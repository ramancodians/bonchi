import { useState } from "react";
import { Helmet } from "react-helmet";
import {
  AiOutlineSearch,
  AiOutlinePhone,
  AiOutlineMail,
  AiOutlineHome,
} from "react-icons/ai";
import { Link } from "react-router-dom";
import { FaHospital } from "react-icons/fa";
import { MdVerified } from "react-icons/md";

interface HospitalPartner {
  id: string;
  created_at: string;
  updated_at: string;
  hospital_name: string;
  email: string;
  address: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  hospital_type: string | null;
  hospital_registration_number: string | null;
  year_of_establishment: number | null;
  mobile: string;
  is_otp_verified: boolean;
  medical_services_offered: string | null;
  specialties_available: string | null;
  hospital_address: string;
  license_number: string;
}

const AllPartners = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const limit = 20;

  // TODO: Replace with actual API hooks when backend is ready
  // const { data: listData, isLoading: isListLoading } = usePartnerList(page, limit);
  // const { data: searchData, isLoading: isSearchLoading } = usePartnerSearch(searchQuery, page, limit);

  // Mock data for UI demonstration
  const isLoading = false;
  const partners: HospitalPartner[] = [];
  const totalPages = 1;
  const data = {
    items: partners,
    pagination: {
      total: 0,
      skip: 0,
      take: limit,
    },
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getLocation = (partner: HospitalPartner) => {
    const parts = [partner.city, partner.state].filter(Boolean);
    return parts.length > 0 ? parts.join(", ") : "N/A";
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    // TODO: Trigger search API call
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  return (
    <>
      <Helmet>
        <title>All Hospital Partners - Bonchi Cares Admin</title>
      </Helmet>
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                Hospital Partners
              </h1>
              <p className="text-gray-600">
                Manage and view all registered hospital partners
              </p>
            </div>
            <div>
              <Link to="/shared/create-partner" className="btn btn-success">
                <FaHospital />
                Add Partner
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
                    placeholder="Search by hospital name, email, mobile, city, or license number..."
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
          {!isLoading && partners.length === 0 && (
            <div className="card bg-base-100 shadow-md">
              <div className="card-body text-center py-12">
                <FaHospital className="mx-auto text-gray-300" size={64} />
                <p className="text-gray-500 text-lg mt-4">
                  {searchQuery
                    ? "No hospital partners found matching your search"
                    : "No hospital partners registered yet"}
                </p>
              </div>
            </div>
          )}

          {/* Partner List */}
          {!isLoading && partners.length > 0 && (
            <>
              {/* Stats */}
              <div className="mb-4 text-sm text-gray-600">
                Showing {data.pagination.skip + 1} -{" "}
                {Math.min(
                  data.pagination.skip + data.pagination.take,
                  data.pagination.total
                )}{" "}
                of {data.pagination.total} partners
              </div>

              {/* Desktop Table View */}
              <div className="hidden lg:block card bg-base-100 shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="table table-zebra">
                    <thead>
                      <tr>
                        <th>Hospital Name</th>
                        <th>Contact</th>
                        <th>Location</th>
                        <th>Type</th>
                        <th>Status</th>
                        <th>Registered</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {partners.map((partner: HospitalPartner) => (
                        <tr key={partner.id}>
                          <td>
                            <div className="flex items-center gap-2">
                              <div className="font-semibold">
                                {partner.hospital_name}
                              </div>
                              {partner.is_otp_verified && (
                                <MdVerified
                                  className="text-success"
                                  size={16}
                                  title="Verified"
                                />
                              )}
                            </div>
                            {partner.license_number && (
                              <div className="text-xs text-gray-500">
                                License: {partner.license_number}
                              </div>
                            )}
                          </td>
                          <td>
                            <div className="flex flex-col gap-1 text-sm">
                              <div className="flex items-center gap-1">
                                <AiOutlinePhone size={14} />
                                {partner.mobile}
                              </div>
                              <div className="flex items-center gap-1 text-gray-500">
                                <AiOutlineMail size={14} />
                                {partner.email}
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="text-sm">
                              <div>{getLocation(partner)}</div>
                              {partner.pincode && (
                                <div className="text-gray-500">
                                  PIN: {partner.pincode}
                                </div>
                              )}
                            </div>
                          </td>
                          <td>
                            <span className="badge badge-ghost">
                              {partner.hospital_type || "N/A"}
                            </span>
                          </td>
                          <td>
                            {partner.is_otp_verified ? (
                              <span className="badge badge-success">
                                Verified
                              </span>
                            ) : (
                              <span className="badge badge-warning">
                                Pending
                              </span>
                            )}
                          </td>
                          <td>
                            <div className="text-sm">
                              {formatDate(partner.created_at)}
                            </div>
                          </td>
                          <td>
                            <Link
                              to={`/dashboard/admin/partners/${partner.id}`}
                              className="btn btn-primary btn-sm"
                            >
                              View Details
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
                {partners.map((partner: HospitalPartner) => (
                  <div key={partner.id} className="card bg-base-100 shadow-md">
                    <div className="card-body p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-lg">
                              {partner.hospital_name}
                            </h3>
                            {partner.is_otp_verified && (
                              <MdVerified
                                className="text-success"
                                size={18}
                                title="Verified"
                              />
                            )}
                          </div>
                          {partner.license_number && (
                            <p className="text-xs text-gray-500">
                              License: {partner.license_number}
                            </p>
                          )}
                        </div>
                        {partner.is_otp_verified ? (
                          <span className="badge badge-success badge-sm">
                            Verified
                          </span>
                        ) : (
                          <span className="badge badge-warning badge-sm">
                            Pending
                          </span>
                        )}
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <AiOutlinePhone className="text-gray-400" />
                          <span>{partner.mobile}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <AiOutlineMail className="text-gray-400" />
                          <span className="text-gray-600">{partner.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <AiOutlineHome className="text-gray-400" />
                          <span className="text-gray-600">
                            {getLocation(partner)}
                          </span>
                        </div>
                        {partner.hospital_type && (
                          <div className="mt-2">
                            <span className="badge badge-ghost badge-sm">
                              {partner.hospital_type}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex justify-between items-center mt-4 pt-3 border-t">
                        <span className="text-xs text-gray-500">
                          Joined {formatDate(partner.created_at)}
                        </span>
                        <Link
                          to={`/dashboard/admin/partners/${partner.id}`}
                          className="btn btn-primary btn-sm"
                        >
                          View Details
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

export default AllPartners;
