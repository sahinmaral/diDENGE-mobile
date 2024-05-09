import moment from "moment";

const sleep = (time) =>
  new Promise((resolve) => setTimeout(() => resolve(), time));

const startOfTheDay = moment().hours(0).minutes(0);
const currentTime = moment();

export { sleep, startOfTheDay, currentTime };
