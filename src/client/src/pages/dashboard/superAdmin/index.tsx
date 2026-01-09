import { Route, Routes } from "react-router-dom";
import Layout from "../../../components/layout";
import AllCustomers from "./allCustomers";
import AllPartners from "../shared/partners/all-partners";

const SuperAdminDashboard = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/all-customers" element={<AllCustomers />} />
        <Route path="/all-partners" element={<AllPartners />} />
      </Routes>
    </Layout>
  );
};

export default SuperAdminDashboard;
