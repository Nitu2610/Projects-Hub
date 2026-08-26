import { Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export const BackToHome = () => {
  const navigate = useNavigate();
  return <Button onClick={() => navigate(`/`)}>Back to Home </Button>;
};
