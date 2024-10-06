import React from "react";
import Posts from "../Components/Posts";
import Header from "../Components/Header";
import { Container } from "@chakra-ui/react";

const PostsPage = () => {
  return (
    <Container maxW={"620px"}>
      <Header />
      <Posts />
    </Container>
  );
};

export default PostsPage;
