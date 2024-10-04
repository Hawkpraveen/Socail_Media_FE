import React, { useState } from "react";
import axios from "axios";

const CreatePost = ({ postedBy, onClose }) => {
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

        // Get the image URL from the upload response
        const imgUrl = uploadResponse.data.secure_url; 

        // Add the image URL to the data object
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

      // Handle successful response
      console.log("Post created successfully:", response.data);
      onClose(); 
    } catch (err) {
      // Handle errors
      if (err.response) {
        setError(err.response.data.error); 
      } else {
        setError("An error occurred. Please try again."); 
      }
      console.error("Error creating post:", err.message);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-bold">Create Post</h2>
      {error && <p className="text-red-500">{error}</p>} 
      <form onSubmit={handleSubmit} className="mt-4">
        <div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)} 
            placeholder="What's on your mind?"
            className="border border-gray-300 rounded w-full p-2"
            maxLength={500} 
          />
        </div>
        <div className="mt-2">
          <input
            type="file"
            accept="image/*" 
            onChange={handleImageChange}
          />
        </div>
        <button
          type="submit"
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded" 
        >
          Create Post
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
