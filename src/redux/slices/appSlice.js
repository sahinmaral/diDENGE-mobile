import { createSlice } from "@reduxjs/toolkit";
import DynamicNotificationTypes from "../../enums/DynamicNotificationTypes";

const initialSpendTimeInterval = {
  [DynamicNotificationTypes.BeginningOfSpendTime]: false,
  [DynamicNotificationTypes.NearlyHalfOfSpendTime]: false,
  [DynamicNotificationTypes.AfterHalfOfSpendTime]: false,
  [DynamicNotificationTypes.NearlyAllOfSpendTime]: false,
  [DynamicNotificationTypes.AfterAllOfSpendTime]: false,
  [DynamicNotificationTypes.FailedOfObeyingSpendTime]: false,
}

const initialState = {
  wordOfTheDay: null,
  spendTimeInterval: initialSpendTimeInterval
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setWordOfTheDay: (state, action) => {
      state.wordOfTheDay = action.payload;
    },
    setSpendTimeInterval: (state, action) => {
      state.spendTimeInterval = action.payload;
    },
    refreshSpendTimeInterval : (state) => {
      state.spendTimeInterval = initialSpendTimeInterval;
    }
  },
});

export const { setWordOfTheDay, setSpendTimeInterval,refreshSpendTimeInterval } = appSlice.actions;

export const selectWordOfTheDay = (state) => state.app.wordOfTheDay;
export const selectSpendTimeInterval = (state) => state.app.spendTimeInterval;

export default appSlice.reducer;
