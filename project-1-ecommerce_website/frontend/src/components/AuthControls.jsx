import { Box, Flex, Heading, Text, Button, Avatar } from "@chakra-ui/react";
import { SignUpBtn } from "./buttons/SignUpBtn";
import { LogInBtn } from "./buttons/LogInBtn";
import { Logout } from "./buttons/LogOutBtn";


export const AuthControls = ({ user }) => {
  return (
    <Flex
      align="center"
      gap={4}
      p={3}
      borderRadius="md"
      backgroundColor={"antiquewhite"}
      _dark={{ bg: "gray.700" }}
      boxShadow={"md"}
    >
      {user ? (
        <>
          <Avatar name={user.firstName} size="sm" />

          <Box >
            <Heading size="sm">Hi, {user.firstName}</Heading>
            <Text fontSize="xs" color="gray.500">
              Logged in
            </Text>
          </Box>

          <Logout />
        </>
      ) : (
        <Flex gap={3}>
          <LogInBtn />
          <SignUpBtn />
        </Flex>
      )}
    </Flex>
  );
};
