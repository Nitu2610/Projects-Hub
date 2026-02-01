import { Box, Flex, Heading, Text, Button, Avatar } from "@chakra-ui/react";
import { SignUpBtn } from "./buttons/SignUpBtn";
import { LogInBtn } from "./buttons/LogInBtn";
import { Logout } from "./buttons/LogOutBtn";

export const AuthControls = ({ user }) => {
  return (
    <Flex
      align="center"
      gap={3}
      px={4}
      py={2}
      borderRadius="full"
      bg={"gray.200"}
      border={"1px solid  gray.200"}
      boxShadow={"sd"}
    >
      {user ? (
        <>
          <Avatar
            name={user.firstName}
            size="sm"
            bg={"blue.500"}
            color={"white"}
          />

          <Box lineHeight={1.2}>
            <Heading size="xs" fontWeight={600}>
              Hi, {user.firstName}
            </Heading>
            <Text fontSize="xs" color="gray.500">
              Logged in
            </Text>
          </Box>

          <Logout />
        </>
      ) : (
        <Flex gap={2}>
          <LogInBtn />
          <SignUpBtn />
        </Flex>
      )}
    </Flex>
  );
};
