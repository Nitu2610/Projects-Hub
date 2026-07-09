import "./App.css";
import { AppRoutes } from "./routes/AppRoutes";
import { Heading } from "@chakra-ui/react";
function App() {
  return (
    <>
      <Heading> The react app</Heading>
      <AppRoutes />
    </>
  );
}

export default App;
