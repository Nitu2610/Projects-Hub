import React, { useEffect } from "react";
import {
  Box,
  Heading,
  VStack,
  Text,
  Divider,
  OrderedList,
  ListItem,
  HStack,
  Container,
  Card,
  CardBody,
  Button,
  FormControl,
  FormLabel,
  Input,
  position,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { checkoutCartProducts } from "../redux/checkoutSlice";

export const CheckoutProductsSummary = () => {
  const { items } = useSelector((state) => state.cart);
  const navTo = useNavigate();
  const dispatch = useDispatch();

  // console.log(items)

  useEffect(() => {
    dispatch(checkoutCartProducts(items));
  }, [items]);
  const { totalPrice, totalProducts } = items.reduce(
    (acc, cur) => {
      acc.totalProducts += cur.productQuantity;
      acc.totalPrice += cur.productQuantity * cur.price;
      return acc;
    },
    { totalPrice: 0, totalProducts: 0 },
  );

  const formatPrice = (price) =>
    price.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
    });

  return (
    <Box>
      <Container maxW="container.lg" py={10}>
        <Card>
          <CardBody>
            {/* Order Summary */}
            <VStack align="stretch" spacing={4}>
              <HStack justify="space-between">
                <Text fontWeight="bold">Total Products</Text>
                <Text>{totalProducts}</Text>
              </HStack>

              <HStack justify="space-between">
                <Text fontWeight="bold">Total Price</Text>
                <Text color="green.600" fontWeight="bold">
                  {formatPrice(totalPrice)}
                </Text>
              </HStack>

              <Divider />

              <OrderedList spacing={4}>
                {items.map((product, i) => {
                  const { title, productQuantity, price } = product;

                  return (
                    <ListItem key={i}>
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="semibold">{title}</Text>

                        <Text fontSize="sm" color="gray.600">
                          Quantity: {productQuantity}{" "}
                          {productQuantity > 1 ? "pieces" : "piece"}
                        </Text>

                        <Text fontWeight="bold">
                          {formatPrice(price * productQuantity)}
                        </Text>
                      </VStack>
                    </ListItem>
                  );
                })}
              </OrderedList>
            </VStack>
          </CardBody>
        </Card>
      </Container>
    </Box>
  );
};
