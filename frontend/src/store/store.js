import { configureStore } from '@reduxjs/toolkit';
import pokerReducer from './pokerSlice';
import userReducer from './userSlice';

export default configureStore({
  reducer: {
    user: userReducer,
    poker: pokerReducer,
  },
});
