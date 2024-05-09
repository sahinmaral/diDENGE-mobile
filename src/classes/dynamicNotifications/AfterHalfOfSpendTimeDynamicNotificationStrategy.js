import DynamicNotificationTypes from "../../enums/DynamicNotificationTypes";
import DynamicNotificationStrategy from "./DynamicNotificationStrategy";

class AfterHalfOfSpendTimeDynamicNotificationStrategy extends DynamicNotificationStrategy {
  constructor(user, dispatch, spendTimeIntervalRef, notificationService) {
    super(
      user,
      DynamicNotificationTypes.AfterHalfOfSpendTime,
      dispatch,
      spendTimeIntervalRef,
      notificationService
    );
  }

  
  execute() {
    super.execute();
  }
}

export default AfterHalfOfSpendTimeDynamicNotificationStrategy