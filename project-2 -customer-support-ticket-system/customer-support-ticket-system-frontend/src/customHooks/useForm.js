import { useState } from "react";

// Reusable hook for form state and submission.
export const useForm = ( INITIAL_FORM_STATE, submitFn) => {
  // Stores the current form values.
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);

  // Updates the changed field while preserving other values.
  const handleChange = (e) => {
    let { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

 // Prevents default submission and passes form data to the parent.
  const handleSubmit = (e) => {
    e.preventDefault();
    submitFn(formData);
  };

  return {
    formData,
    setFormData,
    handleChange,
    handleSubmit,
  };
};
