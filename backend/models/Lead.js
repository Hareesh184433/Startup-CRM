const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Lead name is required"],
      trim: true,
    },
    company: {
      type: String,
      required: [true, "Company is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    status: {
      type: String,
      enum: ["New", "Contacted", "Meeting Scheduled", "Proposal Sent", "Won", "Lost"],
      default: "New",
    },
    source: {
      type: String,
      enum: ["Website", "Referral", "Cold Outreach", "Social Media", "Event", "Other"],
      default: "Website",
    },
    dealValue: {
      type: Number,
      default: 0,
    },
    owner: {
      // The startup/tenant this lead belongs to
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Lead", leadSchema);
