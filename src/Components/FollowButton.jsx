import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@chakra-ui/react";
import axios from "axios";
import { toast } from "react-toastify";
import { followUser, unfollowUser } from "../Utils/Reducers/UserReducer";

const FollowButton = ({ userId, username }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.currentuser);
  const following = currentUser?.userDetails?.following || [];

  // Check if the current user is following the user to be followed
  const isFollowing = following.some(
    (followingUser) => followingUser.id === userId
  );

  const handleFollow = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("Token is missing. Please log in.");
      return;
    }

    try {
      const response = await axios.post(
        `https://socail-media-be.onrender.com/api/users/follow-user/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        if (isFollowing) {
          // If currently following, dispatch unfollow action
          dispatch(unfollowUser({ id: userId })); // Pass only the ID
        } else {
          // If not following, dispatch follow action
          dispatch(followUser({ id: userId, username })); // Include username for storage
        }
      }
    } catch (error) {
      console.error("Error following/unfollowing user:", error);
      toast({
        title: "Error!",
        description: error.response?.data?.error || "Please try again later.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Button
      onClick={handleFollow}
      colorScheme={isFollowing ? "red" : "teal"}
      size="sm"
    >
      {isFollowing ? "Unfollow" : "Follow"}
    </Button>
  );
};

export default FollowButton;
