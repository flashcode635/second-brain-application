import BrainIcon from "../components/svg/brainicon";
// @ts-ignore
import { Book, Bulb, folder, Grid, SearchIcon, UserIcon } from "@svg/gridIcons";
export type SidebarFieldsProps = {
    link: () => React.JSX.Element;
    text: string;
  };
const SidebarFields =({link,text}:SidebarFieldsProps)=>{
    return(
        <>
                <div className="theme-sidebar-item flex justify-start gap-4 items-center w-3/4 cursor-pointer rounded-md transition-all
                 duration-175 p-1.5">          
               
                    {link()}
                
                <span className="font-heading tracking-wider font-medium ">{text}</span>
                </div>
            
        </>
    )
}
// /outlined/book-menu.svg
export default function SidebarComponent() {
    const sidebarFieldsData: SidebarFieldsProps[] = [
        {link: Grid, text: "All"},
        {link:SearchIcon, text:"Search"},
        {link:Bulb, text:"Inspirations"},
        {link:UserIcon, text:"Personal"},
        {link:folder, text:"Projects"},
        {link:Book, text:"Reading List"},
        
    ];
    return (
        <div className="h-screen flex flex-col items-baseline justify-start pt-4 
        md:pt-8 pl-2 md:pl-8
        md:w-70 theme-surface gap-7">
            <div className="flex items-center gap-4 ">
                <BrainIcon size="small" />

                <span className="text-xl font-heading uppercase"><b> Your Brain </b>  </span>
            </div>
            {/* fields - tweet, yt, document etc. */}
            <p className="uppercase text-text-muted w-full 
            text-start font-heading text-xs tracking-widest pt-2"> 
                Spaces
            </p>
            <div className="grid grid-cols-1 text-md tracking-wide
             text-text-sidebar md:pl-1 w-full gap-3 "> 

                {
                    sidebarFieldsData.map((field, index) => (
                    
                            <SidebarFields key={index} link={field.link} text={field.text} />
                    
                    ))
                }
               
            </div>
           

        </div>
    )
}50