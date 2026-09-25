import {  Button,} from "@chakra-ui/react";

import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { CartProducts } from "../components/CartProducts";
import { CartSummary } from "../components/CartSummary";


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
