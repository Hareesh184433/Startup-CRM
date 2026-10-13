import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import Topbar from "./Topbar.jsx";

const pageMeta = {
  "/dashboard": { title: "DASHBOARD", subtitle: "Overview of Startup CRM Lite workspace" },
  "/leads": { title: "LEADS", subtitle: "Overview of Startup CRM Lite workspace" },
  "/analytics": { title: "ANALYTICS", subtitle: "Overview of Startup CRM Lite workspace" },
  "/settings": { title: "SETTINGS", subtitle: "Overview of Startup CRM Lite workspace" },
};

const AppLayout = () => {
  const [darkMode, setDarkMode] = useState(false);
  const location = useLocation();
  const meta = pageMeta[location.pathname] || pageMeta["/dashboard"];

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        <Sidebar darkMode={darkMode} setDarkMode={setDarkMode} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Topbar title={meta.title} subtitle={meta.subtitle} />
          <main className="flex-1 overflow-y-auto p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
