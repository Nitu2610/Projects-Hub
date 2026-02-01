import React from 'react'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { AppRoutes } from '../../routes/AppRoutes'

export const Layout = () => {
  return (
   <>
   <Navbar/>
   <main><AppRoutes/></main>  {/** <main> is a semantic HTML tag that holds the primary, page-specific routed content.  The <AppRoutes/> is responsible to displat entire app content. */}
   <Footer/>
   </>
  )
}
