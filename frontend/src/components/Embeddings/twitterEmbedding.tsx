import { height, width } from "../../config"

export const TwitterEmbedding = ({ url }: { url: string }) => {
    if (!url) {
        return <p>No URL provided to embed.</p>;
    }

    const newUrl = url.replace("x.com", "twitter.com");
    return (
        <>
        <div style={{ maxHeight:`${height}px`,
        overflowY: "hidden",
        //  overflowY: "scroll",
         overflowX:"hidden"}}>
            <blockquote style={{width:`${width}px`}}
            className="twitter-tweet" >
                 <a href={newUrl}></a> 
            </blockquote>
        </div>
           
        </>
    )
}