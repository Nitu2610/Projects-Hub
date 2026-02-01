import { Box, Heading, List, ListItem, Text } from "@chakra-ui/react";

export const About = () => {
  return (
    <Box w={"80%"} m={"auto"} mt={10}>
      <Heading size={"xl"} mb={4}>
        {" "}
        About This Project{" "}
      </Heading>

      <Text fontSize={"md"} color={"gray.600"} mb={6}>
        This is a full-featured ecommerce web application built to simulate a
        real-world online shopping experience. Users can browse products, manage
        their cart, complete checkout, and place orders.
      </Text>

      <Heading size={"md"} mb={2}>
        {" "}
        Tech Stack
      </Heading>

      <List spacing={2} mb={6} pl={4} styleType={"disc"}>
        <ListItem> React (Vite) </ListItem>
        <ListItem> Redux Toolkit for state management </ListItem>
        <ListItem> Chakra UI for UI compoments</ListItem>
        <ListItem> JSON Server for mock backend APIs </ListItem>
        <ListItem> Render & Netlify for deployment</ListItem>
      </List>

      <Heading size={"md"} mb={2}>
        {" "}
        Key Features
      </Heading>
       <List spacing={2} mb={6} pl={4} styleType={"disc"}>
      <ListItem> Product listing and product details pages </ListItem>
      <ListItem> Cart management with quantity control</ListItem>
      <ListItem> Multi-step checkout flow</ListItem>
      <ListItem> User authentication (signup & login) </ListItem>
      <ListItem> Protected routes and persistent login </ListItem>
       </List>

      <Heading size={"md"} mb={2}>
        Purpose
      </Heading>
      <Text fontSize={"md"} color={"gray.600"}>
        {" "}
        This project was built to strengthen my understanding of frontend
        architecture, state management, and real-world ecommerce workflows while
        following best practices in React development.
      </Text>
    </Box>
  );
};
