import BrainIcon from "../components/svg/brainicon";

import { Book, Bulb, folder, Grid, SearchIcon, UserIcon } from "./svg/gridIcons";
export type SidebarFieldsProps = {
    link: () => React.JSX.Element;
    text: string;
  };
const SidebarFields =({link,text}:SidebarFieldsProps)=>{
    return(
        <>
                <div className="flex justify-start gap-4 items-center w-3/4 mb-3 cursor-pointer hover:bg-stone-50 hover:text-black  rounded-md transition-all duration-175 p-2">          
               
                    {link()}
                
                <span className="font-heading tracking-wider ">{text}</span>
                </div>
            
        </>
    )
}
// /outlined/book-menu.svg
export default function SidebarComponent() {
    const sidebarFieldsData: SidebarFieldsProps[] = [
        {link: Grid, text: "All"},
        {link:SearchIcon, text:"Search"},
        {link:Bulb, text:"Ideas"},
        {link:UserIcon, text:"Profile"},
        {link:folder, text:"Folder"},
        {link:Book, text:"Book"},
        
    ];
    return (
        <div className="h-screen flex flex-col items-baseline justify-start pt-4 md:pt-8 pl-2 md:pl-8
        md:w-70 bg-white gap-9">
            <div className="flex items-center gap-4 ">
                <BrainIcon/>

                <span className="text-xl font-heading uppercase"><b> Your Brain </b>  </span>
            </div>
            {/* fields - tweet, yt, document etc. */}
            <p className="uppercase text-gray-500 w-full 
            text-start font-heading text-xs tracking-widest"> 
                Spaces
            </p>
            <div className="grid grid-cols-1 text-md tracking-wide text-gray-700 md:pl-2 w-full"> 

                {
                    sidebarFieldsData.map((field, index) => (
                        <SidebarFields key={index} link={field.link} text={field.text} />
                    ))
                }
               
            </div>
           

        </div>
    )
}50