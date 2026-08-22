import { TicketCard } from "../components/TicketCard";
import { FilterComp } from "../components/FilterComp";
import { filterCompContent } from "../utils/filterCompContent";
import { Input, Container, Heading, Button, Text } from "@chakra-ui/react";
import { useTickets } from "../customHooks/useTickets";
import { useDebounce } from "../customHooks/useDebounce";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { LogoutButton } from "../components/LogoutButton";

// Tickets page:
// Responsible for displaying the user's tickets and providing
// search, filtering, and sorting functionality.
//
// Data flow:
// TicketsContext ➡️ useTickets ➡️ Tickets ➡️ search/filter/sort ➡️ TicketCard
//
// Search, filters, and sorting are kept as local UI state because
// they only affect howo the tickets are displayed.

export const Tickets = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [sortBy, setSortBy] = useState("all");
  const [page, setPage] = useState(1);
  const limit = 5;

  const navigate = useNavigate();

  // Get the tickets managed by the TicketsContext.
  const { ticketsData, loading, error, pagination, fetchTickets } =
    useTickets();

  const { isAuthenticated } = useContext(AuthContext);

  // Delay the search value before applying the filter.
  // This prevents filtering from running on every keystroke.
  // Calling the function twice gives you two independent pieces of state.
  // Debounce the search term so filtering does not run on every keystroke.
  const { debouncedValue } = useDebounce(searchTerm); // thats why we need to pass the state.

  useEffect(() => {
    if (!isAuthenticated) return;

    const params = { page, limit };

    if (debouncedValue.trim()) {
      params.search = debouncedValue.trim();
    }
    if (statusFilter !== "all") {
      params.status = statusFilter;
    }
    if (priorityFilter !== "all") {
      params.priority = priorityFilter;
    }
    if (sortBy !== "all") {
      const [ sortField, sortOrder ] = sortBy.split("-");
      params.sortBy = sortField;
      params.order = sortOrder;
    }
    fetchTickets(params);
  }, [page, debouncedValue, statusFilter, priorityFilter, sortBy]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const handleStatusChange = (value) => {
    setStatusFilter(value);
    setPage(1);
  };

  const handlePriorityChange = (value) => {
    setPriorityFilter(value);
    setPage(1);
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    setPage(1);
  };

  if (isAuthenticated === null)
    return <Heading>Ticket comp Checking authentication...</Heading>;
  if (isAuthenticated === false)
    return <Heading>Ticket comp Please login.</Heading>;
  if (error)
    return (
      <>
        <Heading>Ticket component {error}</Heading>;
      </>
    );
  if (ticketsData.length === 0)
    return (
      <>
        <Heading>Ticket comp No Tickets Availiable.</Heading>
        <Button onClick={() => {
          navigate('/home')
        }}>Back to Ticket</Button>
      </>
    );

  return (
    <>
      <div>Tickets</div>

      <div>
        <Input
          placeholder="Search via title"
          value={searchTerm}
          onChange={handleSearch}
        />
        {loading && <Text>Loading tickets...</Text>}
        <Container
          display="flex"
          justifyContent="center"
          alignContent="center"
          flexWrap="wrap"
        >
          <FilterComp
            heading={"Filter by Status: "}
            value={statusFilter}
            onChange={handleStatusChange}
            content={filterCompContent.filterStatusContent}
          />

          <FilterComp
            heading={"Filter by Priority: "}
            value={priorityFilter}
            onChange={handlePriorityChange}
            content={filterCompContent.filterPriorityContent}
          />

          <FilterComp
            heading={"Sort Tickets: "}
            value={sortBy}
            onChange={handleSortChange}
            content={filterCompContent.filterSortContent}
          />
        </Container>

        {ticketsData &&
          ticketsData.map((ticket) => (
            <TicketCard key={ticket._id} ticket={ticket} />
          ))}
      </div>

      <Container display="flex" justifyContent="center" gap={3} mt={6}>
        <Button
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
        >
          {" "}
          Previous{" "}
        </Button>

        <Text>
          {" "}
          Page {page} of {pagination?.totalPages}{" "}
        </Text>

        <Button
          disabled={page === pagination?.totalPages}
          onClick={() => setPage((prev) => prev + 1)}
        >
          {" "}
          Next{" "}
        </Button>
      </Container>
    </>
  );
};
