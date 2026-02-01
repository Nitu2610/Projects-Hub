import {Box, Button, Heading, SimpleGrid, Text} from '@chakra-ui/react';
import {useNavigate} from 'react-router-dom'

export const Home = () => {
  const navigate=useNavigate();
  return (
  <Box w={'100%'}>

{/*Hero Section */}

<Box bg='gray.50'
py={20}
textAlign={'center'}
>
  <Heading size={'2xl'} mb={4}> Welcome to ShopEase</Heading>
  <Text fontSize={'lg'} color={'gray.600'} mb={6}> Discover quality products at the best prices</Text>
<Button colorScheme='teal' size={'lg'} onClick={()=> navigate('/products')}> Shop Now</Button>
</Box>

{/* Highlights Sections */}

<SimpleGrid column={[1,2,4]} 
spacing={6}
w={'80%'}
m={'auto'}
py={12}
>

  {[ 'Free Delivery', 'Secure Payments', 'Easy Returns', '24/7 Support'] .map((item,i)=>(
    <Box
    key={i}
    p={6}
    textAlign={'center'}
    border={'1px solid'}
    borderColor={'gray.200'}
    borderRadius={'md'}
    boxShadow={'sm'}
    >
      <Heading size={'md'}> {item}</Heading>
    </Box>
  ))}

</SimpleGrid>

<Box 
bg={'teal.500'}
color={'white'}
py={16}
textAlign={'center'}
>
<Heading 
bg={'teal.500'}
color='white'
py={16}
textAlign={'center'}
> Start Shopping Today</Heading>
<Button
colorScheme='blackAlpha'
variant={'outline'}
size={'lg'}
onClick={()=> navigate('/products')}
> Browse Products</Button>
</Box>
  </Box>
  )
}
