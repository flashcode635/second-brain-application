
import { useRef, useState } from "react";
import ButtonElement from "../components/button";
import { InputField } from "../components/inputfield";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { CustomAlert } from "../components/customAlert";

export default function Authentication({endpoint,Title, destination}: {endpoint: string, Title: string, destination: string}) {
    const [alertMessage, setAlertMessage] = useState('');
     const [showAlert, setShowAlert] = useState(false);
    const [loading,setLoading]= useState(false)
   
    const usernameRef= useRef<HTMLInputElement>(null);
    const passwordRef= useRef<HTMLInputElement>(null);

    async function auth(){
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
             if (Title=="Sign In") {
                // Handle post-sign-in logic here
             const jwt=   response.data.token
             const userId= response.data._id;
                localStorage.setItem("token", jwt)
                localStorage.setItem("userId", userId)

            }

            console.log(`${Title} response`, response);
            // alert("Signup successful! Please login.");
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
    return(
        <>
         {/* Add this before your existing JSX */}

        <div className="  fixed z-10000">

            <CustomAlert 
                message={alertMessage}
                isVisible={showAlert}
                onClose={() => setShowAlert(false)}
            />
        </div>
         <div >
            {/* outer screen */}
                <div className="w-screen h-screen bg-gray-50 fixed z-100 flex justify-center items-center ">
                            {/* input box  */}
                    <div className="bg-yellow-50 flex flex-col 
                    gap-3 rounded-md p-4 pt-0 pr-0">
                           

                        <div className="pt-4 pr-4 flex flex-col items-center gap-2 ">

                            <h1 className=" text-2xl text-center"> <b>{Title} </b>  </h1>

                            <InputField label="username" ref={usernameRef}/>
                            <InputField label="password" ref={passwordRef}/>

                        </div>
                        <div className={`pr-4 ${loading?" opacity-50 ":""}   `}>
                            <ButtonElement variant="secondary" full={true} size="default" text="Submit" 
                            
                            onClickfn={()=>{
                                setLoading(true);
                                auth()
                                console.log("signup clicked");

                            }
                            } /> 
                        </div>
                            
                        </div>
                        
                </div>

            </div>
             
        </>
    )
}