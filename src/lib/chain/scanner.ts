import { formatUnits, parseAbiItem, getAddress, type Address, type Log } from 'viem';
import { getPublicClient } from './client';
import { getTokenInfo, requireToken } from './token';
import { contracts, isMarketAddress } from '@/lib/config/contracts';
import { serverEnv } from '@/lib/config/env';
import { ChainUnavailableError } from '@/lib/data/errors';
import type { RipTransaction, TransactionType } from '@/lib/domain/types';

/**
 * READS THE TOKEN'S HISTORY FROM THE CHAIN.
 *
 * Every movement of $RIP is a Transfer event. This walks those events and
 * turns them into the normalised records the rest of the site understands.
 *
 * The classification rule is the important part:
 *
 *   tokens LEFT a DEX address   -> the receiver BOUGHT
 *   tokens WENT TO a DEX address -> the sender SOLD
 *   anything else                -> a plain wallet-to-wallet TRANSFER
 *
 * A transfer between two people is never counted as a trade. When no DEX
 * address has been configured yet, NOTHING is labelled a buy or a sell —
 * the site would rather say "transfer" than guess wrong.
 */

const TRANSFER_EVENT = parseAbiItem(
  'event Transfer(address indexed from, address indexed to, uint256 value)',
);

const ZERO = '0x0000000000000000000000000000000000000000';

type TransferLog = Log<bigint, number, false, typeof TRANSFER_EVENT>;

export interface ScanResult {
  /** Wallet address (checksummed) -> that wallet's transactions. */
  transactionsByWallet: Map<string, RipTransaction[]>;
  fromBlock: number;
  toBlock: number;
  logCount: number;
  /** True when the safety limits stopped the scan before the full history. */
  truncated: boolean;
  scannedAt: number;
}

/** Works out which block range to read. */
async function resolveRange(): Promise<{
  fromBlock: bigint;
  toBlock: bigint;
  clipped: boolean;
}> {
  const client = getPublicClient();
  const latest = await client.getBlockNumber();

  const configuredStart = BigInt(Math.max(0, serverEnv.startBlock));
  const lookbackStart =
    latest > BigInt(serverEnv.lookbackBlocks)
      ? latest - BigInt(serverEnv.lookbackBlocks)
      : 0n;

  // A configured deploy block is always preferred; otherwise look back a
  // bounded window rather than attempting to read all of history.
  let fromBlock = configuredStart > 0n ? configuredStart : lookbackStart;

  // Never exceed the hard block ceiling. If that ceiling cuts into the
  // history we were asked for, say so — a partial history must never be
  // presented as though it were the complete story.
  const maxSpan = BigInt(serverEnv.maxBlocks);
  let clipped = false;
  if (latest - fromBlock > maxSpan) {
    fromBlock = latest - maxSpan;
    clipped = true;
  }

  return { fromBlock, toBlock: latest, clipped };
}

/**
 * Reads logs in chunks. If an RPC rejects a range for being too wide, the
 * chunk is split and retried, which keeps this working across providers
 * with very different limits.
 */
async function fetchLogs(
  token: Address,
  fromBlock: bigint,
  toBlock: bigint,
  deadline: number,
): Promise<{ logs: TransferLog[]; truncated: boolean }> {
  const client = getPublicClient();
  const collected: TransferLog[] = [];
  let cursor = fromBlock;
  let span = BigInt(Math.max(1, serverEnv.batchSize));
  let truncated = false;

  while (cursor <= toBlock) {
    if (Date.now() > deadline) {
      truncated = true;
      break;
    }
    if (collected.length >= serverEnv.maxLogs) {
      truncated = true;
      break;
    }

    const end = cursor + span - 1n > toBlock ? toBlock : cursor + span - 1n;

    try {
      const logs = (await client.getLogs({
        address: token,
        event: TRANSFER_EVENT,
        fromBlock: cursor,
        toBlock: end,
      })) as TransferLog[];

      collected.push(...logs);
      cursor = end + 1n;

      // Creep the window back up after a success.
      if (span < BigInt(serverEnv.batchSize)) span *= 2n;
    } catch (error) {
      // Most providers reject an over-wide range. Halve it and try again.
      if (span > 1n) {
        span = span / 2n;
        continue;
      }
      throw new ChainUnavailableError(
        error instanceof Error ? error.message : 'could not read logs',
      );
    }
  }

  return { logs: collected, truncated };
}

