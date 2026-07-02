import React from "react";
import { Route, Routes } from "react-router-dom";
import { Home } from "../pages/Home";
import { Tickets } from "../pages/Tickets";
import { TicketDetails } from "../pages/TicketDetails";
import { CreateTickets } from "../pages/CreateTicket";
import { EditTicket } from "../pages/EditTicket";

export const AppRoutes = ({ticketsData, setTicketsData }) => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/tickets" element={<Tickets  
      ticketsData={ticketsData} setTicketsData={setTicketsData} />} />
      <Route path="/tickets/:id" element={<TicketDetails 
      ticketsData={ticketsData} setTicketsData={setTicketsData}  />} />
      <Route path="/tickets/:id/edit" element={<EditTicket
      ticketsData={ticketsData} setTicketsData={setTicketsData}   />} />

      <Route path="/create" element={<CreateTickets
       setTicketsData={setTicketsData}  />} />
    </Routes>
  );
};
