
import './App.css'
import { TicketForm } from './components/TicketForm'
import { CreateTickets } from './pages/CreateTicket'
import { AppRoutes } from './routes/AppRoutes'

function App() {

  return (
    <>
     <h1> The react app</h1>
     <AppRoutes/>
    <CreateTickets/>
    </>
  )
}

export default App
