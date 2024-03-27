import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  wordOfTheDay: null,
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setWordOfTheDay: (state, action) => {
      state.wordOfTheDay = action.payload;
    },
  },
});

export const { setWordOfTheDay } = appSlice.actions;

export const selectWordOfTheDay = (state) => state.app.wordOfTheDay;

export default appSlice.reducer;
