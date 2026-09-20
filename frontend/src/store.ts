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

// Interface defining the shape of our dashboard store
interface DashboardStore {
  refreshKey: number;           // A counter that increments to trigger re-fetches
  triggerRefresh: () => void;
  sidebarWidth: number;
  setSidebarWidth: (width: number) => void;
   
  isSetting: boolean;            // Flag to indicate if settings page is visible
  toggleSettings: () => void;    // Function to toggle settings page visibility
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
  
  isSetting: false, // Initial value for settings page visibility
  toggleSettings: () => set((state) => ({ isSetting: !state.isSetting })),
}));

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));