import { type ReactElement } from "react";
// mimic of cva (class variance authirity)
export interface ButtonProps {
    variant:"primary"|"secondary";
    size:"sm"|"default"|"lg";
    text?:string;
    startIcon?:ReactElement;
    endIcon?:ReactElement;
    onClickfn?:()=>void
    loading?:boolean |void
    full?:boolean
}
export const defaultStyles = "font-semibold flex justify-center hover:cursor-pointer"
export const variantStyles={
    "primary":"theme-button-primary",
    "secondary":"theme-button-primary"
}
export const sizeStyles={
    sm:"p-1.5 rounded-md ",
    default:"px-2 py-2 rounded-lg ",
    lg:"px-6 py-3 rounded-lg"
}
export default function ButtonElement({variant,size,text,startIcon,endIcon,onClickfn,loading, full}:ButtonProps) {
    return (
        <>
        <button onClick={onClickfn}
        className={`${defaultStyles} ${variantStyles[variant]} ${sizeStyles[size]} 
        ${loading?"opacity-60":""}   ${full?"w-full":"w-auto"}`} >
            {startIcon}
           <p>{text} </p> 
            {endIcon }
        </button>
        </>
    )
}