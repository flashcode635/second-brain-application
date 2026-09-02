
import Dashboard from "./pages/dashboard";
import { HomePage } from "./pages/homepage";
// import Login from "./pages/signin";
// import Signup from "./pages/signup";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SignInEP, SignupEP } from "./pages/login";
import BrainPage from "./pages/Brainpage";
import { ProtectedRoute } from "./components/protectroutes";




// Main App component
export default function App() {
  var isLoggedIn = false;
  if (!localStorage.getItem("token")) {
    isLoggedIn=false;
  }else{
    isLoggedIn=true;
  }
  return (
    
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route element={<ProtectedRoute isAllowed={isLoggedIn} />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
           {/* Reverse guard: logged-in users shouldn't see signup */}
          <Route element={<ProtectedRoute isAllowed={!isLoggedIn} redirectPath="/dashboard" />}>
          
            <Route path="/signin" element={<SignInEP />} />
            <Route path="/signup" element={<SignupEP />} />
          </Route>

          <Route path="/brain/:link" element={<BrainPage />} />

          <Route path="*" element={<div> 404 Not Found </div>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}