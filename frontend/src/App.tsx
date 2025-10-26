
import Dashboard from "./pages/dashboard";
import { HomePage } from "./pages/homepage";
// import Login from "./pages/signin";
// import Signup from "./pages/signup";
import { BrowserRouter, Routes, Route,useNavigate } from "react-router-dom";
import { SignInEP, SignupEP } from "./pages/login";

// Navigation component to handle button and navigation
export const NavigationButton = () => {
  const navigate = useNavigate();

  return (
    <button 
      className="bg-green-700 text-amber-50 px-4 py-2 rounded" 
      onClick={() => {
   
        navigate("/signup");
      }}
    >
      sign Up
    </button>
  );
};

// Main App component
export default function App() {
  return (
    <BrowserRouter>
  
      <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/signup" element={<SignupEP />} />
        <Route path="/signin" element={<SignInEP />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}