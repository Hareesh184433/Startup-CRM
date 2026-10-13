import React, { useEffect, useState } from "react";
import { Users, CheckCircle, XCircle, Percent, Plus, Download, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../api/axios";

const statusColors = {
  New: "bg-blue-500",
  Contacted: "bg-amber-500",
  "Meeting Scheduled": "bg-indigo-500",
  "Proposal Sent": "bg-purple-500",
  Won: "bg-green-500",
  Lost: "bg-red-500",
};

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      const res = await api.get("/analytics");
      setData(res.data);
    } catch (err) {
      // ignore, empty state will show
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const exportCSV = async () => {
    try {
      const res = await api.get("/leads");
      const leads = res.data;
      const headers = ["Name", "Company", "Email", "Phone", "Status", "Source", "Deal Value"];
      const rows = leads.map((l) => [l.name, l.company, l.email, l.phone, l.status, l.source, l.dealValue]);
      const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "leads_export.csv";
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      // ignore
    }
  };

  if (loading) return <p className="text-gray-400 text-sm">Loading dashboard...</p>;

  const stats = data || {
    totalLeads: 0,
    wonLeads: 0,
    lostLeads: 0,
    conversionRate: "0.0",
    pipeline: [],
    recentLeads: [],
  };

  const cards = [
    { label: "Total Leads", value: stats.totalLeads, change: "+14.2%", up: true, icon: Users, bg: "bg-blue-50", color: "text-blue-500" },
    { label: "Won Leads", value: stats.wonLeads, change: "+8.3%", up: true, icon: CheckCircle, bg: "bg-green-50", color: "text-green-500" },
    { label: "Lost Leads", value: stats.lostLeads, change: "-4.5%", up: false, icon: XCircle, bg: "bg-red-50", color: "text-red-500" },
    { label: "Conversion Rate", value: `${stats.conversionRate}%`, change: "+2.4%", up: true, icon: Percent, bg: "bg-amber-50", color: "text-amber-500" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Good morning, {user?.name}!
      </h1>
      <p className="text-gray-500 text-sm mt-1">Here is your sales pipeline status overview for today.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {cards.map((c) => (
          <div key={c.label} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">{c.label}</p>
              <div className={`w-9 h-9 rounded-lg ${c.bg} flex items-center justify-center`}>
                <c.icon size={16} className={c.color} />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-3">{c.value}</p>
            <p className={`text-xs mt-1 ${c.up ? "text-green-500" : "text-red-500"}`}>
              {c.change} vs last month
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">Pipeline Overview</h3>
            <span className="text-xs text-gray-400">{stats.totalLeads} Total Leads</span>
          </div>
          <div className="w-full h-2 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden flex">
            {stats.pipeline.map((p) =>
              p.percent > 0 ? (
                <div
                  key={p.status}
                  className={statusColors[p.status]}
                  style={{ width: `${p.percent}%` }}
                />
              ) : null
            )}
          </div>
          <div className="flex flex-wrap gap-6 mt-5">
            {(stats.pipeline.length
              ? stats.pipeline
              : ["New", "Contacted", "In Progress", "Won", "Lost"].map((s) => ({ status: s, count: 0, percent: 0 }))
            ).map((p) => (
              <div key={p.status} className="text-sm">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${statusColors[p.status] || "bg-gray-400"}`} />
                  <span className="text-gray-500">{p.status}</span>
                </div>
                <p className="font-semibold text-gray-900 dark:text-white mt-0.5">
                  {p.count} <span className="text-xs font-normal text-gray-400">{p.percent}%</span>
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-5">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <button
              onClick={() => navigate("/leads?new=1")}
              className="w-full flex items-center justify-between bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg"
            >
              <span className="flex items-center gap-2">
                <Plus size={16} /> Add New Lead
              </span>
              <ArrowRight size={16} />
            </button>
            <Link
              to="/leads"
              className="w-full flex items-center justify-between bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 text-gray-700 dark:text-gray-200 text-sm font-medium px-4 py-2.5 rounded-lg"
            >
              View All Leads <ArrowRight size={16} />
            </Link>
            <button
              onClick={exportCSV}
              className="w-full flex items-center justify-between bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 text-gray-700 dark:text-gray-200 text-sm font-medium px-4 py-2.5 rounded-lg"
            >
              <span className="flex items-center gap-2">
                <Download size={16} /> Export Leads Data
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-5 mt-4">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Recent Leads</h3>
        {stats.recentLeads.length === 0 ? (
          <p className="text-center text-gray-400 text-sm py-8">
            No leads found. Use Quick Actions to add your first sales lead.
          </p>
        ) : (
          <div className="divide-y divide-gray-50 dark:divide-gray-700">
            {stats.recentLeads.map((l) => (
              <div key={l._id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{l.name}</p>
                  <p className="text-xs text-gray-400">{l.company}</p>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                  {l.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
