import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  showCards: false,
  you: { name: 'You', vote: null },
  players: [],
  story: '',
};

export const pokerSlice = createSlice({
  name: 'poker',
  initialState,
  reducers: {
    updatePlayers: (state, action) => {
      // avoid infinite loops by updating existing array
      // clear array
      for (let j = 0; j < state.players.length; j++) {
        state.players.pop();
      }
      // then append to array
      for (let i = 0; i < action.payload.length; i++) {
        state.players.push(action.payload[i]);
      }
    },
    showCards: (state) => {
      state.showCards = true;
    },
    hideCards: (state) => {
      state.showCards = false;
    },
    vote: (state, action) => {
      state.you.vote = action.payload;
    },
    updateStory: (state, action) => {
      state.story = action.payload;
    },
    resetGame: () => {
      return initialState;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  showCards,
  hideCards,
  vote,
  updateStory,
  updatePlayers,
  resetGame,
} = pokerSlice.actions;

export default pokerSlice.reducer;
