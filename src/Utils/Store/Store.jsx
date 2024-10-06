import storage from 'redux-persist/lib/storage';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import UserReducer from '../Reducers/UserReducer';
import postsSlice from '../Reducers/PostReducer'
import chatSlice  from '../Reducers/chatSlice';
import socketSlice  from '../Reducers/socketSlice';

const rootReducer = combineReducers({
  user: UserReducer,
  posts:postsSlice,
  socketio:socketSlice,
  chat:chatSlice,
  
});

const persistConfig = {
  key: 'root',
  storage,
  version: 1,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
