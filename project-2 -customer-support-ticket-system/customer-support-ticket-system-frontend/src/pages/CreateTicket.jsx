import React, { useState } from "react";
import { TicketForm } from "../components/TicketForm";
import { useNavigate } from "react-router-dom";
import { useForm } from "../customHooks/useForm";

export const INITIAL_FORM_STATE = {
  title: "",
  description: "",
  status: "open",
  priority: 1,
  createdBy: "",
};

export const CreateTickets = () => {
  const navigate=useNavigate();

  const handleCreateTicket = (updatedData) => {
    const newTicket = {
      ...updatedData,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    };
    console.log(newTicket);
    navigate('/tickets')
  };

  const { formData, setFormData,    handleChange,
    handleSubmit, } = useForm(
    INITIAL_FORM_STATE,
    handleCreateTicket,
  );

  return (
    <TicketForm
      heading="Create Ticket"
      formData={formData}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
    />
  );
};
