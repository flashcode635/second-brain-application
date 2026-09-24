import { useEffect, useState } from 'react';
import type { EmbeddingProps } from '../../config';
import { DocumentLogo } from '../svg/document';

type LinkPreview = {
  title?: string;
  image?: string;
};

// Best-effort only: most sites don't send CORS headers, so this will fail
// for a lot of links. That's fine — the component just falls back to the
// "couldn't load" state below when it can't read the page.
async function fetchLinkPreview(url: string): Promise<LinkPreview | null> {
  try {
    const res = await fetch(url, { mode: 'cors' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();
    const doc = new DOMParser().parseFromString(html, 'text/html');

    const title =
      doc.querySelector('meta[property="og:title"]')?.getAttribute('content') ||
      doc.querySelector('title')?.textContent ||
      undefined;
    const image =
      doc.querySelector('meta[property="og:image"]')?.getAttribute('content') || undefined;

    if (!title && !image) return null;
    return { title: title?.trim(), image };
  } catch {
    return null;
  }
}

function BrokenLinkIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-7 w-7 text-text-muted"
    >
      <path d="M13.5 10.5 21 3m0 0h-5.25M21 3v5.25" />
      <path d="M9 3H6.75A3.75 3.75 0 0 0 3 6.75v10.5A3.75 3.75 0 0 0 6.75 21h10.5A3.75 3.75 0 0 0 21 17.25V15" />
      <path d="m3 21 6-6" />
    </svg>
  );
}

export const DocumentEmbedding = ({ url, description }: EmbeddingProps) => {
  const [preview, setPreview] = useState<LinkPreview | null | undefined>(undefined);

  useEffect(() => {
    if (!url) return;
    let cancelled = false;
    setPreview(undefined);
    fetchLinkPreview(url).then((result) => {
      if (!cancelled) setPreview(result);
    });
    return () => {
      cancelled = true;
    };
  }, [url]);

  if (!url) {
    return <p>No URL provided to embed.</p>;
  }

  let hostname = url;
  try {
    hostname = new URL(url).hostname;
  } catch {
    // keep raw url as fallback label
  }

  const loading = preview === undefined;
  const failed = preview === null;

  return (
    <button
      type="button"
      onClick={() => window.open(url, '_blank', 'noopener,noreferrer')}
      title={url}
      aria-label={`Open ${hostname}`}
      className="theme-surface mx-auto block h-51.75 w-60 cursor-pointer overflow-hidden rounded-lg border border-border p-0 text-left shadow-sm transition-colors hover:border-border-strong"
    >
      <div className="flex h-full w-full flex-col">
        {loading || failed ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 p-4 text-center">
            {failed ? <BrokenLinkIcon /> : <DocumentLogo />}
            {loading ? (
              <p className="text-xs text-text-muted">Loading preview…</p>
            ) : (
              <>
                <p className="text-xs font-medium text-text-secondary">Couldn't load your blog.</p>
                <p className="text-[11px] text-text-muted">Click to open it.</p>
              </>
            )}
          </div>
        ) : (
          <>
            {preview?.image && (
              <div className="theme-muted-surface h-20 w-full shrink-0 overflow-hidden">
                <img
                  src={preview.image}
                  alt=""
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}
            <div className="flex items-center gap-2 p-3 pb-1.5">
              <div className="theme-icon-badge flex h-5 w-5 shrink-0 items-center justify-center rounded">
                <DocumentLogo />
              </div>
              <span className="truncate text-[11px] text-text-muted">{hostname}</span>
            </div>
            <p className="line-clamp-2 px-3 text-sm font-medium text-text-primary">
              {preview?.title || hostname}
            </p>

            {/* Description: scrollable, scrollbar hidden */}
            <div className="scrollbar-hidden min-h-0 flex-1 overflow-y-auto px-3 py-2">
              <p className="whitespace-pre-wrap text-xs leading-5 text-text-secondary">
                {description?.trim() ? description : 'No description added.'}
              </p>
            </div>
          </>
        )}
      </div>
    </button>
  );
};
