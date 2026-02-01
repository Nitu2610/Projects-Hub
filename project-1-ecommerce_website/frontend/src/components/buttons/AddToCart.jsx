import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/cartSlice";
import { Button } from "@chakra-ui/react";

export const AddToCart = ({item}) => {
  const dispatch = useDispatch();
  return (
    <Button
      colorScheme="green"
      flex={1}
      onClick={() => dispatch(addToCart(item))}
    >
      Add
    </Button>
  );
};
