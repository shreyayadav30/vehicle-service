import mongoose, { Schema, Document, Model } from "mongoose";

export interface IService extends Document {
  name: string;
  description?: string;
  price: number;
  duration?: number;
  status: string;
}

const ServiceSchema = new Schema<IService>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
    },

    price: {
      type: Number,
      required: true,
    },

    duration: {
      type: Number,
    },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);

const Service: Model<IService> =
  mongoose.models.Service ||
  mongoose.model<IService>("Service", ServiceSchema);

export default Service;