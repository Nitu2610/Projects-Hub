import { Box, Text } from "@chakra-ui/react";
import type { ShippingAddressSnapshot } from "../../../types/order.types";

interface AddressDetailsProps {
  address: ShippingAddressSnapshot;
}

export const AddressDetails = ({
  address,
}: AddressDetailsProps) => {
  return (
    <Box
      borderWidth="1px"
      borderColor="border"
      borderRadius="lg"
      bg="bg.panel"
      p={5}
    >
      <Text fontWeight="600">
        {address.fullName}
      </Text>

      <Text mt={1}>{address.phone}</Text>

      <Text mt={3}>
        {address.addressLine1}
      </Text>

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