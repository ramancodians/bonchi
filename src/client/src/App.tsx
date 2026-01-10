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
import SharedPages from "./pages/dashboard/shared"; // Added missing import
import Layout from "./components/layout";
import FourNotFour from "./pages/fourNotfour";

// Admin Pages
import AdminDashboard from "./pages/admin/adminDashboard";
import AdminSupportRequests from "./pages/admin/SupportRequests";
import AgentList from "./pages/admin/AgentList";
import CustomerList from "./pages/admin/CustomerList";
import PartnerList from "./pages/admin/PartnerList";
import CreatePartner from "./pages/admin/CreatePartner";
import SurgerySupportForm from "./pages/dashboard/customer/SurgerySupportForm";
import AdminBannerManager from "./pages/admin/BannerManager";
import CustomerSupport from "./pages/dashboard/customer/supportList";
import OperationSupportForm from "./pages/dashboard/customer/supportform";
import HospitalList from "./pages/listings/HospitalList";
import LabList from "./pages/listings/LabList";
import MedicalStoreList from "./pages/listings/MedicalStoreList";

// Agent Pages
import AgentDashboard from "./pages/agent/Dashboard";
import CreateUser from "./pages/agent/CreateUser";
import AgentUsers from "./pages/agent/Users";
import AgentWallet from "./pages/agent/Wallet";

// District Manager Pages
import DMDashboard from "./pages/district-manager/Dashboard";
import DMAgents from "./pages/district-manager/Agents";
import DMCreateAgent from "./pages/district-manager/CreateAgent";

// Other Role Pages
import MedicalStoreDashboard from "./pages/medical-store/Dashboard";
import HealthAssistantDashboard from "./pages/health-assistant/Dashboard";
import HospitalDashboard from "./pages/hospital/Dashboard";
import { Helmet } from "react-helmet";
import CustomerProfile from "./pages/dashboard/shared/customer/view-customer";

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

        {/* Public Listings */}
        <Route path="/hospitals" element={<HospitalList />} />
        <Route path="/labs" element={<LabList />} />
        <Route path="/medical-stores" element={<MedicalStoreList />} />

        {/* <Route path="/admin/*" element={<SuperAdminDashboard />} />  Removed conflicting route */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register-partner" element={<PartnerRegistration />} />

        {/* Admin Routes - Wrapped in Layout */}
        <Route
          path="/admin/*"
          element={
            <Layout>
              <Routes>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="all-agents" element={<AgentList />} />
                <Route path="support" element={<CustomerSupport />} />
                <Route
                  path="surgery-support"
                  element={<SurgerySupportForm />}
                />
                <Route
                  path="support/create"
                  element={<OperationSupportForm />}
                />
                <Route path="all-customers" element={<CustomerList />} />
                <Route
                  path="support-requests"
                  element={<AdminSupportRequests />}
                />
                <Route path="all-partners" element={<PartnerList />} />
                <Route path="partners/create" element={<CreatePartner />} />
                <Route
                  path="customer/:customerId"
                  element={<CustomerProfile />}
                />
                <Route path="banners" element={<AdminBannerManager />} />
              </Routes>
            </Layout>
          }
        />

        {/* Agent Routes - Protected by Logic in Components or Wrapper? 
            Currently bonchi structure seems to use /dashboard/* for authenticated user.
            But App.tsx defines top level routes.
            I will add /agent/* routes here. 
            Ideally wrapped in Layout and Auth check.
            For now, direct routes.
         */}
        {/* Agent Routes - Wrapped in Layout */}
        <Route
          path="/agent/*"
          element={
            <Layout>
              <Routes>
                <Route path="dashboard" element={<AgentDashboard />} />
                <Route path="create-user" element={<CreateUser />} />
                <Route path="users" element={<AgentUsers />} />
                <Route path="wallet" element={<AgentWallet />} />
              </Routes>
            </Layout>
          }
        />

        {/* District Manager Routes - Wrapped in Layout */}
        <Route
          path="/district-manager/*"
          element={
            <Layout>
              <Routes>
                <Route path="dashboard" element={<DMDashboard />} />
                <Route path="agents" element={<DMAgents />} />
                <Route path="create-agent" element={<DMCreateAgent />} />
              </Routes>
            </Layout>
          }
        />

        {/* Medical Store Routes */}
        <Route
          path="/medical-store/*"
          element={
            <Layout>
              <Routes>
                <Route path="dashboard" element={<MedicalStoreDashboard />} />
              </Routes>
            </Layout>
          }
        />

        {/* Health Assistant Routes */}
        <Route
          path="/health-assistant/*"
          element={
            <Layout>
              <Routes>
                <Route
                  path="dashboard"
                  element={<HealthAssistantDashboard />}
                />
              </Routes>
            </Layout>
          }
        />

        {/* Hospital Routes */}
        <Route
          path="/hospital/*"
          element={
            <Layout>
              <Routes>
                <Route path="dashboard" element={<HospitalDashboard />} />
              </Routes>
            </Layout>
          }
        />

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
