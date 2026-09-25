import { useEffect, useRef, useState } from "react";
import ButtonElement from "../components/button";
import { InputField } from "../components/inputfield";
import { CustomAlert } from "../components/customAlert";
import { EyeIcon, EyeOffIcon } from "../components/svg/eyeicon";
import { GoogleIcon } from "../components/svg/googleicon";

export type AuthFormValues = {
    username: string;
    password: string;
    email?: string;
};

type AuthenticationProps = {
    title: string;
    loading: boolean;
    code?: React.ReactNode;
    alertMessage: string;
    showAlert: boolean;
    onSubmit: (values: AuthFormValues) => void;
    onGoogle: () => void;
    onCloseAlert: () => void;
};

// Shared UI shell. Sign-in and sign-up components own all authentication logic.
export default function Authentication({
    title,
    loading,
    alertMessage,
    showAlert,
    onSubmit,
    onGoogle,
    onCloseAlert,
}: AuthenticationProps) {
    const emailRef = useRef<HTMLInputElement>(null);
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const isSignUp = title === "Sign Up";
    const [showPassword, setShowPassword] = useState(false);

    // This page always renders with its own fixed light palette, regardless
    // of the logged-in user's dark-mode preference — pin data-theme to light
    // while it's mounted and restore whatever it was on the way out.
    useEffect(() => {
        const html = document.documentElement;
        const previousTheme = html.getAttribute("data-theme");
        html.setAttribute("data-theme", "light");
        return () => {
            if (previousTheme) html.setAttribute("data-theme", previousTheme);
            else html.removeAttribute("data-theme");
        };
    }, []);

    return (
        <>
            {/* Design tokens + component-scoped styles.
               If your app already loads a display serif, drop the @import
               and swap the font-family below to your existing token. */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&display=swap');

                .auth-shell {
                    --ink: #14171F;
                    --paper: #FAF8F3;
                    --accent: #1F6F5C;
                    --accent-soft: #E3ECE9;
                    --line: #E6E2D8;
                    --muted: #6B6F76;
                }

                .auth-display {
                    font-family: 'Fraunces', Georgia, serif;
                    font-optical-sizing: auto;
                    letter-spacing: -0.01em;
                }

                .auth-panel input,
                .auth-panel textarea {
                    background: transparent !important;
                    border: none !important;
                    border-bottom: 1px solid var(--line) !important;
                    border-radius: 0 !important;
                    padding-left: 2px !important;
                    transition: border-color 150ms ease;
                }
                .auth-panel input:focus,
                .auth-panel textarea:focus {
                    outline: none !important;
                    box-shadow: none !important;
                    border-bottom: 1.5px solid var(--accent) !important;
                }

                .auth-mark {
                    background-image: radial-gradient(rgba(250,248,243,0.16) 1px, transparent 1px);
                    background-size: 14px 14px;
                }
            `}</style>

            {/* Alert */}
            <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4">
                <CustomAlert
                    message={alertMessage}
                    isVisible={showAlert}
                    onClose={onCloseAlert}
                />
            </div>

            <div className="auth-shell fixed inset-0 z-40 flex" style={{ background: "var(--paper)" }}>

                {/* Left: identity panel — hidden on small screens */}
                <div
                    className="auth-mark hidden md:flex md:w-[42%] lg:w-[38%] flex-col justify-between p-12 relative overflow-hidden"
                    style={{ background: "var(--ink)" }}
                >
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ background: "var(--accent)" }} />
                        <span className="text-sm tracking-[0.2em] uppercase text-white/60">Second Brain</span>
                    </div>

                    <div>
                        <p className="auth-display text-[2.75rem] leading-[1.08] text-white font-medium">
                            {isSignUp
                                ? <>Start building<br />something worth<br />coming back to.</>
                                : <>Good to see<br />you again.</>}
                        </p>
                        <p className="mt-5 text-sm text-white/50 max-w-xs leading-relaxed">
                            {isSignUp
                                ? "Set up your account in under a minute — no credit card required."
                                : "Pick up right where you left off."}
                        </p>
                    </div>

                    <p className="text-xs text-white/30">© {new Date().getFullYear()}</p>
                </div>

                {/* Right: form panel */}
                <div className="auth-panel flex-1 flex items-center justify-center p-6">
                    <div className="w-full max-w-95 flex flex-col gap-8">

                        <div className="flex flex-col gap-2">
                            {/* <span className="text-xs tracking-[0.15em] uppercase font-medium" style={{ color: "var(--accent)" }}>
                                {isSignUp ? "Create account" : "Sign in"}
                            </span> */}
                            <h1 className="auth-display text-3xl font-medium" style={{ color: "var(--ink)" }}>
                                {title}
                            </h1>
                            {/* <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                                {isSignUp
                                    ? "A few details and you're in."
                                    : "Enter your details to continue."}
                            </p> */}
                        </div>

                        <div className="flex flex-col gap-5">
                            {isSignUp && <InputField label="Email" ref={emailRef} type="email" />}
                            <InputField label="Username" ref={usernameRef} />
                            <InputField
                                label="Password"
                                ref={passwordRef}
                                type={showPassword ? "text" : "password"}
                                endAdornment={
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((prev) => !prev)}
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                        className="flex items-center text-(--muted) hover:text-(--ink)"
                                    >
                                        {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                                    </button>
                                }
                            />
                        </div>

                        <div className={`flex flex-col gap-4 transition-opacity duration-200 ${loading ? "opacity-50 pointer-events-none" : ""}`}>
                            <ButtonElement
                                variant="primary"
                                full={true}
                                size="default"
                                text={loading ? "Please wait…" : (isSignUp ? "Create account" : "Sign in")}
                                onClickfn={() => {
                                    onSubmit({
                                        username: usernameRef.current?.value || "",
                                        password: passwordRef.current?.value || "",
                                        email: emailRef.current?.value || "",
                                    });
                                }}
                            />

                            <div className="flex items-center gap-3 text-xs uppercase tracking-widest" style={{ color: "var(--muted)" }}>
                                <span className="h-px flex-1" style={{ background: "var(--line)" }} />
                                or
                                <span className="h-px flex-1" style={{ background: "var(--line)" }} />
                            </div>

                            <button
                                type="button"
                                onClick={onGoogle}
                                className="flex w-full items-center justify-center gap-3 rounded-lg border py-2.5 text-sm font-medium transition-colors hover:bg-black/3"
                                style={{ borderColor: "var(--line)", color: "var(--ink)" }}
                            >
                                <GoogleIcon />
                                Continue with Google
                            </button>
                        </div>

                        <div className="pt-2 border-t text-sm" style={{ borderColor: "var(--line)", color: "var(--muted)" }}>
                            <p className="pt-4">
                                {isSignUp ? (
                                    <>Already have an account?{" "}
                                        <a href="/signin" className="font-medium hover:underline" style={{ color: "var(--ink)" }}>
                                            Log in
                                        </a>
                                    </>
                                ) : (
                                    <>Don't have an account?{" "}
                                        <a href="/signup" className="font-medium hover:underline" style={{ color: "var(--ink)" }}>
                                            Sign up
                                        </a>
                                    </>
                                )}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}