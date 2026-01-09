import { useState } from "react";
import { Helmet } from "react-helmet";
import { useCustomerList, useCustomerSearch } from "../../../hooks/query";
import {
  AiOutlineSearch,
  AiOutlineUser,
  AiOutlinePhone,
  AiOutlineMail,
} from "react-icons/ai";
import { Link } from "react-router-dom";
import { FaUser } from "react-icons/fa";

interface Customer {
  id: string;
  createdAt: string;
  updatedAt: string;
  first_name: string;
  last_name: string;
  email: string | null;
  guardian_name: string | null;
  gender: "MALE" | "FEMALE" | "OTHER" | null;
  age: number | null;
  mobile: string;
  dob: string | null;
  village: string | null;
  block: string | null;
  district: string | null;
  state: string | null;
  pincode: string | null;
  ayushmanCardAvailable: "YES" | "NO" | null;
  customerConsent: boolean;
  termsAccepted: boolean;
}

const AllCustomers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const limit = 20;

  // Use search query if available, otherwise use list
  const shouldSearch = searchQuery.trim().length > 0;
  const { data: listData, isLoading: isListLoading } = useCustomerList(
    page,
    limit
  );
  const { data: searchData, isLoading: isSearchLoading } = useCustomerSearch(
    searchQuery,
    page,
    limit
  );

  const data = shouldSearch ? searchData : listData;
  const isLoading = shouldSearch ? isSearchLoading : isListLoading;

  const customers = data?.items || [];
  const totalPages = data?.pagination
    ? Math.ceil(data.pagination.total / limit)
    : 1;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getFullName = (customer: Customer) => {
    return `${customer.first_name} ${customer.last_name}`.trim();
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // Reset to first page on new search
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(1); // Reset to first page when search changes
  };

  return (
    <>
      <Helmet>
        <title>All Customers - Bonchi Cares Admin</title>
      </Helmet>
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                All Customers
              </h1>
              <p className="text-gray-600">
                Manage and view all registered customers
              </p>
            </div>
            <div>
              <Link to="/shared/create-customer" className="btn btn-success">
                <FaUser />
                Create Customer
              </Link>
            </div>
          </div>

          {/* Search Bar */}
          <div className="card bg-base-100 shadow-md mb-6">
            <div className="card-body p-4">
              <form onSubmit={handleSearch} className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search by name, email, mobile, village, or district..."
                    className="input input-bordered w-full pl-10"
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                  <AiOutlineSearch
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  Search
                </button>
                {searchQuery && (
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => {
                      setSearchQuery("");
                      setPage(1);
                    }}
                  >
                    Clear
                  </button>
                )}
              </form>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && customers.length === 0 && (
            <div className="card bg-base-100 shadow-md">
              <div className="card-body text-center py-12">
                <AiOutlineUser className="mx-auto text-gray-300" size={64} />
                <p className="text-gray-500 text-lg mt-4">
                  {searchQuery
                    ? "No customers found matching your search"
                    : "No customers registered yet"}
                </p>
              </div>
            </div>
          )}

          {/* Customer List */}
          {!isLoading && customers.length > 0 && (
            <>
              {/* Stats */}
              <div className="mb-4 text-sm text-gray-600">
                Showing {data?.pagination.skip + 1} -{" "}
                {Math.min(
                  data?.pagination.skip + data?.pagination.take,
                  data?.pagination.total
                )}{" "}
                of {data?.pagination.total} customers
              </div>

              {/* Desktop Table View */}
              <div className="hidden lg:block card bg-base-100 shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="table table-zebra">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Contact</th>
                        <th>Location</th>
                        <th>Gender</th>
                        <th>Registered</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {customers.map((customer: Customer) => (
                        <tr key={customer.id}>
                          <td>
                            <div className="font-semibold">
                              {getFullName(customer)}
                            </div>
                            {customer.guardian_name && (
                              <div className="text-xs text-gray-500">
                                Guardian: {customer.guardian_name}
                              </div>
                            )}
                          </td>
                          <td>
                            <div className="flex flex-col gap-1 text-sm">
                              <div className="flex items-center gap-1">
                                <AiOutlinePhone size={14} />
                                {customer.mobile}
                              </div>
                              {customer.email && (
                                <div className="flex items-center gap-1 text-gray-500">
                                  <AiOutlineMail size={14} />
                                  {customer.email}
                                </div>
                              )}
                            </div>
                          </td>
                          <td>
                            <div className="text-sm">
                              {customer.village && (
                                <div>{customer.village}</div>
                              )}
                              {customer.district && (
                                <div className="text-gray-500">
                                  {customer.district}
                                </div>
                              )}
                              {!customer.village && !customer.district && (
                                <span className="text-gray-400">N/A</span>
                              )}
                            </div>
                          </td>
                          <td>
                            <span className="badge badge-ghost">
                              {customer.gender || "N/A"}
                            </span>
                          </td>
                          <td>
                            <div className="text-sm">
                              {formatDate(customer.createdAt)}
                            </div>
                          </td>
                          <td>
                            <Link
                              to={`/dashboard/admin/customers/${customer.id}`}
                              className="btn btn-primary btn-sm"
                            >
                              View Profile
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile Card View */}
              <div className="lg:hidden space-y-4">
                {customers.map((customer: Customer) => (
                  <div key={customer.id} className="card bg-base-100 shadow-md">
                    <div className="card-body p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-lg">
                            {getFullName(customer)}
                          </h3>
                          {customer.guardian_name && (
                            <p className="text-xs text-gray-500">
                              Guardian: {customer.guardian_name}
                            </p>
                          )}
                        </div>
                        <span className="badge badge-ghost">
                          {customer.gender || "N/A"}
                        </span>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <AiOutlinePhone className="text-gray-400" />
                          <span>{customer.mobile}</span>
                        </div>
                        {customer.email && (
                          <div className="flex items-center gap-2">
                            <AiOutlineMail className="text-gray-400" />
                            <span className="text-gray-600">
                              {customer.email}
                            </span>
                          </div>
                        )}
                        {(customer.village || customer.district) && (
                          <div className="text-gray-600">
                            {customer.village && (
                              <span>{customer.village}, </span>
                            )}
                            {customer.district}
                          </div>
                        )}
                      </div>

                      <div className="flex justify-between items-center mt-4 pt-3 border-t">
                        <span className="text-xs text-gray-500">
                          Joined {formatDate(customer.createdAt)}
                        </span>
                        <Link
                          to={`/dashboard/admin/customers/${customer.id}`}
                          className="btn btn-primary btn-sm"
                        >
                          View Profile
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-6">
                  <div className="join">
                    <button
                      className="join-item btn"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      «
                    </button>
                    <button className="join-item btn">
                      Page {page} of {totalPages}
                    </button>
                    <button
                      className="join-item btn"
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={page === totalPages}
                    >
                      »
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default AllCustomers;
