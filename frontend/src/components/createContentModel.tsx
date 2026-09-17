// import { useState } from "react"
import { useRef, useState } from "react"
import { CONTENT } from "../config"
import ButtonElement from "./button"
import { InputField } from "./inputfield"
import { CancelIcon } from "./svg/cancelicon"
import { CustomAlert } from "./customAlert"
import axios from "axios"
import api from "../api"
// Imported Zustand store to trigger dashboard refresh after adding content
import { useDashboardStore } from "../store"

export interface fieldprops{
    label?:string, 
    placeholder?:string,
    
}

const tagsample = ["tag1", "tag2", "tag3"]
const domainMap = {
    twitter: ["x.com", "twitter.com"],
    linkedIn: ["linkedin.com", "lnkd.in"],
    youtube: ["youtube.com", "youtu.be"],
    instagram: ["instagram.com"],
    reddit: ["reddit.com"],
} as const
type ContentType = keyof typeof domainMap

function getContentType(link: string): ContentType | null {
    try {
        const hostname = new URL(link).hostname.toLowerCase()
        return (Object.entries(domainMap).find(([, domains]) =>
            domains.some((domain) => hostname === domain || hostname.endsWith(`.${domain}`))
        )?.[0] as ContentType | undefined) ?? null
    } catch {
        return null
    }
}
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

    const [detectedType, setDetectedType] = useState<ContentType | null>(null)

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

        const contentType = getContentType(link)

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

            if (!getContentType(link)) {
                setAlertMessage('Please enter a link from LinkedIn, Twitter (X), Instagram, Reddit, or YouTube.');
                setShowAlert(true);
                return;
            }

            // ✅ If all checks passed, proceed
            // e.g. handleValidLink(link)
        } catch {
            setAlertMessage('Please enter a valid URL.');
            setShowAlert(true);
            return;
            }


        console.log("Adding content payload:", { title, link, tags, contentType })
        await api.post(CONTENT, {
            title,
            link,
            type: contentType,
            tags:tags
        }, {
            headers: { "Content-Type": "application/json" }
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
            className="theme-surface w-full max-w-md mx-auto rounded-2xl 
            shadow-2xl px-7 py-6 flex flex-col fixed
            gap-4 border border-slate-100">             
              {/* closing button */}
                <div className=" flex justify-end-safe h-7.5 text-stone-500/90 w-fit top-2 right-3 absolute">
                    <button className="hover:cursor-pointer" onClick={onClose}>

                                <CancelIcon/>
                    </button>
                </div>
                {/* title */}
                <div className="">
                        <h2 className="text-[22px] font-semibold text-center text-text-primary mb-0.5 tracking-tight">
                        Add Contents to List
                    </h2>
                </div>  
                    
            {/* input fields */}
            <div className="flex flex-col mb-3 gap-4">
                        <InputField label="Title" ref={titleref} />
                        <InputField
                            label="Link"
                            ref={linkref}
                            onChange={(event) => setDetectedType(getContentType(event.target.value))}
                        />
                        {detectedType && (
                            <p className="text-sm text-text-muted">Detected type: {detectedType}</p>
                        )}
                {/* <InputField label="Description"/> */}
                <div className="flex flex-col">
                    <label htmlFor="title" className="text-text-primary 
                    font-[16px] font-sans mb-1">Enter tags</label>
                    <div className="grid grid-cols-3 w-full gap-4">
                        {tagsample.map((tag, index) => (
                            <span key={index} className="min-w-0">
                                <InputField 
                                    placeholder={`Enter ${tag}`} 
                                    ref={index === 0 ? tagref1 : index === 1 ? tagref2 : tagref3}
                                />
                            </span>
                        ))}
                    </div>

                </div>
            </div>
            
                <ButtonElement variant="primary" size="lg" 
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
             <div className="theme-page bg-[#090808CB] h-screen w-screen left-0 top-0 fixed z-1000">
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

