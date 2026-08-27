import { TicketForm } from "../components/TicketForm";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { ticketApi } from "../api/ticketApi";
import { AuthContext } from "../context/AuthContext";
import { userApi } from "../api/userApi";
import { Loading } from "../components/Loading";
import { ErrorMessage } from "../components/ErrorMessage";
import { EmptyState } from "../components/EmptyState";
import { useForm } from "../customHooks/useForm";
import { toaster } from "../components/ui/toaster";

/*
EditTicket, useForm, and TicketForm work together:
EditTicket owns ticket-specific data and business logic.
useForm owns reusable form state and submit/change handling.
TicketForm owns only the form UI and input fields.

Data flow:
API ticket data
     ↓
EditTicket → setFormData()
     ↓
useForm → formData
     ↓
TicketForm → displays formData
     ↓
User changes fields
     ↓
TicketForm → handleChange()
     ↓
useForm → updates formData
     ↓
TicketForm → handleSubmit()
     ↓
useForm → handleUpdateTicket(formData)
     ↓
EditTicket → compares data and calls PATCH API
 */

export const EditTicket = () => {
  const { ticketId } = useParams();
  // Keep the original ticket to compare with the edited form data.
  const [ticket, setTicket] = useState(null);

  // Loading state for fetching the ticket.
  const [loading, setLoading] = useState(true);
  // Stores API or page errors.
  const [error, setError] = useState("");
  // Loading state while updating the ticket.
  const [updating, setUpdating] = useState(false);
  // Agent are needed only for admin assignment.
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState("");

  const navigate = useNavigate();
  // Get the logged-in user and their role.
  const { user } = useContext(AuthContext);

  // Fetch the ticket when the page loads.
  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const response = await ticketApi.getTicketById(ticketId);
        // Keep the original server response unchanged.
        // This is later used to detect which fields were modified.
        setTicket(response.data);

        // Load the same server data into useForm so TicketForm
        // can display it as the initial editable form state.
        setFormData(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Unable to fetch ticket.");
      } finally {
        setLoading(false);
      }
    };
    fetchTicket();
  }, [ticketId]);

  // Fetch agents only when the logged-in user is an admin.
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await userApi.getUsers();
        // Only agents can be assigned to a ticket.
        const agentUsers = response.data.filter(
          (user) => user.role === "agent",
        );
        setAgents(agentUsers);
      } catch (err) {
        setError(err.response?.data?.message || "Unable to fetch agents.");
      }
    };

    if (user?.role === "admin") {
      fetchAgents();
    }
  }, [user]);

  /*
Receives the latest form data from useForm,
compares it with the original ticket,
builds a minimal PATCH payload,
and sends the update to the backend.
 */
  const handleUpdateTicket = async (updatedFormData) => {
    // Send only fields that were actually changed.
    let ticketUpdatePayload = {};

    // Capture only the changed data incomparison with originaldata
    for (let [key, value] of Object.entries(updatedFormData)) {
      if (ticket[key] !== value) {
        ticketUpdatePayload[key] = value;
      }
    }
    // Admins can also assign or reassign the ticket.
    if (user.role === "admin" && selectedAgent) {
      ticketUpdatePayload.assignedTo = selectedAgent;
    }

    // Do not call the API if nothing was changed.

    if (Object.keys(ticketUpdatePayload).length === 0) {
      setError("No changes were made.");
      return;
    }

    setError("");

    setUpdating(true);
    try {
      // Update only the changed ticket fields.
      await ticketApi.updateTicket(ticketId, ticketUpdatePayload);

      // Notify the user after the ticket is successfully updated.
      toaster.create({
        title: "Ticket updated",
        description: "Ticket updated successfully.",
        type: "success",
      });

      // Go back to the ticket details after a successful update.
      navigate(`/tickets/${ticketId}`);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update ticket.");
    } finally {
      setUpdating(false);
    }
  };

  /**
useForm is responsible only for generic form behavior:
- storing formData
- updating fields through handleChange
- preventing default form submission
- passing the final formData to submitFn

The parent component remains responsible for business logic,
such as deciding which ticket fields changed and calling the API.
 */
  const { handleChange, handleSubmit, setFormData, formData } = useForm(
    {},
    handleUpdateTicket,
  );

  // Show loading while the ticket is being fetched.
  if (loading) return <Loading />;

  // Show the error and allow the user to go back.
  if (error) {
    return (
      <>
        <ErrorMessage message={error} />
        <Button onClick={() => navigate(`/tickets/${ticketId}`)}>
          Back to Ticket
        </Button>
      </>
    );
  }

  // Do not show the form if no ticket was returned.
  if (!ticket) return <EmptyState />;

  /**
TicketForm is a reusable presentation component.

It does not fetch data or call APIs.
It receives formData and handlers from the parent,
displays fields based on mode and role,
and sends user input back through handleChange/handleSubmit.

EditTicket + useForm + TicketForm work together like this:

EditTicket
  → owns ticket data, role, API calls, update logic

useForm
  → owns generic form state and form events

TicketForm
  → renders the UI and collects user input
   */
  return (
    <>
      <TicketForm
        heading="Edit Ticket"
        formData={formData}
        handleSubmit={handleSubmit}
        handleChange={handleChange}
        mode="edit"
        role={user.role}
        agents={agents}
        selectedAgent={selectedAgent}
        setSelectedAgent={setSelectedAgent}
        loading={updating}
      />
    </>
  );
};
