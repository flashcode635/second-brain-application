import BrainIcon from "../components/svg/brainicon";

import { LinkedInLogo } from "./svg/linkedinLogo";
import {XLogo} from "./svg/xLogo";
import { YoutubeLogo } from "./svg/ytLogo";
import { DocumentLogo } from "./svg/document";
export type SidebarFieldsProps = {
    link: () => React.JSX.Element;
    text: string;
  };
const SidebarFields =({link,text}:SidebarFieldsProps)=>{
    return(
        <>
                <div className="flex justify-start gap-4 items-center w-full mb-3 cursor-pointer hover:bg-yellow-50 pl-3 rounded-md transition-all duration-175 ">          
               
                {link()}
                <span>{text}</span>
                </div>
            
        </>
    )
}
export default function SidebarComponent() {
    return (
        <div className="h-screen md:w-70 bg-white mr-5 p-2 pl-0 pt-4 ">
            <div className="flex items-center gap-2.5 mb-4 pl-3 ">
                <BrainIcon/>

                <span className="text-xl font-heading uppercase"><b> Your Brain </b>  </span>
            </div>
            {/* fields - tweet, yt, document etc. */}
            <div className="ml-3 grid grid-cols-1"> 
                 <SidebarFields link={DocumentLogo} text="All Document " /> 
                 
                <SidebarFields link={XLogo} text="Tweet" /> 
                <SidebarFields link={YoutubeLogo} text="Youtube " />             
                <SidebarFields link={LinkedInLogo} text="linkedin " /> 
            </div>
           

        </div>
    )
}50