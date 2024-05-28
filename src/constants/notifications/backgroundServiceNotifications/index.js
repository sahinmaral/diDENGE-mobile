import { SOCIAL_MEDIA_SPENT_TIME_CHECK_INTERVAL } from "../..";

const backgroundServiceNotificationOptions = {
  taskName: "diDENGEArtificialAgentBackgroundService",
  taskTitle: "diDENGE Sanal Asistan Arkaplan Servisi",
  taskDesc:
    "diDENGE, sosyal medya kullanımını dengelemek için arka planda çalışan bir uygulamadır.",
  taskIcon: {
    name: "ic_notification",
    type: "mipmap",
  },
  linkingURI: "diDENGE://",
  parameters: {
    delay: SOCIAL_MEDIA_SPENT_TIME_CHECK_INTERVAL,
  },
};

export default backgroundServiceNotificationOptions;
