import React, { useState } from "react";
import ReactDOM from "react-dom";
import CreatePost from "./CreatePost";
import { useSelector } from "react-redux";

const Header = () => {
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const currentuser = useSelector((state) => state.user.currentuser);

  return (
    <div className="bg-teal-500 p-4 flex justify-center items-center">
      <button
        onClick={() => setIsCreatePostOpen(true)}
        className="bg-white text-blue-500 px-4 py-2 rounded"
      >
        Create Post
      </button>

      {isCreatePostOpen && currentuser && (
        ReactDOM.createPortal(
          <div className="fixed inset-0 flex items-start justify-center bg-gray-900 bg-opacity-60 mt-16">
            <div className="bg-black p-5 rounded shadow-lg md:w-1/2 h-fit flex flex-wrap">
              <CreatePost
                postedBy={currentuser.userDetails._id}
                profilePic={currentuser.userDetails.profilePic}
                onClose={() => setIsCreatePostOpen(false)}
              />
              <button
                onClick={() => setIsCreatePostOpen(false)}
                className=" bg-red-500 text-white px-7 py-2 rounded ml-auto"
              >
                Close
              </button>
            </div>
          </div>,
          document.body // Render the modal to the body
        )
      )}
    </div>
  );
};

export default Header;
