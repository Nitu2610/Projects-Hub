import { 
  Box, Button, FormControl, FormLabel, Heading, 
  Input, FormHelperText, VStack 
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/actions/authActions";
import { useNavigate } from "react-router-dom";

const formField = { email: "", password: "" };

export const LogIn = () => {

  const [userCred, setUserCred] = useState(formField);
  const dispatch = useDispatch();
  const navigateTo=useNavigate();
  const {user}=useSelector(state=> state.auth)

  useEffect(()=>{
    if(user) {
      navigateTo('/');
    } 
  },[user])
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserCred((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(loginUser(userCred));
    setUserCred(formField);
  };

  return (
    <Box maxW="400px" mx="auto" mt="80px" p="30px" borderRadius="lg" boxShadow="md">
      <Heading mb="30px" textAlign="center">Login</Heading>

      <VStack as="form" spacing={5}>
        
        <FormControl>
          <FormLabel>Email address</FormLabel>
          <Input 
            type="email" 
            name="email" 
            value={userCred.email} 
            onChange={handleChange}
            focusBorderColor="blue.400"
          />
          <FormHelperText>We'll never share your email.</FormHelperText>
        </FormControl>

        <FormControl>
          <FormLabel>Password</FormLabel>
          <Input 
            type="password" 
            name="password" 
            value={userCred.password} 
            onChange={handleChange}
            focusBorderColor="blue.400"
          />
        </FormControl>

        <Button colorScheme="blue" width="100%" onClick={handleLogin}>
          Log In
        </Button>
      </VStack>
    </Box>
  );
};
