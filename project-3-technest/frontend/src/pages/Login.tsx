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
import { useLoginMutation } from "../redux/api/apiSlice";
import { useNavigate } from "react-router-dom";

interface UserCredentials {
  email: string;
  password: string;
}

export const Login = () => {
  const [userCred, setUserCred] = useState<UserCredentials>({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const [login, { isLoading, isError, error }] = useLoginMutation();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setUserCred((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await login(userCred).unwrap();
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

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
              Welcome Back
            </Heading>

            <Text mt={2} color="gray.500">
              Sign in to your account to continue
            </Text>
          </Card.Header>

          {isError &&
            "data" in error &&
            typeof error.data === "object" &&
            error.data !== null &&
            "message" in error.data &&
            typeof error.data.message === "string" && (
              <Heading color="red.500" size="md">
                {error.data.message}
              </Heading>
            )}

          <Card.Body>
            <form onSubmit={handleSubmit}>
              <Stack gap={5}>
                <Field.Root required>
                  <Field.Label color="gray.500">
                    Email
                    <Field.RequiredIndicator />
                  </Field.Label>

                  <Input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={userCred.email}
                    onChange={handleChange}
                    size="lg"
                    color="black"
                  />
                </Field.Root>

                <Field.Root required>
                  <Field.Label color="gray.500">
                    Password
                    <Field.RequiredIndicator />
                  </Field.Label>

                  <Input
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    value={userCred.password}
                    onChange={handleChange}
                    size="lg"
                    color="black"
                  />
                </Field.Root>

                <Button
                  type="submit"
                  size="lg"
                  width="full"
                  colorPalette="blue"
                  loading={isLoading}
                  loadingText="Signing in..."
                >
                  Sign In
                </Button>
              </Stack>
            </form>
          </Card.Body>

          <Card.Footer justifyContent="center" pt={0}>
            <Text fontSize="sm" color="gray.500">
              Don't have an account?{" "}
              <Text as="span" color="blue.500" fontWeight="medium">
                Sign up
              </Text>
            </Text>
          </Card.Footer>
        </Card.Root>
      </Box>
    </Center>
  );
};