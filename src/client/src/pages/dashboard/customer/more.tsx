import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FiHeart,
  FiShield,
  FiFileText,
  FiBell,
  FiUser,
  FiLogOut,
  FiChevronRight,
} from "react-icons/fi";

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  iconBgColor?: string;
  iconColor?: string;
}

const MenuItem: React.FC<MenuItemProps> = ({
  icon,
  label,
  onClick,
  iconBgColor = "bg-gray-100",
  iconColor = "text-gray-700",
}) => {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors rounded-lg group"
    >
      <div className="flex items-center gap-3">
        <div className={`${iconBgColor} ${iconColor} p-2 rounded-full`}>
          {icon}
        </div>
        <span className="text-gray-800 font-medium">{label}</span>
      </div>
      <FiChevronRight
        className="text-gray-400 group-hover:text-gray-600"
        size={20}
      />
    </button>
  );
};

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, children }) => {
  return (
    <div className="mb-6">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-4">
        {title}
      </h3>
      <div className="bg-white rounded-xl shadow-sm divide-y divide-gray-100">
        {children}
      </div>
    </div>
  );
};

const MorePage: React.FC = () => {
  const navigate = useNavigate();

  // TODO: Replace with actual user data from context/state
  const user = {
    name: "Shahbaz Ansari",
    email: "sabziddt@gmail.com",
    initials: "SA",
  };

  const handleLogout = () => {
    // TODO: Implement logout logic (clear tokens, redirect, etc.)
    console.log("Logging out...");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Profile Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 pt-8 pb-24 px-6">
        <div className="flex items-center gap-4">
          <div className="avatar placeholder">
            <div className="bg-blue-700 text-white rounded-full w-16 h-16 flex items-center justify-center">
              <span className="text-xl font-bold">{user.initials}</span>
            </div>
          </div>
          <div className="text-white">
            <h2 className="text-xl font-bold">{user.name}</h2>
            <p className="text-blue-100 text-sm">{user.email}</p>
          </div>
        </div>
      </div>

      {/* Content Section with negative margin to overlap header */}
      <div className="px-4 -mt-16 pb-8">
        {/* Services Section */}
        <Section title="Services">
          <MenuItem
            icon={<FiHeart size={20} />}
            label="Health Card"
            onClick={() => navigate("/dashboard/health-card")}
            iconBgColor="bg-red-50"
            iconColor="text-red-500"
          />
          <MenuItem
            icon={<FiShield size={20} />}
            label="Family Plan"
            onClick={() => navigate("/dashboard/family-plan")}
            iconBgColor="bg-green-50"
            iconColor="text-green-500"
          />
        </Section>

        {/* Requests Section */}
        <Section title="Requests">
          <MenuItem
            icon={<FiFileText size={20} />}
            label="Operation Support"
            onClick={() => navigate("/dashboard/support")}
            iconBgColor="bg-blue-50"
            iconColor="text-blue-500"
          />
        </Section>

        {/* Account Section */}
        <Section title="Account">
          <MenuItem
            icon={<FiBell size={20} />}
            label="Notifications"
            onClick={() => navigate("/dashboard/notifications")}
            iconBgColor="bg-yellow-50"
            iconColor="text-yellow-600"
          />
          <MenuItem
            icon={<FiUser size={20} />}
            label="Profile"
            onClick={() => navigate("/dashboard/profile")}
            iconBgColor="bg-gray-100"
            iconColor="text-gray-600"
          />
        </Section>

        {/* Logout Button */}
        <div className="bg-white rounded-xl shadow-sm">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 p-4 text-red-500 font-medium hover:bg-red-50 transition-colors rounded-xl"
          >
            <FiLogOut size={20} />
            <span>Logout</span>
          </button>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 space-y-1">
          <p className="text-sm font-medium text-gray-600">Bonchi Cares v1.0</p>
          <p className="text-xs text-gray-400">Your health, our priority</p>
        </div>
      </div>
    </div>
  );
};

export default MorePage;
