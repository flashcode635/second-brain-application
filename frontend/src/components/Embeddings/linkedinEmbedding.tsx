export interface LinkedInProps{
    url: string
}
export const LinkedInEmbedding = ({
  url,
 
}: LinkedInProps) => {
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
    <div className="" >
            <iframe className=""
            src={`https://www.linkedin.com/embed/feed/update/urn:li:activity:${postId}`}
            width="390"
            height="250"
            
            // style={{"scrollbarWidth":"thin"}}
            // allowFullScreen={false}
            title="LinkedIn Post"
            
            ></iframe>
    </div>
  );
};
