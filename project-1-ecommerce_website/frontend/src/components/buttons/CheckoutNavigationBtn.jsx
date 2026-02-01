import { useNavigate, useLocation } from "react-router-dom";
import { Button, Flex } from "@chakra-ui/react";
import { useSelector } from "react-redux";

const steps = [
  "/checkout",
  "/checkout/delivery_details",
  "/checkout/payment_details",
  "/checkout/overview",
];

export const CheckoutNavigationBtn = () => {
  const { items } = useSelector((state) => state.cart);

  const navTo = useNavigate();
  const urlLocation = useLocation(); [/** Using it to get the current url details. */]
  const currentURLIndex = steps.indexOf(urlLocation.pathname);

  return (
    <Flex mt={8} px={6} justify="space-between" align="center">
      {/* Back Button */}
      {currentURLIndex > 0 && (
        <Button
          onClick={() => navTo(steps[currentURLIndex - 1])}
          variant="outline"
        >
          Back
        </Button>
      )}

      {/* Next Button */}
      {currentURLIndex < steps.length - 1 && (
        <Button
          colorScheme="teal"
          onClick={() => navTo(steps[currentURLIndex + 1])}
          isDisabled={items.length === 0}
        >
          Next
        </Button>
      )}
    </Flex>
  );
};
