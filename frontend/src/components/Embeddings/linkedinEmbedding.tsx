import { height, type EmbeddingProps } from '../../config';


export const LinkedInEmbedding = ({
  url
}: EmbeddingProps) => {
        if (!url) {
            return <p>No URL provided to embed.</p>;
        }
// find postID
        function getLinkedInPostId(url:string) {
  const match = url.match(/(ugcPost|activity)-(\d+)/);
  return match ? match[2] : null;
}
const postId = getLinkedInPostId(url);
if (!postId) return <p>Invalid LinkedIn URL</p>;
  return (
   // wrapper becomes the scrollable element we style
   <div className="linkedin-embed-wrapper w-full thin-scrollbar overflow-y-auto" style={{ height: `${height}px`, }}>
            <iframe 
            className="block w-full h-full border-0"
            src={`https://www.linkedin.com/embed/feed/update/urn:li:activity:${postId}`}
            loading='lazy'
            scrolling="no"
            // width={width} 
            height={height+90}
            // style={{"scrollbarWidth":"thin"}}
            // allowFullScreen={false}
            title="LinkedIn Post"
            
            ></iframe>
    </div>
  );
};
