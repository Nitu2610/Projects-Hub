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

export const DeliveryAddressForm = ({ showForm, setAddressBtn, userId }) => {
    const navTo=useNavigate();
    const dispatch=useDispatch();
    const {user}=useSelector(state=>state.auth);
    console.log(user);
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
  const handleSubmit=(e)=>{
    e.preventDefault();
   // console.log(deliveryDetails);
     setIsSaved(true);
updateDeliveryAdderssToServer();
  }

  const updateDeliveryAdderssToServer=async()=>{
   try {
     const res= await axios.post(`http://localhost:8080/addresses`,
      deliveryDetails
     );
     setDeliveryDetails((prev)=> [...prev, res.data]);
     setShowForm(false)
     console.log( 'address saved in server successfully')
   } catch (error) {
    console.log("Failed to save the address in server due to error-", error)
   }
  }

  const handleNext=()=>{
    navTo("payment_details")
  }
  return (
    <Container>
      <Heading>Address Details</Heading>
     {isSaved ? (
          <Box>
            <Text>
                <strong>Name:</strong> {deliveryDetails.fName}{" "}{deliveryDetails.lName}
            </Text>
             <Text>
                <strong>Mobile: </strong>{" "} +91{" "} {deliveryDetails.mNum}
            </Text>

            <Text>
                <strong>Address: </strong>{" "} 
                {`${deliveryDetails.address.houseNum}, ${deliveryDetails.address.street}, near ${deliveryDetails.address.landmark}, ${deliveryDetails.address.area}, ${deliveryDetails.address.district}, ${deliveryDetails.address.state}- ${deliveryDetails.address.pincode}, ${deliveryDetails.address.country}.`}
            </Text>
            <br />
            <Button mt={4} colorScheme="green" onClick={handleNext}>Next</Button>
        </Box>
        
     ):(
       <form onSubmit={handleSubmit}>
        <FormControl isRequired>
          <HStack>
            <FormLabel>First Name : </FormLabel>
            <Input name="fName" onChange={handleChange} value={deliveryDetails.fName}/>
          </HStack>
        </FormControl>

        <FormControl >
          <HStack>
            <FormLabel>Last Name : </FormLabel>
            <Input name="lName"  onChange={handleChange} value={deliveryDetails.lName} />
          </HStack>
        </FormControl>

        <FormControl isRequired>
          <HStack>
            <FormLabel>Mobile Number : </FormLabel>
            <Input name="mNum" type="number" onChange={handleChange} value={deliveryDetails.mNum}/>
          </HStack>
        </FormControl>

        <FormControl isRequired>
          <HStack>
            <FormLabel>Address : </FormLabel>
          <VStack>
              <Input placeholder="House / Flat No"  name="houseNum"  onChange={handleAddressChange} value={deliveryDetails.address.houseNum }/>
             <Input placeholder="Street Name"  name="street" onChange={handleAddressChange} value={deliveryDetails.address.street } />
               <Input placeholder="Landmark"  name="landmark" onChange={handleAddressChange}  value={deliveryDetails.address.landmark } />
                 <Input placeholder="Area"  name="area" onChange={handleAddressChange} value={deliveryDetails.address.area } />
                   <Input placeholder="Pincode"  type="number" name="pincode" onChange={handleAddressChange}  value={deliveryDetails.address.pincode }/>
                     <Input placeholder="District"  name="district" onChange={handleAddressChange}  value={deliveryDetails.address.district } />
                       <Input placeholder="State"  name="state" onChange={handleAddressChange} value={deliveryDetails.address.state }  />
                         <Input placeholder="Country- India"  name="country" value="India" isReadOnly />
          </VStack>
          </HStack>
        </FormControl>

         <Button colorScheme="blue" type="submit">
              Save Address
            </Button>
      </form>
     ) }
    </Container>
  );
};
