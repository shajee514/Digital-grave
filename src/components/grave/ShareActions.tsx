'use client';

import { CopyButton } from '@/components/ui/CopyButton';
import { track } from '@/lib/analytics';
import { xIntentUrl } from '@/lib/share';
import { cn } from '@/lib/utils';

/**
 * Share controls.
 *
 * The link and the image both contain only the grave number and the
 * shortened wallet address — never the full address.
 */
export function ShareActions({
  shareUrl,
  shareText,
  imageUrl,
  imageFileName,
  showCopyText = false,
  className,
}: {
  shareUrl: string;
  shareText: string;
  imageUrl?: string;
  imageFileName?: string;
  /** Adds a COPY TEXT button that copies the share message itself. */
  showCopyText?: boolean;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      <CopyButton
        value={shareUrl}
        label="COPY LINK"
        copiedLabel="LINK COPIED"
        event="share_copy_link"
      />

      <a
        href={xIntentUrl(shareText, shareUrl)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => track('share_x_click')}
        className="inline-flex items-center gap-2 rounded-lg border border-moss bg-granite/60 px-3 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-ash transition-colors hover:border-ash/60 hover:text-bone"
      >
        <span aria-hidden>𝕏</span>
        SHARE ON X
      </a>

      {showCopyText ? (
        <CopyButton
          value={shareText}
          label="COPY TEXT"
          copiedLabel="TEXT COPIED"
          event="share_copy_text"
        />
      ) : null}

      {imageUrl ? (
        <a
          href={imageUrl}
          download={imageFileName ?? 'digital-grave.png'}
          onClick={() => track('share_download_image')}
          className="inline-flex items-center gap-2 rounded-lg border border-moss bg-granite/60 px-3 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-ash transition-colors hover:border-ash/60 hover:text-bone"
        >
          <span aria-hidden>↓</span>
          DOWNLOAD IMAGE
        </a>
      ) : null}
    </div>
  );
}
