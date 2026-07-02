import React, { useContext, useEffect, useState } from "react";
import { TicketForm } from "../components/TicketForm";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { INITIAL_FORM_STATE } from "./CreateTicket";
import { Heading } from "@chakra-ui/react";
import { TicketsContext } from "../context/TicketsContext";

export const EditTicket = () => {
    const { ticketsData, setTicketsData } =useContext(TicketsContext)
  const { id:editId } = useParams(); // grab the id from url
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
    const updatedData = ticketsData.map((item) => {
      let { id: defaultId } = item;
      if (defaultId === +editId) {
        //  console.log(item)
        return { ...item, ...editedTicket };
      }

      return item;
    });
    setTicketsData(updatedData);

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

