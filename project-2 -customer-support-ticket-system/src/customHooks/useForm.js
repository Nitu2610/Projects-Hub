import { useState } from "react";

export const useForm = (INITIAL_FORM_STATE, onSubmit) => {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);

  const handleChange = (e) => {
    let { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };
  
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
