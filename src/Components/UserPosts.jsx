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
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons"; // Import only the Delete icon

const UserPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentuser } = useSelector((state) => state.user);
  const username = currentuser.userDetails.username;

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        // Replace with your actual API endpoint
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
      // Remove the deleted post from the state
      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
    } catch (err) {
      console.error("Failed to delete post:", err);
      setError("Failed to delete post.");
    }
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
    <Box className=" pb-5 mb-12">
      <Heading as="h2" size="lg" mb={4}>
        Posts
      </Heading>
      <List spacing={3}>
        {posts.map((post) => (
          <ListItem key={post._id} p={5} borderWidth={1} borderRadius="md">
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Heading as="h1" size="md" mb={5}>
                Post: Title: {post.text}
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
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default UserPosts;
