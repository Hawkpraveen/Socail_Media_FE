import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import {
  Box,
  Heading,
  Image,
  List,
  ListItem,
  Spinner,
  Alert,
  AlertIcon,
  IconButton,
  Tooltip,
  Text,
  Flex,
  Button,
  Container,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";

const UserPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentuser } = useSelector((state) => state.user);
  const username = currentuser.userDetails.username;
  const [expandedComments, setExpandedComments] = useState({});

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/post/user/${username}`
        );
        setPosts(response.data);
      } catch (err) {
        setError("Failed to fetch posts.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, [username]);

  const handleDelete = async (postId) => {
    try {
      await axios.delete(`http://localhost:5000/api/post/${postId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
    } catch (err) {
      console.error("Failed to delete post:", err);
      setError("Failed to delete post.");
    }
  };

  const toggleExpandComments = (postId) => {
    setExpandedComments((prevState) => ({
      ...prevState,
      [postId]: !prevState[postId],
    }));
  };

  if (loading) {
    return <Spinner size="xl" />;
  }

  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        {error}
      </Alert>
    );
  }

  return (
    <Container
      className="pb-5 mb-12 text-center overflow-y-auto"
      maxW={"620px"}
    >
      <Heading className="uppercase p-5 pb-6">Posts</Heading>
      <List spacing={3}>
        {posts.map((post) => (
          <ListItem key={post._id} p={5} borderWidth={1} borderRadius="md">
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Heading as="h1" size="md" mb={5}>
                {post.text || "Untitled Post"}
              </Heading>
              <Tooltip label="Delete Post" aria-label="Delete Post">
                <IconButton
                  icon={<DeleteIcon />}
                  aria-label="Delete Post"
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(post._id)}
                />
              </Tooltip>
            </Box>
            {post.img && (
              <Image
                src={post.img}
                alt="Post Image"
                borderRadius="md"
                mt={2}
                boxSize="300px"
                objectFit="cover"
                className="mx-auto"
              />
            )}

            {/* Display likes and comments */}
            <Flex mt={5} justifyContent="space-between" alignItems="center">
              <Text fontWeight="bold">{post.likes?.length || 0} Likes</Text>
              <Text fontWeight="bold">
                {post.replies?.length || 0} Comments
              </Text>
            </Flex>

            {/* Display comments section */}
            {post.replies?.length > 0 && (
              <Box mt={5} textAlign="left">
                <Heading as="h3" size="sm" mb={2}>
                  Comments:
                </Heading>

                {/* Display up to 3 comments, or all if expanded */}
                {post.replies
                  .slice(
                    0,
                    expandedComments[post._id] ? post.replies.length : 3
                  )
                  .map((comment, index) => (
                    <Text key={index} className="p-2 rounded-lg mb-2">
                      {comment.username}: {comment.text}
                    </Text>
                  ))}

                {/* Show 'View More' or 'View Less' button */}
                {post.replies.length > 3 && (
                  <Button
                    size="sm"
                    variant="link"
                    colorScheme="blue"
                    onClick={() => toggleExpandComments(post._id)}
                  >
                    {expandedComments[post._id] ? "View Less" : "View More"}
                  </Button>
                )}
              </Box>
            )}
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default UserPosts;
