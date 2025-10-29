// Zustand State Management for Dashboard Refresh
// WHY ZUSTAND? 
// - Zustand is a lightweight state management library that works seamlessly with React 19
// - Unlike Recoil (which has compatibility issues with React 19), Zustand is fully supported
// - No provider wrapper needed (unlike Redux or Recoil's RecoilRoot)
// - Simple API: just import and use the hook directly in any component
// - Minimal boilerplate compared to Redux or Context API

import { create } from 'zustand';

// Interface defining the shape of our dashboard store
interface DashboardStore {
  refreshKey: number;           // A counter that increments to trigger re-fetches
  triggerRefresh: () => void;   // Function to increment the refreshKey
}

// Create the Zustand store
// HOW IT WORKS:
// 1. When content is added, triggerRefresh() is called
// 2. This increments refreshKey (0 -> 1 -> 2, etc.)
// 3. Dashboard component watches refreshKey via useEffect dependency
// 4. When refreshKey changes, useEffect runs and fetches fresh data from backend
export const useDashboardStore = create<DashboardStore>((set) => ({
  refreshKey: 0,  // Initial value - starts at 0
  // triggerRefresh uses Zustand's 'set' to update state immutably
  triggerRefresh: () => set((state) => ({ refreshKey: state.refreshKey + 1 })),
}));