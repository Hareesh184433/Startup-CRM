import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const statuses = ["New", "Contacted", "Meeting Scheduled", "Proposal Sent", "Won", "Lost"];
const sources = ["Website", "Referral", "Cold Outreach", "Social Media", "Event", "Other"];

const emptyForm = {
  name: "",
  company: "",
  email: "",
  phone: "",
  status: "New",
  source: "Website",
  dealValue: "",
};

const LeadModal = ({ open, onClose, onSave, initialData }) => {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm({ ...emptyForm, ...initialData });
    } else {
      setForm(emptyForm);
    }
    setError("");
  }, [initialData, open]);

  if (!open) return null;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.company || !form.email) {
      setError("Please fill in all required fields.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await onSave({ ...form, dealValue: Number(form.dealValue) || 0 });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Could not save lead. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">
            {initialData ? "Edit Lead" : "Add New Lead"}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded-lg mb-3">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Lead Name *</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="E.g., Sarah Jenkins"
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company *</label>
            <input
              name="company"
              value={form.company}
              onChange={handleChange}
              placeholder="E.g., Acme Corp"
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="e.g. sarah@acme.com"
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="E.g., +1 (555) 019-2834"
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-brand-500 focus:outline-none text-sm"
              >
                {statuses.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
              <select
                name="source"
                value={form.source}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-brand-500 focus:outline-none text-sm"
              >
                {sources.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deal Value (₹)</label>
            <input
              name="dealValue"
              type="number"
              min="0"
              value={form.dealValue}
              onChange={handleChange}
              placeholder="0"
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 text-sm"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 text-sm font-medium bg-brand-600 hover:bg-brand-700 text-white rounded-lg disabled:opacity-60"
            >
              {saving ? "Saving..." : initialData ? "Save Changes" : "Create Lead"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeadModal;
