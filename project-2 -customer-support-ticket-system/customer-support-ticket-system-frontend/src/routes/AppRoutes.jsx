import { Route, Routes } from "react-router-dom";

import { Home } from "../pages/Home";
import { Tickets } from "../pages/Tickets";
import { TicketDetails } from "../pages/TicketDetails";
import { CreateTicket } from "../pages/CreateTicket";
import { EditTicket } from "../pages/EditTicket";
import { Login } from "../pages/Login";

// Defines the application's route map and connects URL paths
// to their corresponding page-level components.
export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/tickets" element={<Tickets />} />
      <Route path="/tickets/:ticketId" element={<TicketDetails />} />
      <Route path="/tickets/:ticketId/edit" element={<EditTicket />} />

      <Route path="/create" element={<CreateTicket />} />

      <Route path="/login" element={<Login />} />
    </Routes>
  );
};
