// Frontend Component
import { useEffect, useState } from 'react';
import { BACKEND_URL } from '../../config';
import type { EmbeddingProps } from '../../config';

export type metaData = {
    success: boolean;
    provider: string;
    postId: string | null | undefined;
    title: string;
    author: string;
    embedUrl: string | null;
    originalUrl: string;
}

export const LinkedInEmbedding = ({ url }: EmbeddingProps) => {
  const [preview, setPreview] = useState<metaData | null>(null);
  const [loading, setLoading] = useState(false);
  const [showIframe, setShowIframe] = useState(false);

  useEffect(() => {
    if (!url) {
      setPreview(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setShowIframe(false);

    const generatePreview = async () => {
      try {
        const res = await fetch(
          `${BACKEND_URL}/api/linkedinpreview?url=${encodeURIComponent(url)}`
        );
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Failed to fetch LinkedIn preview');
        }
        if (!cancelled) {
          setPreview(data);
        }
      } catch (error) {
        if (!cancelled) {
          setPreview(null);
          console.error('Error fetching LinkedIn preview:', error);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void generatePreview();

    return () => {
      cancelled = true;
    };
  }, [url]);

  return (
    <div className="w-60 h-51.75 overflow-hidden p-1 mx-auto">
      {loading && <p className="text-sm text-text-muted">Loading LinkedIn preview...</p>}

      {/* PREVIEW CARD YAHAN DIKHEGA */}
      {preview && preview.success && (
        <div className="h-full w-full border border-border rounded-lg shadow-sm
        overflow-hidden">
          
          {/* 1. The Rich Card (Guaranteed to work) */}
          <div className="p-4 theme-surface h-full overflow-hidden">
            <div className="flex items-center gap-2 mb-2">
              <span className="theme-muted-surface
               text-text-primary text-xs font-semibold
               px-2.5 py-0.5 rounded">
                Post
              </span>
              <span className="text-text-muted text-sm">{preview.author}</span>
            </div>
            <h3 className="text-sm font-semibold text-text-primary mb-1 truncate">
              {preview.title}
            </h3>
            <p className="text-xs text-text-muted mb-2 line-clamp-2">
              Preview restricted by LinkedIn. Click below to open.
            </p>
            <div className="flex gap-1 overflow-hidden">
              <a href={preview.originalUrl} target="_blank" rel="noopener noreferrer" className="text-xs theme-muted-surface hover:bg-hover px-2 py-1 rounded font-medium truncate">
                Open on LinkedIn
              </a>
              {preview.embedUrl && (
                <button 
                  onClick={() => setShowIframe(!showIframe)}
                  className="text-xs theme-muted-surface text-text-primary hover:bg-hover px-2
                   py-1 rounded font-medium whitespace-nowrap"
                >
                  {showIframe ? "Hide Iframe" : "Try Iframe Embed"}
                </button>
              )}
            </div>
          </div>

          {/* 2. Experimental Iframe (Toggle) */}
          {showIframe && preview.embedUrl && (
              <div className="border-t border-border theme-muted-surface p-1">
               <iframe 
                 src={preview.embedUrl} 
                height="185" 
                width="200" 
                 frameBorder="0" 
                 allow="encrypted-media" 
                 allowFullScreen 
                 title="Embedded LinkedIn Post"
                 className="rounded w-50 h-46.25"
               ></iframe>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
