/**
 * @format
 */

import { AppRegistry, Platform } from "react-native";
import App from "./App";
import { name as appName } from "./app.json";
import PushNotification, { Importance } from "react-native-push-notification";
import "react-native-get-random-values";

AppRegistry.registerComponent(appName, () => App);

PushNotification.configure({
  onRegister: function (token) {
    // console.log("TOKEN:", token);
  },
  onNotification: function (notification) {
    // console.log('LOCAL NOTIFICATION ==>', notification);
  },
  popInitialNotification: true,
  requestPermissions: Platform.OS === "ios",
});

PushNotification.createChannel(
  {
    channelId: "1",
    channelName: "Genel bildirimler",
    playSound: true,
    importance: Importance.HIGH,
    soundName: "default",
    vibrate: true,
    vibration: 300,
  },
  () => {}
);

PushNotification.createChannel(
  {
    channelId: "2",
    channelName: "Sessiz bildirimler",
    playSound: true,
    importance: Importance.HIGH,
    soundName: "silent_sound.mp3",
    vibrate: false,
  },
  () => {}
);
