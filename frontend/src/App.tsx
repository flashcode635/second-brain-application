import Dashboard from "./pages/dashboard";
import { HomePage } from "./pages/homepage";
// import Login from "./pages/signin";
// import Signup from "./pages/signup";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SignInEP, SignupEP } from "./pages/login";
import BrainPage from "./pages/Brainpage";
import { ProtectedRoute } from "./components/protectroutes";
import { authClient } from "./authClient";
import {NotFoundPage} from "@/pages/error";



// Main App component
export default function App() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) return null;
  const isLoggedIn = Boolean(session?.user);
  return (
    
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route element={<ProtectedRoute isAllowed={isLoggedIn} />}>
            <Route path="/dashboard" element={<Dashboard />} >

            </Route>
          </Route>
           {/* Reverse guard: logged-in users shouldn't see signup */}
          <Route element={<ProtectedRoute isAllowed={!isLoggedIn} redirectPath="/dashboard" />}>
          
            <Route path="/signin" element={<SignInEP />} />
            <Route path="/signup" element={<SignupEP />} />
          </Route>

          <Route path="/brain/:link" element={<BrainPage />} />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}