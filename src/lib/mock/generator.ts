import type { RipTransaction } from '../domain/types';
import { buildCemetery, type Cemetery } from '../domain/cemetery';
import {
  DEMO_ALIVE,
  DEMO_DEAD,
  DEMO_REBORN,
  demoAddress,
} from './addresses';

/**
 * DEMO DATA GENERATOR
 *
 * Builds a believable cemetery so the whole website can be reviewed before
 * the token exists. Everything is generated from a fixed seed, so the same
 * demo wallet always tells the same story.
 *
 * This data is fake and is always labelled DEMO in the interface.
 * It is switched off completely once NEXT_PUBLIC_DATA_MODE is "live".
 */

const HOUR = 3600;
const DAY = 86_400;
const GRAVE_NUMBER_BASE = 4000;

/** Simple deterministic random number generator. */
function makeRng(seed: number) {
  let state = seed >>> 0 || 1;
  return () => {
    state ^= state << 13;
    state >>>= 0;
    state ^= state >> 17;
    state ^= state << 5;
    state >>>= 0;
    return state / 4294967296;
  };
}

const DEMO_TOKEN = '0x0000000000000000000000000000000000000000';
const DEMO_PAIR = '0x1111111111111111111111111111111111111111';

interface WalletScript {
  address: string;
  seed: number;
  /** Alternating hold durations in seconds. Last one may still be running. */
  lives: { holdSeconds: number; endsWithSale: boolean }[];
  stillHolding: boolean;
  baseAmount: number;
}

function txId(address: string, index: number): string {
  return `${address.toLowerCase()}-tx-${index}`;
}

function fakeHash(address: string, index: number): string {
  const rng = makeRng(
    Number.parseInt(address.slice(2, 10), 16) + index * 7919,
  );
  let hash = '0x';
  for (let i = 0; i < 64; i += 1) {
    hash += Math.floor(rng() * 16).toString(16);
  }
  return hash;
}

/** Turns a life-script into a transaction list. */
function scriptToTransactions(
  script: WalletScript,
  now: number,
): RipTransaction[] {
  const rng = makeRng(script.seed);
  const transactions: RipTransaction[] = [];

  const totalSpan = script.lives.reduce(
    (sum, life) => sum + life.holdSeconds + Math.floor(rng() * 5 * DAY),
    0,
  );
  let cursor = now - totalSpan - Math.floor(rng() * 3 * DAY);
  let block = 1_000_000 + Math.floor(rng() * 50_000);
  let index = 0;

  script.lives.forEach((life, lifeIndex) => {
    const isLast = lifeIndex === script.lives.length - 1;
    const buyAmount = Math.round(
      script.baseAmount * (0.4 + rng() * 1.8) * (1 + lifeIndex * 0.3),
    );

    // Opening buy.
    transactions.push({
      id: txId(script.address, index),
      walletAddress: script.address,
      txHash: fakeHash(script.address, index),
      blockNumber: block,
      timestamp: cursor,
      transactionType: 'BUY',
      amount: buyAmount,
      tokenAddress: DEMO_TOKEN,
      counterparty: DEMO_PAIR,
      dexAddress: DEMO_PAIR,
    });
    index += 1;
    block += 200 + Math.floor(rng() * 900);

    let held = buyAmount;
    const lifeEnd = cursor + life.holdSeconds;

    // A mid-life top-up, sometimes.
    if (rng() > 0.55 && life.holdSeconds > 2 * DAY) {
      const topUpAt = cursor + Math.floor(life.holdSeconds * (0.2 + rng() * 0.5));
      const topUp = Math.round(buyAmount * (0.15 + rng() * 0.6));
      transactions.push({
        id: txId(script.address, index),
        walletAddress: script.address,
        txHash: fakeHash(script.address, index),
        blockNumber: block,
        timestamp: topUpAt,
        transactionType: 'BUY',
        amount: topUp,
        tokenAddress: DEMO_TOKEN,
        counterparty: DEMO_PAIR,
        dexAddress: DEMO_PAIR,
      });
      held += topUp;
      index += 1;
      block += 150 + Math.floor(rng() * 700);
    }

    // A plain wallet-to-wallet transfer in, sometimes.
    // This must NOT be counted as a buy anywhere in the app.
    if (rng() > 0.82 && life.holdSeconds > 3 * DAY) {
      const at = cursor + Math.floor(life.holdSeconds * (0.3 + rng() * 0.4));
      const amount = Math.round(buyAmount * 0.1);
      transactions.push({
        id: txId(script.address, index),
        walletAddress: script.address,
        txHash: fakeHash(script.address, index),
        blockNumber: block,
        timestamp: at,
        transactionType: 'TRANSFER_IN',
        amount,
        tokenAddress: DEMO_TOKEN,
        counterparty: demoAddress(90 + (index % 20)),
        dexAddress: null,
      });
      held += amount;
      index += 1;
      block += 120 + Math.floor(rng() * 500);
    }

    if (!(isLast && script.stillHolding)) {
      // The life ends here — either sold, or moved away.
      transactions.push({
        id: txId(script.address, index),
        walletAddress: script.address,
        txHash: fakeHash(script.address, index),
        blockNumber: block,
        timestamp: lifeEnd,
        transactionType: life.endsWithSale ? 'SELL' : 'TRANSFER_OUT',
        amount: held,
        tokenAddress: DEMO_TOKEN,
        counterparty: life.endsWithSale ? DEMO_PAIR : demoAddress(60 + (index % 30)),
        dexAddress: life.endsWithSale ? DEMO_PAIR : null,
      });
      index += 1;
      block += 300 + Math.floor(rng() * 1500);
      // Time spent dead before the next life.
      cursor = lifeEnd + Math.floor(HOUR + rng() * 6 * DAY);
    }
  });

  return transactions;
}

