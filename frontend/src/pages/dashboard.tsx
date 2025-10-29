import  ButtonElement from "../components/button";
import { PlusIcon } from "../components/svg/plusicon";
import { ShareIcon } from "../components/svg/shareicon";

import { CardComponent } from "../components/card";
import "../App.css";
import SidebarComponent from "../components/sidebarcomponent";
import { CreateContentModel } from "../components/createContentModel";
import { useState, useEffect } from "react";
// CHANGE: Import Zustand store instead of Recoil hooks
import { useDashboardStore } from "../atoms";
// CHANGE: Import CONTENT endpoint constant for fetching data
import { BACKEND_URL, CONTENT } from "../config";
import axios from "axios";
import { CustomAlert } from "../components/customAlert";

//  Compilation of all components put together to show UI.


export default function Dashboard() {
    const [modelOpen, setModelOpen] = useState(false);
    // CHANGE: Added state to store content fetched from database
    const [content, setContent] = useState([]);
    // CHANGE: Added loading state to show loading indicator while fetching
    const [loading, setLoading] = useState(true);
    // CHANGE: Subscribe to refreshKey from Zustand store
    // When refreshKey changes (incremented by triggerRefresh), this component re-renders
    // and the useEffect below runs again to fetch fresh data
    const refreshKey = useDashboardStore((state) => state.refreshKey);
  // for alert popups:-
    //tells message to alert
    const [alertMessage, setAlertMessage] = useState(''); 
    //controls alert visibility
    const [showAlert, setShowAlert] = useState(false); 
    const fetchContent = async () => {
          try {
              setLoading(true);
              const response = await axios.get(BACKEND_URL + CONTENT, {
                  headers: {
                      Authorization: localStorage.getItem("token") || ""
                  }
              });
              if (response.status === 200) {
                  // Handle both array response and object with content array
                  const contentData = Array.isArray(response.data) 
                      ? response.data 
                      : response.data.content || [];
  
                  setContent(contentData);
              }
          } catch (error) {
              console.error("Error fetching content:", error);
              setContent([]); // Set empty array on error
          } finally {
              setLoading(false);
          }
      };
useEffect(() => {

    fetchContent();
}, [refreshKey]); // This will re-run when refreshKey changes

function shareContent() {
    const FrontendURL = "http://localhost:5173"
   
    console.log("Share content clicked");
    // Implement share functionality here
     axios.post(`${BACKEND_URL}/app/v1/brain/share`, {
         share: true
     }, {
         headers: {
             Authorization: localStorage.getItem("token") || ""
         }
     }).then(response => {
       const link = response.data.link;
         // persist link so the brain page can read it if needed
         localStorage.setItem("sharedBrainLink", link);
         const brainURL = `${FrontendURL}/brain/${link}`;
         // show alert with full share URL
         setShowAlert(true);
         setAlertMessage("Share link created: " + brainURL);
         console.log("Share link created:", brainURL, response.data);
       
     }).catch(error => {
         console.error("Error sharing content:", error);
     });
}
    
    return (
        <div className="outerdiv  bg-yellow-50 ">
            <CustomAlert 
                        message={alertMessage}
                        isVisible={showAlert}
                        onClose={() => setShowAlert(false)}
                    />
            {/* create content model */}
            <div className="h-auto w-auto">
                <CreateContentModel open={modelOpen} onClose={()=>setModelOpen(false)} />
            </div>
            {/* sidebar */}
            <div>
                <SidebarComponent/>
            </div>
            {/* buttons & cards */}
            <div className="pt-2  mr-0 flex flex-col justify-start w-screen h-screen">

                    {/* buttons */}
                    <div className="flex fixed w-full h-[57px] justify-end" >
                        {/* buttons - Add Content & share */}
                        <div className="flex gap-4 pr-3 mb-4">

                            <ButtonElement variant="secondary"
                                text="Add Content" size="default" 
                                onClickfn={()=>setModelOpen(true)}
                                startIcon={<PlusIcon/>}
                            />

                        <ButtonElement variant="primary" 
                        size="default" text="Share" onClickfn={shareContent}  
                         startIcon={<ShareIcon/>}
                        />   
                        </div>

                    </div>

                    {/* cards outer div*/}
                    <div className="flex justify-start-safe mt-[57px] items-baseline-last ml-[270px] mr-3">
                            {/* cards sections */}
                            <div className="mr-0 pr-0 ">

                                <div className="grid grid-cols-1 lg:grid-cols-3 sm:grid-cols-2 gap-3.5">
                                    {loading ? (
                                        <div className="col-span-full text-center">Loading your content...</div>
                                    ) : content.length > 0 ? (
                                        content.map((item: any) => (
                                            <CardComponent key={item.id} 
                                                type={item.type}
                                                heading={item.title} 
                                                tags={item.tags || []}
                                                url={item.link}
                                            />
                                        ))
                                    ) : (
                                        <div className="col-span-full text-center">No content available. Add some content to get started!</div>
                                    )}
                                </div>
              
                            </div>
                      
                    </div>
                </div>
           
        </div>
    )
}