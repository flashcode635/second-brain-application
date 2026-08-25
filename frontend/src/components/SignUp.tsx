import { useState } from "react";
import axios from "axios";
import Authentication from "./Auth";
import { BACKEND_URL, SIGN_UP } from "../config";

export default function SignUp() {
    const [alertMessage, setAlertMessage] = useState("");
    const [showAlert, setShowAlert] = useState(false);
    const [loading, setLoading] = useState(false);
    const isProduction = import.meta.env.PROD;

    async function signUp(username: string, password: string) {
        // Disable the shared form while the sign-up request is running.
        setLoading(true);
        if (!username || !password) {
            setAlertMessage("Please enter both username and password");
            setShowAlert(true);
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post(`${BACKEND_URL}${SIGN_UP}`, { username, password });
            console.log("Sign Up response", response);
            window.location.href = "/signin";
        } catch (error) {
            console.error("Sign Up error:", error);
            const responseData = axios.isAxiosError(error) ? error.response?.data : undefined;
            const message = axios.isAxiosError(error)
                ? responseData?.error
                || responseData?.message
                || (typeof responseData === "string" ? responseData : undefined)
                || (isProduction ? "Sign Up failed" : `${error.response?.status}: ${JSON.stringify(responseData)}`)
                : isProduction ? "An unexpected error occurred. Please try again." : String(error);
            setAlertMessage(message);
            setShowAlert(true);
        } finally {
            setLoading(false);
        }
    }

    return <Authentication title="Sign Up" loading={loading} alertMessage={alertMessage} showAlert={showAlert} onSubmit={signUp} onCloseAlert={() => setShowAlert(false)} />;
}