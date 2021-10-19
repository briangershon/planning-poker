import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  name: null,
  avatarUrl: null
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUser: (state, action) => {
      state.name = action.payload.name;
      state.avatarUrl = action.payload.avatarUrl;
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateUser } =
  userSlice.actions;

export default userSlice.reducer;
