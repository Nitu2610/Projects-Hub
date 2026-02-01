import {
  Container,
  Heading,
  Box,
  Button,
  Spinner,
  Text,
} from "@chakra-ui/react";

import { DeliveryAddressForm } from "../components/DeliveryAddressForm";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { checkoutDeliveryAddress } from "../redux/checkoutSlice";

export const DeliverDetails = () => {
  const [showForm, setShowForm] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const fetchAddress = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:8080/addresses?userId=${user.id}`,
      );
      const data = res.data;
      setDeliveryAddress(data);
    } catch (error) {
      console.log("error -unable to find the delivery address.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchAddress();
    }
  }, [user?.id]);

  useEffect(() => {
    if (deliveryAddress?.length > 0 && !selectedAddress) {
      setSelectedAddress(deliveryAddress[0]);
      dispatch(checkoutDeliveryAddress(deliveryAddress[0]));
    }
  }, [deliveryAddress, selectedAddress, dispatch]);

  if (loading) {
    return (
      <Container centerContent>
        <Spinner size={"lg"} />
      </Container>
    );
  }

  return (
    <Container> 
      <Heading mb={4}>Delivery Deta </Heading>
      {deliveryAddress?.length === 0 ? (
        <>
          <Text>
            No delivery address found. Please add one to place the order.
          </Text>

          <Button
            colorScheme="blue"
            onClick={() => {
              setShowForm(true);
            }}
          >
            Add Address
          </Button>
        </>
      ) : (
        <>
          <Heading size="md" mb={2}>
            Your Delivery Address
          </Heading>

          {deliveryAddress.map((addr) => (
            <Box
              key={addr.id} // always use server id
              boxShadow={
                selectedAddress?.id === addr.id
                  ? "rgba(26, 136, 240, 0.16) 0px 1px 4px, rgb(26, 136, 240) 0px 0px 0px 2px"
                  : "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px"
              }
              borderRadius={"10"}
              p={5}
              mb={2}
              // _hover={{boxShadow: 'rgba(170, 236, 162, 0.16) 0px 1px 4px'}}
              cursor={"pointer"}
              onClick={() => {
                // console.log(addr);
                setSelectedAddress(addr);
                dispatch(checkoutDeliveryAddress(addr));
              }}
            >
              <Text>
                {addr.fName} {addr.lName}
              </Text>
              <Text>{addr.mNum}</Text>
              <Text>
                {addr.address.houseNum}, {addr.address.street},{" "}
                {addr.address.landmark}
              </Text>
              <Text>
                {addr.address.area}, {addr.address.district},{" "}
                {addr.address.state} - {addr.address.pincode}
              </Text>
              <Text>{addr.address.country}</Text>
              <Text>Preferred Time: {addr.preferredTime || "N/A"}</Text>
            </Box>
          ))}
        </>
      )}

      {showForm && (
        <DeliveryAddressForm
          userId={user.id}
          setShowForm={setShowForm}
          onSuccess={(newAddress) => {
            // Add newly saved address to the list and close form
            setDeliveryAddress((prev) => [...prev, newAddress]);
            setShowForm(false);
          }}
        />
      )}
    </Container>
  );
};
