import React, { createContext, useState } from 'react'
import { ticketsDataSet } from '../data/tickets';

export const TicketsContext = createContext();

 export const TicketProvider=({children})=>{
  const [ticketsData,setTicketsData]=useState(ticketsDataSet);  
  return(
    <TicketsContext.Provider value={{ticketsData, setTicketsData}} >
      {children}
    </TicketsContext.Provider>
  )
}