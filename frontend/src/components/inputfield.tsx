import { forwardRef } from "react";

type Props = {
    label?: string;
    placeholder?: string;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
    error?: string;
    hasError?: boolean;
    type?: string;
    defaultValue?: string;
    endAdornment?: React.ReactNode;
    maxLength?: number;
};

export const InputField = forwardRef<HTMLInputElement, Props>(({ label, placeholder, onChange, error, hasError, type = "text", defaultValue, endAdornment, maxLength }, ref) => {
    const showError = Boolean(error) || Boolean(hasError);
    return (
        <div className="flex flex-col">
            {label && <label className="text-[15px] text-text-primary tracking-wider font-sans mb-1">{label}</label>}
            <div className="relative flex items-center">
                <input
                    ref={ref}
                    type={type}
                    placeholder={placeholder}
                    onChange={onChange}
                    defaultValue={defaultValue}
                    maxLength={maxLength}
                    className={`border ${showError ? "border-red-500" : "border-gray-300"} bg-white cursor-text rounded-lg px-3 py-2.5
                         text-sm w-full min-w-0 text-black
                         shadow-[0_1px_3px_rgba(0,0,0,0.08)]
                         outline-none
                         ${endAdornment ? "pr-10" : ""}
                         ${showError
                            ? "shadow-[0_0_0_3px_rgba(239,68,68,0.15)] focus:border-red-500 focus:shadow-[inset_0_0_0_1px_rgb(239,68,68),0_0_0_3px_rgba(239,68,68,0.15)]"
                            : "focus:border-black focus:shadow-[inset_0_0_0_1px_black,0_1px_3px_rgba(0,0,0,0.08)]"}
                         focus:ring-0 transition-all duration-150`}
                />
                {endAdornment && (
                    <div className="absolute right-2 flex items-center">{endAdornment}</div>
                )}
            </div>
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
    );
});
InputField.displayName = "InputField";
export default InputField;