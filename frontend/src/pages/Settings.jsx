import React, { useState } from "react";
import { User, Mail, Building2 } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../api/axios";

const Settings = () => {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [companyName, setCompanyName] = useState(user?.companyName || "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const res = await api.put("/auth/profile", { name, companyName });
      updateUser({ ...user, ...res.data });
      setMessage("Profile updated successfully.");
    } catch (err) {
      setMessage(err.response?.data?.message || "Could not save changes.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
      <p className="text-gray-500 text-sm mt-1">
        Manage your personal user profile settings and account configurations.
      </p>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6 mt-5 max-w-2xl">
        <h3 className="font-semibold text-gray-900 dark:text-white pb-3 border-b border-gray-100 dark:border-gray-700 mb-4">
          Profile Information
        </h3>

        {message && (
          <div className="bg-brand-50 text-brand-700 text-sm px-3 py-2 rounded-lg mb-4">{message}</div>
        )}

        <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1 tracking-wide">FULL NAME</label>
            <div className="relative">
              <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-900 focus:border-brand-500 focus:outline-none text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1 tracking-wide">EMAIL ADDRESS</label>
            <div className="relative">
              <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={user?.email || ""}
                disabled
                className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-400 text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1 tracking-wide">COMPANY NAME</label>
            <div className="relative">
              <Building2 size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Your startup name"
                className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-900 focus:border-brand-500 focus:outline-none text-sm"
              />
            </div>
          </div>

          <div className="sm:col-span-2 flex justify-end pt-3 border-t border-gray-100 dark:border-gray-700 mt-2">
            <button
              type="submit"
              disabled={saving}
              className="bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Profile Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
