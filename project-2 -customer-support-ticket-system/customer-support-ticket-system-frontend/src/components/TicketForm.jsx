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
  Textarea,
} from "@chakra-ui/react";

// Reusable ticket form
// Responsibility only for rendering the ticket form and collecting user input.
//
// The form supports both creating and editing tickets.
// Availiable fields are controlled by the current mode and user role.
//
// Data flow:
// Parent page ➡️ TicketForm ➡️ form input ➡️ handleChange/ handleSubmit
//
// Business logic and API comminication remian outside this components.

export const TicketForm = ({
  heading,
  formData,
  handleChange,
  handleSubmit,
  mode = "create",
  role,
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
              {/* Customers can provide the ticket title when creating
                  a ticket. Admins can also edit the title. */}
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
              {/* Customers can provide the issue description when
                  creating a ticket. Admins can edit the description. */}
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

              {/* Agents and admins can update the ticket status
                  while editing an existing ticket. */}
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
              {/* Agents and admins can change the ticket priority. */}
              {mode === "edit" && (role === "admin" || role === "agent") && (
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
              )}

              {/* Resolution details are entered by agents or admins
                  when working on an existing ticket. */}
              {mode === "edit" && (role === "admin" || role === "agent") && (
                <Field.Root required>
                  <Field.Label>Resolution</Field.Label>
                  <Textarea
                    name="resolution"
                    value={formData.resolution || ""}
                    onChange={handleChange}
                    placeholder="Enter resolution details"
                  />
                </Field.Root>
              )}

              {/* Issue time is provided by the customer when creating
                  the ticket and is not edited as part of ticket updates. */}
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
              <Button type="submit" colorPalette="blue" size="lg">
                Submit
              </Button>
            </Stack>
          </form>
        </Card.Body>
      </Card.Root>
    </Container>
  );
};
