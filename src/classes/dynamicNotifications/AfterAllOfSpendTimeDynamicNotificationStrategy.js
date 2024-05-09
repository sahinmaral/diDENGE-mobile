import DynamicNotificationTypes from "../../enums/DynamicNotificationTypes";
import DynamicNotificationStrategy from "./DynamicNotificationStrategy";

class AfterAllOfSpendTimeDynamicNotificationStrategy extends DynamicNotificationStrategy {
  constructor(user, dispatch, spendTimeIntervalRef, notificationService) {
    super(
      user,
      DynamicNotificationTypes.AfterAllOfSpendTime,
      dispatch,
      spendTimeIntervalRef,
      notificationService
    );
  }


  execute() {
    super.execute();
  }
}

export default AfterAllOfSpendTimeDynamicNotificationStrategy