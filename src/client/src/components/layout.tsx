import SidePanel from "./sidepanel";
import { Link, useLocation } from "react-router-dom";
import {
  AiOutlineHome,
  AiOutlineCalendar,
  AiOutlineFileText,
  AiOutlineMore,
} from "react-icons/ai";
import { FaCreditCard } from "react-icons/fa";
import { useUser } from "../hooks/query";
import { useEffect } from "react";

const Layout = ({ children }) => {
  const location = useLocation();
  const { data: userData, isLoading } = useUser();

  // Layout will handle auth
  useEffect(() => {
    if (!isLoading && !userData) {
      // Redirect to login if not authenticated
      window.location.href = "/login";
    }
  }, [userData, isLoading]);

  const navItems = [
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
      name: "More",
      path: "/dashboard/more",
      icon: <AiOutlineMore size={24} />,
    },
  ];

  return (
    <div className="flex flex-col h-screen">
      {userData?.role === "SUPER_ADMIN" && (
        <div className="bg-red-400 ">
          <div className="container mx-auto">
            <p className="text-white font-bold">Super Admin</p>
          </div>
        </div>
      )}
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidepanel - hidden on mobile */}
        <div className="hidden lg:block">
          <SidePanel />
        </div>

        {/* Main Content */}
        <main className="bg-base-200 w-full overflow-y-auto pb-20 lg:pb-0">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation - hidden on desktop */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <nav className="flex justify-around items-center h-16">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                location.pathname === item.path
                  ? "text-blue-600"
                  : "text-gray-500"
              }`}
            >
              {item.icon}
              <span className="text-xs mt-1 font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Layout;
