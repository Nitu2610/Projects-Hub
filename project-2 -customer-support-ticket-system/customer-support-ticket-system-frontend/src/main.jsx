import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "./components/ui/provider.jsx";
import { BrowserRouter } from "react-router-dom";
import { TicketProvider } from "./context/TicketsContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

// Start the React application and load the global providers.
// Providers give the app access to authentication, ticket state,
// routing, and UI settings.

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <TicketProvider>
        <BrowserRouter>
          <Provider>
            <App />
          </Provider>
        </BrowserRouter>
      </TicketProvider>
    </AuthProvider>
  </StrictMode>,
);
