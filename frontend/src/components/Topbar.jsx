import React, { useState, useEffect, useRef } from "react";
import { Bell, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const Topbar = ({ title, subtitle }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const ref = useRef(null);

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/notifications");
      setNotifications(res.data);
    } catch (err) {
      // fail silently, notifications are non-critical
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = async () => {
    try {
      await api.put("/notifications/mark-all-read");
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      // ignore
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const timeAgo = (date) => {
    const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div>
        <p className="text-xs font-semibold text-brand-600 tracking-wide">{title}</p>
        <p className="text-sm text-gray-400">{subtitle}</p>
      </div>

      <div className="flex items-center gap-4 relative" ref={ref}>
        <button
          onClick={() => setOpen(!open)}
          className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <Bell size={18} className="text-gray-600 dark:text-gray-300" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>

        {open && (
          <div className="absolute right-10 top-11 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 z-50">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700">
              <p className="text-xs font-semibold text-gray-500 tracking-wide">
                NOTIFICATIONS ({unreadCount} NEW)
              </p>
              <button onClick={markAllRead} className="text-xs text-brand-600 font-medium">
                Mark all as read
              </button>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">No notifications yet.</p>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n._id}
                    className="flex gap-3 px-4 py-3 border-b border-gray-50 dark:border-gray-700 last:border-0"
                  >
                    <div className="w-8 h-8 rounded-full bg-brand-50 dark:bg-gray-700 flex items-center justify-center shrink-0">
                      <Bell size={14} className="text-brand-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{n.title}</p>
                      <p className="text-xs text-gray-400">{n.message}</p>
                      <p className="text-[11px] text-gray-300 mt-0.5">{timeAgo(n.createdAt)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="text-center py-2 text-[10px] tracking-wide text-gray-400 border-t border-gray-100 dark:border-gray-700">
              SAAS CRM NOTIFICATIONS CENTRE
            </div>
          </div>
        )}

        <div className="w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center font-semibold text-sm">
          {(user?.name || "U")[0].toUpperCase()}
        </div>
        <button onClick={handleLogout} title="Log out">
          <LogOut size={18} className="text-gray-500 hover:text-red-500" />
        </button>
      </div>
    </header>
  );
};

export default Topbar;
