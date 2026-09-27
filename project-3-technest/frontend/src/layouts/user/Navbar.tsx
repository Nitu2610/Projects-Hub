import {
  Box,
  Button,
  Drawer,
  Flex,
  HStack,
  IconButton,
  Menu,
  Portal,
  Text,
  VStack,
} from "@chakra-ui/react";
import {
  FiChevronDown,
  FiLogOut,
  FiMenu,
  FiPackage,
  FiShoppingCart,
  FiUser,
  FiX,
} from "react-icons/fi";
import { NavLink, useNavigate } from "react-router-dom";
import { useUserLogoutMutation } from "../../features/auth/api/authApi";
import { useGetUserProfileQuery } from "../../features/customers/api/customerApi";
import { ColorModeButton } from "../../components/ui/color-mode";
import { apiSlice } from "../../redux/api/apiSlice";
import { useDispatch } from "react-redux";

export const Navbar = () => {
  const navigate = useNavigate();

  const { data: profileData } = useGetUserProfileQuery();
  const user = profileData?.data;
  const isAuthenticated = !!user;

  const isAdmin = user?.role === "admin";

  const dispatch = useDispatch();

  const [userLogout, { isLoading: isLoggingOut }] = useUserLogoutMutation();

  const handleLogout = async () => {
    try {
      await userLogout().unwrap();

      dispatch(apiSlice.util.resetApiState());

      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const navLinkStyle = ({ isActive }: { isActive: boolean }) => ({
    color: isActive ? "primary" : "fg",
    backgroundColor: isActive ? "bg.muted" : "transparent",
    fontWeight: isActive ? "600" : "400",
    borderRadius: "md",
    padding: "8px 12px",
    transition: "all 0.2s ease",
  });

  return (
    <Box
      as="nav"
      position="sticky"
      top="0"
      zIndex="1000"
      bg="bg"
      borderBottomWidth="1px"
      borderColor="border"
    >
      <Flex
        maxW="1400px"
        mx="auto"
        align="center"
        justify="space-between"
        gap={4}
        px={{ base: 4, md: 8 }}
        py={3}
      >
        {/* Logo */}
        <Text
          fontSize={{ base: "xl", md: "2xl" }}
          fontWeight="bold"
          color="primary"
          cursor="pointer"
          onClick={() => navigate(isAdmin ? "/admin/dashboard" : "/")}
          flexShrink={0}
        >
          TechNest
        </Text>

        {/* Desktop Navigation */}
        <HStack gap={1} display={{ base: "none", md: "flex" }} flex={1} ml={6}>
          {isAdmin ? (
            <>
              <NavLink to="/admin/dashboard" style={navLinkStyle}>
                Admin Dashboard
              </NavLink>

              <NavLink to="/products" style={navLinkStyle}>
                Products
              </NavLink>

              <NavLink to="/categories" style={navLinkStyle}>
                Categories
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to="/" style={navLinkStyle}>
                Home
              </NavLink>

              <NavLink to="/products" style={navLinkStyle}>
                Products
              </NavLink>

              <NavLink to="/categories" style={navLinkStyle}>
                Categories
              </NavLink>

              {isAuthenticated && (
                <NavLink to="/orders" style={navLinkStyle}>
                  Orders
                </NavLink>
              )}
            </>
          )}
        </HStack>

        {/* Desktop Actions */}
        <HStack gap={2} display={{ base: "none", md: "flex" }} flexShrink={0}>
          <ColorModeButton />

          {isAuthenticated ? (
            <>
              {!isAdmin && (
                <IconButton
                  aria-label="Shopping cart"
                  variant="ghost"
                  onClick={() => navigate("/cart")}
                >
                  <FiShoppingCart />
                </IconButton>
              )}

              <Menu.Root>
                <Menu.Trigger asChild>
                  <Button variant="ghost">
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

                      {!isAdmin && (
                        <Menu.Item
                          value="addresses"
                          onClick={() => navigate("/addresses")}
                        >
                          <FiUser />
                          My Addresses
                        </Menu.Item>
                      )}

                      <Menu.Separator />

                      <Menu.Item
                        value="logout"
                        disabled={isLoggingOut}
                        onClick={handleLogout}
                      >
                        <FiLogOut />
                        {isLoggingOut ? "Logging out..." : "Logout"}
                      </Menu.Item>
                    </Menu.Content>
                  </Menu.Positioner>
                </Portal>
              </Menu.Root>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={() => navigate("/login")}>
                Login
              </Button>

              <Button colorPalette="blue" onClick={() => navigate("/register")}>
                Register
              </Button>
            </>
          )}
        </HStack>

        {/* Mobile Navigation */}
        <HStack display={{ base: "flex", md: "none" }} gap={1}>
          <ColorModeButton />

          {isAuthenticated && !isAdmin && (
            <IconButton
              aria-label="Shopping cart"
              variant="ghost"
              onClick={() => navigate("/cart")}
            >
              <FiShoppingCart />
            </IconButton>
          )}

          <Drawer.Root>
            <Drawer.Trigger asChild>
              <IconButton aria-label="Open navigation menu" variant="ghost">
                <FiMenu />
              </IconButton>
            </Drawer.Trigger>

            <Portal>
              <Drawer.Backdrop />

              <Drawer.Positioner>
                <Drawer.Content>
                  <Drawer.Header>
                    <Flex align="center" justify="space-between" width="100%">
                      <Text fontSize="xl" fontWeight="bold" color="primary">
                        TechNest
                      </Text>

                      <Drawer.CloseTrigger asChild>
                        <IconButton
                          aria-label="Close navigation menu"
                          variant="ghost"
                        >
                          <FiX />
                        </IconButton>
                      </Drawer.CloseTrigger>
                    </Flex>
                  </Drawer.Header>

                  <Drawer.Body>
                    <VStack align="stretch" gap={2}>
                      {isAdmin ? (
                        <>
                          <Drawer.CloseTrigger asChild>
                            <Button
                              variant="ghost"
                              justifyContent="flex-start"
                              onClick={() => navigate("/admin/dashboard")}
                            >
                              Admin Dashboard
                            </Button>
                          </Drawer.CloseTrigger>

                          <Drawer.CloseTrigger asChild>
                            <Button
                              variant="ghost"
                              justifyContent="flex-start"
                              onClick={() => navigate("/products")}
                            >
                              Products
                            </Button>
                          </Drawer.CloseTrigger>

                          <Drawer.CloseTrigger asChild>
                            <Button
                              variant="ghost"
                              justifyContent="flex-start"
                              onClick={() => navigate("/categories")}
                            >
                              Categories
                            </Button>
                          </Drawer.CloseTrigger>

                          <Box
                            borderTopWidth="1px"
                            borderColor="border"
                            my={2}
                          />

                          <Drawer.CloseTrigger asChild>
                            <Button
                              variant="ghost"
                              justifyContent="flex-start"
                              onClick={() => navigate("/profile")}
                            >
                              <FiUser />
                              Profile
                            </Button>
                          </Drawer.CloseTrigger>

                          <Button
                            onClick={handleLogout}
                            disabled={isLoggingOut}
                          >
                            {isLoggingOut ? "Logging out..." : "Logout"}
                          </Button>
                        </>
                      ) : (
                        <>
                          <Drawer.CloseTrigger asChild>
                            <Button
                              variant="ghost"
                              justifyContent="flex-start"
                              onClick={() => navigate("/")}
                            >
                              Home
                            </Button>
                          </Drawer.CloseTrigger>

                          <Drawer.CloseTrigger asChild>
                            <Button
                              variant="ghost"
                              justifyContent="flex-start"
                              onClick={() => navigate("/products")}
                            >
                              Products
                            </Button>
                          </Drawer.CloseTrigger>

                          <Drawer.CloseTrigger asChild>
                            <Button
                              variant="ghost"
                              justifyContent="flex-start"
                              onClick={() => navigate("/categories")}
                            >
                              Categories
                            </Button>
                          </Drawer.CloseTrigger>

                          {isAuthenticated ? (
                            <>
                              <Drawer.CloseTrigger asChild>
                                <Button
                                  variant="ghost"
                                  justifyContent="flex-start"
                                  onClick={() => navigate("/orders")}
                                >
                                  <FiPackage />
                                  Orders
                                </Button>
                              </Drawer.CloseTrigger>

                              <Drawer.CloseTrigger asChild>
                                <Button
                                  variant="ghost"
                                  justifyContent="flex-start"
                                  onClick={() => navigate("/profile")}
                                >
                                  <FiUser />
                                  Profile
                                </Button>
                              </Drawer.CloseTrigger>

                              <Drawer.CloseTrigger asChild>
                                <Button
                                  variant="ghost"
                                  justifyContent="flex-start"
                                  onClick={() => navigate("/addresses")}
                                >
                                  <FiUser />
                                  My Addresses
                                </Button>
                              </Drawer.CloseTrigger>

                              <Box
                                borderTopWidth="1px"
                                borderColor="border"
                                my={2}
                              />

                              <Button
                                onClick={handleLogout}
                                disabled={isLoggingOut}
                              >
                                {isLoggingOut ? "Logging out..." : "Logout"}
                              </Button>
                            </>
                          ) : (
                            <>
                              <Box
                                borderTopWidth="1px"
                                borderColor="border"
                                my={2}
                              />

                              <Button
                                variant="outline"
                                onClick={() => navigate("/login")}
                              >
                                Login
                              </Button>

                              <Button
                                colorPalette="blue"
                                onClick={() => navigate("/register")}
                              >
                                Register
                              </Button>
                            </>
                          )}
                        </>
                      )}
                    </VStack>
                  </Drawer.Body>
                </Drawer.Content>
              </Drawer.Positioner>
            </Portal>
          </Drawer.Root>
        </HStack>
      </Flex>
    </Box>
  );
};
