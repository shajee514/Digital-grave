import Link from 'next/link';
import { CelebrityAvatar } from './CelebrityAvatar';
import { LinkTabs, type TabOption } from '@/components/ui/Tabs';
import {
  CELEBRITY_BOARDS,
  getCelebrityBoard,
  type CelebrityBoard,
} from '@/lib/celebrities/source';
import { cn } from '@/lib/utils';

/**
 * 🏆 The meme leaderboard.
 *
 * Every number here is invented entertainment data. It measures jokes,
 * not people, and the page says so directly.
 */
export function CelebrityLeaderboard({ board }: { board: CelebrityBoard }) {
  const rows = getCelebrityBoard(board);
  const active = CELEBRITY_BOARDS.find((b) => b.key === board) ?? CELEBRITY_BOARDS[0];

  const tabs: TabOption[] = CELEBRITY_BOARDS.map((b) => ({
    key: b.key,
    label: b.label,
  }));

  return (
    <div>
      <LinkTabs
        options={tabs}
        active={board}
        buildHref={(key) =>
          key === 'most-immortal'
            ? '/celebrities#leaderboard'
            : `/celebrities?board=${key}#leaderboard`
        }
      />

      <p className="mt-5 text-sm text-ash">{active.blurb}</p>
      <p className="mt-1 text-xs text-ash/70">
        Fictional entertainment scores. Not a measurement of any real person.
      </p>

      <ol className="mt-6 space-y-3">
        {rows.slice(0, 8).map((row) => (
          <li key={row.celebrity.id}>
            <Link
              href={`/celebrities/${row.celebrity.slug}`}
              className="stone-panel stone-panel-hover flex items-center gap-4 p-4"
            >
              <span
                className={cn(
                  'flex h-9 w-9 shrink-0 items-center justify-center rounded-full border font-mono text-xs font-bold',
                  row.rank === 1
                    ? 'border-legendary/50 bg-legendary/10 text-legendary'
                    : row.rank <= 3
                      ? 'border-ash/40 bg-granite text-bone'
                      : 'border-moss bg-granite/50 text-ash',
                )}
              >
                {row.rank}
              </span>

              <CelebrityAvatar
                avatar={row.celebrity.avatar}
                name={row.celebrity.name}
                showEmblem={false}
                className="h-10 w-10 shrink-0"
              />

              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-sm font-bold text-bone">
                  {row.celebrity.displayName}
                </p>
                <p className="mt-0.5 truncate text-xs text-ash">
                  {row.celebrity.title}
                </p>
              </div>

              <span className="shrink-0 text-right font-display text-xs font-bold text-legendary sm:text-sm">
                {row.value}
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
