import PushNotification from "react-native-push-notification";
import PushNotificationType from "../../enums/PushNotificationType";
import commonNotifications from "../../constants/notifications/commonNotifications";
import dynamicNotifications from "../../constants/notifications/dynamicNotifications";

class NotificationService {
  sendNotification(notificationOptions) {
    if (notificationOptions.type === PushNotificationType.Silent) {
      notificationOptions.soundName = "silent_sound.mp3";
    } else {
      notificationOptions.soundName = "default";
    }

    PushNotification.localNotificationSchedule(notificationOptions);
  }

  clearAllNotifications() {
    PushNotification.cancelAllLocalNotifications();
  }

  getCommonNotificationContent(currentUser, currentTime) {
    const userProcedureName =
      currentUser.procedurePointInformation.current.procedure.name;
    const userFirstName = currentUser.firstName;

    const filteredNotifications = commonNotifications.filter(
      (notification) => notification.procedure === userProcedureName
    );

    var foundNotification = filteredNotifications.find(
      (notification) =>
        notification.time.isSame(currentTime, "hour") 
    );

    if (foundNotification) {
      foundNotification.message = foundNotification.message.replace(
        "{firstName}",
        userFirstName
      );

      return foundNotification;
    }

    return null;
  }

  getDynamicNotificationContent(currentUser, notificationType) {

    const userProcedureName =
      currentUser.procedurePointInformation.current.procedure.name;
    const userFirstName = currentUser.firstName;

    const foundNotification = dynamicNotifications.find(
      (notification) =>
        notification.procedure === userProcedureName &&
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
  }
}

export default NotificationService;
