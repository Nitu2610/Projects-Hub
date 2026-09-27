import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Link, Navigate } from "react-router-dom";
import { useGetUserProfileQuery } from "../api/customerApi";

export const Home = () => {
  const { data: userData, isLoading } = useGetUserProfileQuery();

  const userName = userData?.data?.fullName;
  const role = userData?.data?.role;

  // Admin users should enter the admin application.
  if (!isLoading && role === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const isLoggedIn = !!userData?.data;

  return (
    <Box bg="bg" minH="calc(100vh - 80px)">
      {/* Hero */}
      <Box py={{ base: 14, md: 20 }}>
        <Container maxW="1200px">
          <Flex
            direction="column"
            align="center"
            textAlign="center"
            gap={5}
          >
            <Text
              color="blue.600"
              fontWeight="600"
              fontSize="sm"
              textTransform="uppercase"
              letterSpacing="wide"
            >
              Your Technology Store
            </Text>

            <Heading
              as="h1"
              fontSize={{ base: "3xl", md: "5xl" }}
              lineHeight="1.15"
              maxW="800px"
            >
              {isLoggedIn
                ? `Welcome back, ${userName}`
                : "Everything you need, all in one place."}
            </Heading>

            <Text
              color="fg.muted"
              fontSize={{ base: "md", md: "lg" }}
              maxW="650px"
              lineHeight="1.7"
            >
              Explore electronics, gadgets, and everyday technology
              designed to make your life easier.
            </Text>

            <Stack
              direction={{ base: "column", sm: "row" }}
              gap={3}
              mt={3}
              width={{ base: "100%", sm: "auto" }}
            >
              <Link to="/products">
                <Button
                  colorPalette="blue"
                  size="lg"
                  width={{ base: "100%", sm: "auto" }}
                >
                  Browse Products
                </Button>
              </Link>

              {isLoggedIn ? (
                <Link to="/orders">
                  <Button
                    variant="outline"
                    size="lg"
                    width={{ base: "100%", sm: "auto" }}
                  >
                    My Orders
                  </Button>
                </Link>
              ) : (
                <Link to="/register">
                  <Button
                    variant="outline"
                    size="lg"
                    width={{ base: "100%", sm: "auto" }}
                  >
                    Create Account
                  </Button>
                </Link>
              )}
            </Stack>
          </Flex>
        </Container>
      </Box>

      {/* Quick navigation */}
      <Box pb={{ base: 14, md: 20 }}>
        <Container maxW="1200px">
          <SimpleGrid
            columns={{ base: 1, md: 3 }}
            gap={5}
          >
            <Box
              p={6}
              bg="bg.panel"
              borderWidth="1px"
              borderColor="border"
              borderRadius="xl"
              transition="all 0.2s"
              _hover={{
                transform: "translateY(-3px)",
                boxShadow: "md",
              }}
            >
              <Heading size="md" mb={2}>
                Browse Products
              </Heading>

              <Text color="fg.muted" fontSize="sm" mb={4}>
                Explore our collection of electronics and
                technology products.
              </Text>

              <Link to="/products">
                <Button variant="ghost" px={0}>
                  View Products →
                </Button>
              </Link>
            </Box>

            <Box
              p={6}
              bg="bg.panel"
              borderWidth="1px"
              borderColor="border"
              borderRadius="xl"
              transition="all 0.2s"
              _hover={{
                transform: "translateY(-3px)",
                boxShadow: "md",
              }}
            >
              <Heading size="md" mb={2}>
                Shop by Category
              </Heading>

              <Text color="fg.muted" fontSize="sm" mb={4}>
                Find the right products quickly by exploring
                categories.
              </Text>

              <Link to="/categories">
                <Button variant="ghost" px={0}>
                  View Categories →
                </Button>
              </Link>
            </Box>

            <Box
              p={6}
              bg="bg.panel"
              borderWidth="1px"
              borderColor="border"
              borderRadius="xl"
              transition="all 0.2s"
              _hover={{
                transform: "translateY(-3px)",
                boxShadow: "md",
              }}
            >
              <Heading size="md" mb={2}>
                {isLoggedIn ? "Manage Your Account" : "Join TechNest"}
              </Heading>

              <Text color="fg.muted" fontSize="sm" mb={4}>
                {isLoggedIn
                  ? "View your profile, addresses, and previous orders."
                  : "Create an account to manage orders, addresses, and checkout."}
              </Text>

              <Link
                to={isLoggedIn ? "/profile" : "/register"}
              >
                <Button variant="ghost" px={0}>
                  {isLoggedIn ? "View Profile →" : "Register →"}
                </Button>
              </Link>
            </Box>
          </SimpleGrid>
        </Container>
      </Box>
    </Box>
  );
};