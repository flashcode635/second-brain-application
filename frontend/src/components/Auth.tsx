import { useRef } from "react";
import ButtonElement from "../components/button";
import { InputField } from "../components/inputfield";
import { CustomAlert } from "../components/customAlert";

type AuthenticationProps = {
    title: string;
    loading: boolean;
    code?: React.ReactNode;
    alertMessage: string;
    showAlert: boolean;
    onSubmit: (username: string, password: string) => void;
    onCloseAlert: () => void;
};

// Shared UI shell. Sign-in and sign-up components own all authentication logic.
export default function Authentication({
    title,
    loading,
    alertMessage,
    showAlert,
    onSubmit,
    onCloseAlert,
}: AuthenticationProps) {
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    return (
        <>
            {/* Scoped CSS to remove black focus border and apply Apple-style soft focus */}
            <style>{`
                .premium-inputs input:focus,
                .premium-inputs textarea:focus {
                    outline: none !important;
                    border-color: #D1D5DB !important; /* Soft gray border */
                    box-shadow: 0 0 0 4px rgba(0, 0, 0, 0.03) !important; /* Subtle, premium glow */
                }
            `}</style>

            {/* Alert Container - Centered at the top with subtle spacing */}
            <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4">
                <CustomAlert 
                    message={alertMessage}
                    isVisible={showAlert}
                    onClose={onCloseAlert}
                />
            </div>

            {/* Outer Screen - Apple's signature light gray background */}
            <div className="fixed inset-0 z-40 flex justify-center items-center bg-[#F5F5F7]">
                
                {/* Premium Auth Card */}
                <div className="w-full max-w-100 mx-4 bg-white rounded-3xl shadow-[0_20px_40px_-12px_rgba(0,0,0,0.05)] border border-gray-100 p-8 flex flex-col gap-6">
                    
                    {/* Header Section */}
                    <div className="flex flex-col items-center text-center gap-2">
                        <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
                            {title}
                        </h1>
                        <p className="text-sm text-gray-500 font-normal leading-relaxed">
                            {title === "Sign In" 
                                ? "Welcome back. Please enter your details." 
                                : "Create your account to get started."}
                        </p>
                    </div>

                    {/* Form Fields Section with focus-fix class */}
                    <div className="flex flex-col gap-4 premium-inputs">
                        <InputField label="Username" ref={usernameRef} />
                        <InputField label="Password" ref={passwordRef} />
                    </div>

                    {/* Submit Button Section */}
                    <div className={`mt-2 transition-all duration-300 ease-out ${loading ? "opacity-60 pointer-events-none" : ""}`}>
                        <ButtonElement 
                            variant="primary" 
                            full={true} 
                            size="default" 
                            text="Submit" 
                            onClickfn={() => {
                                onSubmit(
                                    usernameRef.current?.value || "",
                                    passwordRef.current?.value || ""
                                );
                            }}
                        /> 
                    </div>

                    <div> { title === "Sign Up" ? <p>Already have an account? <a href="/signin" className="text-blue-500 hover:underline">Login</a></p> : <p>Don't have an account? <a href="/signup" className="text-blue-500 hover:underline">Sign Up</a></p> } 
                    
                    </div>
                </div>
            </div>
        </>
    );
}