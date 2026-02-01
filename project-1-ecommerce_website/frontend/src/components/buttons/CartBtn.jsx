
import { FaShoppingCart } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

export const CartBtn = () => {
  const navigateTo = useNavigate();

  return (
    <FaShoppingCart
      size={20}
      style={{ cursor: "pointer" }}
      onClick={() => navigateTo("/cart")}
    />
  );
};
