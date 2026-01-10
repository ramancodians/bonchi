import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCustomerProfile } from "../../../../hooks/query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

type QueryParams = {
  customerId: string;
};

interface Customer {
  id: string;
  createdAt: string;
  updatedAt: string;
  gender: string | null;
  age: number | null;
  mobile: string;
  village: string | null;
  block: string | null;
  district: string | null;
  state: string | null;
  pincode: string | null;
  ayushmanCardAvailable: boolean | null;
  customerConsent: boolean;
  termsAccepted: boolean;
  dob: string | null;
  email: string;
  first_name: string;
  guardian_name: string | null;
  last_name: string;
  role: string;
  is_self_registered: boolean;
}

const CustomerProfile = () => {
  const { customerId } = useParams<QueryParams>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: customer, isLoading, error } = useCustomerProfile(customerId);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Customer>>({});

  // Initialize form data when customer data loads
  useState(() => {
    if (customer) {
      setFormData(customer);
    }
  });

  const updateCustomerMutation = useMutation({
    mutationFn: async (data: Partial<Customer>) => {
      const response = await axios.put(
        `/api/admin/customers/${customerId}`,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["customerProfile", customerId],
      });
      setIsEditing(false);
    },
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "number") {
      setFormData((prev) => ({
        ...prev,
        [name]: value ? parseInt(value) : null,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value || null }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateCustomerMutation.mutate(formData);
  };

  const handleCancel = () => {
    setFormData(customer || {});
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <span>Error loading customer profile</span>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="alert alert-warning">
        <span>Customer not found</span>
      </div>
    );
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="btn btn-ghost btn-sm mb-2"
          >
            ← Back
          </button>
          <h1 className="text-3xl font-bold">Customer Profile</h1>
        </div>
        <div className="flex gap-2">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="btn btn-primary"
            >
              Edit Profile
            </button>
          ) : (
            <>
              <button
                onClick={handleCancel}
                className="btn btn-ghost"
                disabled={updateCustomerMutation.isPending}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="btn btn-success"
                disabled={updateCustomerMutation.isPending}
              >
                {updateCustomerMutation.isPending ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  "Save Changes"
                )}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Status Messages */}
      {updateCustomerMutation.isError && (
        <div className="alert alert-error mb-4">
          <span>Failed to update customer profile</span>
        </div>
      )}

      {updateCustomerMutation.isSuccess && (
        <div className="alert alert-success mb-4">
          <span>Customer profile updated successfully!</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Personal Information */}
        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">First Name</span>
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name || ""}
                    onChange={handleInputChange}
                    className="input input-bordered"
                  />
                ) : (
                  <p className="py-2">{customer.first_name}</p>
                )}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Last Name</span>
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name || ""}
                    onChange={handleInputChange}
                    className="input input-bordered"
                  />
                ) : (
                  <p className="py-2">{customer.last_name}</p>
                )}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">
                    Guardian Name
                  </span>
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="guardian_name"
                    value={formData.guardian_name || ""}
                    onChange={handleInputChange}
                    className="input input-bordered"
                  />
                ) : (
                  <p className="py-2">{customer.guardian_name || "N/A"}</p>
                )}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">
                    Date of Birth
                  </span>
                </label>
                {isEditing ? (
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob ? formData.dob.split("T")[0] : ""}
                    onChange={handleInputChange}
                    className="input input-bordered"
                  />
                ) : (
                  <p className="py-2">
                    {customer.dob
                      ? new Date(customer.dob).toLocaleDateString()
                      : "N/A"}
                  </p>
                )}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Age</span>
                </label>
                {isEditing ? (
                  <input
                    type="number"
                    name="age"
                    value={formData.age || ""}
                    onChange={handleInputChange}
                    className="input input-bordered"
                  />
                ) : (
                  <p className="py-2">{customer.age || "N/A"}</p>
                )}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Gender</span>
                </label>
                {isEditing ? (
                  <select
                    name="gender"
                    value={formData.gender || ""}
                    onChange={handleInputChange}
                    className="select select-bordered"
                  >
                    <option value="">Select Gender</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                ) : (
                  <p className="py-2">{customer.gender || "N/A"}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-4">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Email</span>
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email || ""}
                    onChange={handleInputChange}
                    className="input input-bordered"
                  />
                ) : (
                  <p className="py-2">{customer.email}</p>
                )}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Mobile</span>
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile || ""}
                    onChange={handleInputChange}
                    className="input input-bordered"
                  />
                ) : (
                  <p className="py-2">{customer.mobile}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-4">Address Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Village</span>
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="village"
                    value={formData.village || ""}
                    onChange={handleInputChange}
                    className="input input-bordered"
                  />
                ) : (
                  <p className="py-2">{customer.village || "N/A"}</p>
                )}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Block</span>
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="block"
                    value={formData.block || ""}
                    onChange={handleInputChange}
                    className="input input-bordered"
                  />
                ) : (
                  <p className="py-2">{customer.block || "N/A"}</p>
                )}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">District</span>
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="district"
                    value={formData.district || ""}
                    onChange={handleInputChange}
                    className="input input-bordered"
                  />
                ) : (
                  <p className="py-2">{customer.district || "N/A"}</p>
                )}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">State</span>
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="state"
                    value={formData.state || ""}
                    onChange={handleInputChange}
                    className="input input-bordered"
                  />
                ) : (
                  <p className="py-2">{customer.state || "N/A"}</p>
                )}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Pincode</span>
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode || ""}
                    onChange={handleInputChange}
                    className="input input-bordered"
                  />
                ) : (
                  <p className="py-2">{customer.pincode || "N/A"}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Account Information */}
        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-4">Account Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Role</span>
                </label>
                <p className="py-2">
                  <span className="badge badge-primary">{customer.role}</span>
                </p>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">
                    Self Registered
                  </span>
                </label>
                <p className="py-2">
                  <span
                    className={`badge ${
                      customer.is_self_registered
                        ? "badge-success"
                        : "badge-ghost"
                    }`}
                  >
                    {customer.is_self_registered ? "Yes" : "No"}
                  </span>
                </p>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Customer ID</span>
                </label>
                <p className="py-2 text-sm font-mono">{customer.id}</p>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">
                    Ayushman Card Available
                  </span>
                </label>
                {isEditing ? (
                  <select
                    name="ayushmanCardAvailable"
                    value={
                      formData.ayushmanCardAvailable === null
                        ? ""
                        : String(formData.ayushmanCardAvailable)
                    }
                    onChange={handleInputChange}
                    className="select select-bordered"
                  >
                    <option value="">Not Specified</option>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                ) : (
                  <p className="py-2">
                    {customer.ayushmanCardAvailable === null ? (
                      "N/A"
                    ) : (
                      <span
                        className={`badge ${
                          customer.ayushmanCardAvailable
                            ? "badge-success"
                            : "badge-error"
                        }`}
                      >
                        {customer.ayushmanCardAvailable ? "Yes" : "No"}
                      </span>
                    )}
                  </p>
                )}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">
                    Customer Consent
                  </span>
                </label>
                {isEditing ? (
                  <input
                    type="checkbox"
                    name="customerConsent"
                    checked={formData.customerConsent || false}
                    onChange={handleInputChange}
                    className="checkbox checkbox-primary"
                  />
                ) : (
                  <p className="py-2">
                    <span
                      className={`badge ${
                        customer.customerConsent
                          ? "badge-success"
                          : "badge-error"
                      }`}
                    >
                      {customer.customerConsent ? "Given" : "Not Given"}
                    </span>
                  </p>
                )}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">
                    Terms Accepted
                  </span>
                </label>
                {isEditing ? (
                  <input
                    type="checkbox"
                    name="termsAccepted"
                    checked={formData.termsAccepted || false}
                    onChange={handleInputChange}
                    className="checkbox checkbox-primary"
                  />
                ) : (
                  <p className="py-2">
                    <span
                      className={`badge ${
                        customer.termsAccepted ? "badge-success" : "badge-error"
                      }`}
                    >
                      {customer.termsAccepted ? "Accepted" : "Not Accepted"}
                    </span>
                  </p>
                )}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Created At</span>
                </label>
                <p className="py-2 text-sm">{formatDate(customer.createdAt)}</p>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Last Updated</span>
                </label>
                <p className="py-2 text-sm">{formatDate(customer.updatedAt)}</p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CustomerProfile;
