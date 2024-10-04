import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signOutSuccess } from "../Utils/Reducers/UserReducer";
import { useToast } from "@chakra-ui/react";

const Logout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast = useToast();

  useEffect(() => {
    // Clear the token from local storage
    localStorage.removeItem("token");

    // Dispatch logout action to update Redux state
    dispatch(signOutSuccess());

    // Show a success toast notification
    toast({
      title: "Logged out successfully.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });

    
    navigate("/login");
  }, [dispatch, navigate, toast]);

  return null; 
};

export default Logout;
