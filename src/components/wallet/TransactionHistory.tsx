import { explorerLink } from '@/lib/config/chain';
import {
  formatAmount,
  formatDateTime,
  shortAddress,
} from '@/lib/domain/format';
import { EMPTY_STATES } from '@/lib/domain/copy';
import { cn } from '@/lib/utils';
import type { RipTransaction, TransactionType } from '@/lib/domain/types';

/**
 * Full transaction list.
 *
 * Buys, sells and plain transfers are labelled differently on purpose —
 * a transfer between two wallets is never presented as a trade.
 */
const TYPE_STYLE: Record<
  TransactionType,
  { label: string; className: string; sign: string }
> = {
  BUY: { label: 'BUY', className: 'text-alive border-alive/40 bg-alive/10', sign: '+' },
  SELL: { label: 'SELL', className: 'text-dead border-dead/40 bg-dead/10', sign: '−' },
  TRANSFER_IN: {
    label: 'TRANSFER IN',
    className: 'text-ghost border-ghost/40 bg-ghost/10',
    sign: '+',
  },
  TRANSFER_OUT: {
    label: 'TRANSFER OUT',
    className: 'text-ash border-moss bg-granite/60',
    sign: '−',
  },
};

export function TransactionHistory({
  transactions,
  limit,
}: {
  transactions: RipTransaction[];
  limit?: number;
}) {
  const rows = limit ? transactions.slice(0, limit) : transactions;

  if (rows.length === 0) {
    return <p className="py-8 text-center text-sm text-ash">{EMPTY_STATES.transactions}</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[38rem] border-collapse text-sm">
        <thead>
          <tr className="border-b border-moss text-left">
            <th className="label-caps py-3 pr-4 font-semibold">Type</th>
            <th className="label-caps py-3 pr-4 font-semibold">Amount</th>
            <th className="label-caps py-3 pr-4 font-semibold">When</th>
            <th className="label-caps py-3 pr-4 font-semibold">Counterparty</th>
            <th className="label-caps py-3 font-semibold">Tx</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((tx) => {
            const style = TYPE_STYLE[tx.transactionType];
            const link = explorerLink('tx', tx.txHash);
            return (
              <tr
                key={tx.id}
                className="border-b border-moss/50 transition-colors hover:bg-granite/40"
              >
                <td className="py-3 pr-4">
                  <span
                    className={cn(
                      'inline-block whitespace-nowrap rounded-md border px-2 py-1 text-[0.6rem] font-bold uppercase tracking-[0.1em]',
                      style.className,
                    )}
                  >
                    {style.label}
                  </span>
                </td>
                <td className="whitespace-nowrap py-3 pr-4 font-mono text-bone">
                  {style.sign}
                  {formatAmount(tx.amount)}
                </td>
                <td className="whitespace-nowrap py-3 pr-4 text-xs text-ash">
                  {formatDateTime(tx.timestamp)}
                </td>
                <td className="whitespace-nowrap py-3 pr-4 font-mono text-xs text-ash">
                  {tx.dexAddress ? 'DEX' : tx.counterparty ? shortAddress(tx.counterparty) : '—'}
                </td>
                <td className="whitespace-nowrap py-3 font-mono text-xs">
                  {link ? (
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-ash underline-offset-2 transition-colors hover:text-alive hover:underline"
                    >
                      {shortAddress(tx.txHash, 4, 4)}
                    </a>
                  ) : (
                    <span className="text-ash/60">{shortAddress(tx.txHash, 4, 4)}</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
