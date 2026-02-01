import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Button,
  VStack,
  InputGroup,
  InputLeftAddon,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signupUser } from "../redux/actions/authActions";
import { useNavigate } from "react-router-dom";

export const SignUp = () => {
  //** The formField contain all the detials required for lable, and input attributes */
  const formFields = [
    { name: "firstName", label: "First Name", type: "text", required: true },
    { name: "lastName", label: "Last Name", type: "text" },
    { name: "email", label: "Email Address", type: "email", required: true },
    { name: "password", label: "Password", type: "password", required: true },
    {
      name: "confirmPassword",
      label: "Confirm Password",
      type: "password",
      required: true,
    },
    { name: "dob", label: "Date Of Birth", type: "date", required: true },
    { name: "mobile", label: "Mobile Number", type: "tel" },
  ];
  //** getInitialState dyamically add the value to every key */
  const getInitialState = () => {
    let obj = {};
    formFields.forEach((e) => (obj[e.name] = ""));
    return obj;
  };

  const dispatch=useDispatch();

  const [formData, setFormData] = useState(getInitialState());
  const {user, loading,error}=useSelector(state=> state.auth);
  const navigateTo=useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Password and Confirm Password must match!");
      return;
    }

    dispatch(signupUser(formData))
  //  console.log("Form Submitted:", formData);
    setFormData(getInitialState());
  };

  
useEffect(() => {
    if (user) {
      const timer = setTimeout(() => {
        navigateTo("/login");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [user, navigateTo]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    
    <Box w="100%" py="40px">
      <Heading textAlign="center" mb={10}>
        Sign Up
      </Heading>

    {loading ? <Text>The Details are Updating</Text>  : (
        <Box
        as="form"
        onSubmit={handleSubmit}
        w={["90%", "70%", "50%", "40%"]}
        mx="auto"
        p="35px"
        borderRadius="lg"
        boxShadow="md"
      >
        <VStack spacing={5}>
          {formFields.map((field, index) => {
            const isError = field.required && !formData[field.name];
            return (
              <FormControl key={index} isInvalid={isError}>
                <FormLabel>{field.label}</FormLabel>
                {field.type === "tel" ? (
                  <InputGroup>
                    <InputLeftAddon children={"+91"} />
                    <Input
                      type={field.type}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                       focusBorderColor="blue.400"
                    />
                  </InputGroup>
                ) : (
                  <Input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                     focusBorderColor="blue.400"
                  />
                )}

                {!isError ? (
                  <FormHelperText>Enter {field.label}</FormHelperText>
                ) : (
                  <FormErrorMessage>{field.label} is required</FormErrorMessage>
                )}
              </FormControl>
            );
          })}

          <Button colorScheme="blue" type="submit" w="50%" mx="auto">
            Submit
          </Button>
        </VStack>
      </Box>
    )}

    {error ? <Heading>{error.message}</Heading> :" " }
    </Box>
  );
};