/** The three headline demo wallets, plus a generated population. */
function buildScripts(): WalletScript[] {
  const scripts: WalletScript[] = [
    {
      address: DEMO_ALIVE,
      seed: 1001,
      lives: [{ holdSeconds: 43 * DAY + 12 * HOUR, endsWithSale: false }],
      stillHolding: true,
      baseAmount: 125_000,
    },
    {
      address: DEMO_DEAD,
      seed: 2002,
      lives: [{ holdSeconds: 2 * DAY + 14 * HOUR, endsWithSale: true }],
      stillHolding: false,
      baseAmount: 48_000,
    },
    {
      address: DEMO_REBORN,
      seed: 3003,
      lives: [
        { holdSeconds: 2 * DAY, endsWithSale: true },
        { holdSeconds: 17 * DAY, endsWithSale: true },
        { holdSeconds: 43 * DAY, endsWithSale: false },
      ],
      stillHolding: true,
      baseAmount: 90_000,
    },
  ];

  // A generated crowd so the graveyard, leaderboard and living wall feel alive.
  for (let i = 0; i < 54; i += 1) {
    const rng = makeRng(5000 + i * 31);
    const lifeCount = 1 + Math.floor(rng() * 3);
    const stillHolding = rng() > 0.42;
    const lives: WalletScript['lives'] = [];

    for (let l = 0; l < lifeCount; l += 1) {
      const roll = rng();
      const holdSeconds =
        roll < 0.18
          ? Math.floor(HOUR * (0.2 + rng() * 20))
          : roll < 0.45
            ? Math.floor(DAY * (1 + rng() * 6))
            : roll < 0.75
              ? Math.floor(DAY * (7 + rng() * 60))
              : Math.floor(DAY * (90 + rng() * 300));
      lives.push({ holdSeconds, endsWithSale: rng() > 0.12 });
    }

    scripts.push({
      address: demoAddress(i),
      seed: 5000 + i * 31,
      lives,
      stillHolding,
      baseAmount: Math.round(1_000 * Math.pow(10, rng() * 2.6)),
    });
  }

  return scripts;
}

export type DemoDataset = Cemetery;

/**
 * Builds the entire demo cemetery.
 *
 * The lives, graves and listings are assembled by the SAME shared builder
 * that live blockchain data uses, so demo mode is a faithful rehearsal of
 * the real thing rather than a separate implementation.
 */
export function generateDemoDataset(
  now: number = Math.floor(Date.now() / 1000),
): DemoDataset {
  const transactionsByWallet = new Map<string, RipTransaction[]>();

  for (const script of buildScripts()) {
    transactionsByWallet.set(script.address, scriptToTransactions(script, now));
  }

  return buildCemetery(transactionsByWallet, {
    now,
    isDemo: true,
    graveNumberBase: GRAVE_NUMBER_BASE,
  });
}
