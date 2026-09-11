/**
 * Reads environment variables safely.
 *
 * Rule: every value has a sensible fallback so the site never crashes
 * because something has not been configured yet. Missing configuration is
 * reported as "CONFIGURATION REQUIRED" in the UI rather than being invented.
 */

function str(value: string | undefined, fallback = ''): string {
  const v = (value ?? '').trim();
  return v.length > 0 ? v : fallback;
}

function num(value: string | undefined, fallback: number): number {
  const parsed = Number.parseInt((value ?? '').trim(), 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function bool(value: string | undefined, fallback = false): boolean {
  const v = (value ?? '').trim().toLowerCase();
  if (v === 'true' || v === '1' || v === 'yes') return true;
  if (v === 'false' || v === '0' || v === 'no') return false;
  return fallback;
}

/** Anything here is safe to send to the browser. */
export const publicEnv = {
  dataMode: str(process.env.NEXT_PUBLIC_DATA_MODE, 'demo') as 'demo' | 'live',

  chainId: num(process.env.NEXT_PUBLIC_RH_CHAIN_ID, 4663),
  chainName: str(process.env.NEXT_PUBLIC_RH_CHAIN_NAME, 'Robinhood Chain'),
  rpcUrl: str(process.env.NEXT_PUBLIC_RH_RPC_URL),
  explorerUrl: str(process.env.NEXT_PUBLIC_RH_EXPLORER_URL),
  nativeSymbol: str(process.env.NEXT_PUBLIC_RH_NATIVE_SYMBOL, 'ETH'),
  nativeDecimals: num(process.env.NEXT_PUBLIC_RH_NATIVE_DECIMALS, 18),

  tokenAddress: str(process.env.NEXT_PUBLIC_RIP_TOKEN_ADDRESS),
  tokenDecimals: num(process.env.NEXT_PUBLIC_RIP_TOKEN_DECIMALS, 18),
  tokenSymbol: str(process.env.NEXT_PUBLIC_RIP_TOKEN_SYMBOL, 'RIP'),

  pairAddress: str(process.env.NEXT_PUBLIC_RIP_PAIR_ADDRESS),
  routerAddress: str(process.env.NEXT_PUBLIC_RIP_ROUTER_ADDRESS),
  factoryAddress: str(process.env.NEXT_PUBLIC_RIP_FACTORY_ADDRESS),
  dexName: str(process.env.NEXT_PUBLIC_DEX_NAME),
  dexSwapUrl: str(process.env.NEXT_PUBLIC_DEX_SWAP_URL),

  supabaseUrl: str(process.env.NEXT_PUBLIC_SUPABASE_URL),
  supabaseAnonKey: str(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),

  rewardsEnabled: bool(process.env.NEXT_PUBLIC_REWARDS_ENABLED, false),
  rewardsMode: str(process.env.NEXT_PUBLIC_REWARDS_MODE, 'collectible') as
    | 'collectible'
    | 'test'
    | 'live',

  siteUrl: str(process.env.NEXT_PUBLIC_SITE_URL, 'http://localhost:3000'),
  twitterUrl: str(process.env.NEXT_PUBLIC_TWITTER_URL),
  telegramUrl: str(process.env.NEXT_PUBLIC_TELEGRAM_URL),
  discordUrl: str(process.env.NEXT_PUBLIC_DISCORD_URL),
} as const;

/**
 * SERVER-ONLY settings. These are never sent to the browser.
 * They control how much of the chain the site is willing to read directly.
 */
export const serverEnv = {
  /** Block to start reading the token's history from (its deploy block). */
  startBlock: num(process.env.INDEXER_START_BLOCK, 0),
  /** How many blocks to request per `eth_getLogs` call. */
  batchSize: num(process.env.INDEXER_BATCH_SIZE, 2000),
  /**
   * When no start block is configured, look back at most this many blocks
   * from the chain tip rather than trying to read all of history.
   */
  lookbackBlocks: num(process.env.CHAIN_SCAN_LOOKBACK_BLOCKS, 200_000),
  /** Hard safety limits so a busy token cannot hang the site. */
  maxBlocks: num(process.env.CHAIN_SCAN_MAX_BLOCKS, 400_000),
  maxLogs: num(process.env.CHAIN_SCAN_MAX_LOGS, 20_000),
  /** How long a scan result is reused before reading the chain again. */
  cacheTtlSeconds: num(process.env.CHAIN_CACHE_TTL_SECONDS, 60),
  /** Overall time budget for one scan, in milliseconds. */
  scanTimeoutMs: num(process.env.CHAIN_SCAN_TIMEOUT_MS, 20_000),
};

export const envHelpers = { str, num, bool };
