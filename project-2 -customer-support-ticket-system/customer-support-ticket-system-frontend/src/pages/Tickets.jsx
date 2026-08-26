import { TicketCard } from "../components/TicketCard";
import { FilterComp } from "../components/FilterComp";
import { filterCompContent } from "../utils/filterCompContent";
import { Box, Button, Container, Heading, Input, Text } from "@chakra-ui/react";
import { useTickets } from "../customHooks/useTickets";
import { useDebounce } from "../customHooks/useDebounce";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { BackToHome } from "../components/BackToHome";
import { ErrorMessage } from "../components/ErrorMessage";
import { Loading } from "../components/Loading";
import { EmptyState } from "../components/EmptyState";
import { Pagination } from "../components/Pagination";

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
  const limit = 6;

  // Get the tickets managed by the TicketsContext.
  const { ticketsData, loading, error, paginationData, fetchTickets } =
    useTickets();

  const { isAuthenticated, user } = useContext(AuthContext);

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
      const [sortField, sortOrder] = sortBy.split("-");
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

  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setPriorityFilter("all");
    setSortBy("all");
    setPage(1);
  };

  if (isAuthenticated === null)
    return <Heading>Ticket comp Checking authentication...</Heading>;
  if (isAuthenticated === false)
    return <Heading>Ticket comp Please login.</Heading>;
  if (error) return <ErrorMessage message={error} />;

  return (
    <Box minH="100vh" bg="support.background" py={{ base: 6, md: 10 }}>
      <Container maxW="1100px">
        {/* Page header */}
        <Box mb={{ base: 6, md: 8 }}>
          <Heading size={{ base: "xl", md: "2xl" }} color="support.text">
            Tickets
          </Heading>

          <Text
            mt={2}
            color="support.muted"
            fontSize={{ base: "sm", md: "md" }}
          >
            Search, filter and manage your support tickets.
          </Text>
        </Box>

        {/* Search and filters */}
        <Box
          bg="support.surface"
          border="1px solid"
          borderColor="support.border"
          borderRadius="xl"
          p={{ base: 4, md: 5 }}
          mb={6}
        >
          <Input
            placeholder="Search tickets by title..."
            value={searchTerm}
            onChange={handleSearch}
            bg="support.surface"
            color="support.text"
            _placeholder={{
              color: "support.muted",
            }}
            _focusVisible={{
              borderColor: "blue.500",
              boxShadow: "0 0 0 1px var(--chakra-colors-blue-500)",
            }}
          />

          <Box
            display="grid"
            gridTemplateColumns={{
              base: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
            }}
            gap={3}
            mt={4}
          >
            <FilterComp
              heading="Status"
              value={statusFilter}
              onChange={handleStatusChange}
              content={filterCompContent.filterStatusContent}
            />

            <FilterComp
              heading="Priority"
              value={priorityFilter}
              onChange={handlePriorityChange}
              content={filterCompContent.filterPriorityContent}
            />

            <FilterComp
              heading="Sort"
              value={sortBy}
              onChange={handleSortChange}
              content={filterCompContent.filterSortContent}
            />
          </Box>

          {/* Clear filters */}
          {(searchTerm ||
            statusFilter !== "all" ||
            priorityFilter !== "all" ||
            sortBy !== "all") && (
            <Button
              mt={4}
              size="sm"
              variant="ghost"
              colorPalette="blue"
              onClick={handleClearFilters}
            >
              Clear filters
            </Button>
          )}
        </Box>

        {/* Loading */}
        {loading && <Loading />}

        {/* Error */}
        {error && <ErrorMessage message={error} />}

        {/* Ticket list */}
        {!loading && ticketsData.length === 0 ? (
          <Box
            bg="support.surface"
            border="1px solid"
            borderColor="support.border"
            borderRadius="xl"
            p={{ base: 6, md: 10 }}
            textAlign="center"
          >
            <EmptyState
              title="No tickets found"
              message="Try changing your search or filters."
            />

            <Button mt={4} colorPalette="blue" onClick={handleClearFilters}>
              Clear Filters
            </Button>
          </Box>
        ) : (
          <Box>
            {ticketsData.map((ticket) => (
              <TicketCard key={ticket._id} ticket={ticket} />
            ))}
          </Box>
        )}

        {/* Pagination */}
        {!loading && ticketsData.length > 0 && (
          <Pagination
            page={page}
            totalPages={paginationData?.totalPages}
            onPrevious={() => setPage((prev) => prev - 1)}
            onNext={() => setPage((prev) => prev + 1)}
          />
        )}

        {/* Admin navigation */}
        {user.role === "admin" && <BackToHome />}
      </Container>
    </Box>
  );
};
