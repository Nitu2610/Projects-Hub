import { Button } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom';

export const SignUpBtn = () => {
    const navigateTo=useNavigate();
  return (
  <Button colorScheme='blue' onClick={()=>navigateTo('/signup')} >Sign Up</Button>
  )
}
