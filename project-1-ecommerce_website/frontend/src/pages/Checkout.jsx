import { Box, Heading } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import { CheckoutNavigationBtn } from "../components/buttons/CheckoutNavigationBtn";

export const Checkout = () => {
  return (
    <Box>
      <Heading> Checkout </Heading>
      <Outlet />{" "}
      {/**  // the outlet act as a container which will render the child components.  */}
      <CheckoutNavigationBtn />{" "}
      {/** its checkout nav button -> net anf back. */}
    </Box>
  );
};
