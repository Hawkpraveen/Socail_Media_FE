import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  Input,
  Text,
} from "@chakra-ui/react";
import { setSelectedUser } from "../Utils/Reducers/UserReducer";
import Conversation from "./Conversation";
import { io } from "socket.io-client";
import { setMessages, setOnlineUsers } from "../Utils/Reducers/chatSlice"; // Ensure you have setMessages action
import axios from "axios";

const ChatPage = () => {
  const [socket, setSocket] = useState(null);
  const { currentuser } = useSelector((store) => store.user);
  const { onlineUsers, messages } = useSelector((store) => store.chat);
  const dispatch = useDispatch();
  const [selectedUser, setSelectedUserState] = useState(null);

  useEffect(() => {
    if (currentuser.userDetails._id) {
      const socketConnection = io("https://socail-media-be.onrender.com", {
        query: { userId: currentuser.userDetails._id },
      });
      setSocket(socketConnection);

      // Listen for incoming messages
      socketConnection.on("receiveMessage", (newMessage) => {
        console.log("New message received:", newMessage);
        // Dispatch the new message to Redux
        dispatch(setMessages((prevMessages) => [...prevMessages, newMessage]));
      });

      // Listen for online users
      socketConnection.on("getOnlineUsers", (onlineUsers) => {
        console.log("Online users:", onlineUsers);
        dispatch(setOnlineUsers(onlineUsers)); // Dispatch to store online users
      });

      return () => {
        socketConnection.disconnect();
      };
    }
  }, [currentuser, dispatch]);

  const handleUserClick = (user) => {
    setSelectedUserState(user);
    fetchMessages(user._id); // Fetch messages for the selected user
    dispatch(setSelectedUser(user)); // Dispatch selected user to Redux
  };

  const fetchMessages = async (receiverId) => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(
        `https://socail-media-be.onrender.com/api/messages/all/${receiverId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Dispatch the messages to Redux
      dispatch(setMessages(res.data.messages));
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const sendMessage = async (receiverId, textMessage) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        `https://socail-media-be.onrender.com/api/messages/send/${receiverId}`,
        { textMessage },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        const newMessage = response.data.newMessage;
        console.log("Message sent successfully:", newMessage);

        // Emit the message via Socket.IO for real-time updates
        socket.emit("sendMessage", { receiverId, newMessage });

        // Dispatch the new message to update the state in Redux
        dispatch(setMessages((prevMessages) => [...prevMessages, newMessage]));
      } else {
        console.error("Failed to send message:", response.data.message);
      }
    } catch (error) {
      console.error("Error sending message:", error.response?.data?.message || "An error occurred while sending the message.");
    }
  };

  return (
    <Flex height="100vh" marginLeft="16%">
      <Box width="250px" my={8}>
        <Text fontSize="lg" fontWeight="bold" mb={4}>
          Following Users
        </Text>
        <Divider mb={4} />
        <Box overflowY="auto" height="80vh">
          {currentuser?.userDetails?.following.length > 0 ? (
            currentuser.userDetails.following.map((user) => (
              <Flex
                key={user.id}
                align="center"
                gap={3}
                p={3}
                _hover={{ bg: "gray.50" }}
                cursor="pointer"
                onClick={() => handleUserClick(user)}
              >
                <Avatar src={`https://via.placeholder.com/150`} />
                <Box>
                  <Text fontWeight="medium">{user.username}</Text>
                  <Text
                    fontSize="sm"
                    color={onlineUsers.includes(user.id) ? "green.600" : "red.600"}
                  >
                    {onlineUsers.includes(user.id) ? "online" : "offline"}
                  </Text>
                </Box>
              </Flex>
            ))
          ) : (
            <Text>No following users yet.</Text>
          )}
        </Box>
      </Box>
      <Box
        flex="1"
        borderLeft="1px"
        borderColor="gray.300"
        display="flex"
        flexDirection="column"
        height="full"
      >
        <div className="flex-1">
          {selectedUser && (
            <Conversation
              messages={messages}
              selectedUser={selectedUser}
              onSendMessage={sendMessage}
            />
          )}
        </div>
      </Box>
    </Flex>
  );
};

export default ChatPage;
