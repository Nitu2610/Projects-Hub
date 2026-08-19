import { TicketCard } from "../components/TicketCard";
import { FilterComp } from "../components/FilterComp";
import { filterCompContent } from "../utils/filterCompContent";
import { filterFieldResult } from "../utils/filterFieldResult";
import { getSortedTicket } from "../utils/getSortedTickets";
import { Input, Container, Heading } from "@chakra-ui/react";
import { TicketsContext } from "../context/TicketsContext";
import { useTickets } from "../customHooks/useTickets";
import { useDebounce } from "../customHooks/useDebounce";
import { useState } from "react";

export const Tickets = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [sortBy, setSortBy] = useState("all");
  const { ticketsData, setTicketsData, context } = useTickets();
  // Calling the function twice gives you two independent pieces of state.
  // Debounce the search term so filtering does not run on every keystroke.
  const { debouncedValue } = useDebounce(searchTerm); // thats why we need to pass the state.

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Derived State- If data can be calculated from existing state, don't store it as separate state.
  // Search, filter, and sort are derived from the current ticket data.
  const searchKeyWord = debouncedValue;
  //  console.log(debouncedValue)
  const filteredTickets = (
    searchKeyWord.length === 0
      ? ticketsData
      : ticketsData.filter(
          ({ title }) => title.toLowerCase().includes(searchKeyWord),
          // Think about condition and its outcome then and how it will work.
        )
  )
    .filter(filterFieldResult(statusFilter, "status"))
    .filter(filterFieldResult(priorityFilter, "priority", "number"));

  const sortedTickets = getSortedTicket(filteredTickets, sortBy);

  if (ticketsData.length === 0)
    return <Heading>No Tickets Availiable.</Heading>;

  return (
    <>
      <div>Tickets</div>
      <Input
        placeholder="Search via title"
        value={searchTerm}
        onChange={handleSearch}
      />
      <Container
        display="flex"
        justifyContent="center"
        alignContent="center"
        flexWrap="wrap"
      >
        <FilterComp
          heading={"Filter by Status: "}
          value={statusFilter}
          onChange={setStatusFilter}
          content={filterCompContent.filterStatusContent}
        />

        <FilterComp
          heading={"Filter by Priority: "}
          value={priorityFilter}
          onChange={setPriorityFilter}
          content={filterCompContent.filterPriorityContent}
        />

        <FilterComp
          heading={"Sort Tickets: "}
          value={sortBy}
          onChange={setSortBy}
          content={filterCompContent.filterSortContent}
        />
      </Container>

      {sortedTickets &&
        sortedTickets.map((ticket) => (
          <TicketCard key={ticket.id} ticket={ticket} />
        ))}
    </>
  );
};
