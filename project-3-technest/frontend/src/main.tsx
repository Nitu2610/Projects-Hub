import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.js";
import { Provider as ChakraProvider } from "./components/ui/provider.js";
import { BrowserRouter } from "react-router-dom";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "./redux/store.js";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ChakraProvider>
        <ReduxProvider store={store} >
          <App />
        </ReduxProvider>
      </ChakraProvider>
    </BrowserRouter>
  </StrictMode>,
);
