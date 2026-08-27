import { Navbar } from "./components/Navbar";
import { Toaster } from "./components/ui/toaster";
import { AppRoutes } from "./routes/AppRoutes";

// Main application component.
// It loads the application routes and keeps the root component simple.
function App() {
  return (
    <>
      <Navbar />

      <AppRoutes />

      <Toaster />
    </>
  );
}

export default App;
