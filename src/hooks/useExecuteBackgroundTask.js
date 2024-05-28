import { useEffect, useRef } from "react";
import {
  APP_NAME,
  CLEAR_ALL_NOTIFICATION_INTERVAL,
  DAILY_LIMIT_EXCESSION_AMOUNT,
  PUSH_NOTIFICATION_INTERVAL,
  SOCIAL_MEDIA_ADDICTION_LEVEL_IDENTIFICATION_TEST_REPEAT_DAY,
  getFirstPieceOfUserDailyLimitInterval,
  getSecondPieceOfUserDailyLimitInterval,
} from "../constants";
import BackgroundService from "react-native-background-actions";
import ProcedurePointInformationSaveStatusTypes from "../enums/ProcedurePointInformationSaveStatusTypes";
import { useDispatch } from "react-redux";
import {
  refreshCommonNotificationInterval,
  refreshSocialMediaAddictionLevelTestReminderInterval,
  refreshSpendTimeInterval,
  setCommonNotificationInterval,
  setSocialMediaAddictionLevelTestReminderInterval,
} from "../redux/slices/appSlice";
import PushNotificationType from "../enums/PushNotificationType";
import PushNotificationOptions from "../classes/PushNotificationOptions";
import NetworkHandler from "../services/networkHandler";
import apiService from "../services/apiService";
import NotificationService from "../services/notificationService";
import UsageStatsService from "../services/usageStatsService";
import LocalStorageService from "../services/localStorageService";
import backgroundServiceNotificationOptions from "../constants/notifications/backgroundServiceNotifications";
import BeginningOfSpendTimeDynamicNotificationStrategy from "../classes/dynamicNotifications/BeginningOfSpendTimeDynamicNotificationStrategy";
import NearlyHalfOfSpendTimeDynamicNotificationStrategy from "../classes/dynamicNotifications/NearlyHalfOfSpendTimeDynamicNotificationStrategy";
import AfterAllOfSpendTimeDynamicNotificationStrategy from "../classes/dynamicNotifications/AfterAllOfSpendTimeDynamicNotificationStrategy";
import NearlyAllOfSpendTimeDynamicNotificationStrategy from "../classes/dynamicNotifications/NearlyAllOfSpendTimeDynamicNotificationStrategy";
import FailedOfObeyingSpendTimeDynamicNotificationStrategy from "../classes/dynamicNotifications/FailedOfObeyingSpendTimeDynamicNotificationStrategy";
import AfterHalfSpendTimeDynamicNotificationStrategy from "../classes/dynamicNotifications/AfterHalfOfSpendTimeDynamicNotificationStrategy";
import * as LocalStorageKeys from "../constants/localStorageKeys";
import ProcedureService from "../services/procedureService";
import SocialMediaApplicationUsageDto from "../classes/SocialMediaApplicationUsageDto";
import AddOrUpdateProcedurePointInformationsRequestDto from "../classes/AddOrUpdateProcedurePointInformationsRequestDto";
import AddSocialMediaApplicationUsagesRequestDto from "../classes/AddSocialMediaApplicationUsagesRequestDto";
import {
  getCurrentTime,
  differenceInDays,
  getEveningTime,
  getMiddleOfTheDayTime,
  getMorningTime,
  returnCurrentTimeHourAsCommonNotificationEnum,
  returnCurrentTimeHourAsSocialMediaAddictionLevelTestReminderNotificationEnum,
  sleep,
  getStartOfTheDayTime,
  isSameDateWithCurrentDate,
} from "../utils/timeUtils";
import moment from "moment";

const notificationService = new NotificationService();
const networkHandler = new NetworkHandler();
const usageStatsService = new UsageStatsService();
const localStorageService = new LocalStorageService();
const procedureService = new ProcedureService();

