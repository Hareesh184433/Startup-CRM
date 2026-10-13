import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Plus, List, LayoutGrid, FolderOpen, Pencil, Trash2 } from "lucide-react";
import api from "../api/axios";
import LeadModal from "../components/LeadModal.jsx";

const tabs = ["All", "New", "Contacted", "Meeting Scheduled", "Proposal Sent", "Won", "Lost"];
const sourceOptions = ["All Sources", "Website", "Referral", "Cold Outreach", "Social Media", "Event", "Other"];

const statusStyles = {
  New: "bg-blue-50 text-blue-600",
  Contacted: "bg-amber-50 text-amber-600",
  "Meeting Scheduled": "bg-indigo-50 text-indigo-600",
  "Proposal Sent": "bg-purple-50 text-purple-600",
  Won: "bg-green-50 text-green-600",
  Lost: "bg-red-50 text-red-600",
};

const Leads = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [source, setSource] = useState("All Sources");
  const [view, setView] = useState("list");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState(null);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/leads", {
        params: { search, status: activeTab, source },
      });
      setLeads(res.data);
    } catch (err) {
      // ignore, empty state handles it
    } finally {
      setLoading(false);
    }
  }, [search, activeTab, source]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  useEffect(() => {
    if (searchParams.get("new") === "1") {
      setEditingLead(null);
      setModalOpen(true);
      searchParams.delete("new");
      setSearchParams(searchParams, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const counts = tabs.reduce((acc, t) => {
    acc[t] = t === "All" ? leads.length : leads.filter((l) => l.status === t).length;
    return acc;
  }, {});

  const handleSave = async (formData) => {
    if (editingLead) {
      await api.put(`/leads/${editingLead._id}`, formData);
    } else {
      await api.post("/leads", formData);
    }
    fetchLeads();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this lead? This cannot be undone.")) return;
    await api.delete(`/leads/${id}`);
    fetchLeads();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Leads</h1>
          <p className="text-gray-500 text-sm mt-1">
            Create, update, and manage your sales pipeline leads records.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingLead(null);
            setModalOpen(true);
          }}
          className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg"
        >
          <Plus size={16} /> Add Lead
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4">
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, company, or email..."
              className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-900 focus:border-brand-500 focus:outline-none text-sm"
            />
          </div>
          <select
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-900 text-sm"
          >
            {sourceOptions.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <div className="flex border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <button
              onClick={() => setView("list")}
              className={`p-2.5 ${view === "list" ? "bg-brand-600 text-white" : "text-gray-500"}`}
            >
              <List size={16} />
            </button>
            <button
              onClick={() => setView("grid")}
              className={`p-2.5 ${view === "grid" ? "bg-brand-600 text-white" : "text-gray-500"}`}
            >
              <LayoutGrid size={16} />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border ${
                activeTab === t
                  ? "bg-brand-600 text-white border-brand-600"
                  : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700"
              }`}
            >
              {t}
              <span
                className={`text-xs px-1.5 rounded-full ${
                  activeTab === t ? "bg-white/20" : "bg-gray-100 dark:bg-gray-700"
                }`}
              >
                {counts[t] || 0}
              </span>
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-center text-gray-400 text-sm py-12">Loading leads...</p>
        ) : leads.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-14 h-14 mx-auto rounded-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center mb-3">
              <FolderOpen size={22} className="text-gray-300" />
            </div>
            <p className="font-semibold text-gray-900 dark:text-white">No leads added yet</p>
            <p className="text-sm text-gray-400 mt-1">
              Get started by creating your first sales lead to begin tracking your pipeline.
            </p>
          </div>
        ) : view === "list" ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 border-b border-gray-100 dark:border-gray-700">
                  <th className="py-2 font-medium">Name</th>
                  <th className="py-2 font-medium">Company</th>
                  <th className="py-2 font-medium">Email</th>
                  <th className="py-2 font-medium">Status</th>
                  <th className="py-2 font-medium">Source</th>
                  <th className="py-2 font-medium">Deal Value</th>
                  <th className="py-2 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                {leads.map((l) => (
                  <tr key={l._id}>
                    <td className="py-3 font-medium text-gray-900 dark:text-white">{l.name}</td>
                    <td className="py-3 text-gray-500">{l.company}</td>
                    <td className="py-3 text-gray-500">{l.email}</td>
                    <td className="py-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${statusStyles[l.status]}`}>
                        {l.status}
                      </span>
                    </td>
                    <td className="py-3 text-gray-500">{l.source}</td>
                    <td className="py-3 text-gray-500">₹{l.dealValue?.toLocaleString() || 0}</td>
                    <td className="py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditingLead(l);
                            setModalOpen(true);
                          }}
                          className="text-gray-400 hover:text-brand-600"
                        >
                          <Pencil size={15} />
                        </button>
                        <button onClick={() => handleDelete(l._id)} className="text-gray-400 hover:text-red-500">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {leads.map((l) => (
              <div key={l._id} className="border border-gray-100 dark:border-gray-700 rounded-xl p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{l.name}</p>
                    <p className="text-xs text-gray-400">{l.company}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${statusStyles[l.status]}`}>
                    {l.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-3">{l.email}</p>
                <p className="text-sm text-gray-500">{l.phone || "No phone"}</p>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50 dark:border-gray-700">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    ₹{l.dealValue?.toLocaleString() || 0}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingLead(l);
                        setModalOpen(true);
                      }}
                      className="text-gray-400 hover:text-brand-600"
                    >
                      <Pencil size={15} />
                    </button>
                    <button onClick={() => handleDelete(l._id)} className="text-gray-400 hover:text-red-500">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <LeadModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initialData={editingLead}
      />
    </div>
  );
};

export default Leads;
