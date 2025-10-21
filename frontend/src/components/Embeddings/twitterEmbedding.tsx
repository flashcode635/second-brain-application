import { width } from "../../config"

const TwitterEmbedding = ({ url }: { url: string }) => {
    return (
        <>
            <blockquote className="twitter-tweet" style={{width:`${width}px`}}>
                <a href={url}></a> 
            </blockquote>
        </>
    )
}