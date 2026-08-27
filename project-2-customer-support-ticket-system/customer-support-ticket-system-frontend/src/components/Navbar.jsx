import {
  Box,
  Container,
  Flex,
  Heading,
  HStack,
  IconButton,
  Link,
  Drawer,
  Portal,
  CloseButton,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { LogoutButton } from "./LogoutButton";
import { ColorModeButton } from "./ui/color-mode";
import { Brand } from "./Brand";

export const Navbar = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const [open, setOpen] = useState(false);

  if (!user) return null;

  const isActive = (path) => location.pathname === path;

  const closeMenu = () => {
    setOpen(false);
  };

  return (
    <Box
      as="header"
      bg="support.surface"
      borderBottom="1px solid"
      borderColor="support.border"
      position="sticky"
      top="0"
      zIndex="100"
    >
      <Container maxW="1200px">
        <Flex minH="64px" align="center" justify="space-between" gap={4}>
          {/* Brand */}
         <Brand />

          {/* Desktop navigation */}
          <HStack
            gap={{ base: 3, md: 5 }}
            display={{ base: "none", md: "flex" }}
          >
            <Link
              as={RouterLink}
              to="/"
              fontSize="sm"
              fontWeight={isActive("/") ? "700" : "500"}
              color={isActive("/") ? "blue.600" : "support.text"}
              _hover={{
                color: "blue.600",
                textDecoration: "none",
              }}
            >
              Home
            </Link>

            <Link
              as={RouterLink}
              to="/tickets"
              fontSize="sm"
              fontWeight={isActive("/tickets") ? "700" : "500"}
              color={isActive("/tickets") ? "blue.600" : "support.text"}
              _hover={{
                color: "blue.600",
                textDecoration: "none",
              }}
            >
              Tickets
            </Link>

            {user.role === "customer" && (
              <Link
                as={RouterLink}
                to="/create"
                fontSize="sm"
                fontWeight={isActive("/create") ? "700" : "500"}
                color={isActive("/create") ? "blue.600" : "support.text"}
                _hover={{
                  color: "blue.600",
                  textDecoration: "none",
                }}
              >
                Create Ticket
              </Link>
            )}
          </HStack>

          {/* Desktop user section */}
          <HStack gap={6} display={{ base: "none", sm: "flex" }}>
            <ColorModeButton />

            <Box textAlign="right">
              <Text fontSize="sm" fontWeight="600" color="support.text">
                {user.firstName}
              </Text>

              <Text
                fontSize="xs"
                color="support.muted"
                textTransform="capitalize"
              >
                {user.role}
              </Text>
            </Box>

            <LogoutButton />
          </HStack>

          {/* Mobile menu button */}
          <IconButton
            display={{ base: "flex", md: "none" }}
            variant="outline"
            aria-label="Open navigation menu"
            onClick={() => setOpen(true)}
          >
            ☰
          </IconButton>
        </Flex>
      </Container>

      {/* Mobile drawer */}
      <Drawer.Root
        open={open}
        onOpenChange={(details) => setOpen(details.open)}
        placement="end"
      >
        <Portal>
          <Drawer.Backdrop />

          <Drawer.Positioner>
            <Drawer.Content
              bg="support.surface"
              color="support.text"
              borderLeft="1px solid"
              borderColor="support.border"
            >
              <Drawer.Header>
                <Drawer.Title color="support.text">SupportDesk</Drawer.Title>

                <Drawer.CloseTrigger asChild>
                  <CloseButton />
                </Drawer.CloseTrigger>
              </Drawer.Header>

              <Drawer.Body>
                <Stack gap={2}>
                  <Link
                    as={RouterLink}
                    to="/"
                    px={3}
                    py={3}
                    borderRadius="md"
                    bg={isActive("/") ? "blue.50" : "transparent"}
                    color={isActive("/") ? "blue.600" : "support.text"}
                    fontWeight={isActive("/") ? "700" : "500"}
                    _hover={{
                      bg: "blue.50",
                      color: "blue.600",
                      textDecoration: "none",
                    }}
                    onClick={closeMenu}
                  >
                    Home
                  </Link>

                  <Link
                    as={RouterLink}
                    to="/tickets"
                    px={3}
                    py={3}
                    borderRadius="md"
                    bg={isActive("/tickets") ? "blue.50" : "transparent"}
                    color={isActive("/tickets") ? "blue.600" : "support.text"}
                    fontWeight={isActive("/tickets") ? "700" : "500"}
                    _hover={{
                      bg: "blue.50",
                      color: "blue.600",
                      textDecoration: "none",
                    }}
                    onClick={closeMenu}
                  >
                    Tickets
                  </Link>

                  {user.role === "customer" && (
                    <Link
                      as={RouterLink}
                      to="/create"
                      px={3}
                      py={3}
                      borderRadius="md"
                      bg={isActive("/create") ? "blue.50" : "transparent"}
                      color={isActive("/create") ? "blue.600" : "support.text"}
                      fontWeight={isActive("/create") ? "700" : "500"}
                      _hover={{
                        bg: "blue.50",
                        color: "blue.600",
                        textDecoration: "none",
                      }}
                      onClick={closeMenu}
                    >
                      Create Ticket
                    </Link>
                  )}
                </Stack>

                {/* Mobile theme toggle */}
                <Box
                  mt={6}
                  pt={6}
                  borderTop="1px solid"
                  borderColor="support.border"
                >
                  <HStack justify="space-between">
                    <Text color="support.text" fontSize="sm">
                      Theme
                    </Text>

                    <ColorModeButton />
                  </HStack>
                </Box>

                {/* Mobile user information */}
                <Box
                  mt={8}
                  pt={6}
                  borderTop="1px solid"
                  borderColor="support.border"
                >
                  <Text fontWeight="600" color="support.text">
                    {user.firstName}
                  </Text>

                  <Text
                    fontSize="sm"
                    color="support.muted"
                    textTransform="capitalize"
                    mb={4}
                  >
                    {user.role}
                  </Text>

                  <LogoutButton />
                </Box>
              </Drawer.Body>
            </Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      </Drawer.Root>
    </Box>
  );
};
