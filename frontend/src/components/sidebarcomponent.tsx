import BrainIcon from "../components/svg/brainicon";
import twitterImage from "../assets/twitterImage.svg";
import youtubeImage from "../assets/youtubeImage.svg";
import documentImage from "../assets/documentImage.svg";
import linkedinImage from "../assets/linkedinImage.svg";


const SidebarFields =({link,text}:any)=>{
    return(
        <>
                <div className="flex mb-3 cursor-pointer hover:bg-yellow-50 pl-3 rounded-md transition-all duration-175 ">
                <img src={link} className="h-6 w-6 mr-2"/>
                <span>{text}</span>
                </div>
            
        </>
    )
}
export default function SidebarComponent() {
    return (
        <div className="h-[100vh] w-[240px] bg-gray-150 mr-5 p-2 pl-0 pt-4 fixed ">
            <div className="flex items-center gap-2.5 mb-4 pl-3 ">
                <BrainIcon/>

                <span className="text-xl"><b> Second Brain App </b>  </span>
            </div>
            {/* fields - tweet, yt, document etc. */}
            <div className="ml-3 grid grid-cols-1"> 
                 <SidebarFields link={documentImage} text="All Document " /> 
                 
                <SidebarFields link={twitterImage} text="Tweet" /> 
                <SidebarFields link={youtubeImage} text="Youtube " /> 
            
               
                <SidebarFields link={linkedinImage} text="linkedin " /> 
            </div>
           

        </div>
    )
}50