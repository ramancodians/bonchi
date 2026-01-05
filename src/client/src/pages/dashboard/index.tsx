import { Route, Routes, useLocation } from "react-router-dom";
import Layout from "../../components/layout";
import CustomerDashboard from "./customer/customerDashboard";
import Appointments from "./customer/appointments";
import OperationSupportForm from "./customer/supportform";
import MorePage from "./customer/more";
import SupportList from "./customer/supportList";

const Dashboard = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/support" element={<SupportList />} />
        <Route path="/support/new" element={<OperationSupportForm />} />
        <Route path="/support/:id" element={<OperationSupportForm />} />
        <Route path="/more" element={<MorePage />} />
        <Route path="/" element={<CustomerDashboard />} />
      </Routes>
    </Layout>
  );
};

export default Dashboard;
