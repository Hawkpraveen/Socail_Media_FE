import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Posts from "./Posts";
import UserPosts from "./UserPosts";

const ProfileEditModal = ({ user, onClose, onUpdate }) => {
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio);
  const [coverPicFile, setCoverPicFile] = useState(null);
  const [profilePicFile, setProfilePicFile] = useState(null);

  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "my_preset");
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/dx8hzftyz/image/upload`,
      formData
    );

    console.log(response.data.secure_url);

    return response.data.secure_url;
  };

  const handleUpdateProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const updatedData = {
        name,
        bio,
        profilePic: user.profilePic,
        coverPic: user.coverPic,
      };

      if (profilePicFile) {
        updatedData.profilePic = await uploadImageToCloudinary(profilePicFile);
      }

      if (coverPicFile) {
        updatedData.coverPic = await uploadImageToCloudinary(coverPicFile);
      }

      const response = await axios.put(
        `https://socail-media-be.onrender.com/api/users/edit-user/${user._id}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("API Response with updated user data:", response.data);

      onUpdate(response.data);

      toast.success("Profile updated successfully!");
      onClose(); // Close the modal
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Error updating profile. Please try again.");
    }
  };

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
        <div className="bg-black p-6 rounded shadow-md">
          <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
          <div className="mb-4">
            <label className="block mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border rounded w-full p-2"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="border rounded w-full p-2"
              rows="3"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Cover Picture</label>
            <input
              type="file"
              onChange={(e) => setCoverPicFile(e.target.files[0])}
              className="border rounded w-full p-2"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Profile Picture</label>
            <input
              type="file"
              onChange={(e) => setProfilePicFile(e.target.files[0])}
              className="border rounded w-full p-2"
            />
          </div>
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="mr-2 bg-gray-300 text-gray-700 px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdateProfile}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileEditModal;
