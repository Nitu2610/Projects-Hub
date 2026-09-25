import { Heading } from "@chakra-ui/react";

interface ErrorCompProps {
  status: number;
  message: string;
}

export const ErrorComp = ({ status, message }: ErrorCompProps) => {
  return (
    <Heading>
      Error code: {status}, due to {message}
    </Heading>
  );
};