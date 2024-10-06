import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const CreatePost = ({ postedBy, profilePic, onClose }) => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const [error, setError] = useState(null);
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImg(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      postedBy,
      profilePic,
      text,
    };

    try {
      if (img) {
        const formData = new FormData();
        formData.append("file", img);
        formData.append("upload_preset", "my_preset");

        // Upload the image to Cloudinary
        const uploadResponse = await axios.post(
          "https://api.cloudinary.com/v1_1/dx8hzftyz/image/upload",
          formData
        );

        const imgUrl = uploadResponse.data.secure_url;

        data.img = imgUrl;
      }

      const response = await axios.post(
        "http://localhost:5000/api/post/create",
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      window.location.reload();
     toast.success("Success posting content");
      onClose();
    } catch (err) {
      if (err.response) {
        setError(err.response.data.error);
      } else {
        setError("An error occurred. Please try again.");
      }
      console.error("Error creating post:", err.message);
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl mt-2 text-center pb-3 uppercase font-bold">
        Create Post
      </h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="mt-6">
        <div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What's on your mind?"
            className="border border-gray-300 rounded w-full p-6 text-lg"
            maxLength={500}
          />
        </div>
        <div className="mt-2 text-lg">
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>
        <button
          type="submit"
          className="mt-7 bg-teal-500 text-white px-4 py-2 rounded hover:bg-green-500"
        >
          Create Post
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
