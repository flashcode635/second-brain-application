import  ButtonElement from "./components/button";
import { PlusIcon } from "./components/svg/plusicon";
import { ShareIcon } from "./components/svg/shareicon";

import { CardComponent } from "./components/card";
import "./App.css";
import SidebarComponent from "./components/sidebarcomponent";

export default function App() {
    return (
        <div className="outerdiv bg-gray-150  p-2">
            {/* buttons */}
            <div className=" flex  " 
            style={{justifyContent:'space-between'}}>
                <div>

                <h1>Second brain</h1>
                </div>
                <div className=" flex gap-3">

                <ButtonElement variant="secondary" size="sm" 
                                text="Add Content" startIcon={<PlusIcon/>}
                />

                <ButtonElement variant="primary" size="default" 
                                    text="Share"    startIcon={<ShareIcon/>}
                />   
                </div>

            </div>
            <div className="flex mt-3 justify-between mr-3">

                {/* sidebar */}
                <div>
                    <SidebarComponent/>
                </div>
                {/* cards */}
                <div className="   ">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <CardComponent type='linkedIn' heading="Lets try it" 
                        description="      Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus ab optio ut illum quis tempora quos asperiores aliquam voluptatum vitae, quidem modi veritatis dignissimos harum voluptatem temporibus doloremque aperiam velit?
        " 
                        linkedinUrl="https://www.linkedin.com/posts/dhanraj-shinemaven_software-engineering-internship-janjun-activity-7385528825272643585--wJF?"/>

                        <CardComponent type='linkedIn' heading="New Post" description="Description" 
                        linkedinUrl="https://www.linkedin.com/posts/krrish-tayal-a14010294_googlecloud-arcadelegend-gcp-activity-7383839207644921857-d2Ho"/>

                        <CardComponent type='linkedIn' heading="Yokoso Watashino soul Society" 
                        description="Description" linkedinUrl="https://www.linkedin.com/posts/chuckkeith_httpsyoutubeexl8mmuxs88featureshared-activity-7385704651142152192-TCgX?"/>
                    </div>
                </div>
            </div>
            <iframe width="360" height="315" src="https://www.youtube.com/embed/orJSJGHjBLI?si=jnlvDHjknbm5lvaz" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen={false}></iframe>
        </div>
    )
}