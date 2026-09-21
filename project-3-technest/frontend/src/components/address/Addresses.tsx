import { useState } from "react";
import { Box, Button, Grid, Heading, Text } from "@chakra-ui/react";

import {
  useAddAddressMutation,
  useDeleteAddressMutation,
  useGetAddressesQuery,
  useUpdateAddressMutation,
  type Address,
} from "../../redux/api/addressApi";

import { AddressForm } from "../../components/address/AddressForm";
import { AddressDetailsCard } from "../../components/address/AddressDetailsCard";

interface BackendValidationError {
  type: string;
  value: unknown;
  msg: string;
  path: string;
  location: string;
}

interface AddressesProps {
  isCheckout?: boolean;
  selectedAddressId?: string | null;
  onSelectAddress?: (addressId: string) => void;
}

export const Addresses = ({
  isCheckout = false,
  selectedAddressId,
  onSelectAddress,
}: AddressesProps) => {
  const { data, isLoading, isError } = useGetAddressesQuery();

  const [addAddress, { isLoading: isAdding, error: addError }] =
    useAddAddressMutation();

  const [updateAddress, { isLoading: isUpdating, error: updateError }] =
    useUpdateAddressMutation();

  const [deleteAddress, { isLoading: isDeleting, error: deleteError }] =
    useDeleteAddressMutation();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | undefined>();

  const addresses = data?.data ?? [];

  const handleAddAddress = () => {
    setSelectedAddress(undefined);
    setIsFormOpen(true);
  };

  const handleEditAddress = (address: Address) => {
    setSelectedAddress(address);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (addressDetails: Omit<Address, "_id">) => {
    try {
      if (selectedAddress) {
        await updateAddress({
          addressId: selectedAddress._id,
          addressDetails,
        }).unwrap();
      } else {
        const response = await addAddress(addressDetails).unwrap();

        if (isCheckout && response._id) {
          onSelectAddress?.(response._id);
        }
      }

      setIsFormOpen(false);
      setSelectedAddress(undefined);
    } catch {
      // Keep form open so validation errors can be displayed.
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    const shouldDelete = window.confirm(
      "Are you sure you want to delete this address?",
    );

    if (!shouldDelete) return;

    try {
      await deleteAddress(addressId).unwrap();

      // If the selected checkout address was deleted,
      // clear the selection.
      if (isCheckout && selectedAddressId === addressId) {
        onSelectAddress?.("");
      }
    } catch {
      // Error is displayed below.
    }
  };

  const getBackendErrors = (error: unknown): BackendValidationError[] => {
    if (typeof error === "object" && error !== null && "data" in error) {
      const data = error.data;

      if (
        typeof data === "object" &&
        data !== null &&
        "data" in data &&
        Array.isArray(data.data)
      ) {
        return data.data;
      }
    }

    return [];
  };

  const getErrorMessage = (error: unknown): string | undefined => {
    if (typeof error === "object" && error !== null && "data" in error) {
      const data = error.data;

      if (
        typeof data === "object" &&
        data !== null &&
        "message" in data &&
        typeof data.message === "string"
      ) {
        return data.message;
      }
    }

    return undefined;
  };

  const backendErrors = getBackendErrors(addError || updateError);

  const generalBackendError = getErrorMessage(addError || updateError);

  const deleteErrorMessage = getErrorMessage(deleteError);

  if (isLoading) {
    return <Text>Loading addresses...</Text>;
  }

  if (isError) {
    return <Text>Failed to load addresses.</Text>;
  }

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={6}
      >
        <Heading size={isCheckout ? "md" : undefined}>
          {isCheckout ? "Select Delivery Address" : "My Addresses"}
        </Heading>

        {!isFormOpen && (
          <Button onClick={handleAddAddress} disabled={addresses.length >= 3}>
            Add Address
          </Button>
        )}
      </Box>

      {addresses.length >= 3 && !isFormOpen && (
        <Text mb={5} color="gray.500">
          You can save a maximum of 3 addresses.
        </Text>
      )}

      {isFormOpen && (
        <Box maxW="600px" mb={8} borderWidth="1px" borderRadius="lg" p={6}>
          <Heading size="md" mb={5}>
            {selectedAddress ? "Update Address" : "Add New Address"}
          </Heading>

          <AddressForm
            address={selectedAddress}
            onSubmit={handleFormSubmit}
            isLoading={isAdding || isUpdating}
            backendErrors={backendErrors}
          />

          {generalBackendError && backendErrors.length === 0 && (
            <Text mt={3} color="red.500">
              {generalBackendError}
            </Text>
          )}

          <Button
            mt={3}
            variant="ghost"
            onClick={() => {
              setIsFormOpen(false);
              setSelectedAddress(undefined);
            }}
          >
            Cancel
          </Button>
        </Box>
      )}

      {deleteErrorMessage && (
        <Text mb={5} color="red.500">
          {deleteErrorMessage}
        </Text>
      )}

      {addresses.length === 0 ? (
        <Text>No saved addresses found.</Text>
      ) : (
        <Grid
          templateColumns={{
            base: "1fr",
            md: "repeat(2, 1fr)",
          }}
          gap={5}
        >
          {addresses.map((address) => (
            <AddressDetailsCard
              key={address._id}
              address={address}
              onEdit={handleEditAddress}
              onDelete={handleDeleteAddress}
              isDeleting={isDeleting}
              isSelectable={isCheckout}
              isSelected={selectedAddressId === address._id}
              onSelect={isCheckout ? onSelectAddress : undefined}
            />
          ))}
        </Grid>
      )}
    </Box>
  );
};
