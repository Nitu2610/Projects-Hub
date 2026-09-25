import { useEffect, useState } from "react";
import { Button, Field, Input, NativeSelect, Stack } from "@chakra-ui/react";

import type { Address } from "../../features/address/api/addressApi";

interface BackendValidationError {
  type: string;
  value: unknown;
  msg: string;
  path: string;
  location: string;
}

interface AddressFormProps {
  address?: Address;
  onSubmit: (addressDetails: Omit<Address, "_id">) => void;
  isLoading?: boolean;
  backendErrors?: BackendValidationError[];
}

type AddressFormErrors = Partial<Record<keyof Omit<Address, "_id">, string>>;

export const AddressForm = ({
  address,
  onSubmit,
  isLoading = false,
  backendErrors = [],
}: AddressFormProps) => {
  const [formData, setFormData] = useState<Omit<Address, "_id">>({
    label: address?.label ?? "Home",
    fullName: address?.fullName ?? "",
    phone: address?.phone ?? "",
    addressLine1: address?.addressLine1 ?? "",
    addressLine2: address?.addressLine2 ?? "",
    city: address?.city ?? "",
    state: address?.state ?? "",
    postalCode: address?.postalCode ?? "",
    country: address?.country ?? "India",
  });

  const [errors, setErrors] = useState<AddressFormErrors>({});

  useEffect(() => {
    setFormData({
      label: address?.label ?? "Home",
      fullName: address?.fullName ?? "",
      phone: address?.phone ?? "",
      addressLine1: address?.addressLine1 ?? "",
      addressLine2: address?.addressLine2 ?? "",
      city: address?.city ?? "",
      state: address?.state ?? "",
      postalCode: address?.postalCode ?? "",
      country: address?.country ?? "India",
    });

    setErrors({});
  }, [address]);

  const getBackendError = (field: string) => {
    return backendErrors.find((error) => error.path === field)?.msg;
  };

  const handleChange = (field: keyof Omit<Address, "_id">, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors: AddressFormErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required.";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    }

    if (!formData.addressLine1.trim()) {
      newErrors.addressLine1 = "Address is required.";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required.";
    }

    if (!formData.state.trim()) {
      newErrors.state = "State is required.";
    }

    if (!formData.postalCode.trim()) {
      newErrors.postalCode = "Postal code is required.";
    }

    if (!formData.country.trim()) {
      newErrors.country = "Country is required.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    onSubmit({
      ...formData,
      fullName: formData.fullName.trim(),
      phone: formData.phone.trim(),
      addressLine1: formData.addressLine1.trim(),
      addressLine2: formData.addressLine2?.trim() || undefined,
      city: formData.city.trim(),
      state: formData.state.trim(),
      postalCode: formData.postalCode.trim(),
      country: formData.country.trim(),
    });
  };

  const fullNameError = errors.fullName || getBackendError("fullName");

  const phoneError = errors.phone || getBackendError("phone");

  const addressLine1Error =
    errors.addressLine1 || getBackendError("addressLine1");

  const cityError = errors.city || getBackendError("city");

  const stateError = errors.state || getBackendError("state");

  const postalCodeError = errors.postalCode || getBackendError("postalCode");

  const countryError = errors.country || getBackendError("country");

  return (
    <Stack gap={4}>
      <Field.Root invalid={!!fullNameError}>
        <Field.Label>Full Name</Field.Label>

        <Input
          value={formData.fullName}
          onChange={(e) => handleChange("fullName", e.target.value)}
        />

        {fullNameError && <Field.ErrorText>{fullNameError}</Field.ErrorText>}
      </Field.Root>

      <Field.Root invalid={!!phoneError}>
        <Field.Label>Phone</Field.Label>

        <Input
          value={formData.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
        />

        {phoneError && <Field.ErrorText>{phoneError}</Field.ErrorText>}
      </Field.Root>

      <Field.Root invalid={!!addressLine1Error}>
        <Field.Label>Address Line 1</Field.Label>

        <Input
          value={formData.addressLine1}
          onChange={(e) => handleChange("addressLine1", e.target.value)}
        />

        {addressLine1Error && (
          <Field.ErrorText>{addressLine1Error}</Field.ErrorText>
        )}
      </Field.Root>

      <Field.Root>
        <Field.Label>Address Line 2</Field.Label>

        <Input
          value={formData.addressLine2 ?? ""}
          onChange={(e) => handleChange("addressLine2", e.target.value)}
        />
      </Field.Root>

      <Field.Root invalid={!!cityError}>
        <Field.Label>City</Field.Label>

        <Input
          value={formData.city}
          onChange={(e) => handleChange("city", e.target.value)}
        />

        {cityError && <Field.ErrorText>{cityError}</Field.ErrorText>}
      </Field.Root>

      <Field.Root invalid={!!stateError}>
        <Field.Label>State</Field.Label>

        <Input
          value={formData.state}
          onChange={(e) => handleChange("state", e.target.value)}
        />

        {stateError && <Field.ErrorText>{stateError}</Field.ErrorText>}
      </Field.Root>

      <Field.Root invalid={!!postalCodeError}>
        <Field.Label>Postal Code</Field.Label>

        <Input
          value={formData.postalCode}
          onChange={(e) => handleChange("postalCode", e.target.value)}
        />

        {postalCodeError && (
          <Field.ErrorText>{postalCodeError}</Field.ErrorText>
        )}
      </Field.Root>

      <Field.Root invalid={!!countryError}>
        <Field.Label>Country</Field.Label>

        <Input
          value={formData.country}
          onChange={(e) => handleChange("country", e.target.value)}
        />

        {countryError && <Field.ErrorText>{countryError}</Field.ErrorText>}
      </Field.Root>

      <Field.Root>
        <Field.Label>Label</Field.Label>

        <NativeSelect.Root>
          <NativeSelect.Field
            value={formData.label}
            onChange={(e) =>
              handleChange("label", e.target.value as Address["label"])
            }
          >
            <option value="Home">Home</option>
            <option value="Work">Work</option>
            <option value="Other">Other</option>
          </NativeSelect.Field>
        </NativeSelect.Root>
      </Field.Root>

      <Button onClick={handleSubmit} loading={isLoading}>
        {address ? "Update Address" : "Add Address"}
      </Button>
    </Stack>
  );
};
