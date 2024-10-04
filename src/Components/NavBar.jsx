import React from "react";
import {
  Box,
  Flex,
  Button,
  Stack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { HamburgerIcon } from "@chakra-ui/icons";

const NavBar = () => {
  return (
    <Box className="bg-neutral-900">
      <Flex
        h={20}
        alignItems={"center"}
        justifyContent={"space-between"}
        p={"20px"}
      >
        <Box fontWeight="bold" color="white">
          <Button as={RouterLink} to="/" colorScheme={"teal"} variant="solid">
            Social Media App
          </Button>
        </Box>

        <Flex alignItems={"center"}>
          <Stack
            direction={"row"}
            spacing={10}
            display={{ base: "none", md: "flex" }}
          >
           
            <Button
              as={RouterLink}
              to="/signin"
              colorScheme={"teal"}
              variant="solid"
            >
              Sign In
            </Button>
            <Button
              as={RouterLink}
              to="/signup"
              colorScheme={"teal"}
              variant="outline"
            >
              Sign Up
            </Button>
          </Stack>

      
          <Box display={{ base: "flex", md: "none" }}>
            <Menu>
              <MenuButton
                as={Button}
                rightIcon={<HamburgerIcon />}
                colorScheme={"teal"}
              ></MenuButton>
              <MenuList>
                <MenuItem as={RouterLink} to="/signin">
                  Sign In
                </MenuItem>
                <MenuItem as={RouterLink} to="/signup">
                  Sign Up
                </MenuItem>
              </MenuList>
            </Menu>
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
};

export default NavBar;
