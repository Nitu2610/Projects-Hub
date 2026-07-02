import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "./components/ui/provider.jsx";
import { BrowserRouter } from "react-router-dom";
import { TicketProvider } from "./context/TicketsContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <TicketProvider>
      <BrowserRouter>
        <Provider>
          <App />
        </Provider>
      </BrowserRouter>
    </TicketProvider>
  </StrictMode>,
);
