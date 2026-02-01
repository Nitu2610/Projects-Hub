import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  FormHelperText,
  VStack,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/actions/authActions";
import { useNavigate } from "react-router-dom";

const initialState = { email: "", password: "" };

export const LogIn = () => {
  const [userCred, setUserCred] = useState(initialState);
  const dispatch = useDispatch();
  const navigateTo = useNavigate();

  const { user, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      navigateTo("/");
    }
  }, [user, navigateTo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserCred((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(loginUser(userCred));
  };

  return (
    <Box
      maxW="400px"
      mx="auto"
      mt="80px"
      p="30px"
      borderRadius="lg"
      boxShadow="md"
    >
      <Heading mb="30px" textAlign="center">
        Login
      </Heading>

      <VStack as="form" spacing={5} onSubmit={handleLogin}>
        <FormControl isRequired>
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

        <FormControl isRequired>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            name="password"
            value={userCred.password}
            onChange={handleChange}
            focusBorderColor="blue.400"
          />
        </FormControl>

        {error && (
          <Text color="red.500" fontSize="sm">
            {error.message || "Login failed"}
          </Text>
        )}

        <Button
          colorScheme="blue"
          width="100%"
          type="submit"
          isLoading={loading}
        >
          Log In
        </Button>
      </VStack>
    </Box>
  );
};
