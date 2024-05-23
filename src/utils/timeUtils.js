import moment from "moment";
import CommonNotificationTypes from "../enums/CommonNotificationTypes";
import SocialMediaAddictionLevelTestReminderNotificationTypes from "../enums/SocialMediaAddictionLevelTestReminderNotificationTypes";

const sleep = (time) =>
  new Promise((resolve) => setTimeout(() => resolve(), time));

const differenceInDays = (date1, date2) => {
  let daysDifference = Math.abs(date1.diff(date2, "days"));
  return daysDifference;
};

const returnCurrentTimeHourAsCommonNotificationEnum = () => {
  if (getCurrentTime().isSame(getMorningTime, "hour")) {
    return CommonNotificationTypes.getMorningTime;
  } else if (getCurrentTime().isSame(getMiddleOfTheDayTime, "hour")) {
    return CommonNotificationTypes.getMiddleOfTheDayTime;
  } else if (getCurrentTime().isSame(getEveningTime, "hour")) {
    return CommonNotificationTypes.getEveningTime;
  } else {
    return null;
  }
};

const returnCurrentTimeHourAsSocialMediaAddictionLevelTestReminderNotificationEnum = () => {
  if (getCurrentTime().isSame(getMorningTime.add(1,"hours"), "hour")) {
    return SocialMediaAddictionLevelTestReminderNotificationTypes.getMorningTime;
  } else if (getCurrentTime().isSame(getMiddleOfTheDayTime.add(1,"hours"), "hour")) {
    return SocialMediaAddictionLevelTestReminderNotificationTypes.getMiddleOfTheDayTime;
  } else if (getCurrentTime().isSame(getEveningTime.add(1,"hours"), "hour")) {
    return SocialMediaAddictionLevelTestReminderNotificationTypes.getEveningTime;
  } else {
    return null;
  }
};

const getStartOfTheDayTime = () => moment().hours(0).minutes(0);
const getCurrentTime = () => moment();
const getMorningTime = () => moment().hours(6).minutes(0);
const getMiddleOfTheDayTime = () => moment().hours(12).minutes(0);
const getEveningTime = () => moment().hours(18).minutes(0);

export {
  sleep,
  differenceInDays,
  returnCurrentTimeHourAsCommonNotificationEnum,
  returnCurrentTimeHourAsSocialMediaAddictionLevelTestReminderNotificationEnum,
  getStartOfTheDayTime,
  getCurrentTime,
  getMorningTime,
  getMiddleOfTheDayTime,
  getEveningTime,
};
