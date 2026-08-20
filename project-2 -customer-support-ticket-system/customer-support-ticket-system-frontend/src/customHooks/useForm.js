

import { useCallback, useState } from "react";

// Reusable form hook for managing field values and form submission.
// The component provides the initial form state and submit callback.

export const useForm = (INITIAL_FORM_STATE, onSubmit) => {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);

  // Updates the changed field while keeping the other fields unchanged.
  // Number inputs are converted from strings to numbers before storing them. 
  const handleChange = useCallback((e) => {
    // This is called cargo-cult optimization.
    let { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  }, []);

  // Prevents the default browser submission and passes the current
  // form data to the callback provided by the component.
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData(INITIAL_FORM_STATE);
  };

  return {
    formData,
    setFormData,
    handleChange,
    handleSubmit,
  };
};
