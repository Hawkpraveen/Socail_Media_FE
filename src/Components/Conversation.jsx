import React from "react";
import { Box, Button, Flex, Input, Text } from "@chakra-ui/react";

const Conversation = ({ messages = [], currentUserId, onSendMessage, selectedUser }) => {
  const [textMessage, setTextMessage] = React.useState("");

  const handleSendMessage = () => {
    if (textMessage.trim() !== "") {
      onSendMessage(selectedUser._id, textMessage);
      setTextMessage(""); // Clear input after sending
    }
  };

  // Log messages for debugging
  console.log("Messages:", messages);
  console.log("Messages Type:", Array.isArray(messages));

  return (
    <Box p={4} overflowY="auto" height="full">
      <Box mb={4}>
        {Array.isArray(messages) && messages.length > 0 ? (
          messages.map((message) => (
            <Flex
              key={message._id}
              mb={2}
              justify={message.senderId === currentUserId ? "flex-end" : "flex-start"}
            >
              <Box
                p={2}
                borderRadius="md"
                bg={message.senderId === currentUserId ? "blue.500" : "gray.200"}
                color={message.senderId === currentUserId ? "white" : "black"}
                maxWidth="70%"
              >
                <Text fontWeight="bold">
                  {message.senderId === currentUserId ? "You" : selectedUser.username}:
                </Text>
                <Text>{message.message}</Text>
              </Box>
            </Flex>
          ))
        ) : (
          selectedUser && <Text>No messages yet with {selectedUser.username}.</Text>
        )}
      </Box>
      <Flex align="center">
        <Input
          value={textMessage}
          onChange={(e) => setTextMessage(e.target.value)}
          type="text"
          placeholder="Type a message..."
          variant="filled"
          flex="1"
          mr={2}
        />
        <Button onClick={handleSendMessage}>Send</Button>
      </Flex>
    </Box>
  );
};

export default Conversation;
