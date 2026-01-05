import { Link } from "react-router-dom";
import { useSupportList } from "../../../hooks/query";
import { useUser } from "../../../hooks/query";
import { AiOutlineCalendar, AiOutlineEye } from "react-icons/ai";

interface SupportForm {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  patient_name: string;
  age: number;
  gender: "MALE" | "FEMALE" | "OTHER";
  relationship: string;
  hospital_name: string | null;
  doctor_name: string | null;
  expected_surgery_date: string | null;
  type_of_surgery: string | null;
  estimated_cost: number | null;
  monthly_income: number | null;
  number_of_dependents: number | null;
  has_insurance: boolean;
  required_support_percetage: number | null;
  additional_details: string | null;
  is_terms_accepted: boolean;
}

const SupportList = () => {
  const { data: userData } = useUser();
  const { data: supportList, isLoading } = useSupportList(
    userData?.id || "",
    !!userData?.id
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number | null) => {
    if (!amount) return "N/A";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Operation Support Requests
        </h1>
        <Link
          to="/dashboard/support/new"
          className="btn btn-primary btn-sm sm:btn-md"
        >
          + Request Support
        </Link>
      </header>

      <main>
        {!supportList || supportList.length === 0 ? (
          <div className="card bg-base-100 shadow-md">
            <div className="card-body text-center py-12">
              <p className="text-gray-500 text-lg mb-4">
                No support requests found
              </p>
              <p className="text-gray-400 text-sm mb-6">
                You haven't submitted any operation support requests yet.
              </p>
              <Link
                to="/dashboard/support/new"
                className="btn btn-primary mx-auto"
              >
                Create Your First Request
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {supportList.map((support: SupportForm) => (
              <div
                key={support.id}
                className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="card-body">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        {support.patient_name}
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Age:</span>{" "}
                          {support.age} years
                        </div>
                        <div>
                          <span className="font-medium">Gender:</span>{" "}
                          {support.gender}
                        </div>
                        <div>
                          <span className="font-medium">Relationship:</span>{" "}
                          {support.relationship}
                        </div>
                        <div>
                          <span className="font-medium">Hospital:</span>{" "}
                          {support.hospital_name || "N/A"}
                        </div>
                        {support.type_of_surgery && (
                          <div className="sm:col-span-2">
                            <span className="font-medium">Operation:</span>{" "}
                            {support.type_of_surgery}
                          </div>
                        )}
                        {support.expected_surgery_date && (
                          <div className="flex items-center gap-1">
                            <AiOutlineCalendar className="text-blue-500" />
                            <span className="font-medium">
                              Expected Date:
                            </span>{" "}
                            {formatDate(support.expected_surgery_date)}
                          </div>
                        )}
                        <div>
                          <span className="font-medium">Estimated Cost:</span>{" "}
                          {formatCurrency(support.estimated_cost)}
                        </div>
                        <div>
                          <span className="font-medium">Support Required:</span>{" "}
                          {support.required_support_percetage}%
                        </div>
                        <div>
                          <span className="font-medium">Insurance:</span>{" "}
                          {support.has_insurance ? "Yes" : "No"}
                        </div>
                      </div>

                      <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                        <span>Submitted: {formatDate(support.created_at)}</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Link
                        to={`/dashboard/support/${support.id}`}
                        className="btn btn-primary btn-sm gap-2"
                      >
                        <AiOutlineEye size={16} />
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default SupportList;
