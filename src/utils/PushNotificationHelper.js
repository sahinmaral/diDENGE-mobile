import PushNotification from "react-native-push-notification";

const showLocalNotification = (channelId, title, message) => {

  const notificationOptions = {
    date: new Date(Date.now() + 2000),
    channelId,
    title,
    message,
    allowWhileIdle: false,
  };

  if(channelId === 2){
    notificationOptions.soundName = "silent_sound.mp3";
  }else{
    notificationOptions.soundName = "default";
  }

  PushNotification.localNotificationSchedule(notificationOptions);
};

const clearLocalNotification = () => {
  PushNotification.cancelAllLocalNotifications();
};

export { showLocalNotification, clearLocalNotification };
