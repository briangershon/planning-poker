import { configureStore } from '@reduxjs/toolkit';
import pokerReducer from './pokerSlice';

export default configureStore({
  reducer: {
    poker: pokerReducer,
  },
});
