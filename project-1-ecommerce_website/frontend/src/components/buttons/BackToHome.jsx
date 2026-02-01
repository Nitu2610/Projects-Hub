import { useNavigate } from "react-router-dom";
import { Button, ButtonGroup } from "@chakra-ui/react";

export const BackToHome = () => {
  const navigate = useNavigate();
  return (
    <Button colorScheme="blue" display={'flex'} p={5} m={"auto"} marginTop={20} onClick={() => navigate("/")}  >
      Back to Home
    </Button>
  );
};
