import mongoose, { Types, Schema } from "mongoose";

 interface AddressDataFormat {
  userId: Types.ObjectId;
  label: "Home" | "Work" | "Other";
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country?: string;
}

const addressSchema = new mongoose.Schema<AddressDataFormat>(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    label: {
      type: String,
      enum:["Home","Work","Other"],
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      match:[/^[6-9]\d{9}$/,"Please provide a valid Indian mobile number"]
    },
    addressLine1: {
      type: String,
      required: true,
    },
    addressLine2: {
      type: String,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    postalCode: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
      default:"India"
    },
  },
  {
    timestamps: true,
  },
);

const Address = mongoose.model("Address", addressSchema);

module.exports = Address;

