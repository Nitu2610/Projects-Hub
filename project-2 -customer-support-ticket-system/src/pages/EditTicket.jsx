import React, { useEffect, useState } from "react";
import { TicketForm } from "../components/TicketForm";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { ticketsData } from "../data/tickets";
import { INITIAL_FORM_STATE } from "./CreateTicket";

export const EditTicket = () => {
  const { editId } = useParams(); // grab the id from url
  const navigate = useNavigate();

  let foundTicket = ticketsData.find(({ id }) => id === +editId); // fetch the data
  if (!foundTicket) return <Heading>Ticket not found</Heading>;
// Now update the data, so there is no data. 
  const [editedData, setEditedData] = useState(foundTicket);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const editedTicket = {
      ...editedData,
      editedAt: new Date().toISOString(),
    };
    console.log(editedTicket);
    alert("Edit is successfull");
    navigate(`/tickets/${+editId}`);
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

{
  /**
 
  */
}
