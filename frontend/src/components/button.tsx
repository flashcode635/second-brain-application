import { type ReactElement } from "react";
// mimic of cva (class variance authirity)
export interface ButtonProps {
    variant:"primary"|"secondary";
    size:"sm"|"default"|"lg";
    text:string;
    startIcon?:ReactElement;
    endIcon?:ReactElement;
    onClickfn?:()=>void
    loading?:boolean |void
    full?:boolean
}
export const defaultStyles = "font-semibold flex justify-center hover:cursor-pointer"
export const variantStyles={
    "primary":" bg-purple-250 text-purple-750",
    "secondary":"bg-purple-750 text-white"
}
export const sizeStyles={
    sm:"px-1 py-1 rounded-md ",
    default:"px-4 py-2 rounded-md ",
    lg:"px-6 py-3 rounded-lg"
}
export default function ButtonElement({variant,size,text,startIcon,endIcon,onClickfn,loading, full}:ButtonProps) {
    return (
        <>
        <button onClick={onClickfn}
        className={`${defaultStyles} ${variantStyles[variant]} ${sizeStyles[size]} 
        ${loading?" bg-gray-600":""}   ${full?"w-full":"w-auto"}`} >
            {startIcon}
           <p>{text} </p> 
            {endIcon }
        </button>
        </>
    )
}