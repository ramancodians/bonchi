import { Link, useLocation } from "react-router-dom";
import cookies from "js-cookie";
import {
  AiOutlineHome,
  AiOutlineCalendar,
  AiOutlineFileText,
  AiOutlineMore,
  AiOutlineGlobal,
  AiOutlineLogout,
} from "react-icons/ai";
import Logo from "./../assets/logo.png";
import { useUser } from "../hooks/query";
import { getFullName } from "../utils/formattingUtils";
import { useMemo } from "react";
import { FaUsers, FaWallet, FaUserPlus, FaCreditCard, FaBoxOpen, FaHospital, FaUserMd } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";


interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
}

const SUPER_ADMIN_LINKS: NavItem[] = [
  {
    name: "Customers",
    path: "/admin/all-customers",
    icon: <FaUsers size={24} />,
  },
  {
    name: "Partners",
    path: "/admin/all-partners",
    icon: <FaUsers size={24} />,
  },
];


const AGENT_LINKS: NavItem[] = [
  {
    name: "Dashboard",
    path: "/agent/dashboard",
    icon: <MdDashboard size={24} />,
  },
  {
    name: "Create User",
    path: "/agent/create-user",
    icon: <FaUserPlus size={24} />,
  },
  {
    name: "My Users",
    path: "/agent/users",
    icon: <FaUsers size={24} />,
  },
  {
    name: "Wallet",
    path: "/agent/wallet",
    icon: <FaWallet size={24} />,
  },
];

const DM_LINKS: NavItem[] = [
  {
    name: "Dashboard",
    path: "/district-manager/dashboard",
    icon: <MdDashboard size={24} />,
  },
  {
    name: "Agents",
    path: "/district-manager/agents",
    icon: <FaUsers size={24} />,
  },
  {
    name: "Create Agent",
    path: "/district-manager/create-agent",
    icon: <FaUserPlus size={24} />,
  },
];

const MEDICAL_STORE_LINKS: NavItem[] = [
  {
    name: "Dashboard",
    path: "/medical-store/dashboard",
    icon: <MdDashboard size={24} />,
  },
  {
    name: "Orders",
    path: "/medical-store/orders", // Placeholder
    icon: <FaBoxOpen size={24} />,
  }
];

const HEALTH_ASSISTANT_LINKS: NavItem[] = [
  {
    name: "Dashboard",
    path: "/health-assistant/dashboard",
    icon: <MdDashboard size={24} />,
  },
  {
    name: "Schedule",
    path: "/health-assistant/schedule",
    icon: <AiOutlineCalendar size={24} />,
  }
];

const HOSPITAL_LINKS: NavItem[] = [
  {
    name: "Dashboard",
    path: "/hospital/dashboard",
    icon: <MdDashboard size={24} />,
  },
  {
    name: "Appointments",
    path: "/hospital/appointments",
    icon: <AiOutlineCalendar size={24} />,
  }
];

const CUSTOMER_LINKS: NavItem[] = [
  {
    name: "Home",
    path: "/dashboard",
    icon: <AiOutlineHome size={24} />,
  },
  {
    name: "Appointments",
    path: "/dashboard/appointments",
    icon: <AiOutlineCalendar size={24} />,
  },
  {
    name: "Health Card",
    path: "/dashboard/health-card",
    icon: <FaCreditCard size={24} />,
  },
  {
    name: "Support",
    path: "/dashboard/support",
    icon: <AiOutlineFileText size={24} />,
  },
  {
    name: "More",
    path: "/dashboard/more",
    icon: <AiOutlineMore size={24} />,
  },
];

const SidePanel = () => {
  const location = useLocation();
  const { data: userData } = useUser();

  const navItems = useMemo(() => {
    if (userData && userData?.role === "SUPER_ADMIN") {
      return SUPER_ADMIN_LINKS;
    }
    if (userData && userData?.role === "BONCHI_MITRA") {
      return AGENT_LINKS;
    }
    if (userData && userData?.role === "DISTRICT_CORDINATOR") { // Check schema for exact enum
      return DM_LINKS;
    }
    if (userData && userData?.role === "MEDICAL_STORE") {
      return MEDICAL_STORE_LINKS;
    }
    if (userData && userData?.role === "HEALTH_ASSISTANT") {
      return HEALTH_ASSISTANT_LINKS;
    }
    if (userData && userData?.role === "HOSPITAL_PARTNER") {
      return HOSPITAL_LINKS;
    }
    return CUSTOMER_LINKS;
  }, [userData]);

  const handleLogout = () => {
    // Add logout logic here
    console.log("Logout clicked");
    cookies.remove("AUTH_TOKEN");
    window.location.href = "/login";
  };

  return (
    <div className="flex flex-col h-screen w-64 bg-white border-r border-gray-200 overflow-y-auto">
      {/* Logo Section */}
      <div className="flex items-center justify-center p-6 border-b border-gray-200">
        <img src={Logo} alt="Bonchi Cares Logo" className="w-12 h-12" />
        <span className="ml-2 text-xl font-semibold text-blue-600">
          Bonchi <span className="text-blue-400">Cares</span>
        </span>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${location.pathname === item.path
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-gray-100"
                  }`}
              >
                <span className="mr-3">{item.icon}</span>
                <span className="font-medium">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Profile Section */}
      <div className="border-t border-gray-200 p-4">
        {/* User Info */}
        <div className="flex items-center mb-4">
          <div className="avatar placeholder">
            <div className="bg-gray-500 text-white rounded-full w-12 h-12">
              <span className="text-xl">S</span>
            </div>
          </div>
          <div className="ml-3">
            <p className="font-semibold text-gray-800">
              {getFullName(userData)}
            </p>
            <p className="text-sm text-gray-500">User</p>
          </div>
        </div>

        {/* Language Selector */}
        <div className="flex items-center px-3 py-2 mb-3 text-gray-700">
          <AiOutlineGlobal size={20} className="mr-2" />
          <span className="text-sm">GB English</span>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <AiOutlineLogout size={20} className="mr-2" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default SidePanel;
