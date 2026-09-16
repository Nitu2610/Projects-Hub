const Address = require("../models/address.model");

interface RequestAddressDataFormat {
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

interface UpdateAddressDetailsDataFormat {
  label?: "Home" | "Work" | "Other";
  fullName?: string;
  phone?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
}

const addressService = {
  addAddress: async (
    addressDetails: RequestAddressDataFormat,
    userId: string,
  ) => {
    const addressCount = await Address.countDocuments({
      userId,
    });

    if (addressCount >= 3) {
      return {
        success: false,
        message: "Can't save more than 3 address.",
        code: "INVALID_REQUEST",
      };
    }

    const addressAdded = await Address.create({ ...addressDetails, userId });
    return {
      success: true,
      message: "Address added successfully.",
      data: addressAdded,
    };
  },

  getAddresses: async (userId: string) => {
    const addressList = await Address.find({ userId });

    return {
      success: true,
      message: "Addresses retrieved successfully.",
      data: addressList,
    };
  },

  getAddressById: async (addressId: string, userId: string) => {
    const address = await Address.findOne({ _id: addressId, userId });

    if (!address) {
      return {
        success: false,
        message: "Address not found.",
        code: "NOT_FOUND",
      };
    }

    return {
      success: true,
      message: "Address retrieved successfully.",
      data: address,
    };
  },

  updateAddress: async (
    addressId: string,
    updateAddressDetails: UpdateAddressDetailsDataFormat,
    userId: string,
  ) => {
    const address = await Address.findOneAndUpdate(
      { _id: addressId, userId },
      { ...updateAddressDetails, country: "India" },
      { new: true, runValidators: true },
    );

    if (!address) {
      return {
        success: false,
        message: "Address not found to update.",
        code: "NOT_FOUND",
      };
    }

    return {
      success: true,
      message: "Address Details are updated.",
      data: address,
    };
  },

  deleteAddress: async (addressId: string, userId: string) => {
    const address = await Address.findOneAndDelete({
      _id: addressId,
      userId,
    });

    if (!address) {
      return {
        success: false,
        message: "Address not found to delete.",
        code: "NOT_FOUND",
      };
    }

    return {
      success: true,
      message: "Address deleted successfully.",
      data: address,
    };
  },
};

module.exports = addressService;
