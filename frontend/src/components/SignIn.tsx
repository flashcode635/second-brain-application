import { useState } from "react";
import axios from "axios";
import Authentication from "./Auth";
import { BACKEND_URL, SIGN_IN } from "../config";

export default function SignIn() {
    const [alertMessage, setAlertMessage] = useState("");
    const [showAlert, setShowAlert] = useState(false);
    const [loading, setLoading] = useState(false);
    const isProduction = import.meta.env.PROD;

    async function signIn(username: string, password: string) {
        // Disable the shared form while the sign-in request is running.
        setLoading(true);
        if (!username || !password) {
            setAlertMessage("Please enter both username and password");
            setShowAlert(true);
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post(`${BACKEND_URL}${SIGN_IN}`, { username, password });
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("userId", response.data._id || response.data.id);
            console.log("Sign In response", response);
            window.location.href = "/dashboard";
        } catch (error) {
            console.error("Sign In error:", error);
            const message = axios.isAxiosError(error)
                ? error.response?.data?.error || (isProduction ? "Sign In failed" : `${error.response?.status}: ${JSON.stringify(error.response?.data)}`)
                : isProduction ? "An unexpected error occurred. Please try again." : String(error);
            setAlertMessage(message);
            setShowAlert(true);
        } finally {
            setLoading(false);
        }
    }

    return <Authentication title="Sign In" loading={loading} alertMessage={alertMessage} showAlert={showAlert} onSubmit={signIn} onCloseAlert={() => setShowAlert(false)} />;
}