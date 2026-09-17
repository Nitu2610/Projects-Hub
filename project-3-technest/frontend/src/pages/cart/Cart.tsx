import { Box, Button, Heading, Image, Stack, Text } from "@chakra-ui/react";
import { useGetCartQuery } from "../../redux/api/cartApi";
import { CartItem } from "../../components/cart/CartItem";
import { CartSummary } from "../../components/cart/CartSummary";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { CartProducts } from "./CartProducts";

export const Cart = () => {
  const [cartTotal, setCartTotal] = useState(0);
  const navigate = useNavigate();

  return (
    <>
      <CartProducts setCartTotal={setCartTotal} />
      <CartSummary total={cartTotal} />
      <Button onClick={() => navigate("/checkout")}>Move to checkout </Button>
    </>
  );
};
