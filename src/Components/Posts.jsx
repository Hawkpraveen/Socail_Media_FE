import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPostsStart,
  fetchPostsSuccess,
  fetchPostsFailure,
  toggleLikeSuccess,
  addReplySuccess,
} from "../Utils/Reducers/PostReducer";
import {
  Spinner,
  Box,
  Text,
  Image,
  Flex,
  Avatar,
  Button,
  Input,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import axios from "axios";
import FollowButton from './FollowButton';
import { toggleFollow } from "../Utils/Reducers/UserReducer";

const Posts = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.currentuser);
  const currentUserId = currentUser.userDetails._id;

  const { posts, loading, error } = useSelector((state) => state.posts);

  const [commentText, setCommentText] = useState("");
  const [selectedPost, setSelectedPost] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const fetchPosts = async () => {
      dispatch(fetchPostsStart());
      try {
        const response = await axios.get("http://localhost:5000/api/post/");
        dispatch(fetchPostsSuccess(response.data));
      } catch (err) {
        dispatch(
          fetchPostsFailure(
            err.response?.data?.message || "Failed to fetch posts"
          )
        );
      }
    };

    fetchPosts();
  }, [dispatch]);

  const likePost = async (postId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("Token is missing. Please log in.");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:5000/api/post/like/${postId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.userId) {
        dispatch(toggleLikeSuccess({ postId, userId: response.data.userId }));
        toast({
          title: response.data.message,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      if (error.response?.status === 400) {
        toast({
          title: error.response.data.message,
          status: "info",
          duration: 3000,
          isClosable: true,
        });
      } else {
        console.error(
          "Error liking the post:",
          error.response?.data || error.message
        );
      }
    }
  };

  const openCommentModal = (post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const closeCommentModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
  };

  const addComment = async (postId) => {
    if (!commentText) return;
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("Token is missing. Please log in.");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:5000/api/post/reply/${postId}`,
        { text: commentText },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const newReply = {
        userId: response.data.userId,
        text: commentText,
        username: response.data.username,
      };

      dispatch(addReplySuccess({ postId, reply: newReply }));
      setCommentText("");
      closeCommentModal(); 
      // Success toast
      toast({
        title: "Comment added successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error(
        "Error adding comment:",
        error.response?.data || error.message
      );

      // Failure toast
      toast({
        title: "Failed to add comment.",
        description: error.response?.data?.message || "Please try again later.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <Text color="red.500">{error}</Text>;
  }

  return (
    <Box mt={"15px"}>
      {posts.map((post) => {
        const userLikedPost = post.likes.some(
          (like) => like._id === currentUserId
        );

        return (
          <Box
            key={post._id}
            p={4}
            borderWidth="1px"
            borderRadius="md"
            shadow="md"
            mb={4}
          >
            <Flex alignItems="center" mb={2}>
              <Avatar
                name={post.postedBy.username}
                src={post.postedBy.profilePic}
              />
              <Text ml={3} fontWeight="bold">
                {post.postedBy.username}
              </Text>
              <FollowButton
                userId={post.postedBy._id}
                isFollowing={post.postedBy.isFollowing}
                onFollowToggle={(userId, isFollowing) => {
                  dispatch(toggleFollow({ userId, isFollowing }));
                }}
              />
            </Flex>
            {post.img && (
              <Box display="flex" justifyContent="center" mb={2}>
                <Image
                  src={post.img}
                  alt="Post image"
                  borderRadius="md"
                  maxW="50%"
                  maxH="50%"
                />
              </Box>
            )}
            <Text mb={2}>{post.text}</Text>
            <Text fontSize="sm" color="gray.500">
              {post.likes.length} {post.likes.length === 1 ? "Like" : "Likes"}
            </Text>
            <Flex justifyContent="space-between" mt={2}>
              <Button
                colorScheme={userLikedPost ? "teal" : "blue"}
                size="sm"
                onClick={userLikedPost ? null : () => likePost(post._id)}
                isDisabled={userLikedPost}
              >
                {userLikedPost ? "Liked" : "Like"}
              </Button>
              <Button
                colorScheme="teal"
                size="sm"
                onClick={() => openCommentModal(post)}
              >
                Comment
              </Button>
            </Flex>
          </Box>
        );
      })}

      {/* Comment Modal */}
      {selectedPost && (
        <Modal isOpen={isModalOpen} onClose={closeCommentModal} size="2xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Reply to {selectedPost.postedBy.username}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Flex>
                {/* Right: Image and Comments */}
                <Box flex="1" p={3}>
                  {selectedPost.img ? (
                    <Image
                      src={selectedPost.img}
                      alt="Post Image"
                      maxH="200px"
                      maxW={"fit"}
                      objectFit="cover"
                      mb={4}
                      borderRadius={"10px"}
                    />
                  ) : (
                    <Text>No Image Available</Text>
                  )}

                  {/* Comments Section */}
                  <Box
                    maxH="200px"
                    overflowY="auto"
                    borderWidth="1px"
                    p={2}
                    mt={4}
                  >
                    {selectedPost.replies.length > 0 ? (
                      selectedPost.replies.map((reply, index) => (
                        <Box
                          key={index}
                          mt={2}
                          p={2}
                          borderWidth="1px"
                          borderRadius="md"
                        >
                          <Text fontWeight="bold">{reply.username}:</Text>
                          <Text>{reply.text}</Text>
                        </Box>
                      ))
                    ) : (
                      <Text>No comments yet.</Text>
                    )}
                  </Box>

                  <Input
                    mt={3}
                    placeholder="Add a comment"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                  />
                </Box>
              </Flex>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" onClick={() => addComment(selectedPost._id)}>
                Add Comment
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Box>
  );
};

export default Posts;
