import { ticketsData } from "../data/tickets";
import { TicketCard } from "../components/TicketCard";
import { useState } from "react";
import { FilterComp } from "../components/FilterComp";
import { filterCompContent } from "../utils/filterCompContent";
import { filterFieldResult } from "../utils/filterFieldResult";
import { getSortedTicket } from "../utils/getSortedTickets";
import { Input,Container } from "@chakra-ui/react";

export const Tickets = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [sortBy, setSortBy] = useState("all");
 

  const handleSearch = (e) => setSearchTerm(e.target.value);

  // Derived State- If data can be calculated from existing state, don't store it as separate state.
  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredTickets = (
    normalizedSearch.length === 0
      ? ticketsData
      : ticketsData.filter(
          ({ title }) => title.toLowerCase().includes(normalizedSearch),
          // Think about condition and its outcome then and how it will work.
        )
  )
  .filter(filterFieldResult(statusFilter, "status"))
  .filter(filterFieldResult(priorityFilter, "priority", "number"));

  const sortedTickets= getSortedTicket(filteredTickets,sortBy);

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

      {sortedTickets.map((ticket) => (
        <TicketCard key={ticket.id} ticket={ticket} />
      ))}
    </>
  );
};
