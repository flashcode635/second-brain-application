import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDashboardStore, type ThemeMode } from "../store";
import { CancelIcon } from "@/components/svg/cancelicon";
import { authClient } from "../authClient";

type SettingsTab = "general" | "theme" | "notifications" | "account";

type TabDefinition = {
    id: SettingsTab;
    label: string;
    description: string;
};

const tabs: TabDefinition[] = [
    { id: "general", label: "General", description: "Your workspace preferences" },
    { id: "theme", label: "Theme", description: "Make the space feel like yours" },
    { id: "notifications", label: "Notifications", description: "Choose what reaches you" },
    { id: "account", label: "Account", description: "Profile and security" },
];

function SettingsIcon({ tab }: { tab: SettingsTab }) {
    const paths: Record<SettingsTab, string> = {
        general: "M4 6h16M4 12h16M4 18h16",
        theme: "M12 3a9 9 0 1 0 9 9M12 3v9h9",
        notifications: "M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4",
        account: "M20 21a8 8 0 0 0-16 0M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8",
    };

    return (
        <svg aria-hidden="true" className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d={paths[tab]} />
        </svg>
    );
}

function Toggle({ checked = false, onClick }: { checked?: boolean; onClick?: () => void }) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={checked}
            className={`flex h-6 w-11 items-center rounded-full p-1 transition-colors ${checked ? "bg-black" : "bg-border-strong"}`}
        >
            <span className={`h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${checked ? "translate-x-5" : "translate-x-0"}`} />
        </button>
    );
}

function OptionRow({ label, description, children }: { label: string; description: string; children: React.ReactNode }) {
    return (
        <div className="flex items-center justify-between gap-6 border-b border-border py-5 last:border-b-0">
            <div>
                <p className="font-medium text-text-primary">{label}</p>
                <p className="mt-1 text-sm text-text-secondary">{description}</p>
            </div>
            {children}
        </div>
    );
}

function ThemeSettings() {
    const theme = useDashboardStore((state) => state.theme);
    const setTheme = useDashboardStore((state) => state.setTheme);

    return (
        <SettingsSection title="Theme" description="Shape the way your second brain looks and feels.">
            <OptionRow label="Interface theme" description="Switch between a light or dark workspace.">
                <select
                    className="theme-input rounded-md px-3 py-2 text-sm"
                    value={theme}
                    onChange={(event) => setTheme(event.target.value as ThemeMode)}
                    aria-label="Interface theme"
                >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                </select>
            </OptionRow>
            <OptionRow label="Dark mode" description="Quickly toggle dark mode on or off.">
                <Toggle checked={theme === "dark"} onClick={() => setTheme(theme === "dark" ? "light" : "dark")} />
            </OptionRow>
        </SettingsSection>
    );
}

function AccountSettings() {
    const { data: session } = authClient.useSession();
    const user = session?.user;
    const navigate = useNavigate();

    const [username, setUsername] = useState(user?.username ?? "");
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [signingOut, setSigningOut] = useState(false);

    useEffect(() => {
        setUsername(user?.username ?? "");
    }, [user?.username]);

    async function saveUsername() {
        const trimmed = username.trim();
        if (!trimmed || trimmed === user?.username) {
            setEditing(false);
            setUsername(user?.username ?? "");
            return;
        }
        setSaving(true);
        setError("");
        const { error: updateError } = await authClient.updateUser({ username: trimmed });
        setSaving(false);
        if (updateError) {
            setError(updateError.message || "Failed to update username");
            return;
        }
        setEditing(false);
    }

    async function signOut() {
        setSigningOut(true);
        try {
            await authClient.signOut();
        } finally {
            navigate("/signin", { replace: true });
        }
    }

    return (
        <SettingsSection title="Account" description="Manage the details that keep your workspace yours.">
            <div className="border-b border-border py-5">
                <span className="text-sm font-medium">Display name</span>
                <div className="mt-2 flex items-center gap-2">
                    <input
                        className="theme-input block w-full min-w-0 rounded-md px-3 py-2 disabled:opacity-60"
                        value={username}
                        disabled={!editing}
                        onChange={(event) => setUsername(event.target.value)}
                        placeholder="Your username"
                    />
                    {editing ? (
                        <>
                            <button
                                type="button"
                                onClick={saveUsername}
                                disabled={saving}
                                className="theme-button-primary shrink-0 rounded-md px-3 py-2 text-sm disabled:opacity-60"
                            >
                                {saving ? "Saving…" : "Save"}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setEditing(false);
                                    setUsername(user?.username ?? "");
                                    setError("");
                                }}
                                className="shrink-0 rounded-md border border-border px-3 py-2 text-sm"
                            >
                                Cancel
                            </button>
                        </>
                    ) : (
                        <button
                            type="button"
                            onClick={() => setEditing(true)}
                            className="shrink-0 rounded-md border border-border px-3 py-2 text-sm"
                        >
                            Change
                        </button>
                    )}
                </div>
                {error && <p className="mt-2 text-xs theme-alert-error">{error}</p>}
            </div>
            <OptionRow label="Sign-in security" description="Your account is protected with secure authentication.">
                <button type="button" className="text-sm font-medium underline underline-offset-4">Review</button>
            </OptionRow>
            <OptionRow label="Sign out" description="End your session on this device.">
                <button
                    type="button"
                    onClick={signOut}
                    disabled={signingOut}
                    className="theme-alert-error rounded-md border border-border px-3 py-2 text-sm font-medium hover:bg-red-50 disabled:opacity-60"
                >
                    {signingOut ? "Signing out…" : "Sign out"}
                </button>
            </OptionRow>
        </SettingsSection>
    );
}

