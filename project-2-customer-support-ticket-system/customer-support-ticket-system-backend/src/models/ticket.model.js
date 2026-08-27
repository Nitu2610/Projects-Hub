const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    issueOccurredAt: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["Open", "In Progress", "Resolved", "Closed"],
      default: "Open",
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      default: "Low",
    },
    createdBy:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'User',
      required:true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref:'User',
      default: null,
    },
    resolution: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

const Ticket = mongoose.model("Ticket", ticketSchema);

module.exports = Ticket;
