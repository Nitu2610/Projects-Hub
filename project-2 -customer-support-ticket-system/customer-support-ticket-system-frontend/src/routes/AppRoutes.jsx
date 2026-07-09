import React from "react";
import { Route, Routes } from "react-router-dom";
import { Home } from "../pages/Home";
import { Tickets } from "../pages/Tickets";
import { TicketDetails } from "../pages/TicketDetails";
import { CreateTickets } from "../pages/CreateTicket";
import { EditTicket } from "../pages/EditTicket";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/tickets" element={<Tickets />} />
      <Route path="/tickets/:id" element={<TicketDetails />} />
      <Route path="/tickets/:id/edit" element={<EditTicket />} />

      <Route path="/create" element={<CreateTickets />} />
    </Routes>
  );
};
