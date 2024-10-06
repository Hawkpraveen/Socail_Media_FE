import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const initialState = {
  currentuser: null,
  currentuserid: null,
  following: [],
  selectedUser:null,
  token: null,
  error: null,
  loading: false,
};

const authSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signupStart: (state) => {
      state.error = null;
      state.loading = true;
    },
    signupSuccess: (state, action) => {
      state.currentuser = action.payload;
      state.error = null;
      state.loading = false;
      toast.success("User created successfully.");
    },
    signupFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
      toast.error(action.payload);
    },
    signinStart: (state) => {
      state.error = null;
      state.loading = true;
    },
    signinSuccess: (state, action) => {
      state.currentuser = action.payload;
      state.currentuserid = action.payload.id;
      state.token = action.payload.token;
      state.error = null;
      state.loading = false;
      toast.success("User logged in successfully");
    },
    signinFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
      console.log("payload", action.payload);
      toast.error(action.payload);
    },
    signOutSuccess: (state) => {
      state.currentuser = null;
      state.loading = false;
      state.error = null;
    },
    updateStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateSuccess: (state, action) => {
      state.currentuser = {
        ...state.currentuser,
        userDetails: {
          ...state.currentuser.userDetails,
          ...action.payload,
        },
      };
      state.loading = false;
      state.error = null;
    },
    updateFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    deleteUserStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteUserSuccess: (state) => {
      state.currentuser = null;
      state.loading = false;
      state.error = null;
    },
    deleteUserFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    followUser: (state, action) => {
      const { id, username } = action.payload; // Destructure id and username
      if (
        !state.currentuser.userDetails.following.find((user) => user.id === id)
      ) {
        state.currentuser.userDetails.following.push({ id, username });
        toast.success(`You are now following ${username}!`);
      }
    },

    unfollowUser: (state, action) => {
      const { id } = action.payload; // Destructure id
      const index = state.currentuser.userDetails.following.findIndex(
        (user) => user.id === id
      );
      if (index > -1) {
        state.currentuser.userDetails.following.splice(index, 1);
        toast.success("You have unfollowed the user!");
      }
    },
    setSelectedUser:(state,action) => {
      state.selectedUser = action.payload;
  },
  },
});

export const {
  signupStart,
  signupSuccess,
  signupFailure,
  signinStart,
  signinSuccess,
  signinFailure,
  signOutSuccess,
  updateFailure,
  updateStart,
  updateSuccess,
  deleteUserFailure,
  deleteUserSuccess,
  deleteUserStart,
  followUser,
  unfollowUser,
  setSelectedUser
} = authSlice.actions;

export default authSlice.reducer;
