import { Route, Routes } from "react-router-dom";
import Layout from "../../components/layout";
import CustomerDashboard from "./customer/customerDashboard";
import Appointments from "./customer/appointments";
import OperationSupportForm from "./customer/supportform";
import SurgerySupportForm from "./customer/SurgerySupportForm";
import MorePage from "./customer/more";
import SupportList from "./customer/supportList";
import HealthCard from "../customer/HealthCard";
import Profile from "./customer/profile";
import FamilyPlan from "./customer/FamilyPlan";

const Dashboard = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/health-card" element={<HealthCard />} />
        <Route path="/support" element={<SupportList />} />
        <Route path="/support/new" element={<OperationSupportForm />} />
        <Route path="/support/:id" element={<OperationSupportForm />} />
        <Route path="/surgery-support" element={<SurgerySupportForm />} />
        <Route path="/more" element={<MorePage />} />
        <Route path="/profile" element={<Profile />} />
        {/* Placeholders for others */}
        <Route path="/family-plan" element={<FamilyPlan />} />
        <Route path="/notifications" element={<div className="p-6">No Notifications</div>} />
        <Route path="/" element={<CustomerDashboard />} />
      </Routes>
    </Layout>
  );
};

export default Dashboard;
