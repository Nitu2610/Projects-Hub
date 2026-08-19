import { useCallback, useState } from "react";

export const useForm = (INITIAL_FORM_STATE, onSubmit) => {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);

  // Update the matching form field while keeping the other fields unchanged.
  const handleChange = useCallback((e) => {
    // This is called cargo-cult optimization.
    let { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  }, []);

  // Prevent the browser's default form submission and pass the form data
  // to the callback provided by the component using this hook.
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    console.log(formData);
    setFormData(INITIAL_FORM_STATE);
  };

  return {
    formData,
    setFormData,
    handleChange,
    handleSubmit,
  };
};
