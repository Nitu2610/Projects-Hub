import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Field,
  Heading,
  Input,
  Stack,
  Separator,
} from "@chakra-ui/react";
import { useChangeUserPasswordMutation, useGetUserProfileQuery, useUpdateUserProfileMutation } from "../api/customerApi";





export const Profile = () => {
  const { data, isLoading } =   useGetUserProfileQuery();

  const [updateUserProfile, { isLoading: isUpdatingProfile }] =
    useUpdateUserProfileMutation();

  const [changeUserPassword, { isLoading: isChangingPassword }] =
    useChangeUserPasswordMutation();

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
    return <Box>Loading profile...</Box>;
  }

  return (
    <Box maxW="700px" mx="auto" p={6}>
      <Heading mb={6}>My Profile</Heading>

      <Stack gap={5}>
        <Field.Root>
          <Field.Label>Full Name</Field.Label>
          <Input
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
          />
        </Field.Root>

        <Field.Root>
          <Field.Label>Email</Field.Label>
          <Input value={data?.data?.email ?? ""} disabled />
        </Field.Root>

        <Field.Root>
          <Field.Label>Mobile</Field.Label>
          <Input
            value={mobile}
            onChange={(event) => setMobile(event.target.value)}
          />
        </Field.Root>

        <Button
          type="button"
          onClick={handleProfileUpdate}
          loading={isUpdatingProfile}
        >
          Update Profile
        </Button>

        <Separator my={4} />

        <Heading size="md">Change Password</Heading>

        <Field.Root>
          <Field.Label>Current Password</Field.Label>
          <Input
            type="password"
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
          />
        </Field.Root>

        <Field.Root>
          <Field.Label>New Password</Field.Label>
          <Input
            type="password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
          />
        </Field.Root>

        <Field.Root>
          <Field.Label>Confirm New Password</Field.Label>
          <Input
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
          />
        </Field.Root>

        <Button
          type="button"
          onClick={handlePasswordChange}
          loading={isChangingPassword}
        >
          Change Password
        </Button>
      </Stack>
    </Box>
  );
};
