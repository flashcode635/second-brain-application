import { useEffect, useRef, useState } from "react";
import BrainIcon from "../components/svg/brainicon";
// @ts-ignore
import { Book, Bulb, folder, Grid, SearchIcon, UserIcon } from "@svg/gridIcons";

const MOBILE_BREAKPOINT = 768;
const MIN_SIDEBAR_WIDTH = 76;
const MAX_SIDEBAR_WIDTH = 320;
const DEFAULT_SIDEBAR_WIDTH = 280;
const MOBILE_EXPANDED_WIDTH = 240;

export type SidebarFieldsProps = {
    link: () => React.JSX.Element;
    text: string;
};

const SidebarFields = ({ link, text, collapsed }: SidebarFieldsProps & { collapsed: boolean }) => {
    return (
        <div
            className={`theme-sidebar-item flex items-center cursor-pointer rounded-md transition-all duration-200 p-1.5 ${
                collapsed ? "justify-center w-full" : "justify-start gap-4 w-3/4"
            }`}
            title={text}
        >
            {link()}
            {!collapsed && <span className="font-heading tracking-wider font-medium">{text}</span>}
        </div>
    );
};

export default function SidebarComponent() {
    const [collapsed, setCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [sidebarWidth, setSidebarWidth] = useState(DEFAULT_SIDEBAR_WIDTH);
    const isResizingRef = useRef(false);

    useEffect(() => {
        const syncLayout = () => {
            const mobile = window.innerWidth < MOBILE_BREAKPOINT;
            setIsMobile(mobile);

            // Mobile should always start in thin mode.
            if (mobile) {
                setCollapsed(true);
                setSidebarWidth(MIN_SIDEBAR_WIDTH);
            } else if (sidebarWidth <= MIN_SIDEBAR_WIDTH) {
                setSidebarWidth(DEFAULT_SIDEBAR_WIDTH);
            }
        };

        syncLayout();
        window.addEventListener("resize", syncLayout);

        return () => {
            window.removeEventListener("resize", syncLayout);
        };
    }, []);

    const handleResizeStart = () => {
        if (collapsed || isMobile) return;

        isResizingRef.current = true;

        const handleResizeMove = (event: MouseEvent) => {
            if (!isResizingRef.current) return;

            const nextWidth = Math.max(MIN_SIDEBAR_WIDTH, Math.min(MAX_SIDEBAR_WIDTH, event.clientX));
            setSidebarWidth(nextWidth);
        };

        const handleResizeEnd = () => {
            isResizingRef.current = false;
            window.removeEventListener("mousemove", handleResizeMove);
            window.removeEventListener("mouseup", handleResizeEnd);
        };

        window.addEventListener("mousemove", handleResizeMove);
        window.addEventListener("mouseup", handleResizeEnd);
    };

    const handleToggleCollapse = () => {
        setCollapsed((prev) => {
            const next = !prev;

            if (next) {
                if (isMobile) {
                    setSidebarWidth(MIN_SIDEBAR_WIDTH);
                }
            } else {
                if (isMobile) {
                    setSidebarWidth(MOBILE_EXPANDED_WIDTH);
                } else if (sidebarWidth <= MIN_SIDEBAR_WIDTH) {
                    setSidebarWidth(DEFAULT_SIDEBAR_WIDTH);
                }
            }

            return next;
        });
    };

    const sidebarFieldsData: SidebarFieldsProps[] = [
        { link: Grid, text: "All" },
        { link: SearchIcon, text: "Search" },
        { link: Bulb, text: "Inspirations" },
        { link: UserIcon, text: "Personal" },
        { link: folder, text: "Projects" },
        { link: Book, text: "Reading List" },
    ];

    return (
        <div
            className={`h-dvh md:h-screen flex flex-col justify-start pt-15 theme-surface gap-7 relative transition-all duration-250 ${
                collapsed ? "items-center px-2" : "items-baseline pl-2 md:pl-8"
            }`}
            style={{ width: collapsed ? MIN_SIDEBAR_WIDTH : isMobile ? MOBILE_EXPANDED_WIDTH : sidebarWidth }}
        >
            <button
                type="button"
                onClick={handleToggleCollapse}
                className="absolute top-3 right-2 text-xs px-2 py-1.5 rounded-md theme-sidebar-item"
                aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                title={collapsed ? "Expand" : "Collapse"}
            >
                {/* {collapsed ? ">" : "<"} */}

               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" 
               className="hover:stroke-text-primary stroke-gray-600"
               stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="16" height="18" rx="2"/>
                    <line x1="9" y1="3" x2="9" y2="21"/>
                </svg>
            </button>

            <div className={`flex items-center ${collapsed ? "justify-center" : "gap-4"}`}>
                <BrainIcon size="small" />
                {!collapsed && (
                    <span className="text-xl font-heading uppercase">
                        <b>Your Brain</b>
                    </span>
                )}
            </div>

            {!collapsed && (
                <p className="uppercase text-text-muted w-full text-start font-heading text-xs tracking-widest pt-2">
                    Spaces
                </p>
            )}

            <div
                className={`grid grid-cols-1 text-md tracking-wide text-text-sidebar w-full gap-3 ${
                    collapsed ? "place-items-center" : "md:pl-1"
                }`}
            >
                {sidebarFieldsData.map((field, index) => (
                    <SidebarFields key={index} link={field.link} text={field.text} collapsed={collapsed} />
                ))}
            </div>

            {!collapsed && !isMobile && (
                <div
                    role="separator"
                    aria-orientation="vertical"
                    className="absolute top-0 right-0 h-full w-1.5 cursor-col-resize"
                    onMouseDown={handleResizeStart}
                    title="Resize sidebar"
                />
            )}
        </div>
    );
}