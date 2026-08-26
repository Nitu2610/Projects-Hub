import {
  Box,
  Button,
  Card,
  Container,
  Field,
  Heading,
  Input,
  Text,
  Link as ChakraLink,
  Stack,
} from "@chakra-ui/react";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { ColorModeButton } from "../components/ui/color-mode";

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
  // Hold the user credentails as user type.
  const [userCred, setUserCred] = useState({ email: "", password: "" });
  // Get the login fn from the AutnContext.
  const { login } = useContext(AuthContext);
  // Track whether the login API request is currently running.
  const [loggingIn, setLoggingIn] = useState(false);
  // Store/display an API error.
  const [error, setError] = useState("");
  //  Track whether the user has attempted to submit the form, so validation messages can be displayed.
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserCred((prev) => ({ ...prev, [name]: value }));
  };

  // Submit the login details and redirect the user after successful login.
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Prevent multiple login requests
    if (loggingIn) return;

    setSubmitted(true);
    setError("");

    if (!userCred.email.trim() || !userCred.password) return;

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
      setSubmitted(false);
    }
  };

  return (
    <>
      <ColorModeButton position="absolute" top={4} right={4} />

      <Box
        minH="100vh"
        bg="support.background"
        display="flex"
        alignItems="center"
        py={{ base: 8, md: 12 }}
      >
        <Container maxW="460px">
          <Card.Root
            bg="support.surface"
            border="1px solid"
            borderColor="support.border"
            borderRadius="xl"
            shadow="sm"
          >
            <Card.Body p={{ base: 6, md: 8 }}>
              {/* Heading */}
              <Box textAlign="center" mb={8}>
                <Heading size={{ base: "xl", md: "2xl" }} color="support.text">
                  Welcome Back
                </Heading>

                <Text
                  mt={2}
                  color="support.muted"
                  fontSize={{ base: "sm", md: "md" }}
                >
                  Sign in to continue to your support dashboard.
                </Text>
              </Box>

              <form onSubmit={handleSubmit}>
                <Stack gap={5}>
                  {/* API error */}
                  {error && (
                    <Box
                      bg="red.50"
                      border="1px solid"
                      borderColor="red.200"
                      borderRadius="md"
                      p={3}
                    >
                      <Text color="red.600" fontSize="sm">
                        {error}
                      </Text>
                    </Box>
                  )}

                  {/* Email */}
                  <Field.Root invalid={submitted && !userCred.email.trim()}>
                    <Field.Label color="support.text">Email</Field.Label>

                    <Input
                      placeholder="Enter your email"
                      type="email"
                      name="email"
                      value={userCred.email}
                      onChange={handleChange}
                      bg="support.surface"
                      color="support.text"
                      _placeholder={{
                        color: "support.muted",
                      }}
                      _focusVisible={{
                        borderColor: "blue.500",
                        boxShadow: "0 0 0 1px var(--chakra-colors-blue-500)",
                      }}
                    />

                    <Field.ErrorText>This field is required</Field.ErrorText>
                  </Field.Root>

                  {/* Password */}
                  <Field.Root invalid={submitted && !userCred.password}>
                    <Field.Label color="support.text">Password</Field.Label>

                    <Input
                      placeholder="Enter your password"
                      type="password"
                      name="password"
                      value={userCred.password}
                      onChange={handleChange}
                      bg="support.surface"
                      color="support.text"
                      _placeholder={{
                        color: "support.muted",
                      }}
                      _focusVisible={{
                        borderColor: "blue.500",
                        boxShadow: "0 0 0 1px var(--chakra-colors-blue-500)",
                      }}
                    />

                    <Field.ErrorText>This field is required</Field.ErrorText>
                  </Field.Root>

                  {/* Login */}
                  <Button
                    type="submit"
                    loading={loggingIn}
                    loadingText="Logging in..."
                    colorPalette="blue"
                    size="lg"
                    width="100%"
                    mt={2}
                  >
                    Login
                  </Button>
                </Stack>
              </form>

              {/* Register */}
              <Box
                textAlign="center"
                mt={6}
                pt={5}
                borderTop="1px solid"
                borderColor="support.border"
              >
                <Text display="inline" color="support.muted" fontSize="sm">
                  Don't have an account?{" "}
                </Text>

                <ChakraLink
                  as={RouterLink}
                  to="/register"
                  color="blue.500"
                  fontWeight="600"
                  fontSize="sm"
                  _hover={{
                    textDecoration: "underline",
                  }}
                >
                  Register
                </ChakraLink>
              </Box>
            </Card.Body>
          </Card.Root>
        </Container>
      </Box>
    </>
  );
};
