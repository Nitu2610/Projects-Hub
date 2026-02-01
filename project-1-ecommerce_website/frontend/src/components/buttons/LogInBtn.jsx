import React from 'react'
import { Button } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'


export const LogInBtn = () => {
    const navigateTo=useNavigate();
  return (
  <Button colorScheme='blue' onClick={()=>navigateTo('/login')} >Login</Button>
  )
}
