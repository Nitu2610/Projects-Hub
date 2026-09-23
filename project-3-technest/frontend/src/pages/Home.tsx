import { Box, Button, Heading, Stack, Text } from "@chakra-ui/react";
import { Link, Navigate } from "react-router-dom";
import { useGetUserProfileQuery } from "../redux/api/authApi";

export const Home = () => {
  const {
    data: userData,
    isLoading,
    isError,
    error,
  } = useGetUserProfileQuery();
  const userName = userData?.data?.fullName;
  const role = userData?.data?.role;

  if (isLoading) return <Heading>Loading ....</Heading>;
  if (isError)
    return (
      <Heading>
        {"data" in error &&
        typeof error.data === "object" &&
        error.data !== null
          ? "message" in error.data && typeof error.data.message === "string"
            ? error.data.message
            : "Something went wrong."
          : "Something went wrong."}
      </Heading>
    );
  return role === "admin" ? (
    <Navigate to="/admin/dashboard" replace />
  ) : (
    <Box p={6}>
      <Box mb={8}>
        <Heading>Welcome to TechNest, {userName} </Heading>

        <Text mt={2} color="gray.500">
          Explore our latest electronics and manage your orders.
        </Text>
      </Box>

      <Stack direction={{ base: "column", sm: "row" }} gap={4}>
        <Link to="/products">
          <Button>Browse Products</Button>
        </Link>

        <Link to="/orders">
          <Button variant="outline">My Orders</Button>
        </Link>

        <Link to="/profile">
          <Button variant="outline">My Profile</Button>
        </Link>
      </Stack>
    </Box>
  );
};
