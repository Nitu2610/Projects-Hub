import {
  Box,
  Button,
  Card,
  Center,
  Field,
  Heading,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useUserRegisterMutation } from "../redux/api/authApi";

interface userRegisterFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  mobile: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  mobile?: string;
}

export const Register = () => {
  const [formData, setFormData] = useState<userRegisterFormData>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    mobile: "",
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const navigate = useNavigate();

  const [userRegister, { isLoading, isError, error }] =
    useUserRegisterMutation();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setFormErrors((prev) => ({
      ...prev,
      [name]: undefined,
    }));
  };

  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    const fullName = formData.fullName.trim();
    const email = formData.email.trim();
    const password = formData.password;
    const confirmPassword = formData.confirmPassword;
    const mobile = formData.mobile.trim();

    if (!fullName) {
      errors.fullName = "Full name is required.";
    } else if (fullName.length < 2) {
      errors.fullName = "Full name must be at least 2 characters.";
    }

    if (!email) {
      errors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Please enter a valid email address.";
    }

    if (!password) {
      errors.password = "Password is required.";
    } else if (password.length < 8) {
      errors.password = "Password must be at least 8 characters.";
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm your password.";
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }

    if (!mobile) {
      errors.mobile = "Mobile number is required.";
    } else if (!/^[6-9]\d{9}$/.test(mobile)) {
      errors.mobile = "Please enter a valid 10-digit mobile number.";
    }

    setFormErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await userRegister({
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        mobile: formData.mobile.trim(),
      }).unwrap();

      navigate("/userLogin");
    } catch (err) {
      console.log(err);
    }
  };

  const getApiErrorMessage = (): string | null => {
    if (
      isError &&
      "data" in error &&
      typeof error.data === "object" &&
      error.data !== null &&
      "message" in error.data &&
      typeof error.data.message === "string"
    ) {
      return error.data.message;
    }

    return null;
  };

  const apiErrorMessage = getApiErrorMessage();

  return (
    <Center minH="100vh" bg="gray.50" px={4}>
      <Box w="full" maxW="420px">
        <Card.Root
          bg="white"
          borderWidth="1px"
          borderColor="gray.200"
          borderRadius="xl"
          shadow="lg"
        >
          <Card.Header textAlign="center" pb={2}>
            <Heading size="xl" color="black">
              Create Account
            </Heading>

            <Text mt={2} color="gray.500">
              Create your TechNest customer account
            </Text>
          </Card.Header>

          {apiErrorMessage && (
            <Box px={6} pt={2}>
              <Text color="red.500" textAlign="center">
                {apiErrorMessage}
              </Text>
            </Box>
          )}

          <Card.Body>
            <form onSubmit={handleSubmit}>
              <Stack gap={5}>
                <Field.Root required invalid={!!formErrors.fullName}>
                  <Field.Label color="gray.500">
                    Full Name
                    <Field.RequiredIndicator />
                  </Field.Label>

                  <Input
                    type="text"
                    name="fullName"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={handleChange}
                    size="lg"
                    color="black"
                  />

                  {formErrors.fullName && (
                    <Field.ErrorText>{formErrors.fullName}</Field.ErrorText>
                  )}
                </Field.Root>

                <Field.Root required invalid={!!formErrors.email}>
                  <Field.Label color="gray.500">
                    Email
                    <Field.RequiredIndicator />
                  </Field.Label>

                  <Input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    size="lg"
                    color="black"
                  />

                  {formErrors.email && (
                    <Field.ErrorText>{formErrors.email}</Field.ErrorText>
                  )}
                </Field.Root>

                <Field.Root required invalid={!!formErrors.password}>
                  <Field.Label color="gray.500">
                    Password
                    <Field.RequiredIndicator />
                  </Field.Label>

                  <Input
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    size="lg"
                    color="black"
                  />

                  {formErrors.password && (
                    <Field.ErrorText>{formErrors.password}</Field.ErrorText>
                  )}
                </Field.Root>

                <Field.Root required invalid={!!formErrors.confirmPassword}>
                  <Field.Label color="gray.500">
                    Confirm Password
                    <Field.RequiredIndicator />
                  </Field.Label>

                  <Input
                    type="password"
                    name="confirmPassword"
                    placeholder="Re-enter your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    size="lg"
                    color="black"
                  />

                  {formErrors.confirmPassword && (
                    <Field.ErrorText>
                      {formErrors.confirmPassword}
                    </Field.ErrorText>
                  )}
                </Field.Root>

                <Field.Root required invalid={!!formErrors.mobile}>
                  <Field.Label color="gray.500">
                    Mobile Number
                    <Field.RequiredIndicator />
                  </Field.Label>

                  <Input
                    type="tel"
                    name="mobile"
                    placeholder="10-digit mobile number"
                    value={formData.mobile}
                    onChange={handleChange}
                    size="lg"
                    color="black"
                  />

                  {formErrors.mobile && (
                    <Field.ErrorText>{formErrors.mobile}</Field.ErrorText>
                  )}
                </Field.Root>

                <Button
                  type="submit"
                  size="lg"
                  width="full"
                  colorPalette="blue"
                  loading={isLoading}
                  loadingText="Creating account..."
                >
                  Create Account
                </Button>
              </Stack>
            </form>
          </Card.Body>

          <Card.Footer justifyContent="center" pt={0}>
            <Text fontSize="sm" color="gray.500">
              Already have an account?{" "}
              <Text
                as="span"
                color="blue.500"
                fontWeight="medium"
                cursor="pointer"
                onClick={() => navigate("/userLogin")}
              >
                Sign in
              </Text>
            </Text>
          </Card.Footer>
        </Card.Root>
      </Box>
    </Center>
  );
};
