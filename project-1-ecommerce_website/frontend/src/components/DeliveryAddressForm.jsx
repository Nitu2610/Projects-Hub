import {
  Container,
  Heading,
  FormControl,
  FormLabel,
  Input,
  HStack,
  VStack,
  Text,
  Box,
  Button,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export const DeliveryAddressForm = ({ showForm, setShowForm, userId }) => {
  const navTo = useNavigate();
  const { user } = useSelector((state) => state.auth);
 //  console.log(user);
  const [deliveryDetails, setDeliveryDetails] = useState({
    userId,
    fName: "",
    lName: "",
    mNum: "",
    address: {
      houseNum: "",
      street: "",
      landmark: "",
      area: "",
      pincode: "",
      district: "",
      state: "",
      country: "INR",
    },
    preferredTime: "",
  });
  const [isSaved, setIsSaved] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDeliveryDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setDeliveryDetails((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value,
      },
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(deliveryDetails);
    try {
      const res = await api.post(`/addresses`, deliveryDetails);
      setIsSaved(true);
      setShowForm(false);
      console.log("Address saved in server successfully");

      // notify parent
    if (typeof onSuccess === "function") {
      onSuccess(res.data); 
    }
    } catch (error) {
      console.log("Failed to save the address in server due to error-", error);
    }
  };

  const handleNext = () => {
    navTo("payment_details");
  };
  return (
    <Container>
      <Heading mb={6}>Address Details</Heading>

      {isSaved ? (
        <Box>
          <Text>
            <strong>Name:</strong> {deliveryDetails.fName}{" "}
            {deliveryDetails.lName}
          </Text>
          <Text>
            <strong>Mobile:</strong> +91 {deliveryDetails.mNum}
          </Text>
          <Text>
            <strong>Address:</strong>{" "}
            {`${deliveryDetails.address.houseNum}, ${deliveryDetails.address.street}, near ${deliveryDetails.address.landmark}, ${deliveryDetails.address.area}, ${deliveryDetails.address.district}, ${deliveryDetails.address.state} - ${deliveryDetails.address.pincode}, ${deliveryDetails.address.country}.`}
          </Text>

          <Button mt={4} colorScheme="green" onClick={handleNext}>
            Next
          </Button>
        </Box>
      ) : (
        <form onSubmit={handleSubmit}>
          <FormControl isRequired mb={3}>
            <HStack>
              <FormLabel>First Name:</FormLabel>
              <Input
                name="fName"
                onChange={handleChange}
                value={deliveryDetails.fName}
              />
            </HStack>
          </FormControl>

          <FormControl mb={3}>
            <HStack>
              <FormLabel>Last Name:</FormLabel>
              <Input
                name="lName"
                onChange={handleChange}
                value={deliveryDetails.lName}
              />
            </HStack>
          </FormControl>

          <FormControl isRequired mb={3}>
            <HStack>
              <FormLabel>Mobile Number:</FormLabel>
              <Input
                name="mNum"
                type="number"
                onChange={handleChange}
                value={deliveryDetails.mNum}
              />
            </HStack>
          </FormControl>

          <FormControl isRequired mb={3}>
            <HStack align="start">
              <FormLabel>Address:</FormLabel>
              <VStack align="stretch">
                <Input
                  placeholder="House / Flat No"
                  name="houseNum"
                  value={deliveryDetails.address.houseNum}
                  onChange={handleAddressChange}
                />
                <Input
                  placeholder="Street Name"
                  name="street"
                  value={deliveryDetails.address.street}
                  onChange={handleAddressChange}
                />
                <Input
                  placeholder="Landmark"
                  name="landmark"
                  value={deliveryDetails.address.landmark}
                  onChange={handleAddressChange}
                />
                <Input
                  placeholder="Area"
                  name="area"
                  value={deliveryDetails.address.area}
                  onChange={handleAddressChange}
                />
                <Input
                  placeholder="Pincode"
                  type="number"
                  name="pincode"
                  value={deliveryDetails.address.pincode}
                  onChange={handleAddressChange}
                />
                <Input
                  placeholder="District"
                  name="district"
                  value={deliveryDetails.address.district}
                  onChange={handleAddressChange}
                />
                <Input
                  placeholder="State"
                  name="state"
                  value={deliveryDetails.address.state}
                  onChange={handleAddressChange}
                />
                <Input
                  placeholder="Country - India"
                  name="country"
                  value="India"
                  isReadOnly
                />
              </VStack>
            </HStack>
          </FormControl>

         <HStack mt={4} spacing={4}>
            <Button colorScheme="blue" type="submit">
              Save Address
            </Button>
            <Button
              variant="outline"
              colorScheme="red"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </Button>
          </HStack>
        </form>
      )}
    </Container>
  );
};
