import  ButtonElement from "./components/button";
import { PlusIcon } from "./components/svg/plusicon";
import { ShareIcon } from "./components/svg/shareicon";

import { CardComponent } from "./components/card";
import "./App.css";
import SidebarComponent from "./components/sidebarcomponent";
import { CreateContentModel } from "./components/createContentModel";
import { useState } from "react";
//  Compilation of all components put together to show UI.
export default function App() {
    const [modelOpen, setModelOpen]= useState(false)
    return (
        <div className="outerdiv bg-gray-150  ">
            <div className="h-auto w-auto">

            <CreateContentModel open={modelOpen} onClose={()=>setModelOpen(false)} />
            </div>

            {/* sidebar */}
                <div>
                    <SidebarComponent/>
                </div>
{/*  buttons & cards  */}
                <div className="pt-2  mr-0 flex flex-col justify-end w-full">

                    {/* buttons */}
                    <div className=" flex  " 
                    style={{justifyContent:'end'}}>
                        
                        {/* buttons - Add Content & share */}
                        <div 
                        className=" flex gap-3 pr-3   "
                        >

                        <ButtonElement variant="secondary" size="sm" 
                                        text="Add Content"  onClickfn={()=>setModelOpen(true)}
                                        startIcon={<PlusIcon/>}
                        />

                        <ButtonElement variant="primary" size="default" 
                                            text="Share"    startIcon={<ShareIcon/>}
                        />   
                        </div>

                    </div>

                    {/* cards outer div*/}
                    <div className="flex justify-end-safe mt-3  mr-3">
                            {/* cards sections */}
                            <div className="mr-0 pr-0 ">

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                                    <CardComponent type='linkedIn' heading="Lets try it" 
                                    description="      Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus ab optio ut illum quis tempora quos asperiores aliquam voluptatum vitae, quidem modi veritatis dignissimos harum voluptatem temporibus doloremque aperiam velit?
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus ab optio ut illum quis tempora quos asperiores aliquam voluptatum vitae, quidem modi veritatis dignissimos harum voluptatem temporibus doloremque aperiam velit? " 
                                    url="https://www.linkedin.com/posts/dhanraj-shinemaven_software-engineering-internship-janjun-activity-7385528825272643585--wJF?"/>

                                

                                    <CardComponent type='linkedIn' heading="Yokoso Watashino soul Society" 
                                    description="sit amet consectetur adipisicing elit. Doloribus ab optio ut illum quis tempora quos asperiores aliquam voluptatum vitae, quidem modi veritatis digni" 
                                    url="https://www.linkedin.com/posts/chuckkeith_httpsyoutubeexl8mmuxs88featureshared-activity-7385704651142152192-TCgX?"/>

                                    <CardComponent type='youtube' heading="YouTube Video" 
                                    description="Text could be movies, scripts, paintings, songs, political cartoons, advertisements and maps. If we can look at something with words and sentences, explore it, find layers of meaning in it, and draw information and conclusions from it, you're looking at a text." 
                                    url="https://youtu.be/oCDIpQ2jp-o?si=5_iyd9fiifJ0yzKT"/>

                                    <CardComponent type='youtube' heading="Another YouTube Video is gon ti be liv n a miut" 
                                    description="Text could be movies, scripts, paintings, songs, political cartoons, advertisements and maps. If we can look at something with words and sentences, explore it, find layers of meaning in it, and draw information and conclusions from it, you're looking at a text." 
                                    url="https://youtu.be/JQbjS0_ZfJ0?si=mzLmPDJSqTUM66yx"/>

                                    <CardComponent type='twitter' heading="YouTube Video" 
                                    description="Text could be movies, scripts, paintings, songs, political cartoons, advertisements and " 
                                    url="https://x.com/TosinOlugbenga/status/1980295569475310051"
                                    // url="https://twitter.com/darshal_/status/1980322975305146510"
                                    />

                                        <CardComponent type='twitter' heading="YouTube Video" 
                                    description="Text could be movies, scripts, paintings, songs,in it, and draw information and conclusions from it, you're looking at a text; political cartoons, advertisements and maps. words and sentences, explore it, find layers of meaning " 
                                    url="https://x.com/wh0sumit/status/1980653791985692675"/>

                                </div>
                                {/* <blockquote className="twitter-tweet">
            <a href="https://twitter.com/darshal_/status/1980322975305146510"></a> 
            </blockquote> */}

                            </div>
                      
                    </div>
                </div>
           
        </div>
    )
}