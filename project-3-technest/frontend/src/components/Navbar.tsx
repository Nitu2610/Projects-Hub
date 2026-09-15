
import {
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Menu,
  Portal,
  Text,
} from "@chakra-ui/react";
import {
  FiChevronDown,
  FiLogOut,
  FiPackage,
  FiSearch,
  FiShoppingCart,
  FiUser,
} from "react-icons/fi";
import { NavLink, useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../redux/api/authApi";


export const Navbar = () => {
  const navigate = useNavigate();

  const [logout, { isLoading }] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const navLinkStyle = ({ isActive }: { isActive: boolean }) => ({
    color: isActive ? "blue.600" : "gray.700",
    backgroundColor: isActive ? "blue.50" : "transparent",
    fontWeight: isActive ? "600" : "400",
    borderRadius: "md",
  });

  return (
    <Box
      as="nav"
      position="sticky"
      top="0"
      zIndex="1000"
      bg="gray"
      borderBottomWidth="1px"
      borderColor="gray.200"
      px={{ base: 4, md: 8 }}
      py={3}
    >
      <Flex
        maxW="1400px"
        mx="auto"
        align="center"
        justify="space-between"
        gap={6}
      >
        {/* Brand */}
        <Text
          fontSize="2xl"
          fontWeight="bold"
          color="blue.600"
          cursor="pointer"
          onClick={() => navigate("/")}
        >
          TechNest
        </Text>

        {/* Main Navigation */}
        <HStack
          gap={2}
          display={{ base: "none", md: "flex" }}
        >
          <NavLink to="/" style={navLinkStyle}>
            <Button variant="ghost">
              Home
            </Button>
          </NavLink>

          <NavLink to="/products" style={navLinkStyle}>
            <Button variant="ghost">
              Products
            </Button>
          </NavLink>

          <NavLink to="/categories" style={navLinkStyle}>
            <Button variant="ghost">
              Categories
            </Button>
          </NavLink>

          <NavLink to="/deals" style={navLinkStyle}>
            <Button variant="ghost">
              Deals
            </Button>
          </NavLink>
        </HStack>

        {/* Customer Actions */}
        <HStack gap={2}>
          <IconButton
            aria-label="Search products"
            variant="ghost"
            onClick={() => navigate("/search")}
          >
            <FiSearch />
          </IconButton>

          <IconButton
            aria-label="Shopping cart"
            variant="ghost"
            onClick={() => navigate("/cart")}
          >
            <FiShoppingCart />
          </IconButton>

          <IconButton
            aria-label="My orders"
            variant="ghost"
            onClick={() => navigate("/orders")}
          >
            <FiPackage />
          </IconButton>

          {/* Account Menu */}
          <Menu.Root>
            <Menu.Trigger asChild>
              <Button
                variant="ghost"
                display={{ base: "none", sm: "flex" }}
              >
                <FiUser />
                Account
                <FiChevronDown />
              </Button>
            </Menu.Trigger>

            <Portal>
              <Menu.Positioner>
                <Menu.Content>
                  <Menu.Item
                    value="profile"
                    onClick={() => navigate("/profile")}
                  >
                    <FiUser />
                    My Profile
                  </Menu.Item>

                  <Menu.Item
                    value="orders"
                    onClick={() => navigate("/orders")}
                  >
                    <FiPackage />
                    My Orders
                  </Menu.Item>

                  <Menu.Separator />

                  <Menu.Item
                    value="logout"
                    disabled={isLoading}
                    onClick={handleLogout}
                  >
                    <FiLogOut />
                    {isLoading ? "Logging out..." : "Logout"}
                  </Menu.Item>
                </Menu.Content>
              </Menu.Positioner>
            </Portal>
          </Menu.Root>
        </HStack>
      </Flex>
    </Box>
  );
};