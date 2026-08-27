import {
  Box,
  Button,
  Card,
  Container,
  Field,
  Heading,
  Input,
  SimpleGrid,
  Stack,
  Text,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { authApi } from "../api/authApi";
import { toaster } from "../components/ui/toaster";
import {ColorModeButton} from "../components/ui/color-mode"

const INITIAL_REGISTRATION_STATE = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

// Registration page:
// Only customer needs to register, agent registration will be done only via authorized admin.
export const Register = () => {
  // To capture the user details, as they update for registration.
  const [userData, setUserData] = useState(INITIAL_REGISTRATION_STATE);
  // A state for handling the UI
  const [registering, setRegistering] = useState(false);
  // State to capture the API errors
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Validate all the field and its value, return if any error found.
  const validateForm = () => {
    if (!userData.firstName.trim()) {
      return "First name is required.";
    }

    if (!userData.lastName.trim()) {
      return "Last name is required.";
    }

    if (!userData.email.trim()) {
      return "Email is required.";
    }

    if (!userData.password) {
      return "Password is required.";
    }

    if (userData.password !== userData.confirmPassword) {
      return "Passwords do not match.";
    }

    return "";
  };

  // Updates the corresponding form field without replacing other user data.
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  // Validates the form, submits, registration data, and redirects to login on success.
  const handleRegister = async (e) => {
    e.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    if (userData.password !== userData.confirmPassword) {
      // Confirm passoword is used only for client-side validation.
      setError("Passwords do no match.");
      setRegistering(false);
      return;
    }

    setRegistering(true);

    try {
      // Remove the confirmPassword before sending the registration data to the API.
      let { confirmPassword, ...registrationData } = userData;
      await authApi.register(registrationData);

      toaster.create({
        title: "Registration successful",
        description: "Please login to continue.",
        type: "success",
      });

      // Clear the form data.
      setUserData(INITIAL_REGISTRATION_STATE);

      // After successful registration of data on server, redirect to login page.
      navigate("/login");
    } catch (err) {
      // Capture API error when avaliable, otherwise use a fallback message.
      setError(err.response?.data?.message || "Unable to register the some.");
    } finally {
      setRegistering(false);
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
      <Container maxW="620px">
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
                Create Your Account
              </Heading>

              <Text
                mt={2}
                color="support.muted"
                fontSize={{ base: "sm", md: "md" }}
              >
                Create an account to start managing your support tickets.
              </Text>
            </Box>

            <form onSubmit={handleRegister}>
              <Stack gap={5}>
                {/* API / validation error */}
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

                {/* First + Last name */}
                <SimpleGrid columns={{ base: 1, md: 2 }} gap={5}>
                  <Field.Root required>
                    <Field.Label color="support.text">First Name</Field.Label>

                    <Input
                      placeholder="Enter your first name"
                      name="firstName"
                      value={userData.firstName}
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
                  </Field.Root>

                  <Field.Root required>
                    <Field.Label color="support.text">Last Name</Field.Label>

                    <Input
                      placeholder="Enter your last name"
                      name="lastName"
                      value={userData.lastName}
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
                  </Field.Root>
                </SimpleGrid>

                {/* Email */}
                <Field.Root required>
                  <Field.Label color="support.text">Email</Field.Label>

                  <Input
                    placeholder="Enter your email address"
                    type="email"
                    name="email"
                    value={userData.email}
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
                </Field.Root>

                {/* Password */}
                <Field.Root required>
                  <Field.Label color="support.text">Password</Field.Label>

                  <Input
                    placeholder="Create a password"
                    type="password"
                    name="password"
                    value={userData.password}
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
                </Field.Root>

                {/* Confirm password */}
                <Field.Root required>
                  <Field.Label color="support.text">
                    Confirm Password
                  </Field.Label>

                  <Input
                    placeholder="Confirm your password"
                    type="password"
                    name="confirmPassword"
                    value={userData.confirmPassword}
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
                </Field.Root>

                {/* Register */}
                <Button
                  type="submit"
                  loading={registering}
                  loadingText="Registering..."
                  colorPalette="blue"
                  size="lg"
                  width="100%"
                  mt={2}
                >
                  Create Account
                </Button>
              </Stack>
            </form>

            {/* Login link */}
            <Box
              textAlign="center"
              mt={6}
              pt={5}
              borderTop="1px solid"
              borderColor="support.border"
            >
              <Text display="inline" color="support.muted" fontSize="sm">
                Already have an account?{" "}
              </Text>

              <ChakraLink
                as={RouterLink}
                to="/login"
                color="blue.500"
                fontWeight="600"
                fontSize="sm"
                _hover={{
                  textDecoration: "underline",
                }}
              >
                Log in
              </ChakraLink>
            </Box>
          </Card.Body>
        </Card.Root>
      </Container>
    </Box>
    </>
   
  );
};
