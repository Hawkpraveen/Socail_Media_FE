import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  signinStart,
  signinSuccess,
  signinFailure,
} from "../Utils/Reducers/UserReducer";
import {
  Box,
  Flex,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  Stack,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";

const SignInPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.user);

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      dispatch(signinStart());

      const response = await axios.post(
        "http://localhost:5000/api/users/signin",
        {
          email,
          password,
        }
      );

      const token = response.data.token;
      localStorage.setItem("token", token);

      dispatch(signinSuccess(response.data));
      navigate("/home");
    } catch (err) {
      dispatch(signinFailure(err.response?.data?.message || err.message));
    }
  };

  return (
    <Flex minH={"80vh"} align={"center"} justify={"center"}>
      <Stack
        spacing={8}
        mx={"auto"}
        w={"full"}
        maxW={"md"}
        py={12}
        px={6}
        className="bg-neutral-900"
      >
        <Stack align={"center"}>
          <Heading fontSize={"2xl"} className="uppercase">
            Sign In to Your Account
          </Heading>
          <Text fontSize={"lg"} color={"gray.600"}>
            Welcome back! Please sign in to continue.
          </Text>
        </Stack>
        <Box rounded={"lg"} p={8} className="shadow-neutral-600 shadow-lg mt-2">
          <form onSubmit={handleSignIn}>
            <Stack spacing={4}>
              <FormControl id="email" isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormControl>

              <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </FormControl>

              {error && (
                <Text color="red.500" fontSize="sm">
                  {error}
                </Text>
              )}

              <Stack spacing={10}>
                <Button
                  bg={"teal.500"}
                  color={"white"}
                  _hover={{
                    bg: "green.400",
                  }}
                  type="submit"
                  isLoading={loading}
                >
                  {loading ? <Spinner size="sm" /> : "Sign In"}
                </Button>
              </Stack>
            </Stack>
          </form>
          <Stack pt={6}>
            <Text align={"center"}>
              Don't have an account?{" "}
              <Button
                as={RouterLink}
                to="/signup"
                color={"blue.400"}
                variant="link"
              >
                Sign Up
              </Button>
            </Text>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
};

export default SignInPage;
