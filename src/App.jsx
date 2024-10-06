import React, { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route, Navigate } from "react-router-dom";
import StartUpPage from "./Pages/StartUpPage";
import NavBar from "./Components/NavBar";
import SignInPage from "./Pages/SignInPage";
import SignUpPage from "./Pages/SignUpPage";
import HomePage from "./Pages/homePage";
import Logout from "./Components/Logout";
import { setSocket } from "./Utils/Reducers/socketSlice";
import { setOnlineUsers } from "./Utils/Reducers/chatSlice";

const App = () => {
  const currentUser = useSelector((state) => state.user.currentuser);
  //console.log(currentUser);

  const { user } = useSelector((store) => store.user);
  const { socket } = useSelector((store) => store.socketio);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      const socketio = io("https://socail-media-be.onrender.com", {
        query: {
          userId: currentUser.userDetails._id,
        },
        transports: ["websocket"],
      });
      dispatch(setSocket(socketio));

      // listen all the events
      socketio.on("getOnlineUsers", (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));
      });

      return () => {
        socketio.close();
        dispatch(setSocket(null));
      };
    } else if (socket) {
      socket.close();
      dispatch(setSocket(null));
    }
  }, [user, dispatch]);

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
