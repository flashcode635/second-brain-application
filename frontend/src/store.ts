// Zustand State Management for Dashboard Refresh

import { create } from 'zustand';

export interface AuthUser {
  id: string;
  username: string;
}

interface AuthStore {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
  clearUser: () => void;
}

export type ThemeMode = "light" | "dark";

function applyThemeToDocument(theme: ThemeMode) {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-theme", theme);
}

function getInitialTheme(): ThemeMode {
  if (typeof window === "undefined") return "light";
  const stored = window.localStorage.getItem("theme");
  return stored === "dark" ? "dark" : "light";
}

// Interface defining the shape of our dashboard store
interface DashboardStore {
  refreshKey: number;           // A counter that increments to trigger re-fetches
  triggerRefresh: () => void;
  sidebarWidth: number;
  setSidebarWidth: (width: number) => void;
  isSidebarResizing: boolean;
  setIsSidebarResizing: (resizing: boolean) => void;

  isSetting: boolean;            // Flag to indicate if settings page is visible
  toggleSettings: () => void;    // Function to toggle settings page visibility

  // Sidebar "space" category currently selected on the dashboard ("All" = no filter)
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;

  // Light / dark theme, persisted to localStorage
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
}

// the Zustand store
// HOW IT WORKS:
// 1. When content is added, triggerRefresh() is called
// 2. This increments refreshKey (0 -> 1 -> 2, etc.)
// 3. Dashboard component watches refreshKey via useEffect dependency
// 4. When refreshKey changes, useEffect runs and fetches fresh data from backend
export const useDashboardStore = create<DashboardStore>((set) => ({
  refreshKey: 0,  // Initial value - starts at 0
  // triggerRefresh uses Zustand's 'set' to update state immutably
  triggerRefresh: () => set((state) => ({ refreshKey: state.refreshKey + 1 })),
  sidebarWidth: 280,
  setSidebarWidth: (width) => set({ sidebarWidth: width }),
  isSidebarResizing: false,
  setIsSidebarResizing: (resizing) => set({ isSidebarResizing: resizing }),

  isSetting: false, // Initial value for settings page visibility
  toggleSettings: () => set((state) => ({ isSetting: !state.isSetting })),

  selectedCategory: "All",
  setSelectedCategory: (category) => set({ selectedCategory: category }),

  theme: (() => {
    const initial = getInitialTheme();
    applyThemeToDocument(initial);
    return initial;
  })(),
  setTheme: (theme) => {
    if (typeof window !== "undefined") window.localStorage.setItem("theme", theme);
    applyThemeToDocument(theme);
    set({ theme });
  },
  toggleTheme: () => set((state) => {
    const next: ThemeMode = state.theme === "dark" ? "light" : "dark";
    if (typeof window !== "undefined") window.localStorage.setItem("theme", next);
    applyThemeToDocument(next);
    return { theme: next };
  }),
}));

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));