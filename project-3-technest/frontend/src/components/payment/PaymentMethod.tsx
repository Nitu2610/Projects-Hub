import {
  Box,
  Button,
  Card,
  Field,
  Flex,
  Heading,
  Input,
  RadioGroup,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";

export type PaymentMethodType = "COD" | "UPI" | "CARD";

interface PaymentMethodProps {
  paymentMethod: PaymentMethodType;
  setPaymentMethod: (method: PaymentMethodType) => void;
  total: number;
  handlePlaceOrder: (
    paymentMethod: PaymentMethodType,
    upiId: string,
    cardType: "CREDIT" | "DEBIT",
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

  const [cardType, setCardType] = useState<"CREDIT" | "DEBIT">("CREDIT");

  const handlePayment = () => {
    handlePlaceOrder(paymentMethod, upiId, cardType);
  };

  return (
    <Card.Root>
      <Card.Body>
        <Stack gap={5}>
          <Heading size="md">Payment Method</Heading>

          <RadioGroup.Root
            value={paymentMethod}
            onValueChange={(details) =>
              setPaymentMethod(details.value as PaymentMethodType)
            }
          >
            <Stack gap={4}>
              <RadioGroup.Item value="COD">
                <RadioGroup.ItemHiddenInput />
                <RadioGroup.ItemIndicator />
                <RadioGroup.ItemText>Cash on Delivery</RadioGroup.ItemText>
              </RadioGroup.Item>

              <RadioGroup.Item value="UPI">
                <RadioGroup.ItemHiddenInput />
                <RadioGroup.ItemIndicator />
                <RadioGroup.ItemText>UPI</RadioGroup.ItemText>
              </RadioGroup.Item>

              <RadioGroup.Item value="CARD">
                <RadioGroup.ItemHiddenInput />
                <RadioGroup.ItemIndicator />
                <RadioGroup.ItemText>Card</RadioGroup.ItemText>
              </RadioGroup.Item>
            </Stack>
          </RadioGroup.Root>

          {/* UPI */}
          {paymentMethod === "UPI" && (
            <Box borderWidth="1px" borderRadius="md" p={4}>
              <Stack gap={4}>
                <Heading size="sm">UPI Payment</Heading>

                <Field.Root>
                  <Field.Label>UPI ID</Field.Label>

                  <Input
                    placeholder="example@upi"
                    value={upiId}
                    onChange={(event) => setUpiId(event.target.value)}
                  />
                </Field.Root>

                <Text fontSize="sm">Demo success ID: success@technest</Text>

                <Text fontSize="sm">Demo failure ID: failed@technest</Text>

                <Text fontSize="sm">Payment session expires in 5 minutes.</Text>
              </Stack>
            </Box>
          )}

          {/* Card */}
          {paymentMethod === "CARD" && (
            <Box borderWidth="1px" borderRadius="md" p={4}>
              <Stack gap={4}>
                <Heading size="sm">Card Payment</Heading>

                <RadioGroup.Root
                  value={cardType}
                  onValueChange={(details) =>
                    setCardType(details.value as "CREDIT" | "DEBIT")
                  }
                >
                  <Stack gap={3}>
                    <RadioGroup.Item value="CREDIT">
                      <RadioGroup.ItemHiddenInput />
                      <RadioGroup.ItemIndicator />
                      <RadioGroup.ItemText>Credit Card</RadioGroup.ItemText>
                    </RadioGroup.Item>

                    <RadioGroup.Item value="DEBIT">
                      <RadioGroup.ItemHiddenInput />
                      <RadioGroup.ItemIndicator />
                      <RadioGroup.ItemText>Debit Card</RadioGroup.ItemText>
                    </RadioGroup.Item>
                  </Stack>
                </RadioGroup.Root>

                <Field.Root>
                  <Field.Label>Card Number</Field.Label>

                  <Input placeholder="Test card number" />
                </Field.Root>

                <Flex gap={4}>
                  <Field.Root>
                    <Field.Label>Expiry</Field.Label>

                    <Input placeholder="MM/YY" />
                  </Field.Root>

                  <Field.Root>
                    <Field.Label>CVV</Field.Label>

                    <Input placeholder="CVV" type="password" />
                  </Field.Root>
                </Flex>

                <Text fontSize="sm">
                  This is a simulated payment. Do not enter real card details.
                </Text>
              </Stack>
            </Box>
          )}

          {paymentMessage && <Text fontWeight="medium">{paymentMessage}</Text>}

          <Button width="100%" onClick={handlePayment} disabled={isProcessing}>
            {isProcessing
              ? "Processing Payment..."
              : paymentMethod === "COD"
                ? "Place Order"
                : `Pay ₹${total.toLocaleString("en-IN")}`}
          </Button>
        </Stack>
      </Card.Body>
    </Card.Root>
  );
};
