import commonNotifications from "../constants/commonNotifications";
import dynamicNotifications from "../constants/dynamicNotifications";

const getCommonNotification = (procedureType, time, userFirstName) => {
  const filteredNotifications = commonNotifications.filter(
    (notification) => notification.procedure === procedureType
  );

  var foundNotification = filteredNotifications.find(
    (notification) =>
      notification.time.isSame(time, "hour") &&
      notification.time.isSame(time, "minute")
  );

  if (foundNotification) {
    foundNotification.message = foundNotification.message.replace(
      "{firstName}",
      userFirstName
    );

    return foundNotification;
  }

  return null;
};

const getDynamicNotification = (
  procedureType,
  notificationType,
  userFirstName
) => {
  const foundNotification = dynamicNotifications.find(
    (notification) =>
      notification.procedure === procedureType &&
      notification.type === notificationType
  );

  if (foundNotification) {

    foundNotification.message = foundNotification.message.replace(
      "{firstName}",
      userFirstName
    );

    return foundNotification;
  }

  return null;
};

export { getCommonNotification, getDynamicNotification };
