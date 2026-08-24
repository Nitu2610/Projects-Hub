import {
  Button,
  Container,
  Field,
  Heading,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Loading } from "../components/Loading";

// Login page:
// Responsible for collecting user credentails and starting the
// authentication flow through AuthContext.
//
// Data flow:
// Login form ➡️ AuthContext.login() ➡️ authApi ➡️ Backend API
//
// AuthContext is responsible for authentication state.
// This component is responsible for form state, UI feedback, navigation.

export const Login = () => {
  const [userCred, setUserCred] = useState({ email: "", password: "" });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loggingIn, setLoggingIn] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserCred((prev) => ({ ...prev, [name]: value }));
  };

  // Submit the login details and redirect the user after successful login.
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loggingIn) return;

    setSubmitted(true);
    setError("");

    if (!userCred.email.trim() || !userCred.password) {
      return;
    }

    setLoggingIn(true);

    try {
      await login(userCred);
      navigate("/");
    } catch (err) {
      // Show an error message when login request fails.
      setError(
        err.response?.data?.message || "Unable to login. Please try again.",
      );
    } finally {
      setLoggingIn(false);
    }
  };

  return (
    <>
      <Container
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <Heading size="4xl" marginBottom="10px">
          Welcome Back
        </Heading>
        <Text marginBottom="10px">Sign in to continue</Text>

        <form onSubmit={handleSubmit} style={{ margin: "auto" }}>
          <VStack border="1px solid" gap="4" maxW="sm" p="10px">
            {error && <Text color="red.500">{error}</Text>}
            <Field.Root>
              <Field.Label>Email</Field.Label>
              <Input
                placeholder="Enter your email"
                type="email"
                name="email"
                value={userCred.email}
                onChange={handleChange}
              />
              <Field.ErrorText>This field is required</Field.ErrorText>
            </Field.Root>

            <Field.Root invalid={submitted && !userCred.password}>
              <Field.Label>Password</Field.Label>
              <Input
                placeholder="Enterpassword"
                type="password"
                name="password"
                value={userCred.password}
                onChange={handleChange}
              />
              <Field.ErrorText>This field is required</Field.ErrorText>
            </Field.Root>

            <Button
              bg="bg.subtle"
              variant="outline"
              type="submit"
              loading={loggingIn}
              loadingText="Logging in..."
            >
              Login
            </Button>
          </VStack>
        </form>
        <Text>Don't have an account?</Text>
        <Link to="/register">Register</Link>
      </Container>
    </>
  );
};
