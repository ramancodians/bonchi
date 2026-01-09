import { Route, Routes } from "react-router-dom";
import Layout from "../../../components/layout";
import CreateCustomer from "./createCustomer";
import CreatePartner from "./partners/create-partner";

const SharedPages = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/create-customer" element={<CreateCustomer />} />
        <Route path="/create-partner" element={<CreatePartner />} />
      </Routes>
    </Layout>
  );
};

export default SharedPages;
