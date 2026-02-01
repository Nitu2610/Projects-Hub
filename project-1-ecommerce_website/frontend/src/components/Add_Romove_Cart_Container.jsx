import { Box } from '@chakra-ui/react'
import { AddToCart } from './buttons/AddToCart'
import { RemoveFromCart } from './buttons/RemoveFromCart'
import { useSelector } from 'react-redux';

export const Add_Romove_Cart_Container = ({item}) => {
    const {items} = useSelector((state) => state.cart);
    let{id}= item;
const existingItem= items.find(item => item.id === id);
  return (
     <Box
                bg="gray.50"
                w="100%"
                p={4}
                borderRadius="md"
                border="1px solid"
                borderColor="gray.200"
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                gap={4}
                mt={"auto"}
              >
                <Box
                  bg="gray.800"
                  color="white"
                  px={3}
                  py={1}
                  borderRadius="full"
                  fontWeight="bold"
                  fontSize="md"
                  minW="40px"
                  textAlign="center"
                >
                  {" "}
                  {existingItem ? existingItem.productQuantity : 0}
                </Box>
                <AddToCart item={item} />
                <RemoveFromCart existingItem={existingItem} item={item} />
              </Box>
  )
}
