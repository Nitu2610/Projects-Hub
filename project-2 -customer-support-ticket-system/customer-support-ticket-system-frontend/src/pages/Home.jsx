import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useTickets } from "../customHooks/useTickets";
import { Button, Heading, Text } from "@chakra-ui/react";
import { Tickets } from "./Tickets";
import { LogoutButton } from "../components/LogoutButton";

//Home page:
// Responsible for displaying the authenticated user's ticket overview
// and providing the main action to create a new ticket.
//
// Data flow:
// AuthContext ➡️ user/authentication state
// useTickets ➡️ ticket state

export const Home = () => {
  // Get ticket data and request status from the ticket context.
  const { ticketsData, loading, error } = useTickets();
  const navigate = useNavigate();

  const { isAuthenticated, user } = useContext(AuthContext);

  if (loading) return <Heading>Loading</Heading>;
  if (error) return <Heading>{error}</Heading>;
  return (
    <>
      <Heading>Home Page</Heading>
      <Text>
        {" "}
        Welcome back, {user.firstName} as {user.role}{" "}
      </Text>
      <LogoutButton />
      <Button onClick={() => navigate("/create")}>Create Ticket</Button>
      <Tickets />
    </>
  );
};
