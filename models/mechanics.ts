import mongoose, { Schema } from "mongoose";

const MechanicSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
    },

    specialization: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["Available", "Busy", "Offline"],
      default: "Available",
    },

    assignedJobs: {
      type: Number,
      default: 0,
    },

    completedJobs: {
      type: Number,
      default: 0,
    },

    rating: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Mechanic =
  mongoose.models.Mechanic ||
  mongoose.model("Mechanic", MechanicSchema);

export default Mechanic;