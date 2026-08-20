
import { LinkedInEmbedding } from "./Embeddings/linkedinEmbedding"
import { DeleteIcon } from "./svg/deleteicon"
import { DynamicIcon } from "./svg/logos";
import YouTubeEmbed from "./Embeddings/youtubeEmbedding";
import { BACKEND_URL, CONTENT, height, width, type CardProps } from "../config";
import { TwitterEmbedding } from "./Embeddings/twitterEmbedding";
import  {  sizeStyles, variantStyles, } from "./button";
import axios, { type AxiosResponse } from "axios";

const Embedd=({type, url}: {type: string, url: string})=>{
    return(
        <>
        { type == "linkedIn" && <div key={type}> <LinkedInEmbedding 
        url={url} /></div>  }
        { type == "youtube" && <div key={type}> <YouTubeEmbed 
        url={url}  /></div> }
        { type == "twitter" && <div key={type}> <TwitterEmbedding 
        url={url}  /></div> }
        </>
    )
}
export let sampleLink =["link1","link2","link3"]
const cardWidth = width + 102;
const cardHeight = 350;
const embedHeight = 205;
const tagsHeight = 50;
// DELETE content function
const deleteContent = async({id}: {id: any})=>{
    try {
        console.log("Delete content clicked");
        // Implement delete functionality here
        const response:AxiosResponse = await axios.delete(BACKEND_URL+CONTENT, 
            {data:{
    
                contentId: id
            },
             headers: {
                    "Content-Type": "application/json",
                Authorization: localStorage.getItem("token") 
            }
        });
        return response.data;
    } catch (error) {
    // Check if the error is an Axios error and log relevant details
    if (axios.isAxiosError(error) ) {
      console.error('Delete failed:', error.response?.data || error.message);
      // Re-throw a standardized error or a custom error for the component to handle
      throw new Error(error.response?.data.message || 'Failed to delete content.');
    } else {
      console.error('An unexpected error occurred:', error);
      throw new Error('An unexpected error occurred during deletion.');
    }
  }
  
}
export const CardComponent = ({type, heading, tags, url,key}: CardProps)=>{
        if (!url) {
            return (<p style={{height:`${height}px`, width:`${width}px`}}>
                No URL provided to embed.</p>)
        }
        if (!tags) {
        sampleLink.map((tag)=>(
            <p className="text-gray-700"> {tag} </p>
        ))

}
    return(
        <>
        <div key={url}
            className="rounded-lg shadow-md bg-stone-50 
            flex flex-col self-start border-gray-150 border 
            p-2 pt-0 mb-2 overflow-hidden"
    style={{ width: `${cardWidth}px`, height: `${cardHeight}px` }}
        >
          
            <div 
                 className="text-center overflow-hidden p-3 md:pt-4 thin-scrollbar h-full">
                {/* heading */}
                <div className="flex justify-between items-center text-center h-8 overflow-hidden">
                    <div className="flex h-full justify-start items-start gap-3">
                    
                        { <DynamicIcon type={type} /> }

                        <h1
                            className="font-semibold text-xl overflow-hidden pr-0 wrap-break-words"
                        >
                            {heading}
                        </h1>
                    </div>
                    <div className="flex justify-flex-end items-center" onClick={() => 
                        deleteContent({ id: key })}>

                    <DeleteIcon/>
                    </div>
                </div>

                {/* embedding */}
                <div
                    className="mb-3 flex items-center justify-center w-full overflow-hidden"
                    style={{ height: `${embedHeight}px` }}
                >
                      <Embedd type={type} url={url}/>
                </div>

                {/* tags */}
                <div
                    className="grid grid-cols-3 h-13 overflow-hidden"
                    style={{ height: `${tagsHeight}px` }}
                >
                   {tags?.map((tagValue)=>(
                    //  force wrapping and prevent horizontal expansion
                    <span className="block max-h-18 overflow-y-auto min-w-auto max-w-20 ">
                        <h6 className={`block  ${variantStyles["primary"]} ${sizeStyles["sm"]} text-sm wrap-break-words whitespace-normal`}>
                            #{tagValue}
                        </h6>
                    </span>
                   ))}
                </div>
            </div>
        </div>
        </>
    )
}
