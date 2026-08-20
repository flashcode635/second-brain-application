// import { height, type EmbeddingProps } from '../../config';

// export const LinkedInEmbedding = ({
//   url
// }: EmbeddingProps) => {
//         if (!url) {
//             return <p>No URL provided to embed.</p>;
//         }
// // find postID
//         function getLinkedInPostId(url:string) {
//   const match = url.match(/(ugcPost|activity)-(\d+)/);
//   return match ? match[2] : null;
// }
// const postId = getLinkedInPostId(url);
// if (!postId) return <p>Invalid LinkedIn URL</p>;
//   return (
//    // wrapper becomes the scrollable element we style
//    <div className="linkedin-embed-wrapper w-full thin-scrollbar overflow-y-auto" style={{ height: `${height}px`, }}>
//             <iframe 
//             className="block w-full h-full border-0"
//             src={`https://www.linkedin.com/embed/feed/update/urn:li:activity:${postId}`}
//             loading='lazy'
//             scrolling="no"
//             // width={width} 
//             height={height+90}
//             // style={{"scrollbarWidth":"thin"}}
//             // allowFullScreen={false}
//             title="LinkedIn Post"
            
//             ></iframe>
//     </div>
//   );
// };

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
      {loading && <p className="text-sm text-gray-500">Loading LinkedIn preview...</p>}

      {/* PREVIEW CARD YAHAN DIKHEGA */}
      {preview && preview.success && (
        <div className="h-full w-full border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          
          {/* 1. The Rich Card (Guaranteed to work) */}
          <div className="p-4 bg-white h-full overflow-hidden">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-blue-100
               text-blue-800 text-xs font-semibold 
               px-2.5 py-0.5 rounded">
                Post
              </span>
              <span className="text-gray-500 text-sm">{preview.author}</span>
            </div>
            <h3 className="text-sm font-semibold text-gray-900 mb-1 truncate">
              {preview.title}
            </h3>
            <p className="text-xs text-gray-500 mb-2 line-clamp-2">
              Preview restricted by LinkedIn. Click below to open.
            </p>
            <div className="flex gap-1 overflow-hidden">
              <a href={preview.originalUrl} target="_blank" rel="noopener noreferrer" className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded font-medium truncate">
                Open on LinkedIn
              </a>
              {preview.embedUrl && (
                <button 
                  onClick={() => setShowIframe(!showIframe)}
                  className="text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 px-2 py-1 rounded font-medium whitespace-nowrap"
                >
                  {showIframe ? "Hide Iframe" : "Try Iframe Embed"}
                </button>
              )}
            </div>
          </div>

          {/* 2. Experimental Iframe (Toggle) */}
          {showIframe && preview.embedUrl && (
              <div className="border-t bg-gray-50 p-1">
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
