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

export const TicketForm = ({
  heading,
  formData,
  handleChange,
  handleSubmit,
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
              <Field.Root required>
                <Field.Label>Title</Field.Label>
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter ticket title"
                />
              </Field.Root>

              <Field.Root required>
                <Field.Label>Description</Field.Label>
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the issue..."
                />
              </Field.Root>

              <Field.Root>
                <Field.Label>Status</Field.Label>
                <NativeSelect.Root>
                  <NativeSelect.Field
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option >Select status</option>
                    <option value="open">Open</option>
                    <option value="inprogress">In Progress</option>
                    <option value="closed">Closed</option>
                  </NativeSelect.Field>
                  <NativeSelect.Indicator />
                </NativeSelect.Root>
              </Field.Root>

              <Field.Root>
                <Field.Label>Priority</Field.Label>
                <NativeSelect.Root>
                  <NativeSelect.Field
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                  >
                    <option >Select priority</option>
                    <option value={1}>Low</option>
                    <option value={2}>Medium</option>
                    <option value={3}>High</option>
                  </NativeSelect.Field>
                  <NativeSelect.Indicator />
                </NativeSelect.Root>
              </Field.Root>

              <Field.Root required>
                <Field.Label>Created By</Field.Label>
                <Input
                  name="createdBy"
                  value={formData.createdBy}
                  onChange={handleChange}
                  placeholder="Enter your name"
                />
              </Field.Root>

              <Button
                type="submit"
                colorPalette="blue"
                size="lg"
              >
                Submit
              </Button>
            </Stack>
          </form>
        </Card.Body>
      </Card.Root>
    </Container>
  );
};