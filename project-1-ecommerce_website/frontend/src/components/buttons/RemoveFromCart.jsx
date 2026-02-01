import { useDispatch } from "react-redux";
import { removeFromCart } from "../../redux/cartSlice";
import { Button } from "@chakra-ui/react";

export const RemoveFromCart = ({item,existingItem}) => {
  const dispatch = useDispatch();
  return (
    <Button
      colorScheme="red"
      flex={1}
      onClick={() => dispatch(removeFromCart(item))}
      disabled={!existingItem || existingItem.productQuantity == 0}
    >
      Remove
    </Button>
  );
};
