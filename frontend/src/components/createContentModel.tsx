// import { useState } from "react"
import { useRef, useState } from "react"
import { CATEGORY_OPTIONS, CONTENT } from "../config"
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
const TAG_MAX_LENGTH = 30
const domainMap = {
    twitter: ["x.com", "twitter.com"],
    linkedIn: ["linkedin.com", "lnkd.in"],
    youtube: ["youtube.com", "youtu.be"],
    instagram: ["instagram.com"],
    reddit: ["reddit.com"],
} as const
type ContentType = keyof typeof domainMap
// links from any other site (blogs, articles, docs, etc.) fall back to "document"
type DetectedContentType = ContentType | "document"

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

// resolves the type saved to the backend: a known platform, or "document" for any other valid link (e.g. blog posts)
function resolveContentType(link: string): DetectedContentType | null {
    try {
        new URL(link)
    } catch {
        return null
    }
    return getContentType(link) ?? "document"
}
export interface EditableContentItem {
    _id: string;
    title: string;
    link: string;
    type: DetectedContentType;
    description?: string;
    tags?: string[];
}

interface InputBoxProps {
    onClose: () => void;
    editItem?: EditableContentItem | null;
}
const InputBox: React.FC<InputBoxProps> = ({ onClose, editItem }) => {
    const isEditing = Boolean(editItem);
    // CHANGE: Get triggerRefresh function from Zustand store
    // This will be called after successfully adding content to refresh the dashboard
    const triggerRefresh = useDashboardStore((state) => state.triggerRefresh);
    // for alert popups:-
    //tells message to alert
    const [alertMessage, setAlertMessage] = useState(''); 
    //controls alert visibility
    const [showAlert, setShowAlert] = useState(false); 

    const [detectedType, setDetectedType] = useState<DetectedContentType | null>(editItem?.type ?? null)

    const initialCategory = editItem?.tags?.find((tag) =>
        CATEGORY_OPTIONS.some((option) => option.toLowerCase() === tag.toLowerCase())
    ) ?? ""
    const [category, setCategory] = useState(initialCategory)
    const manualTagsInitial = editItem?.tags?.filter((tag) => tag.toLowerCase() !== initialCategory.toLowerCase()) ?? []

    // per-field validation errors shown as red glow + suggestion below the field
    const [fieldErrors, setFieldErrors] = useState<{ title?: string; link?: string; tags?: string }>({})
    const clearFieldError = (field: keyof typeof fieldErrors) => {
        setFieldErrors((prev) => {
            if (!prev[field]) return prev
            const next = { ...prev }
            delete next[field]
            return next
        })
    }

    const titleref= useRef<HTMLInputElement>(null)
    const linkref= useRef<HTMLInputElement>(null)
    const descriptionref= useRef<HTMLTextAreaElement>(null)
    const tagref1= useRef<HTMLInputElement>(null)
    const tagref2= useRef<HTMLInputElement>(null)
    const tagref3= useRef<HTMLInputElement>(null)

// adds contents to db
    async function addContent() {
        const title = titleref.current?.value?.trim() ?? ""
        const link = linkref.current?.value?.trim() ?? ""
        const description = descriptionref.current?.value?.trim() ?? ""

        // read raw values from each tag ref, trim and filter out empty strings
        const rawTags = [
            tagref1.current?.value ?? "",
            tagref2.current?.value ?? "",
            tagref3.current?.value ?? ""
        ]
        const manualTags = rawTags.map(t => t.trim()).filter(Boolean)
        const trimmedCategory = category.trim()
        const tags = trimmedCategory
            ? [trimmedCategory, ...manualTags.filter(t => t.toLowerCase() !== trimmedCategory.toLowerCase())]
            : manualTags

        // minimal logging removed

        const newFieldErrors: { title?: string; link?: string; tags?: string } = {}
        if (!title) newFieldErrors.title = "Title is required"
        if (!link) newFieldErrors.link = "Link is required"
        if (tags.length === 0) newFieldErrors.tags = "Enter at least one tag"

        if (Object.keys(newFieldErrors).length > 0) {
            setFieldErrors(newFieldErrors)
            return
        }
        setFieldErrors({})

        // validate URL properly
        let contentType: DetectedContentType
        try {
            // link parsed in URL object
            const parsed = new URL(link);

            // ✅ Ensure HTTPS
            if (parsed.protocol !== 'https:') {
                setAlertMessage('Please enter an HTTPS URL.');
                setShowAlert(true);
                return;
            }

            // known platforms keep their dedicated type; any other valid link
            // (blog posts, articles, docs, etc.) is saved as a "document"
            contentType = getContentType(link) ?? "document"

            // ✅ If all checks passed, proceed
            // e.g. handleValidLink(link)
        } catch {
            setAlertMessage('Please enter a valid URL.');
            setShowAlert(true);
            return;
            }


        const payload = {
            title,
            link,
            type: contentType,
            description,
            tags: tags
        }
        console.log(isEditing ? "Updating content payload:" : "Adding content payload:", payload)

        const request = isEditing
            ? api.patch(CONTENT, { id: editItem!._id, ...payload }, { headers: { "Content-Type": "application/json" } })
            : api.post(CONTENT, payload, { headers: { "Content-Type": "application/json" } })

        await request
        .then((res) => {
            if (res.status === 200) {
                setAlertMessage(isEditing ? 'Content updated successfully!' : 'Content added successfully!');
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
            const fallback = isEditing ? "Failed to update content" : "Failed to add content"
            const msg = axios.isAxiosError(err) ? (err.response?.data?.message || err.response?.data?.error || fallback) : fallback
            setAlertMessage(msg)
            setShowAlert(true)
            console.error(fallback, err)
        })
    }

    // react content of input box component - main
    return (
        <>
          <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
                <div className="pointer-events-auto">
                    <CustomAlert 
                        message={alertMessage}
                        isError={!alertMessage.includes('successfully')}
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
                        {isEditing ? "Edit Content" : "Add Contents to List"}
                    </h2>
                </div>

            {/* input fields */}
            <div className="flex flex-col mb-3 gap-4">
                        <InputField
                            label="Title"
                            ref={titleref}
                            defaultValue={editItem?.title}
                            error={fieldErrors.title}
                            onChange={(event) => {
                                if (event.target.value.trim()) clearFieldError("title")
                            }}
                        />
                        <InputField
                            label="Link"
                            ref={linkref}
                            defaultValue={editItem?.link}
                            error={fieldErrors.link}
                            onChange={(event) => {
                                setDetectedType(resolveContentType(event.target.value))
                                if (event.target.value.trim()) clearFieldError("link")
                            }}
                        />
                        {detectedType && (
                            <p className="text-sm text-text-muted">Detected type: {detectedType}</p>
                        )}
                <div className="flex flex-col">
                    <label htmlFor="category" className="text-[15px] text-text-primary tracking-wider font-sans mb-1">
                        Category <span className="text-text-muted font-normal">(optional)</span>
                    </label>
                    <select
                        id="category"
                        value={category}
                        onChange={(event) => setCategory(event.target.value)}
                        className="theme-input rounded-lg px-3 py-2.5 text-sm w-full min-w-0"
                    >
                        <option value="">No category</option>
                        {CATEGORY_OPTIONS.map((option) => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                </div>
                <div className="flex flex-col">
                    <label htmlFor="description" className="text-[15px] text-text-primary tracking-wider font-sans mb-1">
                        Description <span className="text-text-muted font-normal">(optional)</span>
                    </label>
                    <textarea
                        id="description"
                        ref={descriptionref}
                        placeholder="Add a short description..."
                        rows={3}
                        defaultValue={editItem?.description}
                        className="scrollbar-hidden resize-none border border-gray-300 bg-white cursor-text rounded-lg px-3 py-2.5
                             text-sm w-full min-w-0 text-black
                             shadow-[0_1px_3px_rgba(0,0,0,0.08)]
                             outline-none
                             focus:border-black focus:shadow-[inset_0_0_0_1px_black,0_1px_3px_rgba(0,0,0,0.08)]
                             focus:ring-0 transition-all duration-150"
                    />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="title" className="text-text-primary
                    font-[16px] font-sans mb-1">Enter tags</label>
                    <div className="grid grid-cols-3 w-full gap-4">
                        {tagsample.map((tag, index) => (
                            <span key={index} className="min-w-0">
                                <InputField
                                    placeholder={`Enter ${tag}`}
                                    ref={index === 0 ? tagref1 : index === 1 ? tagref2 : tagref3}
                                    defaultValue={manualTagsInitial[index]}
                                    hasError={Boolean(fieldErrors.tags)}
                                    maxLength={TAG_MAX_LENGTH}
                                    onChange={(event) => {
                                        if (event.target.value.trim()) clearFieldError("tags")
                                    }}
                                />
                            </span>
                        ))}
                    </div>
                    {fieldErrors.tags && (
                        <p className="text-xs text-red-500 mt-1">{fieldErrors.tags}</p>
                    )}
                </div>
            </div>

                <ButtonElement variant="primary" size="lg"
                onClickfn={addContent} text={isEditing ? "Save Changes" : "Add Content"}/>

            </div>
        </>
        
    );
}

interface modelProps{
    open:boolean,
    onClose: ()=>void
    editItem?: EditableContentItem | null
}
export const CreateContentModel = ({open ,onClose, editItem}:modelProps) => {
    return (
        <>
            {open &&
             <div className="theme-page bg-[#090808CB] h-screen w-screen left-0 top-0 fixed z-1000">
                <div>
                    <div
                    className=" h-screen w-full fixed flex items-center justify-center opacity-120 ">
                                <InputBox onClose={onClose} editItem={editItem} />
                   </div>
                </div>

            </div> }
        </>
    )
}

