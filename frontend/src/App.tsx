
import Dashboard from "./pages/dashboard";
import { HomePage } from "./pages/homepage";
// import Login from "./pages/signin";
// import Signup from "./pages/signup";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SignInEP, SignupEP } from "./pages/login";
import BrainPage from "./pages/Brainpage";



// Main App component
export default function App() {
  return (
    // CHANGE: Removed RecoilRoot wrapper that was previously here
    // WHY? Zustand doesn't require a provider wrapper like Recoil or Redux
    // Zustand stores are self-contained and can be used directly in any component
    // This simplifies the app structure and reduces boilerplate code
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/signin" element={<SignInEP />} />
          <Route path="/signup" element={<SignupEP />} />
          <Route path="/brain/:link" element={<BrainPage />} />

          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}