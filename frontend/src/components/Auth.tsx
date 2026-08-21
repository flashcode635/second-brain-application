import { useRef, useState } from "react";
import ButtonElement from "../components/button";
import { InputField } from "../components/inputfield";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { CustomAlert } from "../components/customAlert";

export default function Authentication({ endpoint, Title, destination }: { endpoint: string, Title: string, destination: string }) {
    const [alertMessage, setAlertMessage] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [loading, setLoading] = useState(false);
   
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    async function auth() {
        // Get values from input fields using refs
        const username = usernameRef.current?.value;
        const password = passwordRef.current?.value;
        
        // Basic client-side validation
        if (!username || !password) {
            const errorMessage = 'Please enter both username and password';
            setAlertMessage(errorMessage);
            setShowAlert(true);
            setLoading(false);
            return;
        }
        
        try {
            // Make a POST request to the signup endpoint with username and password
            const response = await axios.post(`${BACKEND_URL}${endpoint}`, {
                username: username,
                password: password
            }, {
                headers: {
                    // Ensure we're sending JSON data
                    'Content-Type': 'application/json' 
                }
            });
            
            // getting the jwt token and storing in local storage
            if (Title === "Sign In") {
                // Handle post-sign-in logic here
                const jwt = response.data.token;
                const userId = response.data._id;
                localStorage.setItem("token", jwt);
                localStorage.setItem("userId", userId);
            }

            console.log(`${Title} response`, response);
            window.location.href = `${destination}`; // Redirect to login page after successful signup
           
        } catch (error) {
            console.error(`${Title} error:`, error);
            // Handle different types of errors
            if (axios.isAxiosError(error)) {
                // Extract the error message from the response or use a default message
                const errorMessage = error.response?.data?.error || ` ${Title} failed`;
                setAlertMessage(errorMessage);
                setShowAlert(true);
            } else {
                // For non-Axios errors, show a generic error message
                setAlertMessage('An unexpected error occurred. Please try again.');
                setShowAlert(true);
            }
        } finally {
            setLoading(false);
        }
        // auth() ends here
    }

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
                    onClose={() => setShowAlert(false)}
                />
            </div>

            {/* Outer Screen - Apple's signature light gray background */}
            <div className="fixed inset-0 z-40 flex justify-center items-center bg-[#F5F5F7]">
                
                {/* Premium Auth Card */}
                <div className="w-full max-w-100 mx-4 bg-white rounded-3xl shadow-[0_20px_40px_-12px_rgba(0,0,0,0.05)] border border-gray-100 p-8 flex flex-col gap-6">
                    
                    {/* Header Section */}
                    <div className="flex flex-col items-center text-center gap-2">
                        <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
                            {Title}
                        </h1>
                        <p className="text-sm text-gray-500 font-normal leading-relaxed">
                            {Title === "Sign In" 
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
                            variant="secondary" 
                            full={true} 
                            size="default" 
                            text="Submit" 
                            onClickfn={() => {
                                setLoading(true);
                                auth();
                                console.log("signup clicked");
                            }}
                        /> 
                    </div>
                </div>
            </div>
        </>
    );
}