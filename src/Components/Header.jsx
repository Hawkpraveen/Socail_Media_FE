import React, { useState } from "react";
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


      {isCreatePostOpen &&
        currentuser && ( // Check if currentuser exists
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-black p-5 rounded shadow-lg">
              <CreatePost
                postedBy={currentuser.userDetails._id}
                onClose={() => setIsCreatePostOpen(false)}
              />
              <button
                onClick={() => setIsCreatePostOpen(false)} 
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        )}
    </div>
  );
};

export default Header;
