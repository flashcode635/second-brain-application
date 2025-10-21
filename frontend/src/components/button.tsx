import { type ReactElement } from "react";
// mimic of cva (class variance authirity)
interface ButtonProps {
    variant:"primary"|"secondary";
    size:"sm"|"default"|"lg";
    text:string;
    startIcon?:ReactElement;
    endIcon?:ReactElement;
    
}
const defaultStyles = "font-semibold flex"
const variantStyles={
    "primary":" bg-purple-250 text-purple-750",
    "secondary":"bg-purple-750 text-white"
}
export const sizeStyles={
    sm:"px-2 py-2 rounded-md ",
    default:"px-4 py-2 rounded-md ",
    lg:"px-6 py-3 rounded-lg"
}
export default function ButtonElement({variant,size,text,startIcon,endIcon}:ButtonProps) {
    return (
        <>
        <button className={`${defaultStyles} ${variantStyles[variant]} ${sizeStyles[size]}`}>
            {startIcon}
            {text}
            {endIcon}
        </button>
        </>
    )
}