import { useEffect, useState } from "react";
import { useTickets } from "./useTickets";

export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDeboundedValue] = useState("");

  // Wait for the user to stop typing before updating the value.
  // This helps avoid running search logic on every keystroke.
  useEffect(() => {
    let timerId = setTimeout(() => {
      setDeboundedValue(value.trim().toLowerCase());
    }, delay);

    return () => clearTimeout(timerId);
  }, [delay, value]);

  return { debouncedValue };
};

// A custom hook has it own state for each call.
// Shared state should be handled through Context or another state manager
// when multiple components need to access the same value.

// We can't directly get the updated searchTerm from useTickets()
// inside useDebounce because every call to useTickets() creates
// a separate state instance. The states are independent and not shared.
// If searchTerm were stored in a shared place, for example: React Context; Zustand; Redux, Then both TicketPage and useDebounce could access the same state.
// Custom hooks do not share state automatically.

// Why not use a utility function instead of a custom hook?
// Utility functions cannot use React hooks or manage React state and lifecycle. Custom hooks allow us to reuse stateful React logic by composing built-in hooks like useState, useEffect, and useContext.
