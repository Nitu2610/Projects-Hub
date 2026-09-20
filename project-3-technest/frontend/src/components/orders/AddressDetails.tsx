import { Box, Text } from "@chakra-ui/react";

interface Address {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface AddressDetailsProps {
  address: Address;
}

export const AddressDetails = ({
  address,
}: AddressDetailsProps) => {
  return (
    <Box>
      <Text>{address.fullName}</Text>
      <Text>{address.phone}</Text>
      <Text>{address.addressLine1}</Text>

      {address.addressLine2 && (
        <Text>{address.addressLine2}</Text>
      )}

      <Text>
        {address.city}, {address.state}
      </Text>

      <Text>{address.postalCode}</Text>
      <Text>{address.country}</Text>
    </Box>
  );
};