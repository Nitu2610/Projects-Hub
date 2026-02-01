import {
  Box,
  Button,
  Container,
  Heading,
  Spinner,
  Text,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BackToHome } from "../components/buttons/BackToHome";
import { resetCheckout } from "../redux/checkoutSlice";
import { clearCart } from "../redux/cartSlice";

export const OrderSummary = () => {
  const dispatch=useDispatch();
  const { cartItems, deliveryAddress, paymentMethod } = useSelector(
    (state) => state.checkout,
  );
  const navTo = useNavigate();
  const [processing, setProcessing] = useState({
    loading: false,
    error: null,
    success: false,
    orderNum: "",
  });

  const formatPrice = (price) =>
    price.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
    });
  //  console.log(paymendMethod)

  const fakeDelay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  async function handlePlaceOrder(cartItems, deliveryAddress, paymentMethod) {
    setProcessing((prev) => ({ ...prev, loading: true, error: null }));
    let orderId = Date.now();

    let orderDetails = {
      OrderedProduct: cartItems,
      DeliveryAddress: deliveryAddress,
      PaymentMode: paymentMethod,
      orderId,
    };
    try {
      await fakeDelay(3000);
      await axios.post("http://localhost:8080/orders", orderDetails);
      setProcessing((prev) => ({
        ...prev,
        loading: false,
        success: true,
        orderNum: orderId,
      }));
      // console.log(" orderdetails post successfully !!!");
     dispatch(resetCheckout());
     dispatch(clearCart())

    } catch (error) {
      setProcessing((prev) => ({
        ...prev,
        loading: false,
        error: "Order couldn't place",
      }));
    //  console.log("Order couldn't place");
    }
  }

  if (processing.loading) {
    return (
      <Container>
        <Heading>
          {" "}
          Loading ... <Spinner />
        </Heading>
      </Container>
    );
  }

  if (processing.error) {
    return (
      <Container>
        <Heading> Error: 404, Order was not place.</Heading>
      </Container>
    );
  }
  return (
    <>
      {processing.success ? (
        <>
          <Text>
            {" "}
            Order has been placed Successfully and order number is{" "}
            {processing.orderNum} .
          </Text>
          <BackToHome />
        </>
      ) : (
        <Container>
          <Heading m={"auto"}> Order Summary</Heading>

          <Container>
            <Heading mt={10}> Product List</Heading>
            <ol>
              {cartItems.map((product, i) => {
                let { id, title, price, productQuantity } = product;
                return (
                  <li key={i}>
                    <Box
                      key={id}
                      boxShadow={"rgba(0, 0, 0, 0.05) 0px 0px 0px 1px"}
                      borderRadius={3}
                      p={2}
                      mb={2}
                    >
                      <Text> {title} </Text>
                      <Text>
                        {" "}
                        {`${price > 1 ? "Costs" : "Cost"} : ${formatPrice(price * productQuantity)} for`}{" "}
                      </Text>
                      <Text>
                        {" "}
                        {`${productQuantity} ${productQuantity > 1 ? "pc's ." : "pc ."}`}{" "}
                      </Text>
                    </Box>
                  </li>
                );
              })}
            </ol>

            <hr style={{ marginTop: "30px", width: "100%" }} />

            <Heading mt={"30px"}>Delivery Address: </Heading>
            <Box
              key={deliveryAddress.id}
              boxShadow={
                "rgba(26, 136, 240, 0.16) 0px 1px 4px, rgb(26, 136, 240) 0px 0px 0px 2px"
              }
              borderRadius={"10"}
              p={5}
              mb={2}
              mt={"20px"}
            >
              <Text>
                {deliveryAddress.fName} {deliveryAddress.lName}
              </Text>
              <Text>{deliveryAddress.mNum}</Text>
              <Text>
                {deliveryAddress.address.houseNum},{" "}
                {deliveryAddress.address.street},{" "}
                {deliveryAddress.address.landmark}
              </Text>
              <Text>
                {deliveryAddress.address.area},{" "}
                {deliveryAddress.address.district},{" "}
                {deliveryAddress.address.state} -{" "}
                {deliveryAddress.address.pincode}
              </Text>
              <Text>{deliveryAddress.address.country}</Text>
              <Text>
                Preferred Time: {deliveryAddress.preferredTime || "N/A"}
              </Text>
            </Box>

            <hr style={{ marginTop: "30px", width: "100%" }} />

            <Heading mt={"30px"}>Payment Mode: </Heading>
            <Text style={{ marginTop: "50px" }}> {paymentMethod}</Text>
          </Container>

          <hr />

          <Button
            onClick={() =>
              handlePlaceOrder(cartItems, deliveryAddress, paymentMethod)
            }
          >
            Place Order
          </Button>
        </Container>
      )}
    </>
  );
};