export function SettingsSwitcher({ value }: { value: SettingsTab }) {
    switch (value) {
        case "theme":
            return <ThemeSettings />;
        case "notifications":
            return (
                <SettingsSection title="Notifications"  description="Decide which updates deserve your attention.">
                    <OptionRow label="New content reminders" description="Get a gentle reminder when it is time to revisit your brain."><Toggle checked /></OptionRow>
                    <OptionRow label="Weekly digest" description="Receive a summary of what you have saved this week."><Toggle /></OptionRow>
                </SettingsSection>
            );
        case "account":
            return <AccountSettings />;
        case "general":
        default:
            return (
                <SettingsSection title="General" description="Set the basics for how you organize your saved ideas.">
                    <OptionRow label="Auto-save links" description="Save new links as soon as they are added."><Toggle checked /></OptionRow>
                    <OptionRow label="Default space" description="Choose where new content should appear."><button type="button" className="rounded-md border border-border px-3 py-2 text-sm">Personal</button></OptionRow>
                </SettingsSection>
            );
    }
}

function SettingsSection({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
    return (
        <div className="max-w-2xl">
            {/* <p className="font-mono text-xs uppercase tracking-[0.18em] text-text-muted">{eyebrow}</p> */}
            <h2 className="mt-2 font-heading text-3xl text-text-primary">{title}</h2>
            <p className="mt-2 max-w-lg text-text-secondary">{description}</p>
            <div className="mt-8">{children}</div>
        </div>
    );
}

export function SettingsPage() {
    const [activeTab, setActiveTab] = useState<SettingsTab>("general");
    const closeSettings = useDashboardStore((state) => state.toggleSettings);
    // const activeTabDetails = tabs.find((tab) => tab.id === activeTab) ?? tabs[0];

    return (
        <section className="fixed inset-0 z-9999 flex items-center justify-center bg-black/40 p-3 backdrop-blur-sm sm:p-6" aria-label="Settings">
            <div className="relative flex h-[min(760px,calc(100vh-1.5rem))] w-full max-w-5xl flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-2xl sm:h-[min(760px,calc(100vh-3rem))] md:flex-row">
                <aside className="flex w-full shrink-0 flex-col border-b border-border bg-surface-muted md:w-60 md:border-b-0 md:border-r" aria-label="Settings categories">
                    <div className="flex items-center justify-between border-b border-border px-5 py-4 md:block">
                        <div>
                            {/* <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-muted">Workspace</p> */}
                            <h1 className="mt-1 font-heading text-2xl">Settings</h1>
                        </div>
                        <button type="button" onClick={closeSettings} className="rounded-md p-2 text-text-secondary hover:bg-hover hover:text-text-primary md:hidden" aria-label="Close settings">&times;</button>
                    </div>
                    <nav className="flex min-h-0 gap-2.5 overflow-x-auto p-3 md:flex-1 md:flex-col md:overflow-y-auto" aria-label="Settings navigation">
                        {tabs.map((tab) => (
                            <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={`flex min-w-max items-center gap-3 rounded-md px-3 py-2.5 text-left transition-colors md:min-w-0 ${activeTab === tab.id ? "bg-surface text-text-primary shadow-sm" : "text-text-secondary hover:bg-hover hover:text-text-primary"}`} aria-current={activeTab === tab.id ? "page" : undefined}>
                                <SettingsIcon tab={tab.id} />
                                <span className="text-base font-medium">{tab.label}</span>
                            </button>
                        ))}
                    </nav>
                    {/* <div className="hidden border-t border-border p-4 md:block"><p className="text-xs leading-5 text-text-muted">{tabs.length} areas to tune your workspace.</p></div> */}
                </aside>
                <button
                    type="button"
                    onClick={closeSettings}
                    className="absolute top-4 right-4 z-10 hidden rounded-md p-1.5 text-xl leading-none text-text-secondary hover:bg-hover hover:text-text-primary md:flex"
                    aria-label="Close settings"
                >
                    <CancelIcon/>
                </button>
                <main className="min-h-0 flex-1 overflow-y-auto bg-surface px-5 py-6 sm:px-8 sm:py-8 md:px-12 md:py-10 ">
                    <SettingsSwitcher value={activeTab} />
                </main>
            </div>
        </section>
    );
}
