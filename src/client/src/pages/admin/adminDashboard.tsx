import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getAdminStatsAPI } from "../../hooks/api";

const AdminDashboard = () => {
  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: getAdminStatsAPI,
  });

  console.log({ stats });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="font-semibold text-gray-500 mb-2">Total Customers</h2>
          <p className="text-3xl font-bold text-blue-600">
            {stats?.totalCustomers || 0}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="font-semibold text-gray-500 mb-2">Total Partners</h2>
          <p className="text-3xl font-bold text-green-600">
            {stats?.totalPartners || 0}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="font-semibold text-gray-500 mb-2">Support Requests</h2>
          <p className="text-3xl font-bold text-orange-600">
            {stats?.totalSupportRequests || 0}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
