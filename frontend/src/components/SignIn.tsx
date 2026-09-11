import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../api";
import Authentication from "./Auth";
import { SIGN_IN } from "../config";
import { useAuthStore, type AuthUser } from "../store";
export default function SignIn() {
    const [alertMessage, setAlertMessage] = useState("");
    const [showAlert, setShowAlert] = useState(false);
    const [loading, setLoading] = useState(false);
    const isProduction = import.meta.env.PROD;
    const navigate = useNavigate();
    const setUser = useAuthStore((state) => state.setUser);

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
            const response = await api.post<{ user: AuthUser }>(
                SIGN_IN,
                { username, password },
                { withCredentials: true },
            );
            setUser(response.data.user);
            navigate("/dashboard", { replace: true });
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