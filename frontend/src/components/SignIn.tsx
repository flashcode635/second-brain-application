import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authClient } from "../authClient";
import Authentication, { type AuthFormValues } from "./Auth";

export default function SignIn() {
    const [alertMessage, setAlertMessage] = useState("");
    const [showAlert, setShowAlert] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function signIn({ username, password }: AuthFormValues) {
        setLoading(true);
        if (!username || !password) {
            setAlertMessage("Please enter both username and password");
            setShowAlert(true);
            setLoading(false);
            return;
        }

        const { error } = await authClient.signIn.username({ username, password });
        setLoading(false);

        if (error) {
            setAlertMessage(error.message || "Sign In failed");
            setShowAlert(true);
            return;
        }

        navigate("/dashboard", { replace: true });
    }

    async function signInWithGoogle() {
        // The OAuth callback is handled on the backend's origin, so this must be an
        // absolute URL back to the frontend — a relative path would resolve there instead.
        await authClient.signIn.social({ provider: "google", callbackURL: `${window.location.origin}/dashboard` });
    }

    return (
        <Authentication
            title="Sign In"
            loading={loading}
            alertMessage={alertMessage}
            showAlert={showAlert}
            onSubmit={signIn}
            onGoogle={signInWithGoogle}
            onCloseAlert={() => setShowAlert(false)}
        />
    );
}
