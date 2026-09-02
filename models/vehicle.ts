import mongoose, { Schema } from "mongoose";

const VehicleSchema = new Schema(
  {
    vehicleNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    customerName: {
      type: String,
      required: true,
      trim: true,
    },

    vehicleType: {
      type: String,
      required: true,
    },

    model: {
      type: String,
    },

    serviceType: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["Active", "In Service", "Completed", "Pending"],
      default: "Pending",
    },

    lastService: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Vehicle =
  mongoose.models.Vehicle ||
  mongoose.model("Vehicle", VehicleSchema);

export default Vehicle;