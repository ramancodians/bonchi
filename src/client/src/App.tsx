import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";

import { ToastContainer } from "react-toastify";
import Login from "./pages/login";
import Register from "./pages/registration";
import Dashboard from "./pages/dashboard";
import { useUser } from "./hooks/query";
import { useEffect } from "react";
import PartnerRegistration from "./pages/partner-registration";
import SuperAdminDashboard from "./pages/dashboard/superAdmin";
import FourNotFour from "./pages/fourNotfour";
import SharedPages from "./pages/dashboard/shared";

function App() {
  const { data: userData } = useUser();

  useEffect(() => {
    if (userData) {
      console.log("User data fetched:", userData);
    }
  }, [userData]);

  return (
    <>
      <Routes>
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="/shared/*" element={<SharedPages />} />
        <Route path="/admin/*" element={<SuperAdminDashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register-partner" element={<PartnerRegistration />} />
        <Route path="/404" element={<FourNotFour />} />
      </Routes>
      <ToastContainer
        position="bottom-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}

export default App;
