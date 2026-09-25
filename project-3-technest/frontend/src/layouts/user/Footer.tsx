
import {
  Box,
  Container,
  Flex,
  Heading,
  HStack,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import {
  FiFacebook,
  FiGithub,
  FiInstagram,
  FiLinkedin,
  FiMail,
  FiTwitter,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export const Footer = () => {
  const navigate = useNavigate();

  return (
    <Box as="footer" bg="gray.900" color="white" mt={12}>
      <Container maxW="1400px" py={10}>
        <SimpleGrid
          columns={{ base: 1, sm: 2, md: 4 }}
          gap={{ base: 8, md: 12 }}
        >
          {/* Brand */}
          <VStack align="start" gap={3}>
            <Heading size="md">TechNest</Heading>

            <Text fontSize="sm" color="gray.400" lineHeight="1.7">
              Your trusted destination for electronics, gadgets, and
              everyday technology.
            </Text>

            <HStack gap={3} pt={1}>
              <Box
                as="button"
                aria-label="GitHub"
                color="gray.400"
                _hover={{ color: "white" }}
              >
                <FiGithub size={18} />
              </Box>

              <Box
                as="button"
                aria-label="LinkedIn"
                color="gray.400"
                _hover={{ color: "white" }}
              >
                <FiLinkedin size={18} />
              </Box>

              <Box
                as="button"
                aria-label="Instagram"
                color="gray.400"
                _hover={{ color: "white" }}
              >
                <FiInstagram size={18} />
              </Box>

              <Box
                as="button"
                aria-label="Twitter"
                color="gray.400"
                _hover={{ color: "white" }}
              >
                <FiTwitter size={18} />
              </Box>

              <Box
                as="button"
                aria-label="Facebook"
                color="gray.400"
                _hover={{ color: "white" }}
              >
                <FiFacebook size={18} />
              </Box>
            </HStack>
          </VStack>

          {/* Shop */}
          <VStack align="start" gap={3}>
            <Heading size="sm">Shop</Heading>

            <Text
              fontSize="sm"
              color="gray.400"
              cursor="pointer"
              _hover={{ color: "white" }}
              onClick={() => navigate("/products")}
            >
              Products
            </Text>

            <Text
              fontSize="sm"
              color="gray.400"
              cursor="pointer"
              _hover={{ color: "white" }}
              onClick={() => navigate("/categories")}
            >
              Categories
            </Text>

            <Text
              fontSize="sm"
              color="gray.400"
              cursor="pointer"
              _hover={{ color: "white" }}
              onClick={() => navigate("/deals")}
            >
              Deals
            </Text>

            <Text
              fontSize="sm"
              color="gray.400"
              cursor="pointer"
              _hover={{ color: "white" }}
              onClick={() => navigate("/cart")}
            >
              Cart
            </Text>
          </VStack>

          {/* Account */}
          <VStack align="start" gap={3}>
            <Heading size="sm">Account</Heading>

            <Text
              fontSize="sm"
              color="gray.400"
              cursor="pointer"
              _hover={{ color: "white" }}
              onClick={() => navigate("/profile")}
            >
              My Profile
            </Text>

            <Text
              fontSize="sm"
              color="gray.400"
              cursor="pointer"
              _hover={{ color: "white" }}
              onClick={() => navigate("/orders")}
            >
              My Orders
            </Text>

            <Text
              fontSize="sm"
              color="gray.400"
              cursor="pointer"
              _hover={{ color: "white" }}
              onClick={() => navigate("/address")}
            >
              My Addresses
            </Text>
          </VStack>

          {/* Support */}
          <VStack align="start" gap={3}>
            <Heading size="sm">Support</Heading>

            <HStack gap={2} align="start">
              <FiMail size={17} />
              <Text fontSize="sm" color="gray.400">
                support@technest.com
              </Text>
            </HStack>

            <Text fontSize="sm" color="gray.400" lineHeight="1.6">
              Need help with your order or account?
              <br />
              We're here to help.
            </Text>
          </VStack>
        </SimpleGrid>

        <Box borderTopWidth="1px" borderColor="gray.700" mt={10} pt={6}>
          <Flex
            direction={{ base: "column", md: "row" }}
            justify="space-between"
            align={{ base: "start", md: "center" }}
            gap={3}
          >
            <Text fontSize="sm" color="gray.500">
              © {new Date().getFullYear()} TechNest. All rights reserved.
            </Text>

            <HStack gap={5}>
              <Text
                fontSize="sm"
                color="gray.500"
                cursor="pointer"
                _hover={{ color: "white" }}
              >
                Privacy Policy
              </Text>

              <Text
                fontSize="sm"
                color="gray.500"
                cursor="pointer"
                _hover={{ color: "white" }}
              >
                Terms & Conditions
              </Text>
            </HStack>
          </Flex>
        </Box>
      </Container>
    </Box>
  );
};
