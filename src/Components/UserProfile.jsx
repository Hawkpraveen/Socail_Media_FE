import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import ProfileEditModal from "./ProfileEditModal";
import "react-toastify/dist/ReactToastify.css";
import { updateSuccess } from "../Utils/Reducers/UserReducer";
import UserPosts from "./UserPosts";
import People from "./People";
import { Container } from "@chakra-ui/react";

const UserProfile = () => {
  const { currentuser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPeople, setShowPeople] = useState(false);

  const handleUpdateUser = (response) => {
    const updatedUser = response.updatedUser;

    console.log("Updated user data after extraction:", updatedUser);

    dispatch(updateSuccess(updatedUser));

    setIsModalOpen(false);
  };

  const handleToggleView = () => {
    setShowPeople(!showPeople);
  };

  return (
    <Container
      className="shadow-xl shadow-slate-500 mt-5 mb-20 pb-16 "
      maxW={"850px"}
    >
      {currentuser ? (
        <>
          <div className="p-10 flex justify-center border-b-2 ">
            <img
              src={currentuser.userDetails.coverPic}
              alt="Cover"
              className="w-full h-full md:h-44 md:w-3/4 object-cover rounded-2xl"
            />
          </div>
          <div className=" flex items-center md:px-10 md:py-8 flex-wrap justify-center md:justify-start pt-4 border-b-2 pb-6">
            <img
              src={currentuser.userDetails.profilePic}
              alt="Profile"
              className="rounded-full w-32 h-32 border-2 border-white"
            />
            <div className="ml-14 text-wrap ">
              <h1 className="text-2xl font-bold py-1">
                {currentuser.userDetails.username}
              </h1>
              <h1 className="text-2xl font-bold py-1">
                {currentuser.userDetails.name}
              </h1>
              <p className="text-white py-1">{currentuser.userDetails.bio}</p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-3 bg-teal-500 text-white px-4 py-2 rounded "
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

      <div className="mt-5 flex justify-around border-b-2 pb-5">
        {/* Button to toggle between posts and followers (People component) */}
        <button
          onClick={handleToggleView}
          className="bg-purple-500 text-white px-4 py-2 rounded"
        >
          {showPeople ? "Show Posts" : "Show Friends"}
        </button>
      </div>

      {/* Conditionally render the UserPosts component when not showing followers */}
      {!showPeople && (
        <div className="mt-5">
          <UserPosts />
        </div>
      )}

      {/* Conditionally render the People component */}
      {showPeople && (
        <div className="mt-5">
          <People />
        </div>
      )}
    </Container>
  );
};

export default UserProfile;
