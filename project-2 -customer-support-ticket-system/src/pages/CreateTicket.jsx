import React, { useState } from "react";
import { TicketForm } from "../components/TicketForm";
import { useNavigate } from "react-router-dom";

export const INITIAL_FORM_STATE  = {
  title: "",
  description: "",
  status: "open",
  priority: 1,
  createdBy: "",
};

export const CreateTickets = () => {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE );
  const navigate=useNavigate();
  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name === "priority") {
      value = Number(value);
    }
    // console.log(name, value);
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTicket = {
      ...formData,
      createdAt: new Date().toISOString(),
      id: Date.now(),
    };
    setFormData(INITIAL_FORM_STATE );
  //  console.log(newTicket);
    navigate('/tickets');
  };
  return (
    <TicketForm
    heading="Create Ticket"
      formData={formData}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
    />
  );
};
