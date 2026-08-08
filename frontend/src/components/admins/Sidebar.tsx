import { useState } from "react";
import {
  FolderTree,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router";
import { authApi } from "../../lib/endpoints";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  const navItems = [
    {
      label: "Dashboard",
      path: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Products",
      path: "/admin/products",
      icon: Package,
    },
    {
      label: "Orders",
      path: "/admin/orders",
      icon: ShoppingCart,
    },
    {
      label: "Categories",
      path: "/admin/categories",
      icon: FolderTree,
    },
    {
      label: "Customers",
      path: "/admin/customers",
      icon: Users,
    },
  ];

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authApi.logout();
      navigate("/admin/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  const renderNavContent = () => (
    <>
      <div>
        <div className="p-6 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-black text-[#002b9a] tracking-tight leading-tight">
              <span className="text-blue-500">Laza</span>
              <span className="text-red-500">pee</span> Admin
            </h1>
            <p className="text-[11px] text-gray-400 font-medium">
              Management Portal
            </p>
          </div>

          {/* Close button for mobile inside drawer */}
          <button
            onClick={closeSidebar}
            className="md:hidden p-1.5 text-gray-500 hover:text-gray-800 hover:bg-gray-200/60 rounded-xl transition-colors"
            aria-label="Close Sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="px-3 space-y-1">
          {navItems.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              onClick={closeSidebar}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-xl text-sm transition-all ${
                  isActive
                    ? "bg-[#1d4ed8] text-white font-semibold shadow-xs"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 font-medium"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={`w-4 h-4 ${isActive ? "" : "text-gray-500"}`}
                  />
                  <span>{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* User Profile Info Footer */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center space-x-3 mb-4">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop"
            alt="Admin User"
            className="w-9 h-9 rounded-full object-cover border border-gray-200"
          />
          <div className="overflow-hidden">
            <h4 className="text-xs font-bold text-gray-900 truncate">
              Admin User
            </h4>
            <p className="text-[10px] uppercase tracking-wider font-semibold text-gray-400">
              Super Admin
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-100 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* MOBILE TRIGGER BUTTON (Shown on small screens) */}
      <div className="md:hidden fixed top-4 left-4 z-40 print:hidden">
        <button
          onClick={toggleSidebar}
          className="p-2.5 bg-white text-gray-700 hover:bg-gray-50 rounded-xl border border-gray-200 shadow-md transition-all flex items-center justify-center"
          aria-label="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* MOBILE BACKDROP OVERLAY */}
      {isOpen && (
<div
        onClick={closeSidebar}
        className="fixed inset-0 bg-gray-900/40 backdrop-blur-xs z-40 md:hidden transition-opacity print:hidden"
      />
      )}

      {/* MOBILE SLIDE-OUT DRAWER */}
      <aside
        className={`fixed top-0 left-0 bottom-0 w-64 bg-[#f8fafc] z-50 flex flex-col justify-between border-r border-gray-200/80 transform transition-transform duration-300 ease-in-out md:hidden print:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {renderNavContent()}
      </aside>

      {/* DESKTOP PERMANENT SIDEBAR */}
      <aside className="w-64 bg-[#f8fafc] border-r border-gray-200/80 flex-col justify-between shrink-0 hidden md:flex min-h-screen sticky top-0 print:hidden">
        {renderNavContent()}
      </aside>
    </>
  );
};

export default Sidebar;
