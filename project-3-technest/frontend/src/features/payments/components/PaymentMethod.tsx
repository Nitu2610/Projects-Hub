import {
  Box,
  Button,
  Card,
  Field,
  Heading,
  Input,
  RadioGroup,
  Stack,
  Text,
} from "@chakra-ui/react";

import { useState } from "react";

export type PaymentMethodType =
  | "COD"
  | "UPI"
  | "CARD";

interface PaymentMethodProps {
  paymentMethod: PaymentMethodType;
  setPaymentMethod: (
    method: PaymentMethodType
  ) => void;
  total: number;

  handlePlaceOrder: (
    paymentMethod: PaymentMethodType,
    upiId: string,
    cardType: "CREDIT" | "DEBIT"
  ) => void;

  isProcessing: boolean;
  paymentMessage: string;
}

export const PaymentMethod = ({
  paymentMethod,
  setPaymentMethod,
  total,
  handlePlaceOrder,
  isProcessing,
  paymentMessage,
}: PaymentMethodProps) => {
  const [upiId, setUpiId] = useState("");

  const [cardType, setCardType] =
    useState<"CREDIT" | "DEBIT">("CREDIT");

  const handlePayment = () => {
    handlePlaceOrder(
      paymentMethod,
      upiId,
      cardType
    );
  };

  return (
    <Card.Root
      bg="bg.panel"
      borderColor="border"
    >
      <Card.Body>
        <Stack gap={5}>
          <Heading size="md">
            Payment Method
          </Heading>

          <RadioGroup.Root
            value={paymentMethod}
            onValueChange={(details) =>
              setPaymentMethod(
                details.value as PaymentMethodType
              )
            }
          >
            <Stack gap={4}>
              <RadioGroup.Item value="COD">
                <RadioGroup.ItemHiddenInput />
                <RadioGroup.ItemIndicator />
                <RadioGroup.ItemText>
                  Cash on Delivery
                </RadioGroup.ItemText>
              </RadioGroup.Item>

              <RadioGroup.Item value="UPI">
                <RadioGroup.ItemHiddenInput />
                <RadioGroup.ItemIndicator />
                <RadioGroup.ItemText>
                  UPI
                </RadioGroup.ItemText>
              </RadioGroup.Item>

              <RadioGroup.Item value="CARD">
                <RadioGroup.ItemHiddenInput />
                <RadioGroup.ItemIndicator />
                <RadioGroup.ItemText>
                  Card
                </RadioGroup.ItemText>
              </RadioGroup.Item>
            </Stack>
          </RadioGroup.Root>

          {paymentMethod === "UPI" && (
            <Box
              borderWidth="1px"
              borderColor="border"
              borderRadius="lg"
              p={4}
            >
              <Stack gap={4}>
                <Heading size="sm">
                  UPI Payment
                </Heading>

                <Field.Root>
                  <Field.Label>
                    UPI ID
                  </Field.Label>

                  <Input
                    placeholder="example@upi"
                    value={upiId}
                    onChange={(event) =>
                      setUpiId(event.target.value)
                    }
                  />
                </Field.Root>

                <Text
                  fontSize="sm"
                  color="fg.muted"
                >
                  Demo success ID: success@technest
                </Text>

                <Text
                  fontSize="sm"
                  color="fg.muted"
                >
                  Demo failure ID: failed@technest
                </Text>

                <Text
                  fontSize="sm"
                  color="fg.muted"
                >
                  Payment session expires in 5 minutes.
                </Text>
              </Stack>
            </Box>
          )}

          {paymentMethod === "CARD" && (
            <Box
              borderWidth="1px"
              borderColor="border"
              borderRadius="lg"
              p={4}
            >
              <Stack gap={4}>
                <Heading size="sm">
                  Card Payment
                </Heading>

                <RadioGroup.Root
                  value={cardType}
                  onValueChange={(details) =>
                    setCardType(
                      details.value as
                        | "CREDIT"
                        | "DEBIT"
                    )
                  }
                >
                  <Stack gap={3}>
                    <RadioGroup.Item value="CREDIT">
                      <RadioGroup.ItemHiddenInput />
                      <RadioGroup.ItemIndicator />
                      <RadioGroup.ItemText>
                        Credit Card
                      </RadioGroup.ItemText>
                    </RadioGroup.Item>

                    <RadioGroup.Item value="DEBIT">
                      <RadioGroup.ItemHiddenInput />
                      <RadioGroup.ItemIndicator />
                      <RadioGroup.ItemText>
                        Debit Card
                      </RadioGroup.ItemText>
                    </RadioGroup.Item>
                  </Stack>
                </RadioGroup.Root>

                <Text
                  fontSize="sm"
                  color="fg.muted"
                >
                  This is a simulated card payment.
                  Do not enter real card details.
                </Text>
              </Stack>
            </Box>
          )}

          {paymentMessage && (
            <Text
              color="error"
              fontWeight="500"
            >
              {paymentMessage}
            </Text>
          )}

          <Button
            width="100%"
            bg="primary"
            color="white"
            _hover={{
              bg: "primary.hover",
            }}
            onClick={handlePayment}
            disabled={isProcessing}
          >
            {isProcessing
              ? "Processing Payment..."
              : paymentMethod === "COD"
                ? "Place Order"
                : `Pay ₹${total.toLocaleString(
                    "en-IN"
                  )}`}
          </Button>
        </Stack>
      </Card.Body>
    </Card.Root>
  );
};