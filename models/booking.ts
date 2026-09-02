import mongoose, { Schema } from "mongoose";

const BookingSchema = new Schema(
  {
    bookingId: {
      type: String,
      required: true,
      unique: true,
    },

    customerName: {
      type: String,
      required: true,
    },

    vehicleNumber: {
      type: String,
    },

    serviceType: {
      type: String,
      required: true,
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Emergency"],
      default: "Medium",
    },

    status: {
      type: String,
      enum: ["Completed", "Pending", "Cancelled", "In Progress"],
      default: "Pending",
    },

    amount: {
      type: Number,
      default: 0,
    },

    bookingDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Booking =
  mongoose.models.Booking ||
  mongoose.model("Booking", BookingSchema);

export default Booking;