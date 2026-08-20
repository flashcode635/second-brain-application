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
    <div className="p-4 max-w-2xl mx-auto">
      {loading && <p className="text-sm text-gray-500">Loading LinkedIn preview...</p>}
      {/* <input 
        type="text" 
        placeholder="Paste lnkd.in or LinkedIn URL here..." 
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="w-full p-2 border rounded mb-2"
      />
      <button 
        onClick={handleGeneratePreview} 
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Fetching..." : "Generate Preview"}
      </button> */}

      {/* PREVIEW CARD YAHAN DIKHEGA */}
      {preview && preview.success && (
        <div className="border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          
          {/* 1. The Rich Card (Guaranteed to work) */}
          <div className="p-4 bg-white ">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-blue-100
               text-blue-800 text-xs font-semibold 
               px-2.5 py-0.5 rounded">
                Post
              </span>
              <span className="text-gray-500 text-sm">{preview.author}</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {preview.title}
            </h3>
            <p className="text-sm text-gray-500 mb-3">
              Preview restricted by LinkedIn. Click below to open or try experimental iframe embed.
            </p>
            <div className="flex gap-2">
              <a href={preview.originalUrl} target="_blank" rel="noopener noreferrer" className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded font-medium">
                Open on LinkedIn
              </a>
              {preview.embedUrl && (
                <button 
                  onClick={() => setShowIframe(!showIframe)}
                  className="text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded font-medium"
                >
                  {showIframe ? "Hide Iframe" : "Try Iframe Embed"}
                </button>
              )}
            </div>
          </div>

          {/* 2. Experimental Iframe (Toggle) */}
          {showIframe && preview.embedUrl && (
            <div className="border-t bg-gray-50 p-2">
               <iframe 
                 src={preview.embedUrl} 
                 height="500" 
                 width="100%" 
                 frameBorder="0" 
                 allow="encrypted-media" 
                 allowFullScreen 
                 title="Embedded LinkedIn Post"
                 className="rounded"
               ></iframe>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
