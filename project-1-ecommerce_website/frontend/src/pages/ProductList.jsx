import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../redux/actions/productActions";
import {
  Box,
  Heading,
  Image,
  SimpleGrid,
  Text,
  Badge,
  Stack,
  Skeleton,
  Button,
  Flex,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { clearCart } from "../redux/cartSlice";
import { Add_Romove_Cart_Container } from "../components/Add_Romove_Cart_Container";
import { base_API } from "../api/base_api";

export const ProductList = () => {
  const dispatch = useDispatch();
  const { productsArray, loading, error } = useSelector(
    (state) => state.products,
  );

  const { items, totalQuantity, totalPrice } = useSelector(
    (state) => state.cart,
  );

  const navigateTo = useNavigate();

  {
    /** The displatch in the useEffect dependency is just because of React’s Hooks rules suggest that any variable used inside useEffect should be in the dependency array. Apart from that, it can no may make changes or trigger the thunk creator fn. */
  }
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  if (loading)
    return (
      <SimpleGrid columns={[1, 2]} spacing={6} w="80%" m="auto">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} height="350px" borderRadius="md" />
        ))}
      </SimpleGrid>
    );

  if (error) return <div>Error fetching data: {error}</div>;

  return (
    <Box w="85%" m="auto" mt={8}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        bg="white"
        px={5}
        py={3}
        borderBottom="1px solid"
        borderColor="gray.200"
        mb={4}
        position={"sticky"}
        top={"0"}
        zIndex={"100"}
        boxShadow={"sm"}
      >
        <Box>
          <Text fontSize="lg" fontWeight="bold">
            Total Items: {totalQuantity}
          </Text>
          <Text fontSize="lg" fontWeight="bold" color="green.600">
            Total Price: ₹{totalPrice}
          </Text>
        </Box>

        <Box display={"flex"} columnGap={"20px"}>
          {items.length > 0 ? (
            <Button
              colorScheme="blue"
              variant="solid"
              onClick={() => navigateTo("/checkout")}
            >
              Move to Checkout
            </Button>
          ) : (
            " "
          )}

          <Button
            colorScheme="red"
            variant="solid"
            onClick={() => dispatch(clearCart())}
          >
            Clear Cart
          </Button>
        </Box>
      </Box>

      {productsArray.length === 0 && (
        <Text textAlign="center">Internal data is empty</Text>
      )}

      <SimpleGrid columns={[1, 2, 3, 4]} spacing={10} mt={"60px"}>
        {productsArray.map((item) => {
          const { id, title, brand, price, category, image, description } =
            item;
          const existingItem = items.find((item) => item.id === id);

          return (
            <Box
              key={id}
              bg="white"
              boxShadow="rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em"
              borderRadius="lg"
              overflow="hidden"
              transition="all 0.3s"
              _hover={{ transform: "translateY(-6px)", boxShadow: "xl" }}
              display="flex"
              flexDirection="column"
            >
              <Box
                w={"100%"}
                h={"180px"}
                bg={"grey.100"}
                display={"flex"}
                alignItems={"center"}
                justifyContent={"center"}
                mt={"10px"}
                onClick={() => {
                  navigateTo(`/product/${id}`);
                }}
              >
                <Image
                  src={`${base_API}/${image}`}
                  alt={title}
                  objectFit="contain"
                  maxW="100%"
                  maxH="100%"
                  borderRadius={"5px"}
                />
              </Box>

              <Box p={5}>
                <Stack
                  direction="row"
                  align="center"
                  justify="space-between"
                  mb={3}
                >

                   <Text fontSize="lg" fontWeight="bold" color="green.600" mb={2}>
                  ₹{price}
                </Text>

                  <Heading as="h4" size="md">
                    {title}
                  </Heading>

                  <Badge colorScheme="purple" variant="subtle">
                    {category}
                  </Badge>
                </Stack>

                <Text fontSize="sm" color="gray.600" mb={1}>
                  Brand: <strong>{brand}</strong>
                </Text>

               

                <Text fontSize="sm" color="gray.600" noOfLines={2}>
                  {description}
                </Text>
              </Box>
              <Add_Romove_Cart_Container
                item={item}
                existingItem={existingItem}
              />
            </Box>
          );
        })}
      </SimpleGrid>
    </Box>
  );
};
