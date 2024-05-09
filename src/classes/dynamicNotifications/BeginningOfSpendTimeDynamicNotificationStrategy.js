import DynamicNotificationTypes from "../../enums/DynamicNotificationTypes";
import DynamicNotificationStrategy from "./DynamicNotificationStrategy";

class BeginningOfSpendTimeDynamicNotificationStrategy extends DynamicNotificationStrategy {
  constructor(user, dispatch, spendTimeIntervalRef, notificationService) {
    super(
      user,
      DynamicNotificationTypes.BeginningOfSpendTime,
      dispatch,
      spendTimeIntervalRef,
      notificationService
    );
  }

  execute() {
    super.execute();
  }
}

export default BeginningOfSpendTimeDynamicNotificationStrategy;
