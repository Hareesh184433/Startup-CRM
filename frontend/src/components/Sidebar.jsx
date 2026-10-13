import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutGrid, Users, TrendingUp, Settings as SettingsIcon, Sun, Moon } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const navItems = [
  { to: "/dashboard", label: "Dashboard", sub: "Pipeline overview", icon: LayoutGrid },
  { to: "/leads", label: "Leads", sub: "Manage lead database", icon: Users },
  { to: "/analytics", label: "Analytics", sub: "Insights & forecasts", icon: TrendingUp },
  { to: "/settings", label: "Settings", sub: "Account profile", icon: SettingsIcon },
];

const Sidebar = ({ darkMode, setDarkMode }) => {
  const { user } = useAuth();

  return (
    <aside className="w-60 shrink-0 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex flex-col">
      <div className="flex items-center gap-2 px-5 py-5">
        <div className="w-8 h-8 rounded-lg bg-brand-600 text-white flex items-center justify-center font-bold text-sm">
          CL
        </div>
        <span className="font-bold text-gray-900 dark:text-white">
          CRM<span className="text-brand-600">Lite</span>
        </span>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {navItems.map(({ to, label, sub, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? "bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-500 border-l-2 border-brand-600"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`
            }
          >
            <Icon size={18} />
            <span>
              <span className="block font-medium">{label}</span>
              <span className="block text-xs text-gray-400">{sub}</span>
            </span>
          </NavLink>
        ))}
      </nav>

      <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
        <span className="flex items-center gap-2">
          {darkMode ? <Moon size={16} /> : <Sun size={16} />}
          {darkMode ? "Dark Mode" : "Light Mode"}
        </span>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`w-9 h-5 rounded-full flex items-center transition-colors px-0.5 ${
            darkMode ? "bg-brand-600 justify-end" : "bg-gray-300 justify-start"
          }`}
        >
          <span className="w-4 h-4 bg-white rounded-full block" />
        </button>
      </div>

      <div className="flex items-center gap-2 px-4 py-4 border-t border-gray-100 dark:border-gray-800">
        <div className="w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center font-semibold text-sm">
          {(user?.name || "U")[0].toUpperCase()}
        </div>
        <div className="text-sm">
          <p className="font-medium text-gray-900 dark:text-white">{user?.name}</p>
          <p className="text-xs text-gray-400">{user?.email}</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
