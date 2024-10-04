import React from "react";
import { ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";
import { Routes, Route, Navigate } from "react-router-dom";
import StartUpPage from "./Pages/StartUpPage";
import NavBar from "./Components/NavBar";
import SignInPage from "./Pages/SignInPage";
import SignUpPage from "./Pages/SignUpPage";
import HomePage from "./Pages/homePage";
import Logout from "./Components/Logout";
import UserProfile from "./Components/UserProfile";

const App = () => {
  const currentUser = useSelector((state) => state.user.currentuser);
  //console.log(currentUser);

  return (
    <div>
      <ToastContainer />
      {currentUser ? (
        <Routes>
          <Route path="/home" element={<HomePage />} />
          <Route path="*" element={<Navigate to="/home" />} />
          <Route path="/logout" element={<Logout />} />
        </Routes>
      ) : (
        <>
          <NavBar />
          <Routes>
            <Route path="/" element={<StartUpPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/signin" element={<SignInPage />} />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </>
      )}
    </div>
  );
};

export default App;
