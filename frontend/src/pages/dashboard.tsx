import { useState, useEffect, useCallback } from "react";
import ButtonElement from "../components/button";
import { PlusIcon } from "../components/svg/plusicon";
import { ShareIcon } from "../components/svg/shareicon";
import { CardComponent } from "../components/card";
import "../App.css";
import SidebarComponent from "../components/sidebarcomponent";
import { CreateContentModel } from "../components/createContentModel";
import { useDashboardStore } from "../atoms";
import { BACKEND_URL, CONTENT } from "../config";
import axios from "axios";
import { CustomAlert } from "../components/customAlert";

interface ContentItem {
  id: string;
  type: 'linkedIn' | 'youtube' | 'twitter';
  title: string;
  link: string;
  tags?: string[];
}

export default function Dashboard() {
  const [modelOpen, setModelOpen] = useState(false);
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  
  const { refreshKey } = useDashboardStore();

  const fetchContent = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get<ContentItem[] | { content: ContentItem[] }>(
        `${BACKEND_URL}${CONTENT}`,
        {
          headers: {
            Authorization: localStorage.getItem("token") || "",
          },
        }
      );

      if (response.status === 200) {
        const contentData = Array.isArray(response.data)
          ? response.data
          : response.data.content || [];
        setContent(contentData);
      }
    } catch (error) {
      console.error("Error fetching content:", error);
      setContent([]);
      setShowAlert(true);
      setAlertMessage("Failed to load content. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  const shareContent = useCallback(async () => {
    const FrontendURL = "http://localhost:5173";
    
    try {
      const response = await axios.post<{ link: string }>(
        `${BACKEND_URL}/app/v1/brain/share`,
        { share: true },
        {
          headers: {
            Authorization: localStorage.getItem("token") || "",
          },
        }
      );

      const link = response.data.link;
      localStorage.setItem("sharedBrainLink", link);
      const brainURL = `${FrontendURL}/brain/${link}`;
      
      setShowAlert(true);
      setAlertMessage(`Share link created: ${brainURL}`);
    } catch (error) {
      console.error("Error sharing content:", error);
      setShowAlert(true);
      setAlertMessage("Failed to create share link. Please try again.");
    }
  }, []);

  useEffect(() => {
    fetchContent();
  }, [fetchContent, refreshKey]);

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
                                        content.map((item) => (
                                            <CardComponent 
                                                key={item.id}
                                                type={item.type}
                                                heading={item.title}
                                                tags={item.tags || []}
                                                url={item.link}
                                            />
                                        ))
                                    ) : (
                                        <div className="col-span-full text-center">
                                            No content available. Add some content to get started!
                                        </div>
                                    )}
                                </div>
              
                            </div>
                      
                    </div>
                </div>
           
        </div>
    )
}