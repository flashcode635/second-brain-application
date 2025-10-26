import { forwardRef } from "react";
import { className } from "../config";

type Props = {
    label?: string;
    placeholder?: string;
  
};

// Forward ref to the underlying <input> so parent refs work
export const InputField = forwardRef<HTMLInputElement, Props>(({ label, placeholder}, ref) => {
    return (
        <div className="flex flex-col">
            {label && <label className="text-sm text-slate-700 mb-1">{label}</label>}
            <input
                ref={ref}
                placeholder={placeholder}
                className={`border rounded px-3 py-2 text-sm ${className}`}
                // keep it uncontrolled so ref.value works
                defaultValue={undefined}
            />
        </div>
    );
});
InputField.displayName = "InputField";
export default InputField;