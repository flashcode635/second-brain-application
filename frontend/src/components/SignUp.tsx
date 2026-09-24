import { useState } from "react";
import { authClient } from "../authClient";
import Authentication, { type AuthFormValues } from "./Auth";

export default function SignUp() {
    const [alertMessage, setAlertMessage] = useState("");
    const [showAlert, setShowAlert] = useState(false);
    const [loading, setLoading] = useState(false);

    async function signUp({ username, password, email }: AuthFormValues) {
        setLoading(true);
        if (!username || !password || !email) {
            setAlertMessage("Please fill in your email, username and password");
            setShowAlert(true);
            setLoading(false);
            return;
        }

        // The app doesn't use a separate display name — the username is the name.
        const { error } = await authClient.signUp.email({ email, password, name: username, username });
        setLoading(false);

        if (error) {
            setAlertMessage(error.message || "Sign Up failed");
            setShowAlert(true);
            return;
        }

        window.location.href = "/dashboard";
    }

    async function signUpWithGoogle() {
        // The OAuth callback is handled on the backend's origin, so this must be an
        // absolute URL back to the frontend — a relative path would resolve there instead.
        await authClient.signIn.social({ provider: "google", callbackURL: `${window.location.origin}/dashboard` });
    }

    return (
        <Authentication
            title="Sign Up"
            loading={loading}
            alertMessage={alertMessage}
            showAlert={showAlert}
            onSubmit={signUp}
            onGoogle={signUpWithGoogle}
            onCloseAlert={() => setShowAlert(false)}
        />
    );
}
