import { Box, Button, Heading, Stack, Text } from "@chakra-ui/react";
import { Address } from "../../../types/address.types";


interface AddressDetailsCardProps {
  address: Address;
  onEdit: (address: Address) => void;
  onDelete: (addressId: string) => void;
  isDeleting?: boolean;

  // Checkout selection
  isSelectable?: boolean;
  isSelected?: boolean;
  onSelect?: (addressId: string) => void;
}

export const AddressDetailsCard = ({
  address,
  onEdit,
  onDelete,
  isDeleting = false,
  isSelectable = false,
  isSelected = false,
  onSelect,
}: AddressDetailsCardProps) => {
  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      p={5}
      borderColor={isSelected ? "blue.500" : undefined}
    >
      <Stack gap={2}>
        <Heading size="md">{address.label}</Heading>

        <Text fontWeight="medium">{address.fullName}</Text>

        <Text>{address.phone}</Text>

        <Text>{address.addressLine1}</Text>

        {address.addressLine2 && <Text>{address.addressLine2}</Text>}

        <Text>
          {address.city}, {address.state}
        </Text>

        <Text>{address.postalCode}</Text>

        <Text>{address.country}</Text>

        <Stack direction="row" gap={3} mt={3}>
          {isSelectable && (
            <Button
              onClick={() => onSelect?.(address._id)}
              colorPalette={isSelected ? "green" : "blue"}
            >
              {isSelected ? "Selected" : "Select"}
            </Button>
          )}

          <Button variant="outline" onClick={() => onEdit(address)}>
            Edit
          </Button>

          <Button
            colorPalette="red"
            variant="outline"
            onClick={() => onDelete(address._id)}
            loading={isDeleting}
          >
            Delete
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};
