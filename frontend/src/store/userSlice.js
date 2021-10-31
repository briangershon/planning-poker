import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoggedIn: false,
  name: null,
  avatarUrl: null,
  gameIds: [],
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUser: (state, action) => {
      state.isLoggedIn = true;
      state.name = action.payload.name;
      state.avatarUrl = action.payload.avatarUrl;

      // avoid infinite loop when using `state.gameIds = action.payload.gameIds;`
      // instead, clear array
      for (let j = 0; j < state.gameIds.length; j++) {
        state.gameIds.pop();
      }
      // then append to array
      for (let i = 0; i < action.payload.gameIds.length; i++) {
        state.gameIds.push(action.payload.gameIds[i]);
      }
    },
    addGameId: (state, action) => {
      state.gameIds.push(action.payload.gameId);
    },
    deleteGameId: (state, action) => {
      // delete gameId in array
      for (let i = 0; i < state.gameIds.length; i++) {
        if (state.gameIds[i] === action.payload) {
          state.gameIds.splice(i, 1);
        }
      }
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateUser, addGameId, deleteGameId } = userSlice.actions;

export default userSlice.reducer;
