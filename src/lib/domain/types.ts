/** Shared vocabulary for the whole application. */

/** How a wallet's $RIP movement is classified. */
export type TransactionType = 'BUY' | 'SELL' | 'TRANSFER_IN' | 'TRANSFER_OUT';

/** The four states a wallet can be in. */
export type WalletState = 'NEVER' | 'ALIVE' | 'DEAD' | 'RESURRECTED';

/** Cosmetic reputation tiers. These carry no financial meaning. */
export type SurvivalLevel =
  | 'NEWBORN'
  | 'SURVIVOR'
  | 'VETERAN'
  | 'DIAMOND HANDS'
  | 'IMMORTAL'
  | 'UNDYING';

export type CauseOfDeath =
  | 'PANIC SELL'
  | 'PAPER HANDS'
  | 'SOLD THE DIP'
  | 'TOO EARLY'
  | 'NO PATIENCE'
  | 'WEAK HANDS'
  | 'TAKE PROFIT'
  | 'RUGGED BY MYSELF'
  | "COULDN'T HOLD"
  | 'FOMO OUT';

export interface RipTransaction {
  id: string;
  walletAddress: string;
  txHash: string;
  blockNumber: number;
  /** Unix seconds. */
  timestamp: number;
  transactionType: TransactionType;
  /** Human-readable token amount (already divided by decimals). */
  amount: number;
  tokenAddress: string;
  counterparty: string | null;
  dexAddress: string | null;
}

/** One uninterrupted period of holding $RIP. */
export interface SurvivalSession {
  id: string;
  walletAddress: string;
  lifeNumber: number;
  startedAt: number;
  /** null while the wallet is still holding. */
  endedAt: number | null;
  durationSeconds: number;
  peakBalance: number;
  isActive: boolean;
  /**
   * How the life ended.
   * SELL          -> the position was sold. This produces a grave.
   * TRANSFER_OUT  -> the tokens were moved to another wallet, not sold.
   *                  No grave is issued, because nobody actually died.
   * null          -> still alive.
   */
  endedBy: 'SELL' | 'TRANSFER_OUT' | null;
}

export interface Grave {
  id: string;
  graveNumber: number;
  walletAddress: string;
  bornAt: number;
  diedAt: number;
  lifespanSeconds: number;
  causeOfDeath: CauseOfDeath;
  status: 'BURIED' | 'RESURRECTED';
  resurrectionNumber: number;
  createdAt: number;
}

export interface Achievement {
  id: string;
  key: string;
  label: string;
  description: string;
  tier: 'common' | 'rare' | 'legendary';
  unlockedAt: number | null;
}

/** Everything the wallet profile page needs, in one object. */
export interface WalletProfile {
  address: string;
  state: WalletState;
  isDemo: boolean;

  currentBalance: number;
  /** Seconds held in the current uninterrupted life. 0 when not alive. */
  currentLifeSeconds: number;
  currentLifeStartedAt: number | null;
  survivalLevel: SurvivalLevel | null;

  totalLives: number;
  deaths: number;
  resurrections: number;
  longestLifeSeconds: number;
  totalLifetimeSeconds: number;

  firstSeenAt: number | null;
  lastActivityAt: number | null;

  transactions: RipTransaction[];
  sessions: SurvivalSession[];
  graves: Grave[];
  achievements: Achievement[];
}

export interface LivingEntry {
  address: string;
  balance: number;
  holdingSeconds: number;
  level: SurvivalLevel;
  transactionCount: number;
  isDemo: boolean;
}

export interface ResurrectedEntry {
  address: string;
  deaths: number;
  resurrections: number;
  currentState: WalletState;
  longestLifeSeconds: number;
  totalLifetimeSeconds: number;
  isDemo: boolean;
}

export interface GraveyardEntry extends Grave {
  totalDeathsForWallet: number;
  isDemo: boolean;
}

export type GraveyardFilter =
  | 'all'
  | 'recent'
  | 'longest'
  | 'shortest'
  | 'most-deaths'
  | 'funniest';

export type LivingSort =
  | 'longest-survival'
  | 'largest-holder'
  | 'most-transactions'
  | 'highest-level';

export type LeaderboardSection =
  | 'longest-survivors'
  | 'biggest-survivors'
  | 'most-resurrected'
  | 'most-deaths'
  | 'oldest-living';

export interface LeaderboardRow {
  rank: number;
  address: string;
  primaryValue: string;
  secondaryValue: string;
  state: WalletState;
  isDemo: boolean;
}

export interface CemeteryStats {
  totalGraves: number;
  totalLiving: number;
  totalResurrected: number;
  longestLifeSeconds: number;
  isDemo: boolean;
}
