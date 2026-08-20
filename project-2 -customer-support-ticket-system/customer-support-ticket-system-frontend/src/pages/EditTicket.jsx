import { TicketForm } from "../components/TicketForm";
import { useNavigate, useParams } from "react-router-dom";
import { Heading } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { ticketApi } from "../api/ticketApi";
import { AuthContext } from "../context/AuthContext";

// EditTicket page:
// Responsibility for loading an existing ticket, managing its edited state,
// preparing the update payload, and submitting the changes to the backend.
//
// Data flow:
// Route parameter ➡️ EditTicket ➡️ ticketApi ➡️ Backend
//                        ⬇️
//                    TicketForm
//
// TicketForm is responsible for the form UI.
// This page is responsible for the editing workflow and API communication.

export const EditTicket = () => {
  const { ticketId } = useParams();

  const [ticket, setTicket] = useState(null);
  const [editedData, setEditedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Get the current user's role to determine which fields
  // can be included in the update request.
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const response = await ticketApi.getTicketById(ticketId);
        setTicket(response.data);
        setEditedData(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Unable to fetch ticket.");
      } finally {
        setLoading(false);
      }
    };
    fetchTicket();
  }, [ticketId]);

  if (loading) return <Heading>Loading...</Heading>;
  if (error) return <Heading>{error}</Heading>;
  if (!ticket) return <Heading>Ticket not found.</Heading>;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let updateData;

    // Agents can update ticket workflow fields,
    // but cannot change the original ticket or description.
    if (user.role === "agent") {
      updateData = {
        status: editedData.status,
        priority: editedData.priority,
        resolution: editedData.resolution,
      };
    }
    // Agent have permission to update both ticket details
    // and workflow-related fields.
    if (user.role === "admin") {
      updateData = {
        title: editedData.title,
        description: editedData.description,
        status: editedData.status,
        priority: editedData.priority,
        resolution: editedData.resolution,
      };
    }
    try {
      const response = await ticketApi.updateTicket(ticketId, updateData);

      navigate(`/tickets/${ticketId}`);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update ticket.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TicketForm
        heading="Edit Ticket"
        formData={editedData}
        handleSubmit={handleSubmit}
        handleChange={handleChange}
        mode="edit"
        role={user.role}
      />
    </>
  );
};
