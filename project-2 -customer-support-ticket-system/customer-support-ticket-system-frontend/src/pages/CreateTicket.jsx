import { useState } from "react";
import { TicketForm } from "../components/TicketForm";
import { useNavigate } from "react-router-dom";
import { useForm } from "../customHooks/useForm";
import { ticketApi } from "../api/ticketApi";
import { Text } from "@chakra-ui/react";

import { useTickets } from "../customHooks/useTickets";
import { toaster } from "../components/ui/toaster";
import { Loading } from "../components/Loading";

// CreateTicket:
// Owns ticket-creation business logic, API communication,
// error handling, shared-data refresh, and navigation.
//
// Form flow:
//
// CreateTicket
//      ↓
//    useForm
//      ↓
//  TicketForm
//
// CreateTicket = business logic
// useForm      = reusable form state
// TicketForm   = form UI
//
// CreateTicket, useForm, and TicketForm are intentionally separated
// but work together through formData, handleChange, and handleSubmit.

export const CreateTicket = () => {
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { fetchTickets } = useTickets();

  const INITIAL_FORM_STATE = {
  title: "",
  description: "",
  priority: "",
  issueOccurredAt: "",
};

  const handleCreateTicket = async (updatedData) => {
    // Receives the current form data from useForm.
    // Handles ticket-specific validation and API communication.

    // Basic client-side validation for immediate user feedback.
    if (!updatedData.title.trim() || !updatedData.description.trim()) {
      setError("Title and description are required, it can't be empty.");
      return;
    }

    // Prepare the data in the format expected by the backend.
    // datetime-local valures do not contain timezone information,
    // so convert the selected data/time to an ISO UTC string.
    try {
      setCreating(true);

      // Backend remains the final authority for validation and authorization.
      await ticketApi.createTicket(updatedData);

      // Notify the user after the ticket is successfully created.
      toaster.create({
        title: "Ticket Created",
        description: "Ticket created successfully.",
        type: "success",
      });

      // Refresh shared ticket data after successful creation.
      await fetchTickets();

      navigate("/");
    } catch (err) {
      // Extract field-level validation errors returned by Express-validator.
      const backendErrors = err.response?.data?.data?.errors;

      if (backendErrors) {
        setError(backendErrors.map((err) => err.msg).join("\n"));
      } else {
        // Use the server message or a generic fallback.
        setError(err.response?.data?.message || "Unable to create ticket.");
      }
    } finally {
      // Always stop the loading state whether the request succeeds or fails.
      setCreating(false);
    }
  };



  // useForm:
  // Reusable hook for managing form state and submission.
  //
  // It is intentionally unaware of the business purpose of the form.
  // It does not know whether the form creates a ticket, edits a ticket,
  // or belongs to another feature.
  //
  // Responsibilities:
  // 1. Store form data.
  // 2. Update the changed field.
  // 3. Prevent browser form submission.
  // 4. Pass the current form data to the component's submit callback.
  //
  // The parent component provides:
  // - Submission/business logic
  //
  // This allows CreateTicket and EditTicket to reuse the same form logic.

  const { formData, handleChange, handleSubmit } = useForm(INITIAL_FORM_STATE, handleCreateTicket);

   const isFormValid =
      formData.title.trim() &&
      formData.description.trim() &&
      formData.priority &&
      formData.issueOccurredAt;

  if (creating) return <Loading />;

  // TicketForm:
  // Reusable presentation component shared by CreateTicket and EditTicket.
  //
  // Responsibilities:
  // - Render the appropriate fields.
  // - Display form values.
  // - Forward input changes.
  // - Submit the form.
  //
  // It does not:
  // - Call APIs.
  // - Manage ticket data.
  // - Contain ticket business logic.
  //
  // Field visibility depends on:
  // mode → create/edit
  // role → customer/agent/admin
  //
  // Data flow:
  //
  // Parent
  //   ↓
  // TicketForm
  //   ↓
  // user input
  //   ↓
  // handleChange
  //   ↓
  // useForm
  //   ↓
  // formData

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
        loading={creating}
        isFormValid={isFormValid}
      />
    </>
  );
};
