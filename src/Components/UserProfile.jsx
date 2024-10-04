import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import ProfileEditModal from "./ProfileEditModal";
import "react-toastify/dist/ReactToastify.css"; 
import { updateSuccess } from "../Utils/Reducers/UserReducer"; 
import UserPosts from "./UserPosts";

const UserProfile = () => {
  const { currentuser } = useSelector((state) => state.user); 
  const dispatch = useDispatch(); 
  const [isModalOpen, setIsModalOpen] = useState(false); 

  // Function to handle updated user data
  const handleUpdateUser = (response) => {
    
    const updatedUser = response.updatedUser;

    console.log("Updated user data after extraction:", updatedUser);

 
    dispatch(updateSuccess(updatedUser));

    setIsModalOpen(false); 
  };

  return (
    <div className="shadow-xl shadow-slate-500 mt-5">
      {currentuser ? (
        <>
          <div className="p-10 flex justify-center">
            <img
              src={currentuser.userDetails.coverPic}
              alt="Cover"
              className="w-full h-full md:h-44 md:w-3/4 object-cover rounded-2xl"
            />
          </div>
          <div className="profile-info flex items-center ml-10">
            <img
              src={currentuser.userDetails.profilePic}
              alt="Profile"
              className="rounded-full w-32 h-32 border-2 border-white"
            />
            <div className="ml-10">
              <h1 className="text-2xl font-bold">
                {currentuser.userDetails.username}
              </h1>
              <h1 className="text-2xl font-bold">
                {currentuser.userDetails.name}
              </h1>
              <p className="text-white">{currentuser.userDetails.bio}</p>
              <button
                onClick={() => setIsModalOpen(true)} // Open modal
                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
              >
                Edit Profile
              </button>
            </div>
          </div>

         
          {isModalOpen && (
            <ProfileEditModal
              user={currentuser.userDetails}
              onClose={() => setIsModalOpen(false)}
              onUpdate={handleUpdateUser} 
            />
          )}
        </>
      ) : (
        <p>No user data available.</p>
      )}

      <div className="mt-10">
        <UserPosts />
      </div>
    </div>
  );
};

export default UserProfile;
