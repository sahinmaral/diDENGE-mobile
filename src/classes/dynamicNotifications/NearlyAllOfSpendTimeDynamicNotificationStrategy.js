import DynamicNotificationTypes from "../../enums/DynamicNotificationTypes";
import DynamicNotificationStrategy from "./DynamicNotificationStrategy";

class NearlyAllOfSpendTimeDynamicNotificationStrategy extends DynamicNotificationStrategy {
  constructor(user, dispatch, spendTimeIntervalRef, notificationService) {
    super(
      user,
      DynamicNotificationTypes.NearlyAllOfSpendTime,
      dispatch,
      spendTimeIntervalRef,
      notificationService
    );
  }

  execute() {
    super.execute();
  }
}

export default NearlyAllOfSpendTimeDynamicNotificationStrategy;
