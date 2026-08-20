import { height, width } from "@/config"

export const TwitterEmbedding = ({ url }: { url: string }) => {
    if (!url) {
        return <p>No URL provided to embed.</p>;
    }

    const newUrl = url.replace("x.com", "twitter.com");
    return (
        <>
        <div 
        style={{ 
        width: `${width}px`,
        height: `${height}px`,
        overflowY: "hidden",
        marginBottom:"0",
         overflowX:"hidden"}}>
            <blockquote style={{width:`${width}px`}}
            className="twitter-tweet" >
                 <a href={newUrl}></a> 
            </blockquote>
        </div>
           
        </>
    )
}