import { Button } from '@chakra-ui/react'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/authSlice';
import { useNavigate } from 'react-router-dom';
import { clearCart } from '../../redux/cartSlice';
import { resetCheckout } from '../../redux/checkoutSlice';






export const Logout = () => {
  const {user} =useSelector(state=> state.auth);
const dispatch=useDispatch();
const navigateTo= useNavigate();

const handleLogout=()=>{
   dispatch(logout());
   navigateTo('/');
   dispatch(clearCart());
   dispatch(resetCheckout());
}

  return (
   <Button onClick={handleLogout}>Logout</Button>
  )
}
