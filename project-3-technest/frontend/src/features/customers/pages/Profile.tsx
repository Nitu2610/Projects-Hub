import {
  Box,
  Button,
  Container,
  Field,
  Heading,
  Input,
  Separator,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {
  useChangeUserPasswordMutation,
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
} from "../api/customerApi";

export const Profile = () => {
  const { data, isLoading } = useGetUserProfileQuery();

  const [
    updateUserProfile,
    { isLoading: isUpdatingProfile },
  ] = useUpdateUserProfileMutation();

  const [
    changeUserPassword,
    { isLoading: isChangingPassword },
  ] = useChangeUserPasswordMutation();

  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (data?.data) {
      setFullName(data.data.fullName);
      setMobile(data.data.mobile);
    }
  }, [data]);

  const handleProfileUpdate = async () => {
    try {
      await updateUserProfile({
        fullName,
        mobile,
      }).unwrap();
    } catch (error) {
      console.error("Profile update failed:", error);
    }
  };

  const handlePasswordChange = async () => {
    try {
      await changeUserPassword({
        currentPassword,
        newPassword,
        confirmPassword,
      }).unwrap();

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Password change failed:", error);
    }
  };

  if (isLoading) {
    return (
      <Box
        bg="bg"
        minH="100vh"
        py={{ base: 6, md: 10 }}
      >
        <Container maxW="800px">
          <Text color="fg.muted">Loading profile...</Text>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      bg="bg"
      minH="calc(100vh - 80px)"
      py={{ base: 6, md: 10 }}
    >
      <Container maxW="800px">
        <Stack gap={8}>
          {/* Page Header */}
          <Box>
            <Heading fontSize={{ base: "2xl", md: "3xl" }}>
              My Profile
            </Heading>

            <Text mt={2} color="fg.muted">
              Manage your personal information and account password.
            </Text>
          </Box>

          {/* Profile Information */}
          <Box
            bg="bg.panel"
            borderWidth="1px"
            borderColor="border"
            borderRadius="xl"
            p={{ base: 5, md: 7 }}
          >
            <Stack gap={6}>
              <Box>
                <Heading size="md">
                  Personal Information
                </Heading>

                <Text mt={1} fontSize="sm" color="fg.muted">
                  Update your basic account information.
                </Text>
              </Box>

              <Stack gap={5}>
                <Field.Root>
                  <Field.Label>Full Name</Field.Label>
                  <Input
                    value={fullName}
                    onChange={(event) =>
                      setFullName(event.target.value)
                    }
                  />
                </Field.Root>

                <Field.Root>
                  <Field.Label>Email</Field.Label>
                  <Input
                    value={data?.data?.email ?? ""}
                    disabled
                  />
                  <Field.HelperText>
                    Email address cannot be changed.
                  </Field.HelperText>
                </Field.Root>

                <Field.Root>
                  <Field.Label>Mobile</Field.Label>
                  <Input
                    value={mobile}
                    onChange={(event) =>
                      setMobile(event.target.value)
                    }
                  />
                </Field.Root>

                <Button
                  type="button"
                  width={{ base: "100%", sm: "fit-content" }}
                  alignSelf={{ base: "stretch", sm: "flex-end" }}
                  loading={isUpdatingProfile}
                  onClick={handleProfileUpdate}
                >
                  Update Profile
                </Button>
              </Stack>
            </Stack>
          </Box>

          {/* Password */}
          <Box
            bg="bg.panel"
            borderWidth="1px"
            borderColor="border"
            borderRadius="xl"
            p={{ base: 5, md: 7 }}
          >
            <Stack gap={6}>
              <Box>
                <Heading size="md">
                  Change Password
                </Heading>

                <Text mt={1} fontSize="sm" color="fg.muted">
                  Update your password to keep your account secure.
                </Text>
              </Box>

              <Separator />

              <Stack gap={5}>
                <Field.Root>
                  <Field.Label>Current Password</Field.Label>
                  <Input
                    type="password"
                    value={currentPassword}
                    onChange={(event) =>
                      setCurrentPassword(event.target.value)
                    }
                  />
                </Field.Root>

                <Field.Root>
                  <Field.Label>New Password</Field.Label>
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(event) =>
                      setNewPassword(event.target.value)
                    }
                  />
                </Field.Root>

                <Field.Root>
                  <Field.Label>Confirm New Password</Field.Label>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(event) =>
                      setConfirmPassword(event.target.value)
                    }
                  />
                </Field.Root>

                <Button
                  type="button"
                  width={{ base: "100%", sm: "fit-content" }}
                  alignSelf={{ base: "stretch", sm: "flex-end" }}
                  loading={isChangingPassword}
                  onClick={handlePasswordChange}
                >
                  Change Password
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};