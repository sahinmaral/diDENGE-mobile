class PushNotificationOptions {
  constructor(options = {}) {
    const {type, date, title, message, allowWhileIdle = false} = options
    this.type = type;
    this.date = date;
    this.title = title;
    this.message = message;
    this.allowWhileIdle = allowWhileIdle;
  }
}

export default PushNotificationOptions;

// FIX : Validasyonlarin yapilmasi gerekir