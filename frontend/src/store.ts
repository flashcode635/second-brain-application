// Zustand State Management for Dashboard Refresh

import { create } from 'zustand';

// Interface defining the shape of our dashboard store
interface DashboardStore {
  refreshKey: number;           // A counter that increments to trigger re-fetches
  triggerRefresh: () => void;
   
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
  
  isSetting: false, // Initial value for settings page visibility
  toggleSettings: () => set((state) => ({ isSetting: !state.isSetting })),
}));