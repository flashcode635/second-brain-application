// import { useState } from "react"
import { useRef, useState } from "react"
import { BACKEND_URL, className, CONTENT } from "../config"
import ButtonElement from "./button"
import { InputField } from "./inputfield"
import { CancelIcon } from "./svg/cancelicon"
import { CustomAlert } from "./customAlert"
import axios from "axios"
// Imported Zustand store to trigger dashboard refresh after adding content
import { useDashboardStore } from "../atoms"

export interface fieldprops{
    label?:string, 
    placeholder?:string,
    
}

const tagsample = ["tag1", "tag2", "tag3"]
interface InputBoxProps {
    onClose: () => void;
}
const InputBox: React.FC<InputBoxProps> = ({ onClose }) => {
    // CHANGE: Get triggerRefresh function from Zustand store
    // This will be called after successfully adding content to refresh the dashboard
    const triggerRefresh = useDashboardStore((state) => state.triggerRefresh);
    // for alert popups:-
    //tells message to alert
    const [alertMessage, setAlertMessage] = useState(''); 
    //controls alert visibility
    const [showAlert, setShowAlert] = useState(false); 

    //  to get data
    // default to a valid content type that backend supports
    const [type, setType]= useState<'linkedIn' | 'youtube' | 'twitter'>("youtube")

    const titleref= useRef<HTMLInputElement>(null)
    const linkref= useRef<HTMLInputElement>(null)
    const tagref1= useRef<HTMLInputElement>(null)
    const tagref2= useRef<HTMLInputElement>(null)
    const tagref3= useRef<HTMLInputElement>(null)
   
// adds contents to db
    async function addContent() {
        const title = titleref.current?.value?.trim() ?? ""
        const link = linkref.current?.value?.trim() ?? ""

        // read raw values from each tag ref, trim and filter out empty strings
        const rawTags = [
            tagref1.current?.value ?? "",
            tagref2.current?.value ?? "",
            tagref3.current?.value ?? ""
        ]
        const tags = rawTags.map(t => t.trim()).filter(Boolean)

        // minimal logging removed

        const contentType = type

        if (!title || !link || tags.length === 0 || !contentType) {
            const errormessage = "Missing required fields"
            setAlertMessage(errormessage)
            setShowAlert(true)
            console.error(errormessage)
            return
        }

        // validate URL properly
        try {
            // link parsed in URL object
            const parsed = new URL(link);

            // ✅ Ensure HTTPS
            if (parsed.protocol !== 'https:') {
                setAlertMessage('Please enter an HTTPS URL.');
                setShowAlert(true);
                return;
            }

            // ✅ Normalize and check domain
            const hostname = parsed.hostname.toLowerCase();
            const allowed = ['x.com', 'twitter.com', 'linkedin.com', 'youtube.com', 'youtu.be'];
            const isAllowed = allowed.some(
                (d) => hostname === d || hostname.endsWith('.' + d)
            );
            // If domain is not FOUND in list
            if (!isAllowed) {
                setAlertMessage('Please enter a link from LinkedIn, Twitter (X), or YouTube.');
                setShowAlert(true);
                return;
            }

            // ✅ Additional check: match domain with provided contentType
        
            const domainMap: Record<string, string[]> = {
                // mapping of types with their respective domains.
                twitter: ['x.com', 'twitter.com'],
                linkedIn: ['linkedin.com'],
                youtube: ['youtube.com', 'youtu.be'],
            };

            // If `contentType` is defined, make sure the link belongs to that platform
            if (contentType) {
                const expectedDomains = domainMap[contentType] || [];
                const matchesContentType = expectedDomains.some(
                (d) => hostname === d || hostname.endsWith('.' + d)
                );

                if (!matchesContentType) {
                setAlertMessage(`The link does not match the selected content type (${contentType}).`);
                setShowAlert(true);
                return;
                }
            }

            // ✅ If all checks passed, proceed
            // e.g. handleValidLink(link)
        } catch {
            setAlertMessage('Please enter a valid URL.');
            setShowAlert(true);
            return;
            }




        console.log("Adding content payload:", { title, link, tags, contentType })
        await axios.post(BACKEND_URL + CONTENT, {
            title,
            link,
            type: contentType,
            tags:tags
        }, {
            headers: {
                "Content-Type": "application/json",
                Authorization: localStorage.getItem("token") || ""
            }
        }  )
        .then((res) => {
            if (res.status === 200) {
                setAlertMessage('Content added successfully!');
                setShowAlert(true);
                // CHANGE: Trigger dashboard refresh by calling triggerRefresh()
                // This increments the refreshKey in Zustand store (0 -> 1 -> 2...)
                // Dashboard component is watching refreshKey, so it will detect the change
                // and automatically re-fetch all content from the database
                // Result: New content appears on dashboard without manual page refresh!
                triggerRefresh();
                // Close the modal after successful submission
                setTimeout(() => {
                    onClose();
                }, 1500);
            }
        }).catch(err => {
            const msg = axios.isAxiosError(err) ? (err.response?.data?.message || err.response?.data?.error || "Failed to add content") : "Failed to add content"
            setAlertMessage(msg)
            setShowAlert(true)
            console.error("Add content error:", err)
        })
    }

    // react content of input box component - main
    return (
        <>
          <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
                <div className="pointer-events-auto">
                    <CustomAlert 
                        message={alertMessage}
                        isVisible={showAlert}
                        onClose={() => setShowAlert(false)}
                    />
                </div>
          </div>

            <div 
            className="w-full max-w-md mx-auto bg-yellow-50 rounded-2xl 
            shadow-2xl pt-0 pr-5 pl-5 pb-4   flex flex-col fixed
            gap-2 border border-slate-100">
                {/* closing button */}
                <div className=" flex justify-end-safe h-[30px]  w-full ">
                    <button className="hover:cursor-pointer" onClick={onClose}>

                                <CancelIcon/>
                    </button>
                </div>
            
                {/* title */}
                <div className="">
                    <h2 className="text-[22px] font-semibold text-center text-slate-800 mb-0.5 tracking-tight">
                        Add Contents to List
                    </h2>
                </div>  
                    
            {/* input fields */}
            <div className="flex flex-col  gap-2">
                        <InputField label="Title" ref={titleref} />
                        <InputField label="Link" ref={linkref} />
                {/* <InputField label="Description"/> */}
                <div className="flex flex-col">
                    {/* chose type */}
                    <label htmlFor="title" className="text-slate-700 font-medium mb-1.5">Choose Type</label>
                    {/* type of link */}
                    <div className="grid grid-cols-2">

                        <button  className={`content-button ${className} w-40 mb-3 ${type === "linkedIn" ? "bg-purple-850 text-amber-50" : ""}`}
                         onClick={() => setType("linkedIn")}
                         >LinkedIn</button>
                        <button className={`${className} w-40 mb-3 ${type === "youtube" ? "bg-purple-850 text-amber-50" : ""}`}
                         onClick={() => setType("youtube")}
                         >Youtube</button>
                        <button className={` content-button ${className} w-40 mb-3 ${type ==="twitter" ? "bg-purple-850 text-amber-50" : ""}`} 
                        onClick={() => setType("twitter")}
                        >Twitter</button>
                    </div>
                
                    <label htmlFor="title" className="text-slate-700 
                    font-medium mb-1.5">Enter tags</label>
                    <div className="grid grid-cols-3">
                        {tagsample.map((tag, index) => (
                            <span key={index} className="mr-3">
                                <InputField 
                                    placeholder={`Enter ${tag}`} 
                                    ref={index === 0 ? tagref1 : index === 1 ? tagref2 : tagref3}
                                />
                            </span>
                        ))}
                    </div>

                </div>
            </div>
            
                <ButtonElement variant="secondary" size="lg" 
                onClickfn={addContent} text="Add Content"/>

            </div>
        </>
        
    );
}

interface modelProps{
    open:boolean,
    onClose: ()=>void
}
export const CreateContentModel = ({open ,onClose}:modelProps) => {
    return (
        <>
            {open &&
             <div className="h-screen w-screen left-0 top-0 fixed     bg-gray-50 z-1000">
                <div> 
                    <div 
                    className=" h-screen w-full fixed flex items-center justify-center opacity-120 ">
                                <InputBox onClose={onClose} />       
                   </div>
                </div>

            </div> }
        </>
    )
}

