import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  posts: [],
  loading: false,
  error: null,
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    fetchPostsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchPostsSuccess: (state, action) => {
      state.loading = false;
      state.posts = action.payload;
    },
    fetchPostsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    createPostSuccess: (state, action) => {
      state.posts.push(action.payload);
    },
    deletePostSuccess: (state, action) => {
      state.posts = state.posts.filter((post) => post._id !== action.payload);
    },
    updatePostSuccess: (state, action) => {
      const index = state.posts.findIndex(
        (post) => post._id === action.payload._id
      );
      if (index !== -1) {
        state.posts[index] = action.payload;
      }
    },
    toggleLikeSuccess: (state, action) => {
      const { postId, userId } = action.payload;
      const post = state.posts.find((post) => post._id === postId);
      if (post) {
          // Check if the user ID already exists in the likes array
          if (!post.likes.includes(userId)) {
              post.likes.push(userId); // Add like
          } else {
              const likedIndex = post.likes.indexOf(userId);
              post.likes.splice(likedIndex, 1); // Remove like
          }
      }
  },
  

    addReplySuccess: (state, action) => {
      const { postId, reply } = action.payload;
      const post = state.posts.find((post) => post._id === postId);
      if (post) {
        post.replies.push(reply);
      }
    },
    deleteReplySuccess: (state, action) => {
      const { postId, replyId } = action.payload;
      const post = state.posts.find((post) => post._id === postId);
      if (post) {
        post.replies = post.replies.filter((reply) => reply._id !== replyId);
      }
    },
  },
});

export const {
  fetchPostsStart,
  fetchPostsSuccess,
  fetchPostsFailure,
  createPostSuccess,
  deletePostSuccess,
  updatePostSuccess,
  toggleLikeSuccess,
  addReplySuccess,
  deleteReplySuccess,
} = postsSlice.actions;

export default postsSlice.reducer;
