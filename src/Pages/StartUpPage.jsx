import React from "react";
import { Box, Heading } from "@chakra-ui/react";

const StartUpPage = () => {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      height="70vh"
    >
      <Heading as="h1" size="2xl" textAlign="center">
        Welcome to Social Media Website App
      </Heading>
    </Box>
  );
};

export default StartUpPage;
