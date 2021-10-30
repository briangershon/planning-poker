import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  name: null,
  avatarUrl: null,
  gameIds: [],
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUser: (state, action) => {
      state.name = action.payload.name;
      state.avatarUrl = action.payload.avatarUrl;

      // avoid infinite loop when using `state.gameIds = action.payload.gameIds;`
      // instead, clear array
      for (let j = 0; j < state.gameIds; j++) {
        state.gameIds.pop();
      }
      // then append to array
      for (let i = 0; i < action.payload.gameIds.length; i++) {
        if (!state.gameIds.includes(action.payload.gameIds[i])) {
          state.gameIds.push(action.payload.gameIds[i]);
        }
      }
    },
    addGameId: (state, action) => {
      state.gameIds.push(action.payload.gameId);
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateUser, addGameId } = userSlice.actions;

export default userSlice.reducer;
