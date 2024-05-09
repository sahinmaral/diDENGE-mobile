import { useEffect, useMemo, useRef } from "react";
import {
  APP_NAME,
  CLEAR_ALL_NOTIFICATION_INTERVAL,
  DAILY_LIMIT_EXCESSION_AMOUNT,
  PUSH_NOTIFICATION_INTERVAL,
  getFirstPieceOfUserDailyLimitInterval,
  getSecondPieceOfUserDailyLimitInterval,
} from "../constants";
import BackgroundService from "react-native-background-actions";
import ProcedurePointInformationSaveStatusTypes from "../enums/ProcedurePointInformationSaveStatusTypes";
import { useDispatch } from "react-redux";
import { refreshSpendTimeInterval } from "../redux/slices/appSlice";
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
import * as LocalStorageKeys from "../constants/localStorageKeys";
import ProcedureService from "../services/procedureService";
import SocialMediaApplicationUsageDto from "../classes/socialMediaApplicationUsageDto";
import AddOrUpdateProcedurePointInformationsRequestDto from "../classes/AddOrUpdateProcedurePointInformationsRequestDto";
import AddSocialMediaApplicationUsagesRequestDto from "../classes/AddSocialMediaApplicationUsagesRequestDto";
import { currentTime, sleep, startOfTheDay } from "../utils/timeUtils";

const notificationService = new NotificationService();
const networkHandler = new NetworkHandler();
const usageStatsService = new UsageStatsService();
const localStorageService = new LocalStorageService();
const procedureService = new ProcedureService();

const useExecuteBackgroundTask = (user, spendTimeInterval) => {
  const dispatch = useDispatch();

  const spendTimeIntervalRef = useRef(spendTimeInterval);
  const userRef = useRef(user);

  const currentUser = useMemo(() => {
    userRef.current = user;
    return userRef.current;
  }, [user]);

  const currentSpentTimeInterval = useMemo(() => {
    spendTimeIntervalRef.current = spendTimeInterval;
    return spendTimeIntervalRef.current;
  }, [spendTimeInterval]);

  const handleExecuteBackgroundTask = async (taskDataArguments) => {
    const { delay } = taskDataArguments;
    await new Promise(async (resolve) => {
      for (let i = 0; BackgroundService.isRunning(); i++) {
        const isNetworkConnected =
          await networkHandler.checkNetworkConnection();

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
        await handleSendDynamicNotification(totalSpentTime);
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
    checkAndStartBackgroundService();
  }, []);

  const handleUpdateProcedurePointInformationAndSocialMediaApplicationUsages =
    async (
      isNetworkConnected,
      totalSpentTime,
      socialMediaApplicationUsages
    ) => {
      const isCurrentTimeStartOfTheDay =
        startOfTheDay.isSame(currentTime, "hour") &&
        startOfTheDay.isSame(currentTime, "minute");

      if (isCurrentTimeStartOfTheDay) {
        dispatch(refreshSpendTimeInterval());

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
    const foundNotificationContent =
      notificationService.getCommonNotificationContent(
        currentUser,
        currentTime
      );

    if (foundNotificationContent) {
      notificationService.sendNotification(
        new PushNotificationOptions({
          type: PushNotificationType.Normal,
          date: new Date(Date.now() + 2000),
          title: APP_NAME,
          message: foundNotificationContent.message,
        })
      );
    }
  };

  const handleSendDynamicNotification = async (totalSpentTime) => {
    const userDailyLimit = currentUser.addictionLevel.dailyLimit;

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
        totalSpentTime > intervalValue &&
        totalSpentTime <= intervalValue + secondPieceFirstPositiveInterval,
      strategy: AfterAllOfSpendTimeDynamicNotificationStrategy,
    };

    const nearlyAllOfSpendTimeStrategy = {
      condition:
        totalSpentTime > intervalValue + secondPieceFirstPositiveInterval * 9 &&
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
        const hasStrategyExecutedBefore =
          currentSpentTimeInterval[strategy.type];

        if (!hasStrategyExecutedBefore) {
          const notificationStrategy = new strategy(
            currentUser,
            dispatch,
            currentSpentTimeInterval,
            notificationService
          );
          notificationStrategy.execute();
          break;
        }
      }
    }
  };

  const getSocialMediaApplicationUsages = async () => {
    const allSocialMediaApplicationUsages =
      await usageStatsService.getUsageStats(
        startOfTheDay.valueOf(),
        currentTime.valueOf()
      );

    // FIX: Sosyal medya uygulamalari ön planda calisirken kullanım süresi değişmiyor fakat arkaplana alınca süre güncelleniyor.
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
          title: APP_NAME,
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
};

export default useExecuteBackgroundTask;
