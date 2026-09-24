import { useState, useEffect, useCallback, useMemo } from "react";
import ButtonElement from "../components/button";
import { PlusIcon } from "../components/svg/plusicon";
import { ShareIcon } from "../components/svg/shareicon";
import { CardComponent } from "../components/card";
import "../App.css";
// @ts-ignore
import { SearchIcon } from "@svg/gridIcons";
import SidebarComponent from "../components/sidebarcomponent";
import { CreateContentModel, type EditableContentItem } from "../components/createContentModel";
import { useDashboardStore } from "../store";
import { CONTENT } from "../config";
import api from "../api";
import { CustomAlert } from "../components/customAlert";
import { SettingsPage } from "./settingspage";

interface ContentItem {
  _id: string;
  type: 'linkedIn' | 'youtube' | 'twitter' | 'instagram' | 'reddit' | 'document';
  title: string;
  link: string;
  description?: string;
  tags?: string[];
}
interface ShareResponse {
  link?: string;
  message: string;
}
export default function Dashboard() {
  const [modelOpen, setModelOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<EditableContentItem | null>(null);
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [alertMessage, setAlertMessage] = useState<ShareResponse>({ message: "" });
  const [showAlert, setShowAlert] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { refreshKey, isSetting, sidebarWidth, selectedCategory, isSidebarResizing } = useDashboardStore();

  const filteredContent = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const category = selectedCategory.toLowerCase();

    return content.filter((item) => {
      const matchesCategory =
        category === "all" || (item.tags || []).some((tag) => tag.toLowerCase() === category);
      if (!matchesCategory) return false;

      if (!query) return true;
      const haystack = [item.title, item.type, ...(item.tags || [])]
        .join(" ")
        .toLowerCase();
      return haystack.includes(query);
    });
  }, [content, searchQuery, selectedCategory]);

  const fetchContent = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get<ContentItem[] | { content: ContentItem[] }>(CONTENT);

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
      setAlertMessage({ message: "Failed to load content. Please try again." });
    } finally {
      setLoading(false);
    }
  }, []);

  const shareContent = useCallback(async () => {
    const FrontendURL = import.meta.env.VITE_FRONTEND_URL || "http://localhost:5173";
    
    try {
      const response = await api.post<{ link: string }>("/app/v1/brain/share", { share: true });

      const link = response.data.link;
      const brainURL = `${FrontendURL}/brain/${link}`;
      
      setShowAlert(true);
      setAlertMessage({ message: `Share link created
      ` , link: brainURL });
    } catch (error) {
      console.error("Error sharing content:", error);
      setShowAlert(true);
      setAlertMessage({ message: "Failed to create share link. Please try again." });
    }
  }, []);

  useEffect(() => {
    fetchContent();
  }, [fetchContent, refreshKey]);

  return (
    <>
                {/* settings popup */}
      <div>
        {isSetting && <SettingsPage />}
      </div>
      {/* alert */}
        <CustomAlert message={alertMessage.message}
            link={alertMessage.link}
          isError={!alertMessage.message.includes("created")}
                    isVisible={showAlert}
                    onClose={() => setShowAlert(false)}
                />
        {/* create content model */}
        <div className="h-auto w-auto">
            <CreateContentModel
                open={modelOpen}
                editItem={editingItem}
                onClose={() => {
                  setModelOpen(false);
                  setEditingItem(null);
                }}
            />
        </div>

        <div className=" flex min-h-screen">

          {/* sidebar */}
          <div className="shrink-0 border-r fixed border-border
          z-99 bg-surface">
              <SidebarComponent/>
          </div>
            {/* placeholder */}
          <div
            className={`h-screen z-1 theme-page bg-[#f3f2f2f7] flex flex-col items-baseline justify-start pt-4 pl-4 md:pt-8 md:pl-8 gap-7 shrink-0 ${isSidebarResizing ? "" : "transition-[width] duration-300 ease-in-out"}`}
            style={{ width: sidebarWidth }}
          ></div>
          {/* buttons & cards */}
          <main className="theme-page bg-[#f3f2f2f7] min-w-0 flex-1 px-5 pb-10 sm:px-8">

                  {/* search & buttons */}
              <div className="flex w-full items-center justify-end gap-3 py-4" >
                      {/* search bar */}
                      <label className="theme-input relative flex w-full md:max-w-80 max-w-60 items-center gap-2 rounded-lg px-3 md:mr-3 py-2">
                          <span className="text-text-muted">
                              <SearchIcon />
                          </span>
                          <input
                              type="text"
                              value={searchQuery}
                              onChange={(event) => setSearchQuery(event.target.value)}
                              placeholder="Search your content..."
                              aria-label="Search saved content"
                              className="w-full min-w-0 bg-transparent text-sm text-text-primary outline-none placeholder:text-text-muted"
                          />
                      </label>

                      {/* buttons - Add Content & share */}
                      <div className="flex shrink-0 items-center gap-4">
                            <ButtonElement variant="secondary"
                                size="sm"
                              onClickfn={()=>{ setEditingItem(null); setModelOpen(true); }}
                              startIcon={<PlusIcon/>}
                          />

                      <ButtonElement variant="secondary"
                      size="sm"  onClickfn={shareContent}
                      startIcon={<ShareIcon/>}
                      />
                      </div>

              </div>

              {/* cards outer div*/}
              <div className="mx-auto mt-10 w-full max-w-270">
                  
                  {/* cards sections */}
                <div className="mr-0 w-full pr-0 ">

                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                        {loading ? (
                            <div className="col-span-full text-center font-heading text-text-secondary">
                              Fetching your saved links…
                              </div>
                        ) : filteredContent.length > 0 ? (
                            filteredContent.map((item) => (
                                <CardComponent
                                    key={item._id}
                                    type={item.type}
                                    heading={item.title}
                                    tags={item.tags || []}
                                    url={item.link}
                                    description={item.description}
                                    onEdit={() => {
                                      setEditingItem({
                                        _id: item._id,
                                        title: item.title,
                                        link: item.link,
                                        type: item.type,
                                        description: item.description,
                                        tags: item.tags,
                                      });
                                      setModelOpen(true);
                                    }}
                                    onDeleted={() => {
                                      setContent((currentContent) =>
                                        currentContent.filter(
                                          (contentItem) => contentItem._id !== item._id
                                        )
                                      );
                                    }}
                                />
                            ))
                        ) : content.length > 0 ? (
                            <div className="col-span-full font-heading text-center text-lg text-text-secondary">
                                No content matches "{searchQuery}".
                            </div>
                        ) : (
                            <div className="col-span-full font-heading text-center text-lg text-text-secondary">
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