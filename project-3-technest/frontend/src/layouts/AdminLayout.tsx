import { Box, Flex } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import { AdminSidebar } from "../components/admin/AdminSidebar";

export const AdminLayout = () => {
  return (
    <Flex minH="100vh" bg="gray.50">
      <Box
        w="260px"
        bg="white"
        borderRightWidth="1px"
        borderColor="gray.200"
        flexShrink={0}
      >
       <AdminSidebar/>
      </Box>

      <Box flex="1" minW="0">
        <Outlet />
      </Box>
    </Flex>
  );
};