import { Box, Text } from "@chakra-ui/react";
import { Address } from "../../redux/api/addressApi";

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