/** Looks up the timestamps for every block we saw, in as few calls as possible. */
async function fetchBlockTimes(
  blockNumbers: Set<bigint>,
  deadline: number,
): Promise<Map<string, number>> {
  const client = getPublicClient();
  const times = new Map<string, number>();
  const ordered = [...blockNumbers];

  // Fetch in small parallel batches to stay friendly to the RPC.
  const BATCH = 10;
  for (let i = 0; i < ordered.length; i += BATCH) {
    if (Date.now() > deadline) break;
    const slice = ordered.slice(i, i + BATCH);
    const blocks = await Promise.all(
      slice.map((n) =>
        client
          .getBlock({ blockNumber: n, includeTransactions: false })
          .catch(() => null),
      ),
    );
    blocks.forEach((block, index) => {
      if (block) times.set(slice[index].toString(), Number(block.timestamp));
    });
  }

  return times;
}

/**
 * Decides what a transfer means for the sender and for the receiver.
 * Returns null for a side that should not be recorded (a DEX's own books,
 * or the zero address used for minting and burning).
 */
function classify(
  from: string,
  to: string,
): { sender: TransactionType | null; receiver: TransactionType | null } {
  const fromIsMarket = isMarketAddress(from);
  const toIsMarket = isMarketAddress(to);
  const fromIsZero = from.toLowerCase() === ZERO;
  const toIsZero = to.toLowerCase() === ZERO;

  return {
    // What this meant for the wallet that sent the tokens.
    sender:
      fromIsZero || fromIsMarket
        ? null
        : toIsMarket
          ? 'SELL'
          : 'TRANSFER_OUT',
    // What this meant for the wallet that received them.
    receiver:
      toIsZero || toIsMarket
        ? null
        : fromIsMarket
          ? 'BUY'
          : 'TRANSFER_IN',
  };
}

/** Reads the token's history and groups it by wallet. */
export async function scanChain(): Promise<ScanResult> {
  const token = requireToken();
  const { decimals } = await getTokenInfo();
  const deadline = Date.now() + serverEnv.scanTimeoutMs;

  const { fromBlock, toBlock, clipped } = await resolveRange();
  const { logs, truncated: hitLimits } = await fetchLogs(
    token,
    fromBlock,
    toBlock,
    deadline,
  );
  const truncated = hitLimits || clipped;

  const blockNumbers = new Set<bigint>();
  for (const log of logs) {
    if (log.blockNumber !== null) blockNumbers.add(log.blockNumber);
  }
  const blockTimes = await fetchBlockTimes(blockNumbers, deadline);

  const byWallet = new Map<string, RipTransaction[]>();

  const push = (
    wallet: string,
    type: TransactionType,
    log: TransferLog,
    amount: number,
    counterparty: string,
    timestamp: number,
  ) => {
    const key = getAddress(wallet);
    const list = byWallet.get(key) ?? [];
    list.push({
      id: `${log.transactionHash}-${log.logIndex}-${type}`,
      walletAddress: key,
      txHash: log.transactionHash ?? '',
      blockNumber: Number(log.blockNumber ?? 0n),
      timestamp,
      transactionType: type,
      amount,
      tokenAddress: token,
      counterparty: getAddress(counterparty),
      dexAddress: isMarketAddress(counterparty) ? getAddress(counterparty) : null,
    });
    byWallet.set(key, list);
  };

  for (const log of logs) {
    const from = log.args?.from;
    const to = log.args?.to;
    const value = log.args?.value;
    if (!from || !to || value === undefined || log.blockNumber === null) continue;

    const timestamp = blockTimes.get(log.blockNumber.toString());
    if (timestamp === undefined) continue; // Skip rather than invent a time.

    const amount = Number(formatUnits(value, decimals));
    if (!Number.isFinite(amount)) continue;

    const { sender, receiver } = classify(from, to);
    if (sender) push(from, sender, log, amount, to, timestamp);
    if (receiver) push(to, receiver, log, amount, from, timestamp);
  }

  return {
    transactionsByWallet: byWallet,
    fromBlock: Number(fromBlock),
    toBlock: Number(toBlock),
    logCount: logs.length,
    truncated,
    scannedAt: Math.floor(Date.now() / 1000),
  };
}

/** True when BUY/SELL labelling is trustworthy. */
export function canClassifyTrades(): boolean {
  return contracts.pairs.length > 0 || contracts.routers.length > 0;
}
