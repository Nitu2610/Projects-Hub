import {
  Button,
  Card,
  Container,
  Field,
  Stack,
  Heading,
  Input,
  NativeSelect,
  Textarea,
} from "@chakra-ui/react";
import { BackToHome } from "./BackToHome";

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
  mode = "create",
  role,
  agents,
  selectedAgent,
  setSelectedAgent,
}) => {
 

  return (
    <Container maxW="lg" py={8}>
      <Card.Root>
        <Card.Body>
          <Heading size="lg" mb={6}>
            {heading}
          </Heading>

          <form onSubmit={handleSubmit}>
            <Stack gap={5}>
              {/* Customers create titles; admins can edit them. */}
              {(mode === "create" || role === "admin") && (
                <Field.Root required>
                  <Field.Label>Title</Field.Label>
                  <Input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter ticket title"
                  />
                </Field.Root>
              )}
              {/* Customers provide descriptions; admins can edit them. */}
              {(mode === "create" || role === "admin") && (
                <Field.Root required>
                  <Field.Label>Description</Field.Label>
                  <Textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe the issue..."
                    autoresize
                  />
                </Field.Root>
              )}

              {/* Agents and admins can update ticket status. */}
              {mode === "edit" && (role === "admin" || role === "agent") && (
                <Field.Root>
                  <Field.Label>Status</Field.Label>

                  <NativeSelect.Root>
                    <NativeSelect.Field
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
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
                <Field.Label>Priority</Field.Label>
                <NativeSelect.Root>
                  <NativeSelect.Field
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
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

              {/* Agents and admins can add or update resolution details. */}
              {mode === "edit" && (role === "admin" || role === "agent") && (
                <Field.Root>
                  <Field.Label>Resolution</Field.Label>
                  <Textarea
                    name="resolution"
                    value={formData.resolution || ""}
                    onChange={handleChange}
                    placeholder="Enter resolution details"
                  />
                </Field.Root>
              )}

              {/* Customers provide the issue date when creating a ticket. */}
              {mode === "create" && (
                <Field.Root required>
                  <Field.Label>Issue Occurred At</Field.Label>
                  <Input
                    type="datetime-local"
                    name="issueOccurredAt"
                    value={formData.issueOccurredAt}
                    onChange={handleChange}
                  />
                </Field.Root>
              )}

              {/* Only admins can assign or reassign tickets. */}
              {role === "admin" && (
                <Field.Root>
                  <Field.Label>
                    Assigned Agent :{" "}
                    {formData.assignedTo
                      ? `${formData.assignedTo.firstName} ${formData.assignedTo.lastName}`
                      : "Not assigned"}
                  </Field.Label>
                  <NativeSelect.Root>
                    <NativeSelect.Field
                      value={selectedAgent}
                      onChange={(e) => setSelectedAgent(e.target.value)}
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

              <Button
                loading={loading}
                loadingText="Submitting..."
                type="submit"
                colorPalette="blue"
                size="lg"
                disabled={!isFormValid}
              >
                Submit
              </Button>
              <BackToHome />
            </Stack>
          </form>
        </Card.Body>
      </Card.Root>
    </Container>
  );
};
