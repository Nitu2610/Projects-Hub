import { Box, Flex } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";


import { AdminSidebar } from "./AdminSidebar";
import { Navbar } from "../user/Navbar";

export const AdminLayout = () => {
  return (
    <Box minH="100vh" bg="bg">
      <Navbar />

      <Flex minH="calc(100vh - 73px)">
        <Box
          w="260px"
          bg="bg.panel"
          borderRightWidth="1px"
          borderColor="border"
          flexShrink={0}
          display={{ base: "none", md: "block" }}
        >
          <AdminSidebar />
        </Box>

        <Box flex="1" minW="0">
          <Outlet />
        </Box>
      </Flex>
    </Box>
  );
};