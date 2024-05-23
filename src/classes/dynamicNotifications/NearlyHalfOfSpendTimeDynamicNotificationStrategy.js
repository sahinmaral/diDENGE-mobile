import DynamicNotificationTypes from "../../enums/DynamicNotificationTypes";
import DynamicNotificationStrategy from "./DynamicNotificationStrategy";

class NearlyHalfOfSpendTimeDynamicNotificationStrategy extends DynamicNotificationStrategy {
  constructor(user, dispatch, spendTimeIntervalRef, notificationService) {
    super(
      user,
      DynamicNotificationTypes.NearlyHalfOfSpendTime,
      dispatch,
      spendTimeIntervalRef,
      notificationService
    );
  }

  execute() {
    super.execute();
  }
}

export default NearlyHalfOfSpendTimeDynamicNotificationStrategy;
