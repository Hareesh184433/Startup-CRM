const Lead = require("../models/Lead");
const Notification = require("../models/Notification");

// @route GET /api/leads
const getLeads = async (req, res) => {
  try {
    const { search, status, source } = req.query;
    const query = { owner: req.user._id };

    if (status && status !== "All") query.status = status;
    if (source && source !== "All Sources") query.source = source;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const leads = await Lead.find(query).sort({ createdAt: -1 });
    res.json(leads);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route GET /api/leads/:id
const getLead = async (req, res) => {
  try {
    const lead = await Lead.findOne({ _id: req.params.id, owner: req.user._id });
    if (!lead) return res.status(404).json({ message: "Lead not found" });
    res.json(lead);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route POST /api/leads
const createLead = async (req, res) => {
  try {
    const { name, company, email, phone, status, source, dealValue } = req.body;

    if (!name || !company || !email) {
      return res.status(400).json({ message: "Name, company, and email are required" });
    }

    const lead = await Lead.create({
      name,
      company,
      email,
      phone,
      status,
      source,
      dealValue,
      owner: req.user._id,
    });

    await Notification.create({
      owner: req.user._id,
      title: `New Lead Added: ${lead.name}`,
      message: `Acquired through ${lead.source} contact form.`,
      type: "lead_created",
    });

    res.status(201).json(lead);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route PUT /api/leads/:id
const updateLead = async (req, res) => {
  try {
    const lead = await Lead.findOne({ _id: req.params.id, owner: req.user._id });
    if (!lead) return res.status(404).json({ message: "Lead not found" });

    const prevStatus = lead.status;
    Object.assign(lead, req.body);
    await lead.save();

    if (prevStatus !== "Won" && lead.status === "Won") {
      await Notification.create({
        owner: req.user._id,
        title: `Sales Lead ${lead.name} Won!`,
        message: `Deal of ₹${lead.dealValue || 0} successfully closed.`,
        type: "lead_won",
      });
    } else if (prevStatus !== "Lost" && lead.status === "Lost") {
      await Notification.create({
        owner: req.user._id,
        title: `Lead ${lead.name} marked as Lost`,
        message: `This lead was moved to lost status.`,
        type: "lead_lost",
      });
    } else if (prevStatus !== "Meeting Scheduled" && lead.status === "Meeting Scheduled") {
      await Notification.create({
        owner: req.user._id,
        title: `Meeting Scheduled: ${lead.name}`,
        message: `Sales conversation has been booked.`,
        type: "meeting_scheduled",
      });
    }

    res.json(lead);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route DELETE /api/leads/:id
const deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!lead) return res.status(404).json({ message: "Lead not found" });
    res.json({ message: "Lead deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getLeads, getLead, createLead, updateLead, deleteLead };