const useExecuteBackgroundTask = (
  user,
  spendTimeInterval,
  commonNotificationInterval,
  socialMediaAddictionLevelTestReminderInterval,
  navigation
) => {
  const dispatch = useDispatch();

  const spendTimeIntervalRef = useRef(spendTimeInterval);
  const userRef = useRef(user);
  const commonNotificationIntervalRef = useRef(commonNotificationInterval);
  const socialMediaAddictionLevelTestReminderIntervalRef = useRef(
    socialMediaAddictionLevelTestReminderInterval
  );

  const handleExecuteBackgroundTask = async (taskDataArguments) => {
    const { delay } = taskDataArguments;
    await new Promise(async () => {
      for (let i = 0; BackgroundService.isRunning(); i++) {
        const isUserReadyForUsingApp = isSameDateWithCurrentDate(user.addictionLevel.createdAt)

        if(!isUserReadyForUsingApp){
          await sleep(delay);
          continue;
        }

        const isNetworkConnected =
          await networkHandler.checkNetworkConnection();

        await checkAndRemindSocialMediaAddictionLevelTest();

        const socialMediaApplicationUsagesDto =
          await getSocialMediaApplicationUsages();

        const socialMediaApplicationUsages = Object.values(
          socialMediaApplicationUsagesDto.allSocialMediaApplicationUsagesDictionary
        );

        await handleUpdateProcedurePointInformationAndSocialMediaApplicationUsages(
          socialMediaApplicationUsagesDto.totalSpentTimeOfSocialMediaApplicationsAsMinutes,
          socialMediaApplicationUsages
        );

        if (isNetworkConnected) {
          checkIfAnyLocalDataHasToBeUpdated();
        }

        handleSendCommonNotification();
        await handleSendDynamicNotification(
          socialMediaApplicationUsagesDto.totalSpentTimeOfSocialMediaApplicationsAsMinutes
        );
        await sleep(delay);
      }
    });
  };

  const checkAndStartBackgroundService = async () => {
    if (!BackgroundService.isRunning())
      await BackgroundService.start(
        handleExecuteBackgroundTask,
        backgroundServiceNotificationOptions
      );
  };

  useEffect(() => {
    spendTimeIntervalRef.current = spendTimeInterval;
  }, [spendTimeInterval]);

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  useEffect(() => {
    commonNotificationIntervalRef.current = commonNotificationInterval;
  }, [commonNotificationInterval]);

  useEffect(() => {
    socialMediaAddictionLevelTestReminderIntervalRef.current =
      socialMediaAddictionLevelTestReminderInterval;
  }, [socialMediaAddictionLevelTestReminderInterval]);

  useEffect(() => {
    checkAndStartBackgroundService();
  }, []);

  const handleUpdateProcedurePointInformationAndSocialMediaApplicationUsages =
    async (
      isNetworkConnected,
      totalSpentTime,
      socialMediaApplicationUsages
    ) => {
      const currentUser = userRef.current;

      const isCurrentTimeStartOfTheDay =
        getStartOfTheDayTime().isSame(getCurrentTime(), "hour") &&
        getStartOfTheDayTime().isSame(getCurrentTime(), "minute");

      if (isCurrentTimeStartOfTheDay) {
        dispatch(refreshSpendTimeInterval());
        dispatch(refreshCommonNotificationInterval());
        dispatch(refreshSocialMediaAddictionLevelTestReminderInterval());

        const currentProcedurePointInformationGrade =
          procedureService.calculateCurrentProcedurePointInformationGrade(
            currentUser,
            totalSpentTime
          );

        const userProcedurePointInformationOverallGrade =
          procedureService.getOverallProcedurePointInformationGrade(
            currentUser
          );

        let newProcedurePointInformationGrade =
          procedureService.calculateNewProcedurePointInformationGrade(
            userProcedurePointInformationOverallGrade,
            currentProcedurePointInformationGrade
          );

        const copiedProcedurePointInformation =
          procedureService.updateProcedurePointInformationCountAndReturn(
            currentUser,
            newProcedurePointInformationGrade
          );

        if (isNetworkConnected) {
          try {
            const [savedProcedurePointInformationsResponse] = await Promise.all(
              [
                await fetchAddOrUpdateProcedurePointInformations({
                  userId: currentUser.id,
                  procedurePointInformations:
                    copiedProcedurePointInformation.all,
                }),
                await fetchAddSocialMediaApplicationUsages({
                  userId: currentUser.id,
                  addictionLevelId: currentUser.addictionLevel.id,
                  socialMediaApplicationUsages,
                }),
              ]
            );

            const savedProcedurePointInformationsResponseData =
              savedProcedurePointInformationsResponse.data.items;

            await procedureService.updateNewSavedProcedurePointInformations(
              currentUser,
              savedProcedurePointInformationsResponseData,
              ProcedurePointInformationSaveStatusTypes.Lately,
              dispatch
            );
          } catch (error) {
            console.log(error.response);

            await procedureService.updateNewSavedProcedurePointInformations(
              currentUser,
              copiedProcedurePointInformation,
              ProcedurePointInformationSaveStatusTypes.MustUpdate,
              dispatch
            );
          }
        } else {
          await procedureService.updateNewSavedProcedurePointInformations(
            currentUser,
            copiedProcedurePointInformation,
            ProcedurePointInformationSaveStatusTypes.MustUpdate,
            dispatch
          );

          await usageStatsService.saveSocialMediaApplicationUsagesLocally(
            localStorageService,
            socialMediaApplicationUsages
          );
        }
      }
    };

  const handleSendCommonNotification = () => {
    const currentUser = userRef.current;

    const foundNotificationContent =
      notificationService.getCommonNotificationContent(
        currentUser,
        getCurrentTime()
      );

    if (foundNotificationContent) {
      const commonNotificationIntervalEnum =
        returnCurrentTimeHourAsCommonNotificationEnum();
      const currentCommonNotificationInterval =
        commonNotificationIntervalRef.current;

      const hasCommonNotificationExecutedBefore =
        currentCommonNotificationInterval[commonNotificationIntervalEnum];

      if (!hasCommonNotificationExecutedBefore) {
        dispatch(
          setCommonNotificationInterval({
            ...currentCommonNotificationInterval,
            [commonNotificationIntervalEnum]: true,
          })
        );

        notificationService.sendNotification(
          new PushNotificationOptions({
            channelId: PushNotificationType.Normal,
            date: new Date(Date.now() + 2000),
            message: foundNotificationContent.message,
          })
        );
      }
    }
  };

  const handleSendDynamicNotification = async (totalSpentTime) => {
    const currentUser = userRef.current;
    const currentSpentTimeInterval = spendTimeIntervalRef.current;
    const userDailyLimit = currentUser.addictionLevel.dailyLimit;

    const halfOfUserDailyLimit = userDailyLimit / 2;

    const firstPieceOfFirstPositiveInterval =
      getFirstPieceOfUserDailyLimitInterval(userDailyLimit);
    const secondPieceFirstPositiveInterval =
      getSecondPieceOfUserDailyLimitInterval(userDailyLimit);

    const beginningOfSpendTimeStrategy = {
      condition:
        totalSpentTime > 0 &&
        totalSpentTime <= firstPieceOfFirstPositiveInterval * 2,
      strategy: BeginningOfSpendTimeDynamicNotificationStrategy,
    };

    const nearlyHalfOfSpendTimeStrategy = {
      condition:
        totalSpentTime > firstPieceOfFirstPositiveInterval * 4 &&
        totalSpentTime < firstPieceOfFirstPositiveInterval * 5,
      strategy: NearlyHalfOfSpendTimeDynamicNotificationStrategy,
    };

    const afterHalfOfSpendTimeStrategy = {
      condition:
        totalSpentTime > halfOfUserDailyLimit &&
        totalSpentTime <=
          halfOfUserDailyLimit + secondPieceFirstPositiveInterval,
      strategy: AfterHalfSpendTimeDynamicNotificationStrategy,
    };

    const nearlyAllOfSpendTimeStrategy = {
      condition:
        totalSpentTime >
          halfOfUserDailyLimit + secondPieceFirstPositiveInterval * 9 &&
        totalSpentTime <= userDailyLimit,
      strategy: NearlyAllOfSpendTimeDynamicNotificationStrategy,
    };

    const afterAllOfSpendTimeStrategy = {
      condition:
        totalSpentTime > userDailyLimit &&
        totalSpentTime < userDailyLimit + DAILY_LIMIT_EXCESSION_AMOUNT,
      strategy: AfterAllOfSpendTimeDynamicNotificationStrategy,
    };

    const failedOfObeyingStrategy = {
      condition:
        totalSpentTime >= userDailyLimit + DAILY_LIMIT_EXCESSION_AMOUNT,
      strategy: FailedOfObeyingSpendTimeDynamicNotificationStrategy,
    };

    const strategies = [
      beginningOfSpendTimeStrategy,
      nearlyHalfOfSpendTimeStrategy,
      afterHalfOfSpendTimeStrategy,
      nearlyAllOfSpendTimeStrategy,
      afterAllOfSpendTimeStrategy,
      failedOfObeyingStrategy,
    ];

    for (const { condition, strategy } of strategies) {
      if (condition) {
        const notificationStrategy = new strategy(
          currentUser,
          dispatch,
          currentSpentTimeInterval,
          notificationService
        );

        const hasStrategyExecutedBefore =
          currentSpentTimeInterval[notificationStrategy.type];

        if (!hasStrategyExecutedBefore) {
          notificationStrategy.execute();
          break;
        }
      }
    }
  };

  const getSocialMediaApplicationUsages = async () => {
    const allSocialMediaApplicationUsages =
      await usageStatsService.getUsageStats(
        getStartOfTheDayTime().valueOf(),
        getCurrentTime().valueOf()
      );

    const totalSpentTimeOfSocialMediaApplications =
      usageStatsService.getTotalSpentTimeOfSocialMediaApplications(
        allSocialMediaApplicationUsages
      );

    const totalSpentTimeOfSocialMediaApplicationsAsMinutes = Math.floor(
      totalSpentTimeOfSocialMediaApplications / 60
    );

    return new SocialMediaApplicationUsageDto(
      allSocialMediaApplicationUsages,
      totalSpentTimeOfSocialMediaApplicationsAsMinutes
    );
  };

  const clearAllNotifications = () => {
    setTimeout(() => {
      notificationService.clearAllNotifications();
    }, CLEAR_ALL_NOTIFICATION_INTERVAL + PUSH_NOTIFICATION_INTERVAL);
  };

  const checkIfAnyLocalDataHasToBeUpdated = async () => {
    const currentUser = userRef.current;
    const localProcedurePointInformation = await localStorageService.getObject(
      LocalStorageKeys.PROCEDURE_POINT_INFORMATION
    );

    const localSocialMediaApplicationUsage =
      await localStorageService.getObject(
        LocalStorageKeys.SOCIAL_MEDIA_APPLICATION_USAGES
      );

    const isLocalProcedurePointInformationStateMustUpdate =
      localProcedurePointInformation.status ===
      ProcedurePointInformationSaveStatusTypes.MustUpdate;

    const isLocalSocialMediaApplicationUsagesStateExist =
      localSocialMediaApplicationUsage !== null;

    const isAnyLocalDataHasToBeUpdated =
      isLocalProcedurePointInformationStateMustUpdate ||
      isLocalSocialMediaApplicationUsagesStateExist;

    if (isAnyLocalDataHasToBeUpdated) {
      try {
        notificationService.sendNotification({
          type: PushNotificationType.Silent,
          date: new Date(Date.now() + PUSH_NOTIFICATION_INTERVAL),
          message: "Kullanım süreleriniz kaydediliyor ...",
        });

        if (isLocalProcedurePointInformationStateMustUpdate) {
          const savedProcedurePointInformationsResponse =
            await apiService.procedures.fetchAddOrUpdateProcedurePointInformations(
              new AddOrUpdateProcedurePointInformationsRequestDto(
                currentUser,
                localProcedurePointInformation.all
              )
            );

          const savedProcedurePointInformationsResponseData =
            savedProcedurePointInformationsResponse.data.items;

          await procedureService.updateNewSavedProcedurePointInformations(
            currentUser,
            savedProcedurePointInformationsResponseData,
            ProcedurePointInformationSaveStatusTypes.Lately,
            dispatch
          );
        }
        if (isLocalSocialMediaApplicationUsagesStateExist) {
          await apiService.socialMediaApplicationUsages.fetchAddSocialMediaApplicationUsages(
            new AddSocialMediaApplicationUsagesRequestDto(
              currentUser,
              socialMediaApplicationUsages
            )
          );

          await localStorageService.removeItem(
            LocalStorageKeys.SOCIAL_MEDIA_APPLICATION_USAGES
          );
        }
      } catch (error) {
        console.log(error);
      } finally {
        clearAllNotifications();
      }
    }
  };

  const checkAndRemindSocialMediaAddictionLevelTest = async () => {
    const currentUser = userRef.current;

    const currentSocialMediaAddictionLevelTestReminderInterval =
      socialMediaAddictionLevelTestReminderIntervalRef.current;

    const differenceBetweenDates = differenceInDays(
      getCurrentTime(),
      moment(currentUser.addictionLevel.createdAt)
    );

    if (
      differenceBetweenDates ===
      SOCIAL_MEDIA_ADDICTION_LEVEL_IDENTIFICATION_TEST_REPEAT_DAY
    ) {
      if (
        getCurrentTime().isSame(getMorningTime().add(1, "hours"), "hours") ||
        getCurrentTime().isSame(
          getMiddleOfTheDayTime().add(1, "hours"),
          "hours"
        ) ||
        getCurrentTime().isSame(getEveningTime().add(1, "hours"), "hours")
      ) {
        const socialMediaAddictionLevelTestReminderIntervalEnum =
          returnCurrentTimeHourAsSocialMediaAddictionLevelTestReminderNotificationEnum();

        const hasSocialMediaAddictionLevelTestReminderNotificationExecutedBefore =
          currentSocialMediaAddictionLevelTestReminderInterval[
            socialMediaAddictionLevelTestReminderIntervalEnum
          ];
        if (
          !hasSocialMediaAddictionLevelTestReminderNotificationExecutedBefore
        ) {
          dispatch(
            setSocialMediaAddictionLevelTestReminderInterval({
              ...currentSocialMediaAddictionLevelTestReminderInterval,
              [socialMediaAddictionLevelTestReminderIntervalEnum]: true,
            })
          );
          notificationService.sendNotification(
            new PushNotificationOptions({
              channelId: PushNotificationType.Normal,
              date: new Date(Date.now() + 2000),
              message:
                "Bugün içerisinde sosyal medya bağımlılık seviye testini çözmen gerekiyor. Aksi taktirde oturumun sonlandırılacak.",
            })
          );
        }
      }
    } else if (
      differenceBetweenDates >
      SOCIAL_MEDIA_ADDICTION_LEVEL_IDENTIFICATION_TEST_REPEAT_DAY
    ) {
      navigation.navigate("LoggedOut", {
        message:
          "Sosyal medya bağımlılık seviye testini çözmediğin için oturum sonlandırılıyor",
      });
    }
  };
};

export default useExecuteBackgroundTask;
