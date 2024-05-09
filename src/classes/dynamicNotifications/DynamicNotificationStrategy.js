import { APP_NAME } from "../../constants";
import { setSpendTimeInterval } from "../../redux/slices/appSlice";
import PushNotificationOptions from "../PushNotificationOptions";

class DynamicNotificationStrategy {
  constructor(user, type, dispatch, spendTimeInterval, notificationService) {
    this.user = user;
    this.type = type;
    this.dispatch = dispatch;
    this.spendTimeInterval = spendTimeInterval;
    this.notificationService = notificationService;
  }

  execute() {
    const foundNotification =
      this.notificationService.getDynamicNotificationContent(
        this.user,
        this.type
      );

    if (foundNotification) {
      this.dispatch(
        setSpendTimeInterval({
          ...this.spendTimeInterval,
          [this.type]: true,
        })
      );

      this.notificationService.sendNotification(
        new PushNotificationOptions({
          type: PushNotificationType.Normal,
          date: new Date(Date.now() + 2000),
          title: APP_NAME,
          message: foundNotification.message,
        })
      );
    }
  }
}

export default DynamicNotificationStrategy;
