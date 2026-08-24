import { Button } from "@chakra-ui/react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export const BackToHome = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  return (
    
  <Button onClick={() => navigate(`/`)}>Back to Home </Button>
  );
};
