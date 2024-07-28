import { createSlice } from "@reduxjs/toolkit";
import DynamicNotificationTypes from "../../enums/DynamicNotificationTypes";
import CommonNotificationTypes from "../../enums/CommonNotificationTypes";
import SocialMediaAddictionLevelTestReminderNotificationTypes from "../../enums/SocialMediaAddictionLevelTestReminderNotificationTypes"

const initialSpendTimeInterval = {
  [DynamicNotificationTypes.BeginningOfSpendTime]: false,
  [DynamicNotificationTypes.NearlyHalfOfSpendTime]: false,
  [DynamicNotificationTypes.AfterHalfOfSpendTime]: false,
  [DynamicNotificationTypes.NearlyAllOfSpendTime]: false,
  [DynamicNotificationTypes.AfterAllOfSpendTime]: false,
  [DynamicNotificationTypes.FailedOfObeyingSpendTime]: false,
};

const initialCommonNotificationInterval = {
  [CommonNotificationTypes.Morning]: false,
  [CommonNotificationTypes.MiddleOfTheDay]: false,
  [CommonNotificationTypes.Evening]: false,
};


const initialSocialMediaAddictionLevelTestReminderNotificationInterval = {
  [SocialMediaAddictionLevelTestReminderNotificationTypes.Morning]: false,
  [SocialMediaAddictionLevelTestReminderNotificationTypes.MiddleOfTheDay]: false,
  [SocialMediaAddictionLevelTestReminderNotificationTypes.Evening]: false,
};

const initialState = {
  wordOfTheDay: null,
  spendTimeInterval: initialSpendTimeInterval,
  commonNotificationInterval: initialCommonNotificationInterval,
  socialMediaAddictionLevelTestReminderInterval: initialSocialMediaAddictionLevelTestReminderNotificationInterval,
  isStartOfTheDayCheckPassed : false
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setWordOfTheDay: (state, action) => {
      state.wordOfTheDay = action.payload;
    },
    setCommonNotificationInterval: (state, action) => {
      state.commonNotificationInterval = action.payload;
    },
    setSpendTimeInterval: (state, action) => {
      state.spendTimeInterval = action.payload;
    },
    setSocialMediaAddictionLevelTestReminderInterval: (state, action) => {
      state.socialMediaAddictionLevelTestReminderInterval = action.payload;
    },
    refreshSpendTimeInterval: (state) => {
      state.spendTimeInterval = initialSpendTimeInterval;
    },
    refreshCommonNotificationInterval: (state) => {
      state.commonNotificationInterval = initialCommonNotificationInterval;
    },
    refreshSocialMediaAddictionLevelTestReminderInterval: (state) => {
      state.socialMediaAddictionLevelTestReminderInterval = initialSocialMediaAddictionLevelTestReminderNotificationInterval;
    },
    setIsStartOfTheDayCheckPassed : (state, action) => {
      state.isStartOfTheDayCheckPassed = action.payload
    }
  },
});

export const {
  setWordOfTheDay,
  setSpendTimeInterval,
  setCommonNotificationInterval,
  setSocialMediaAddictionLevelTestReminderInterval,
  refreshSpendTimeInterval,
  refreshCommonNotificationInterval,
  setIsStartOfTheDayCheckPassed,
  refreshSocialMediaAddictionLevelTestReminderInterval
} = appSlice.actions;

export const selectWordOfTheDay = (state) => state.app.wordOfTheDay;
export const selectSpendTimeInterval = (state) => state.app.spendTimeInterval;
export const selectCommonNotificationInterval = (state) => state.app.commonNotificationInterval;
export const selectIsStartOfTheDayCheckPassed = (state) => state.app.isStartOfTheDayCheckPassed;

export default appSlice.reducer;
