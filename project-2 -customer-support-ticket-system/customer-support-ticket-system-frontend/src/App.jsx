import { Toaster } from "./components/ui/toaster";
import { AppRoutes } from "./routes/AppRoutes";
import { Heading } from "@chakra-ui/react";

// Main application component.
// It loads the application routes and keeps the root component simple.
function App() {
  return (
    <>
      <Heading> The react app</Heading>
      <AppRoutes />

      <Toaster />
    </>
  );
}

export default App;
