import { Button } from '@chakra-ui/react'
import { Navigate, useNavigate } from 'react-router-dom'

export const CheckOutBtn = () => {
  const navTo=useNavigate();
  return (
    <Button
         colorScheme="green"
         flex={1}
         onClick={() => navTo('/checkout')}
       >
         Move to Checkout
       </Button>
  )
}
