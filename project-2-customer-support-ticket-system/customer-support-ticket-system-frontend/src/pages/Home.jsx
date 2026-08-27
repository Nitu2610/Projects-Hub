import { Box, Button, Container, Heading, Text } from "@chakra-ui/react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Tickets } from "./Tickets";
import { AdminDashboard } from "./AdminDashboard";

//Home page:
// Responsible for displaying the authenticated user's ticket overview
// and providing the main action to create a new ticket.
//
// Data flow:
// AuthContext ➡️ user/authentication state
// useTickets ➡️ ticket state

export const Home = () => {
  const navigate = useNavigate();

  const { user } = useContext(AuthContext);

  if (user.role === "admin") {
    return (
      <Box
        minH="calc(100vh - 64px)"
        bg="support.background"
        py={{ base: 6, md: 10 }}
      >
        <AdminDashboard />
      </Box>
    );
  }

  return (
    <Box
      minH="calc(100vh - 64px)"
      bg="support.background"
      py={{ base: 6, md: 10 }}
    >
      <Container maxW="1200px">
        {/* Welcome section */}
        <Box mb={{ base: 6, md: 8 }}>
          <Heading size={{ base: "xl", md: "2xl" }} color="support.text">
            Welcome back, {user.firstName} 👋
          </Heading>

          <Text
            mt={2}
            color="support.muted"
            fontSize={{ base: "sm", md: "md" }}
          >
            Here's an overview of your support tickets.
          </Text>
        </Box>

        {/* Customer action section */}
        {user.role === "customer" && (
          <Box
            bg="blue.600"
            color="white"
            borderRadius="xl"
            p={{ base: 5, md: 8 }}
            mb={{ base: 8, md: 10 }}
          >
            <Heading size={{ base: "md", md: "lg" }} mb={2}>
              Need help with something?
            </Heading>

            <Text
              fontSize={{ base: "sm", md: "md" }}
              opacity="0.9"
              maxW="600px"
              mb={5}
            >
              Create a support ticket and provide the details of your issue. Our
              support team will help you resolve it.
            </Text>

            <Button
              bg="support.surface"
              color="blue.600"
              size={{ base: "md", md: "lg" }}
              onClick={() => navigate("/create")}
              _hover={{
                bg: "gray.100",
              }}
            >
              Create Ticket
            </Button>
          </Box>
        )}

        {/* Tickets section */}
        <Box>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={5}
            flexWrap="wrap"
            gap={3}
          >
            <Box>
              <Heading size={{ base: "lg", md: "xl" }} color="support.text">
                {user.role === "customer" ? "Your Tickets" : "Assigned Tickets"}
              </Heading>

              <Text mt={1} fontSize="sm" color="support.muted">
                Track and manage your support requests.
              </Text>
            </Box>

            <Button
              variant="outline"
              colorPalette="blue"
              onClick={() => navigate("/tickets")}
            >
              View All Tickets
            </Button>
          </Box>

          <Tickets />
        </Box>
      </Container>
    </Box>
  );
};
