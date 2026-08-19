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

export const Login = () => {
  const [userCred, setUserCred] = useState({ email: "", password: "" });
  const { login, user, isAuthenticated } = useContext(AuthContext);
  const navTo = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserCred((prev) => ({ ...prev, [name]: value }));
  };

  // Submit the login details and redirect the user after successful login.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(userCred);
      if (isAuthenticated) {
        navTo("/");
      }
    } catch (err) {
      // Show an error message when login request fails.
      setError(
        err.response?.data?.message || "Unable to login. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Heading> Loading ...</Heading>;
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
            <Field.Root invalid>
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

            <Field.Root invalid>
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

            <Button bg="bg.subtle" variant="outline" type="submit">
              Login
            </Button>
          </VStack>
        </form>
        <Text>Don't have an account?</Text>
        <Link onClick={() => navTo("/")}>Register</Link>
      </Container>
    </>
  );
};
