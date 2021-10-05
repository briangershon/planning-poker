import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  gameId: null,
  showCards: false,
  you: { name: 'You', value: null, id: new Date().getTime() },
  players: [],
};

export const pokerSlice = createSlice({
  name: 'poker',
  initialState,
  reducers: {
    addPlayer: (state, action) => {
      state.players.push({
        id: new Date().getTime(),
        name: action.payload.name,
        value: action.payload.value,
      });
    },
    createGame: (state) => {
      state.gameId = 'xxx';
    },
    endGame: () => {
      return initialState;
    },
    showCards: (state) => {
      state.showCards = true;
    },
    hideCards: (state) => {
      state.showCards = false;
    },
    vote: (state, action) => {
      state.you.value = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { addPlayer, createGame, endGame, showCards, hideCards, vote } =
  pokerSlice.actions;

export default pokerSlice.reducer;
