import { APP_NAME } from "../constants";

class PushNotificationOptions {
  constructor(options = {}) {
    const {channelId, date, message, allowWhileIdle = false} = options
    this.channelId = channelId;
    this.date = date;
    this.title = APP_NAME;
    this.message = message;
    this.allowWhileIdle = allowWhileIdle;
  }
}

export default PushNotificationOptions;

// FIX : Validasyonlarin yapilmasi gerekir