import React from "react";
import { Container, Icon } from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";
import PostsPage from "../Pages/PostsPage";

import { FaComments, FaHome, FaSignOutAlt, FaUser } from "react-icons/fa";
import UserProfile from "./UserProfile";
import ChatPage from "./ChatPage";

const Sidebar = () => {
  const location = useLocation();

  const urlParams = new URLSearchParams(location.search);
  const tab = urlParams.get("tab");

  const renderComponent = () => {
    if (tab === "profile") {
      return <UserProfile />;
    }
    if (tab === "chat") {
      return <ChatPage />;
    }

    return <PostsPage />;
  };

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-auto ">
      <div className="hidden md:flex flex-col w-64 bg-neutral-950 text-white p-6">
        <Link to="/home" className="mb-6 text-lg font-semibold">
          Logo
        </Link>
        <nav className="flex flex-col space-y-4">
          <Link
            to="/home"
            className="hover:bg-teal-600 p-2 rounded flex items-center"
          >
            <Icon as={FaHome} boxSize={4} mr={2} /> Home
          </Link>
          <Link
            to="/home?tab=chat"
            className="hover:bg-teal-600 p-2 rounded flex items-center"
          >
            <Icon as={FaComments} boxSize={4} mr={2} />
            Messages
          </Link>
          <Link
            to="/home?tab=profile"
            className="hover:bg-teal-600 p-2 rounded flex items-center"
          >
            <Icon as={FaUser} boxSize={4} mr={2} />
            Profile
          </Link>
          <Link
            to="/logout"
            className="hover:bg-teal-600 p-2 rounded flex items-center"
          >
            <Icon as={FaSignOutAlt} boxSize={4} mr={2} />
            Logout
          </Link>
        </nav>
      </div>

      <Container
        className="flex-1 pt-10 pb-20 main-content bg-neutral-950 w-full "
        maxW="full"
      >
        {renderComponent()}
      </Container>

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-neutral-900 text-white flex justify-around p-4">
        <Link to="/home" className="flex flex-col items-center">
          <Icon as={FaHome} boxSize={7} mr={2} />
          <span className="text-sm">Home</span>
        </Link>
        <Link to="/home?tab=chat" className="flex flex-col items-center">
          <Icon as={FaComments} boxSize={7} mr={2} />
          <span className="text-sm">Chat</span>
        </Link>
        <Link to="/home?tab=profile" className="flex flex-col items-center">
          <Icon as={FaUser} boxSize={7} mr={2} />
          <span className="text-sm">Profile</span>
        </Link>
        <Link to="/logout" className="flex flex-col items-center">
          <Icon as={FaSignOutAlt} boxSize={7} mr={2} />
          <span className="text-sm">Logout</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
