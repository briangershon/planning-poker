import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  you: { name: 'You', vote: null, avatarUrl: null },
  players: [],
  playersPresent: [],
  story: '',
  gameState: 'lobby',
};

function everyoneHasVoted(state) {
  return (
    state.players.length >= 1 &&
    state.you.vote &&
    state.players.filter((player) => player.vote).length ===
      state.players.length
  );
}

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

      if (everyoneHasVoted(state)) {
        state.gameState = 'complete';
      }
    },
    updatePlayersPresent: (state, action) => {
      // avoid infinite loops by updating existing array
      // clear array
      for (let j = 0; j < state.playersPresent.length; j++) {
        state.playersPresent.pop();
      }
      // then append to array
      for (let i = 0; i < action.payload.length; i++) {
        state.playersPresent.push(action.payload[i]);
      }
    },
    vote: (state, action) => {
      state.you.vote = action.payload;
      if (everyoneHasVoted(state)) {
        state.gameState = 'complete';
      }
    },
    updateYou: (state, action) => {
      state.you.name = action.payload.name;
      state.you.vote = action.payload.vote;
      state.you.avatarUrl = action.payload.avatarUrl;
    },
    updateStory: (state, action) => {
      state.story = action.payload;
    },
    resetGame: () => {
      return initialState;
    },
    startGame: (state) => {
      state.gameState = 'in-progress';
    },
    endGame: (state) => {
      state.gameState = 'complete';
    },
    updateGameState: (state, action) => {
      state.gameState = action.payload;
    },
    clearAllVotes: (state) => {
      state.you.vote = null;
      state.players.map((player) => (player.vote = null));
      state.gameState = 'lobby';
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  vote,
  updateYou,
  updateStory,
  updatePlayers,
  updatePlayersPresent,
  resetGame,
  startGame,
  endGame,
  updateGameState,
  clearAllVotes,
} = pokerSlice.actions;

export default pokerSlice.reducer;
