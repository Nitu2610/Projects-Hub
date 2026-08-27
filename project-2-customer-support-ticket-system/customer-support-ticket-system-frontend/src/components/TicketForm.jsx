import {
  Box,
  Button,
  Card,
  Container,
  Field,
  Heading,
  Input,
  NativeSelect,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { BackToHome } from "./BackToHome";
import { ErrorMessage } from "../components/ErrorMessage";

// Reusable form for creating and editing tickets.
// Visible fields depend on the current mode and user role.
// Business logic and API calls are handled by the parent.

export const TicketForm = ({
  heading,
  formData,
  handleChange,
  handleSubmit,
  loading,
  isFormValid,
  error,
  mode = "create",
  role,
  agents,
  selectedAgent,
  setSelectedAgent,
}) => {
  return (
    <Box minH="100vh" bg="support.background" py={{ base: 6, md: 8, lg: 10 }}>
      <Container maxW="720px">
        <Card.Root
          bg="support.surface"
          border="1px solid"
          borderColor="support.border"
          borderRadius="xl"
          shadow="sm"
        >
          <Card.Body p={{ base: 5, md: 8 }}>
            <Box mb={6}>
              <Heading size={{ base: "lg", md: "xl" }} color="support.text">
                {" "}
                {heading}{" "}
              </Heading>

              <Text
                mt={2}
                color="support.muted"
                fontSize={{
                  base: "sm",
                  md: "md",
                }}
              >
                {mode === "create"
                  ? "Provide the details below to create a support ticket."
                  : "Update the ticket information and resolution details."}
              </Text>
            </Box>
             {error && <ErrorMessage message={error} />}
            <form onSubmit={handleSubmit}>
              <Stack gap={{ base: 4, md: 5 }}>
                {(mode === "create" || role === "admin") && (
                  <Field.Root required>
                    <Field.Label color="support.text">Title</Field.Label>
                    <Input
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Enter a short title for the issue"
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
                )}

                {(mode === "create" || role === "admin") && (
                  <Field.Root required>
                    <Field.Label color="support.text">Description</Field.Label>
                    <Textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Describe the issue in details..."
                      autoresize
                      minH="120px"
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
                )}

                {mode === "edit" && (role === "admin" || role === "agent") && (
                  <Field.Root>
                    <Field.Label color="support.text">Status</Field.Label>

                    <NativeSelect.Root>
                      <NativeSelect.Field
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        bg="support.surface"
                        color="support.text"
                      >
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Closed">Closed</option>
                      </NativeSelect.Field>
                      <NativeSelect.Indicator />
                    </NativeSelect.Root>
                  </Field.Root>
                )}

                <Field.Root>
                  <Field.Label color="support.text">Priority</Field.Label>

                  <NativeSelect.Root>
                    <NativeSelect.Field
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      bg="support.surface"
                      color="support.text"
                    >
                      <option value="">Select priority</option>
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Critical">Critical</option>
                    </NativeSelect.Field>
                    <NativeSelect.Indicator />
                  </NativeSelect.Root>
                </Field.Root>

                {mode === "edit" && (role === "admin" || role === "agent") && (
                  <Field.Root>
                    <Field.Label color="support.text">Resolution</Field.Label>

                    <Textarea
                      name="resolution"
                      value={formData.resolution || ""}
                      onChange={handleChange}
                      placeholder="Enter the resolution or actions taken..."
                      minH="120px"
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
                )}

                {/* Issue date */}
                {mode === "create" && (
                  <Field.Root required>
                    <Field.Label color="support.text">
                      Issue occurred at
                    </Field.Label>

                    <Input
                      type="datetime-local"
                      name="issueOccurredAt"
                      value={formData.issueOccurredAt}
                      onChange={handleChange}
                      bg="support.surface"
                      color="support.text"
                      _focusVisible={{
                        borderColor: "blue.500",
                        boxShadow: "0 0 0 1px var(--chakra-colors-blue-500)",
                      }}
                      sx={{
                        "&::-webkit-calendar-picker-indicator": {
                          opacity: 1,
                          cursor: "pointer",
                          filter: "invert(0)",
                        },
                      }}
                    />
                  </Field.Root>
                )}

                {/* Agent assignment */}
                {role === "admin" && (
                  <Field.Root>
                    <Field.Label color="support.text">
                      Assigned Agent
                    </Field.Label>

                    <Text fontSize="sm" color="support.muted" mb={1}>
                      Currently assigned:{" "}
                      {formData.assignedTo
                        ? `${formData.assignedTo.firstName} ${formData.assignedTo.lastName}`
                        : "Not assigned"}
                    </Text>

                    <NativeSelect.Root>
                      <NativeSelect.Field
                        name="agent"
                        value={selectedAgent}
                        onChange={(e) => setSelectedAgent(e.target.value)}
                        bg="support.surface"
                        color="support.text"
                      >
                        <option value="">
                          {formData.assignedTo
                            ? "Reassign Agent"
                            : "Assign Agent"}
                        </option>

                        {agents.map((agent) => (
                          <option key={agent._id} value={agent._id}>
                            {agent.firstName} {agent.lastName}
                          </option>
                        ))}
                      </NativeSelect.Field>

                      <NativeSelect.Indicator />
                    </NativeSelect.Root>
                  </Field.Root>
                )}

                {/* Submit */}

                <Button
                  loading={loading}
                  loadingText="Submitting..."
                  type="submit"
                  colorPalette="blue"
                  size="lg"
                  disabled={mode === "create" && !isFormValid}
                  w="100%"
                  mt={2}
                  _disabled={{
                    opacity: 0.5,
                    cursor: "not-allowed",
                  }}
                >
                  {mode === "create" ? "Create Ticket" : "Update Ticket"}
                </Button>

                {/* Back */}
                <Box pt={1} textAlign="center">
                  <BackToHome />
                </Box>
              </Stack>
            </form>
          </Card.Body>
        </Card.Root>
      </Container>
    </Box>
  );
};
