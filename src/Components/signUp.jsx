import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  signupStart,
  signupSuccess,
  signupFailure,
} from "../Utils/Reducers/UserReducer";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  Text,
  Stack,
  Spinner,
} from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";

const SignUp = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !username || !email || !password) {
      toast.error("Please fill all the fields.");
      return;
    }

    try {
      dispatch(signupStart());
      const response = await axios.post(
        "http://localhost:5000/api/users/signup",
        {
          name,
          username,
          email,
          password,
        }
      );
      dispatch(signupSuccess(response.data));
      navigate("/signin");
    } catch (err) {
      dispatch(signupFailure(err.response?.data?.message || "Sign up failed"));
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minH="80vh"
      py={12}
      
    >
      <Box maxW="md" w="full" boxShadow="lg" rounded="lg" p={8} className="bg-neutral-900">
        <Heading as="h2" size="xl" textAlign="center" mb={6}>
          Sign Up to App
        </Heading>
        <form onSubmit={handleSubmit} className="shadow-neutral-600 shadow-lg mt-2 p-2">
          <Stack spacing={4}>
            <FormControl id="name" isRequired>
              <FormLabel>Name</FormLabel>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
              />
            </FormControl>

            <FormControl id="username" isRequired>
              <FormLabel>Username</FormLabel>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Your username"
              />
            </FormControl>

            <FormControl id="email" isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
              />
            </FormControl>

            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
              />
            </FormControl>

            {error && (
              <Text color="red.500" fontSize="sm">
                {error}
              </Text>
            )}

            <Button
              type="submit"
              bg={"teal.500"}
                  color={"white"}
                  _hover={{
                    bg: "green.400",
                  }}
              isFullWidth
              isLoading={loading}
              loadingText="Signing up..."
            >
              {loading ? <Spinner size="sm" /> : "Sign Up"}
            </Button>
          </Stack>
        </form>
        <Stack pt={6}>
            <Text align={"center"}>
            Already have an account?{" "}
              <Button
                as={RouterLink}
                to="/signin"
                color={"blue.400"}
                variant="link"
              >
                Sign Up
              </Button>
            </Text>
          </Stack>
      </Box>
    </Box>
  );
};

export default SignUp;
