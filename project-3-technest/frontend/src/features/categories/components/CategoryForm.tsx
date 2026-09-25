import {
  Button,
  Field,
  Input,
  NativeSelect,
  Dialog,
  Portal,
  Stack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useAddCategoryMutation, useUpdateCategoryMutation } from "../api/categoryApi";
import { AdminCategory } from "../../../types/category.types";


interface CategoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  category?: AdminCategory;
  parentCategories: AdminCategory[];
}

export const CategoryForm = ({
  isOpen,
  onClose,
  category,
  parentCategories,
}: CategoryFormProps) => {
  const isEditMode = Boolean(category);

  const [name, setName] = useState("");
  const [parent, setParent] = useState<string>("");

  const [addCategory, { isLoading: isAdding }] = useAddCategoryMutation();

  const [updateCategory, { isLoading: isUpdating }] =
    useUpdateCategoryMutation();

  const isSubmitting = isAdding || isUpdating;

  useEffect(() => {
    if (category) {
      setName(category.name);
      setParent(category.parent?._id ?? "");
    } else {
      setName("");
      setParent("");
    }
  }, [category, isOpen]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      return;
    }

    try {
      if (isEditMode && category) {
        const response = await updateCategory({
          id: category._id,
          name: trimmedName,
        }).unwrap();

      } else {
        await addCategory({
          name: trimmedName,
          parent: parent || null,
        }).unwrap();
      }

      setName("");
      setParent("");
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(details) => {
        if (!details.open) {
          onClose();
        }
      }}
    >
      <Portal>
        <Dialog.Backdrop />

        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>
                {isEditMode ? "Edit Category" : "Add Category"}
              </Dialog.Title>
            </Dialog.Header>

            <form onSubmit={handleSubmit}>
              <Dialog.Body>
                <Stack gap={5}>
                  <Field.Root required>
                    <Field.Label>
                      Category Name
                      <Field.RequiredIndicator />
                    </Field.Label>

                    <Input
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="Enter category name"
                    />
                  </Field.Root>

                  {!isEditMode && (
                    <Field.Root>
                      <Field.Label>Parent Category</Field.Label>

                      <NativeSelect.Root>
                        <NativeSelect.Field
                          value={parent}
                          onChange={(event) => setParent(event.target.value)}
                        >
                          <option value="">None</option>

                          {parentCategories
                            .filter((item) => item.parent === null)
                            .map((item) => (
                              <option key={item._id} value={item._id}>
                                {item.name}
                              </option>
                            ))}
                        </NativeSelect.Field>

                        <NativeSelect.Indicator />
                      </NativeSelect.Root>
                    </Field.Root>
                  )}
                </Stack>
              </Dialog.Body>

              <Dialog.Footer>
                <Button
                  variant="outline"
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>

                <Button type="submit" loading={isSubmitting}>
                  {isEditMode ? "Save Changes" : "Add Category"}
                </Button>
              </Dialog.Footer>
            </form>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
