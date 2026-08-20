import { useContext, useState } from "react";
import { TicketForm } from "../components/TicketForm";
import { useNavigate } from "react-router-dom";
import { useForm } from "../customHooks/useForm";
import { ticketApi } from "../api/ticketApi";
import { Text } from "@chakra-ui/react";
import { TicketsContext } from "../context/TicketsContext";
import { useTickets } from "../customHooks/useTickets";

export const INITIAL_FORM_STATE = {
  title: "",
  description: "",
  priority: "Low",
  issueOccurredAt: "",
};

// CreateTicket Page:
// Create a new ticket and return to the ticket list after submission.
//
// Data flow:
// TicketForm ➡️ useForm ➡️ CreateTicket ➡️ ticketApi ➡️ Backend
//
// After a successful creation, the ticket list is refreshed
// and the user is redirected to the home page.

export const CreateTicket = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { fetchTickets } = useTickets();

  const handleCreateTicket = async (updatedData) => {
    // Perform basic client-side validation before making the API request.
    // This provides immediate feedbak without waiting for the backend.
    if (!updatedData.title.trim() || !updatedData.description.trim()) {
      setError("Title and description are required, it can't be empty.");
      return;
    }

    // Prepare the data in the format expected by the backend.
    // datetime-local valures do not contain timezone information,
    // so convert the selected data/time to an ISO UTC string.
    const payload = {
      ...updatedData,
      issueOccurredAt: new Date(updatedData.issueOccurredAt).toISOString(),
    };
    try {
      const response = await ticketApi.createTicket(payload);

      // Refresh the shared ticket list to the newlycreated ticket
      // is available when the user retuns to the ticket list.
      await fetchTickets();

      navigate("/");
    } catch (err) {
      // Validation errors returned by express-validator are stored
      // as an array and displayed together to the user.
      const backendErrors = err.response?.data?.data?.errors;

      if (backendErrors) {
        setError(backendErrors.map((err) => err.msg).join("\n"));
      } else {
        // Use the backend error message when available.
        // Otherwise, show a general error message.
        setError(err.response?.data?.message || "Unable to create ticket.");
      }
    }
  };

  // useForm manages form values and input events.
  // This components only handles what should happpen when the form
  // is submitted.
  const { formData, setFormData, handleChange, handleSubmit } = useForm(
    INITIAL_FORM_STATE,
    handleCreateTicket,
  );

  return (
    <>
      {/* Display validation or API errors above the form. */}
      {error && (
        <Text color="red.500" whiteSpace="pre-line">
          {error}
        </Text>
      )}
      {/* TicketForm is responsible only for rendering the form UI. */}
      <TicketForm
        heading="Create Ticket"
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
      />
    </>
  );
};
