import DynamicNotificationTypes from "../../enums/DynamicNotificationTypes";
import DynamicNotificationStrategy from "./DynamicNotificationStrategy";

class FailedOfObeyingSpendTimeDynamicNotificationStrategy extends DynamicNotificationStrategy {
  constructor(user, dispatch, spendTimeIntervalRef, notificationService) {
    super(
      user,
      DynamicNotificationTypes.FailedOfObeyingSpendTime,
      dispatch,
      spendTimeIntervalRef,
      notificationService
    );
  }

  execute() {
    super.execute();
  }
}

export default FailedOfObeyingSpendTimeDynamicNotificationStrategy;
