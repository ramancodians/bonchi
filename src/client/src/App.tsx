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

function App() {
  const navigate = useNavigate();
  const { data: userData } = useUser();

  useEffect(() => {
    if (userData) {
      console.log("User data fetched:", userData.data);
    }
  }, [userData]);

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
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
