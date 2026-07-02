
import { useEffect, useState } from 'react';
import './App.css'
import { TicketForm } from './components/TicketForm'
import { CreateTickets } from './pages/CreateTicket'
import { AppRoutes } from './routes/AppRoutes'
import { ticketsDataSet } from './data/tickets';

function App() {
  const [ticketsData,setTicketsData]=useState(ticketsDataSet);

  return (
    <>
     <h1> The react app</h1>
     <AppRoutes ticketsData={ticketsData} setTicketsData={setTicketsData} />
     
    </>
  )
}

export default App
