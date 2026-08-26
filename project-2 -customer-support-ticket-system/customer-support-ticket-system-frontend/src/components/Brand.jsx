import { HStack, Heading, Icon } from "@chakra-ui/react";
import { LiaHeadsetSolid  } from "react-icons/lia";
import { Link as RouterLink } from "react-router-dom";

export const Brand = () => {
  return (
    <HStack
      as={RouterLink}
      to="/"
      gap={2}
      _hover={{ textDecoration: "none" }}
    >
      <Icon
        as={LiaHeadsetSolid }
        boxSize={{ base: 5, md: 6 }}
        color="brand.600"
      />

      <Heading
        size={{ base: "md", md: "lg" }}
        color="brand.600"
      >
        SupportDesk
      </Heading>
    </HStack>
  );
};