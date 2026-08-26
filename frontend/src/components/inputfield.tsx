import { forwardRef } from "react";

type Props = {
    label?: string;
    placeholder?: string;
};

export const InputField = forwardRef<HTMLInputElement, Props>(({ label, placeholder}, ref) => {
    return (
        <div className="flex flex-col">
            {label && <label className="text-[15px] text-text-primary tracking-wider font-sans mb-1">{label}</label>}
            <input
                ref={ref}
                placeholder={placeholder}
                className={`border border-gray-300 bg-white cursor-text rounded-lg px-3 py-2.5 
                     text-sm w-full min-w-0 text-black
                     shadow-[0_1px_3px_rgba(0,0,0,0.08)]
                     outline-none 
                     focus:border-black focus:shadow-[inset_0_0_0_1px_black,0_1px_3px_rgba(0,0,0,0.08)] 
                     focus:ring-0 transition-all duration-150`}
                defaultValue={undefined}
            />
        </div>
    );
});
InputField.displayName = "InputField";
export default InputField;