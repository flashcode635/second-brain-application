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
  type: 'linkedIn' | 'youtube' | 'twitter' | 'instagram' | 'reddit';
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
      <>
        {/* alert */}
          <CustomAlert 
                      message={alertMessage}
                      isVisible={showAlert}
                      onClose={() => setShowAlert(false)}
                  />

          {/* create content model */}
            <div className="h-auto w-auto">
              <CreateContentModel open={modelOpen} onClose={()=>setModelOpen(false)} />
          </div>

            <div className="outerdiv theme-page flex min-h-screen">

              {/* sidebar */}
              <div className="shrink-0 border-r fixed border-border bg-surface">
                  <SidebarComponent/>
              </div>
              <div className="h-screen flex flex-col items-baseline justify-start pt-4 
        md:pt-8 pl-2 md:pl-8
        md:w-70 theme-surface gap-7"></div>
              {/* buttons & cards */}
              <main className="min-w-0 flex-1 px-5 pb-10 sm:px-8">

                      {/* buttons */}
                  <div className="flex w-full items-center justify-end gap-4 py-4" >
                          {/* buttons - Add Content & share */}
                          {/* <div className="flex gap-4 pr-3 mb-4"> */}

                                <ButtonElement variant="secondary"
                                   size="sm" 
                                  onClickfn={()=>setModelOpen(true)}
                                  startIcon={<PlusIcon/>}
                              />

                          <ButtonElement variant="secondary" 
                          size="sm"  onClickfn={shareContent}  
                          startIcon={<ShareIcon/>}
                          />   
                          {/* </div> */}

                      </div>

                      {/* cards outer div*/}
                      <div className="mx-auto mt-10 w-full max-w-270">
                          
                              {/* cards sections */}
                                <div className="mr-0 w-full pr-0 ">

                                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                      {loading ? (
                                          <div className="col-span-full text-center text-text-secondary">
                                            Loading your content...</div>
                                      ) : content.length > 0 ? (
                                          content.map((item) => (
                                              <CardComponent 
                                                  key={JSON.stringify(item.link)}
                                                  type={item.type}
                                                  heading={item.title}
                                                  tags={item.tags || []}
                                                  url={item.link}
                                                  onDeleted={() => {
                                                    setContent((currentContent) =>
                                                      currentContent.filter(
                                                        (contentItem) => contentItem.link !== item.link
                                                      )
                                                    );
                                                  }}
                                              />
                                          ))
                                      ) : (
                                          <div className="col-span-full text-center text-text-secondary">
                                              No content available. Add some content to get started!
                                          </div>
                                      )}
                                  </div>
                
                              </div>
                        
                      </div>
              </main>
            
          </div>
        </>
    )
}