const Lead = require("../models/Lead");

// @route GET /api/analytics
const getAnalytics = async (req, res) => {
  try {
    const ownerId = req.user._id;
    const leads = await Lead.find({ owner: ownerId });

    const total = leads.length;
    const won = leads.filter((l) => l.status === "Won").length;
    const lost = leads.filter((l) => l.status === "Lost").length;
    const conversionRate = total > 0 ? ((won / total) * 100).toFixed(1) : "0.0";

    const statusCounts = {
      New: 0,
      Contacted: 0,
      "Meeting Scheduled": 0,
      "Proposal Sent": 0,
      Won: 0,
      Lost: 0,
    };
    leads.forEach((l) => {
      if (statusCounts[l.status] !== undefined) statusCounts[l.status]++;
    });

    const pipeline = ["New", "Contacted", "Meeting Scheduled", "Proposal Sent", "Won", "Lost"].map(
      (status) => ({
        status,
        count: statusCounts[status],
        percent: total > 0 ? Math.round((statusCounts[status] / total) * 100) : 0,
      })
    );

    const sourceCounts = {};
    leads.forEach((l) => {
      sourceCounts[l.source] = (sourceCounts[l.source] || 0) + 1;
    });

    const totalDealValue = leads
      .filter((l) => l.status === "Won")
      .reduce((sum, l) => sum + (l.dealValue || 0), 0);

    res.json({
      totalLeads: total,
      wonLeads: won,
      lostLeads: lost,
      conversionRate,
      pipeline,
      sourceCounts,
      totalDealValue,
      recentLeads: leads.slice(0, 5),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAnalytics };
