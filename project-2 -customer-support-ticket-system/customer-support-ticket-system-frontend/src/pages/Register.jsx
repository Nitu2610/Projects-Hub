import {
  Box,
  Button,
  Container,
  Field,
  Heading,
  Input,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api/authApi";

const initialState = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

// Registration page:
// Only customer needs to register, agent registration will be done only via authorized admin.
export const Register = () => {
  const [userData, setUserData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Updates the corresponding form field without replacing other user data.
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  // Validates the form, submits, registration data, and redirects to login on success.
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (userData.password !== userData.confirmPassword) {
      // Confirm passoword is used only for client-side validation.
      setError("Passwords do no match.");
      setLoading(false);
      return;
    }
    try {
      // Remove the confirmPassword before sending the registration data to the API.
      let { confirmPassword, ...registrationData } = userData;
      await authApi.register(registrationData);
      // After successful registration of data on server, redirect to login page.
      navigate("/login");
    } catch (err) {
      // Display API error when avaliable, otherwise use a fallback message.
      setError(err.response?.data?.message || "Unable to register the some.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container md={5}>
      <Box md={6}>
        <Heading size="2xl"> Registration </Heading>
      </Box>

      {error && <Box color="red">{error}</Box>}
      <form onSubmit={handleRegister}>
        <Field.Root>
          <Field.Label>First Name :</Field.Label>
          <Input
            placeholder="Enter your first name"
            name="firstName"
            value={userData.firstName}
            onChange={handleChange}
          />
        </Field.Root>

        <Field.Root>
          <Field.Label>Last Name :</Field.Label>
          <Input
            placeholder="Enter your last name"
            name="lastName"
            value={userData.lastName}
            onChange={handleChange}
          />
        </Field.Root>

        <Field.Root>
          <Field.Label>Email :</Field.Label>
          <Input
            placeholder="Enter email address"
            type="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
          />
        </Field.Root>

        <Field.Root>
          <Field.Label>Password </Field.Label>
          <Input
            placeholder="Enter password"
            type="password"
            name="password"
            value={userData.password}
            onChange={handleChange}
          />
        </Field.Root>

        <Field.Root>
          <Field.Label>Confirm Password</Field.Label>
          <Input
            placeholder="Confirm  password"
            type="password"
            name="confirmPassword"
            value={userData.confirmPassword}
            onChange={handleChange}
          />
        </Field.Root>

        <Button type="submit" disabled={loading}>
          {" "}
          {loading ? "Registering..." : "Register "}{" "}
        </Button>
      </form>
    </Container>
  );
};
