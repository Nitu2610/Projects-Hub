export type AddressLabel = "Home" | "Work" | "Other";

export interface AddressData {
  label: AddressLabel;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
}

export interface UpdateAddressData {
  label?: AddressLabel;
  fullName?: string;
  phone?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
}