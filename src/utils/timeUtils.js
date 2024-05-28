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
  if (getCurrentTime().isSame(getMorningTime(), "hour")) {
    return CommonNotificationTypes.Morning;
  } else if (getCurrentTime().isSame(getMiddleOfTheDayTime(), "hour")) {
    return CommonNotificationTypes.MiddleOfTheDay;
  } else if (getCurrentTime().isSame(getEveningTime(), "hour")) {
    return CommonNotificationTypes.Evening;
  } else {
    return null;
  }
};

const returnCurrentTimeHourAsSocialMediaAddictionLevelTestReminderNotificationEnum = () => {
  if (getCurrentTime().isSame(getMorningTime().add(1,"hours"), "hour")) {
    return SocialMediaAddictionLevelTestReminderNotificationTypes.Morning;
  } else if (getCurrentTime().isSame(getMiddleOfTheDayTime().add(1,"hours"), "hour")) {
    return SocialMediaAddictionLevelTestReminderNotificationTypes.MiddleOfTheDay;
  } else if (getCurrentTime().isSame(getEveningTime().add(1,"hours"), "hour")) {
    return SocialMediaAddictionLevelTestReminderNotificationTypes.Evening;
  } else {
    return null;
  }
};

const isSameDateWithCurrentDate = (date) => {
    const currentDate = moment();
    const givenDate = moment(date, "YYYY-MM-DD");
    
    return currentDate.isSame(givenDate, 'day') && 
           currentDate.isSame(givenDate, 'month') && 
           currentDate.isSame(givenDate, 'year');
}

const getStartOfTheDayTime = () => moment().hours(0).minutes(0);
const getCurrentTime = () => moment();
const getMorningTime = () => moment().hours(6).minutes(0);
const getMiddleOfTheDayTime = () => moment().hours(12).minutes(0);
const getEveningTime = () => moment().hours(18).minutes(0);

export {
  sleep,
  differenceInDays,
  isSameDateWithCurrentDate,
  returnCurrentTimeHourAsCommonNotificationEnum,
  returnCurrentTimeHourAsSocialMediaAddictionLevelTestReminderNotificationEnum,
  getStartOfTheDayTime,
  getCurrentTime,
  getMorningTime,
  getMiddleOfTheDayTime,
  getEveningTime,
};
