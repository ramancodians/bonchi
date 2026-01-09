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
import Layout from "./components/layout";

// Agent Pages
import AgentDashboard from "./pages/agent/Dashboard";
import CreateUser from "./pages/agent/CreateUser";
import AgentUsers from "./pages/agent/Users";
import AgentWallet from "./pages/agent/Wallet";

// District Manager Pages
import DMDashboard from "./pages/district-manager/Dashboard";
import DMAgents from "./pages/district-manager/Agents";
import DMCreateAgent from "./pages/district-manager/CreateAgent";
import MedicalStoreDashboard from "./pages/medical-store/Dashboard";
import HealthAssistantDashboard from "./pages/health-assistant/Dashboard";
import HospitalDashboard from "./pages/hospital/Dashboard";

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
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="/shared/*" element={<SharedPages />} />
        <Route path="/admin/*" element={<SuperAdminDashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register-partner" element={<PartnerRegistration />} />

        {/* Agent Routes - Protected by Logic in Components or Wrapper? 
            Currently bonchi structure seems to use /dashboard/* for authenticated user.
            But App.tsx defines top level routes.
            I will add /agent/* routes here. 
            Ideally wrapped in Layout and Auth check.
            For now, direct routes.
         */}
        {/* Agent Routes - Wrapped in Layout */}
        <Route path="/agent/*" element={
          <Layout>
            <Routes>
              <Route path="dashboard" element={<AgentDashboard />} />
              <Route path="create-user" element={<CreateUser />} />
              <Route path="users" element={<AgentUsers />} />
              <Route path="wallet" element={<AgentWallet />} />
            </Routes>
          </Layout>
        } />

        {/* District Manager Routes - Wrapped in Layout */}
        <Route path="/district-manager/*" element={
          <Layout>
            <Routes>
              <Route path="dashboard" element={<DMDashboard />} />
              <Route path="agents" element={<DMAgents />} />
              <Route path="create-agent" element={<DMCreateAgent />} />
            </Routes>
          </Layout>
        } />

        {/* Medical Store Routes */}
        <Route path="/medical-store/*" element={
          <Layout>
            <Routes>
              <Route path="dashboard" element={<MedicalStoreDashboard />} />
            </Routes>
          </Layout>
        } />

        {/* Health Assistant Routes */}
        <Route path="/health-assistant/*" element={
          <Layout>
            <Routes>
              <Route path="dashboard" element={<HealthAssistantDashboard />} />
            </Routes>
          </Layout>
        } />

        {/* Hospital Routes */}
        <Route path="/hospital/*" element={
          <Layout>
            <Routes>
              <Route path="dashboard" element={<HospitalDashboard />} />
            </Routes>
          </Layout>
        } />

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
