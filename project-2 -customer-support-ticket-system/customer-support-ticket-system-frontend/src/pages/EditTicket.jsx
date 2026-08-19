import React, { useState } from "react";
import { TicketForm } from "../components/TicketForm";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { INITIAL_FORM_STATE } from "./CreateTicket";
import { Heading } from "@chakra-ui/react";
import { useTickets } from "../customHooks/useTickets";
import { useTicketById } from "../customHooks/useTicketById";

export const EditTicket = () => {
  const { ticketsData, setTicketsData } = useTickets();
  const { urlId, ticketDetailsWithId } = useTicketById();
    let navigate = useNavigate();
  if (!ticketDetailsWithId) return <Heading>Ticket not found</Heading>;
  
  // Now update the data, if there is no data present.
  // Keep the selected ticket data seperate while the user edits the form.
  const [editedData, setEditedData] = useState(ticketDetailsWithId);

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name === "priority") {
      value = Number(value);
    }
    // console.log(name, value);
    setEditedData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Update the matching ticket and return to its details page.
  const handleSubmit = (e) => {
    e.preventDefault();
    const editedTicket = {
      ...editedData,
      editedAt: new Date().toISOString(),
    };
    const updatedData = ticketsData.map((item) => {
      let { id: defaultId } = item;
      if (defaultId === urlId) {
        //  console.log(item)
        return { ...item, ...editedTicket };
      }

      return item;
    });
    setTicketsData(updatedData);

    alert("Edit is successfull");
    navigate(`/tickets/${urlId}`);
  };

  if (!editedData) {
    return <Heading>Loading...</Heading>;
  }
  return (
    <>
      <TicketForm
        heading="Edit Ticket"
        formData={editedData}
        handleSubmit={handleSubmit}
        handleChange={handleChange}
      />
    </>
  );
};
