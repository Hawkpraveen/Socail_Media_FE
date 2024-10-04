import React from "react";
import { Button, useToast } from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { toggleFollow } from "../Utils/Reducers/UserReducer"; 

const FollowButton = ({ userId, isFollowing }) => {
  const toast = useToast();
  const dispatch = useDispatch();

  const handleFollowToggle = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const response = await axios.post(
        `http://localhost:5000/api/users/follow-user/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );


      dispatch(toggleFollow({ userId, isFollowing }));

      toast({
        title: response.data.message,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Failed to follow/unfollow.",
        description: error.response?.data?.message || "Please try again later.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Button
      ml="auto"
      colorScheme={isFollowing ? "red" : "blue"}
      size="sm"
      onClick={handleFollowToggle}
    >
      {isFollowing ? "Unfollow" : "Follow"}
    </Button>
  );
};

export default FollowButton;
