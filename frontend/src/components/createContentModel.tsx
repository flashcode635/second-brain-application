// import { useState } from "react"
import ButtonElement from "./button"
import { CancelIcon } from "./svg/cancelicon"

const InputField = ({label}:{label:string}) => {
    return(
        <>
            <div className="flex flex-col gap-1 mb-2">
                <label htmlFor="title" className="text-slate-700 font-medium mb-1.5">{label}</label>
                <input
                    type="text"
                    id={label}
                    placeholder={`Enter the ${label}`}
                    className="px-4 py-2 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-slate-900 bg-slate-50 shadow-sm"
                />
            </div> 
        </>
    )
}
const InputBox = (
    // @ts-ignore
    {onClose}:IntrinsicAttributes
) => {
    return (
        <div 
        className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-2xl p-8 flex flex-col 
        gap-6 border border-slate-100">
             <div className=" flex justify-end-safe h-[40px]  w-full "
             >
                <button className="hover:cursor-pointer" onClick={onClose}>

                             <CancelIcon/>
                </button>
            </div>
            
            <div className="">
                <h2 className="text-2xl font-semibold text-center text-slate-800 mb-2 tracking-tight">Add Contents to List</h2>
        </div>  
                

            <div className="flex flex-col  gap-3">

            <InputField label="Title"/>
            <InputField label="Link"/>
            <InputField label="Description"/>
            </div>
            
            {/* <button
                type="button"
                className="mt-4 w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold text-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
                Add Content
            </button> */}
            
          
                
            <ButtonElement variant="secondary" size="lg" text="Add Content"/>

        </div>
    );
}

interface modelProps{
    open:boolean,
    onClose: ()=>void
}
export const CreateContentModel = ({open ,onClose}:modelProps) => {
    // const [close, setClose]= useState(open)
    return (
        <>
            {open &&
             <div className="h-screen w-screen left-0 top-0 fixed bg-gray-50 z-1000">
                <div>
                       
                    <div 
                    className=" h-full w-full fixed flex items-center justify-center opacity-120 ">
                                <InputBox onClose={onClose} />
                            {/* <div className="bg-white"> 
                            </div> */}
                   </div>
                </div>

            </div> }
        </>
    )
}

