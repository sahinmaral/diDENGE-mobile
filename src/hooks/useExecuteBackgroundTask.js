import moment from "moment";
import {
  clearLocalNotification,
  showLocalNotification,
} from "../utils/PushNotificationHelper";
import {
  getCommonNotification,
  getDynamicNotification,
} from "../utils/NotificationHelper";
import { useEffect, useRef } from "react";
import {
  DAILY_LIMIT_EXCESSION_AMOUNT,
  MAX_GRADE_INTERVAL,
  MIN_GRADE_INTERVAL,
  Q_LEARNING_WEIGHT_VECTOR_COEFFICIENT,
  SOCIAL_MEDIA_SPENT_TIME_CHECK_INTERVAL,
} from "../constants";
import BackgroundService from "react-native-background-actions";
import { NativeModules } from "react-native";
import { getTotalSpentTimeOfSocialMediaApplications } from "../utils/UsageStatsParser";
import { fetch } from "@react-native-community/netinfo";
import { getCurrentProcedurePointInformation } from "../utils/ProcedureHelper";
import { getObject, storeObject } from "../utils/LocalStorageHelper";
import ProcedurePointInformationSaveStatusTypes from "../enums/ProcedurePointInformationSaveStatusTypes";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/slices/authSlice";
import { fetchAddOrUpdateProcedurePointInformations } from "../services/APIService";
import {
  setSpendTimeInterval,
  refreshSpendTimeInterval,
} from "../redux/slices/appSlice";
import DynamicNotificationTypes from "../enums/DynamicNotificationTypes";
import { v4 as uuidv4 } from "uuid";

const { UsageStats } = NativeModules;

const useExecuteBackgroundTask = (user, spendTimeInterval) => {
  const sleep = (time) =>
    new Promise((resolve) => setTimeout(() => resolve(), time));

  const dispatch = useDispatch();

  const spendTimeIntervalRef = useRef(spendTimeInterval);

  const handleExecuteBackgroundTask = async (taskDataArguments) => {
    const { delay } = taskDataArguments;
    await new Promise(async (resolve) => {
      for (let i = 0; BackgroundService.isRunning(); i++) {
        const networkState = await fetch();

        const isNetworkConnected =
          networkState.type !== "unknown" && networkState.isConnected;

        const localProcedurePointInformation = await getObject(
          "procedurePointInformation"
        );

        if (
          isNetworkConnected &&
          localProcedurePointInformation.status ===
            ProcedurePointInformationSaveStatusTypes.MustUpdate
        ) {
          
          try {
            showLocalNotification(
              "2",
              "diDENGE",
              "Kullanım süreleriniz kaydediliyor ..."
            );

            const procedurePointInformationsResponse =
              await fetchAddOrUpdateProcedurePointInformations({
                userId: user.id,
                procedurePointInformations: localProcedurePointInformation.all,
              });

            const procedurePointInformationsData =
              procedurePointInformationsResponse.data.items;

            const currentProcedurePointInformation =
              getCurrentProcedurePointInformation(
                procedurePointInformationsData
              );

            storeObject("procedurePointInformation", {
              all: procedurePointInformationsData,
              current: currentProcedurePointInformation,
              status: ProcedurePointInformationSaveStatusTypes.Lately,
            });

            dispatch(
              setUser({
                ...user,
                procedurePointInformation: {
                  all: procedurePointInformationsData,
                  current: currentProcedurePointInformation,
                  status: ProcedurePointInformationSaveStatusTypes.Lately,
                },
              })
            );
          } catch (error) {
            console.log(error);
          } finally {
            setTimeout(() => {
              clearLocalNotification()
            }, 12000)
          }
        }

        const totalSpentTime = await getSpentTimeOfAllSocialMediaApplication();

        await handleUpdateProcedurePointInformation(
          isNetworkConnected,
          totalSpentTime
        );

        await handleSendNotification(totalSpentTime);
        await sleep(delay);
      }
    });
  };

  const options = {
    taskName: "SendNotificationBySpentTimeOfUser",
    taskTitle: "diDENGE Sanal Asistan Arkaplan Servisi",
    taskDesc:
      "diDENGE, sosyal medya kullanımını dengelemek için arka planda çalışan bir uygulamadır.",
    taskIcon: {
      name: "ic_launcher",
      type: "mipmap",
    },
    linkingURI: "diDENGE://",
    parameters: {
      delay: 1000,
    },
  };

  const checkAndStartBackgroundService = async () => {
    if (!BackgroundService.isRunning())
      await BackgroundService.start(handleExecuteBackgroundTask, options);
  };

  useEffect(() => {
    spendTimeIntervalRef.current = spendTimeInterval;
  }, [spendTimeInterval]);

  useEffect(() => {
    checkAndStartBackgroundService();
  }, []);

  const handleUpdateProcedurePointInformation = async (
    isNetworkConnected,
    totalSpentTime
  ) => {
    const startOfTheDay = moment().hours(17).minutes(36);
    const currentTime = moment();

    if (
      startOfTheDay.isSame(currentTime, "hour")
      // &&
      // startOfTheDay.isSame(currentTime, "minute")
    ) {
      dispatch(refreshSpendTimeInterval());

      const spentTimeGrade = calculateSpentTimeGrade(totalSpentTime);
      const currentProcedurePointInformationGrade =
        user.procedurePointInformation.current.overallGrade;

      let newProcedurePointInformationGrade =
        currentProcedurePointInformationGrade *
          Q_LEARNING_WEIGHT_VECTOR_COEFFICIENT +
        spentTimeGrade * (1 - Q_LEARNING_WEIGHT_VECTOR_COEFFICIENT);

      newProcedurePointInformationGrade = Number(
        newProcedurePointInformationGrade.toFixed(6)
      );

      const copiedProcedurePointInformation = {
        ...user.procedurePointInformation,
        all: user.procedurePointInformation.all.map((procedurePoint) => ({
          ...procedurePoint,
        })),
      };

      copiedProcedurePointInformation.all.find(
        (procedurePoint) =>
          procedurePoint.id === user.procedurePointInformation.current.id
      ).overallGrade = newProcedurePointInformationGrade;

      copiedProcedurePointInformation.current =
        getCurrentProcedurePointInformation(
          copiedProcedurePointInformation.all
        );

      if (isNetworkConnected) {
        try {
          const procedurePointInformationsResponse =
            await fetchAddOrUpdateProcedurePointInformations({
              userId: user.id,
              procedurePointInformations: copiedProcedurePointInformation.all,
            });

          const procedurePointInformationsData =
            procedurePointInformationsResponse.data.items;

          const currentProcedurePointInformation =
            getCurrentProcedurePointInformation(procedurePointInformationsData);

          storeObject("procedurePointInformation", {
            all: procedurePointInformationsData,
            current: currentProcedurePointInformation,
            status: ProcedurePointInformationSaveStatusTypes.Lately,
          });

          dispatch(
            setUser({
              ...user,
              procedurePointInformation: {
                all: procedurePointInformationsData,
                current: currentProcedurePointInformation,
                status: ProcedurePointInformationSaveStatusTypes.Lately,
              },
            })
          );
        } catch (error) {
          console.log(error.response);
          saveProcedurePointInformationLocally(
            copiedProcedurePointInformation,
            user
          );
        }
      } else {
        saveProcedurePointInformationLocally(
          copiedProcedurePointInformation,
          user
        );
      }
    }
  };

  const saveProcedurePointInformationLocally = (
    copiedProcedurePointInformation,
    user
  ) => {
    storeObject("procedurePointInformation", {
      ...copiedProcedurePointInformation,
      status: ProcedurePointInformationSaveStatusTypes.MustUpdate,
    });

    dispatch(
      setUser({
        ...user,
        procedurePointInformation: {
          ...copiedProcedurePointInformation,
          status: ProcedurePointInformationSaveStatusTypes.MustUpdate,
        },
      })
    );
  };

  const calculateSpentTimeGrade = (totalSpentTime) => {
    const userDailyLimit = user.addictionLevel.dailyLimit;
    const intervalValue = userDailyLimit / 2;
    const firstPieceOfFirstPositiveInterval = intervalValue / 5;
    const secondPieceFirstPositiveInterval = intervalValue / 10;

    if (totalSpentTime >= 0 && totalSpentTime < intervalValue) {
      return (
        MAX_GRADE_INTERVAL -
        Math.ceil(totalSpentTime / firstPieceOfFirstPositiveInterval)
      );
    } else if (
      totalSpentTime >= intervalValue &&
      totalSpentTime < userDailyLimit
    ) {
      return (
        MAX_GRADE_INTERVAL / 2 -
        Math.ceil(totalSpentTime / secondPieceFirstPositiveInterval)
      );
    } else if (totalSpentTime >= userDailyLimit) {
      return (
        Math.ceil(
          (totalSpentTime - userDailyLimit) / secondPieceFirstPositiveInterval
        ) * -1
      );
    } else {
      return MIN_GRADE_INTERVAL;
    }
  };

  const handleSendNotification = async (totalSpentTime) => {
    handleSendCommonNotification();
    await handleSendDynamicNotificationBySpentTimeOfUser(totalSpentTime);
  };

  const handleSendCommonNotification = () => {
    const currentTime = moment();

    const foundNotification = getCommonNotification(
      user.procedurePointInformation.current.procedure.name,
      currentTime,
      user.firstName
    );

    if (foundNotification) {
      showLocalNotification("1", "diDENGE", foundNotification.message);
    }
  };

  const handleSendDynamicNotificationBySpentTimeOfUser = async (
    totalSpentTime
  ) => {
    const userDailyLimit = user.addictionLevel.dailyLimit;

    const intervalValue = userDailyLimit / 2;
    const firstPieceOfFirstPositiveInterval = intervalValue / 5;
    const secondPieceFirstPositiveInterval = intervalValue / 10;

    if (
      totalSpentTime > 0 &&
      totalSpentTime <= firstPieceOfFirstPositiveInterval * 2
    ) {
      if (
        !spendTimeIntervalRef.current[
          DynamicNotificationTypes.BeginningOfSpendTime
        ]
      ) {
        const foundNotification = getDynamicNotification(
          user.procedurePointInformation.current.procedure.name,
          DynamicNotificationTypes.BeginningOfSpendTime,
          user.firstName
        );

        if (foundNotification) {
          dispatch(
            setSpendTimeInterval({
              ...spendTimeIntervalRef.current,
              [DynamicNotificationTypes.BeginningOfSpendTime]: true,
            })
          );

          showLocalNotification("1", "diDENGE", foundNotification.message);
        }
      }
    } else if (
      totalSpentTime > firstPieceOfFirstPositiveInterval * 4 &&
      totalSpentTime < firstPieceOfFirstPositiveInterval * 5
    ) {
      if (
        !spendTimeIntervalRef.current[
          DynamicNotificationTypes.NearlyHalfOfSpendTime
        ]
      ) {
        const foundNotification = getDynamicNotification(
          user.procedurePointInformation.current.procedure.name,
          DynamicNotificationTypes.NearlyHalfOfSpendTime,
          user.firstName
        );

        if (foundNotification) {
          dispatch(
            setSpendTimeInterval({
              ...spendTimeIntervalRef.current,
              [DynamicNotificationTypes.NearlyHalfOfSpendTime]: true,
            })
          );

          showLocalNotification("1", "diDENGE", foundNotification.message);
        }
      }
    } else if (
      totalSpentTime > intervalValue &&
      totalSpentTime <= intervalValue + secondPieceFirstPositiveInterval
    ) {
      if (
        !spendTimeIntervalRef.current[
          DynamicNotificationTypes.AfterHalfOfSpendTime
        ]
      ) {
        const foundNotification = getDynamicNotification(
          user.procedurePointInformation.current.procedure.name,
          DynamicNotificationTypes.AfterHalfOfSpendTime,
          user.firstName
        );

        if (foundNotification) {
          dispatch(
            setSpendTimeInterval({
              ...spendTimeIntervalRef.current,
              [DynamicNotificationTypes.AfterHalfOfSpendTime]: true,
            })
          );

          showLocalNotification("1", "diDENGE", foundNotification.message);
        }
      }
    } else if (
      totalSpentTime > intervalValue + secondPieceFirstPositiveInterval * 9 &&
      totalSpentTime <= userDailyLimit
    ) {
      if (
        !spendTimeIntervalRef.current[
          DynamicNotificationTypes.NearlyAllOfSpendTime
        ]
      ) {
        const foundNotification = getDynamicNotification(
          user.procedurePointInformation.current.procedure.name,
          DynamicNotificationTypes.NearlyAllOfSpendTime,
          user.firstName
        );

        if (foundNotification) {
          dispatch(
            setSpendTimeInterval({
              ...spendTimeIntervalRef.current,
              [DynamicNotificationTypes.NearlyAllOfSpendTime]: true,
            })
          );

          showLocalNotification("1", "diDENGE", foundNotification.message);
        }
      }
    } else if (totalSpentTime > userDailyLimit) {
      if (
        totalSpentTime > totalSpentTime &&
        totalSpentTime <= totalSpentTime + DAILY_LIMIT_EXCESSION_AMOUNT
      ) {
        if (
          !spendTimeIntervalRef.current[
            DynamicNotificationTypes.AfterAllOfSpendTime
          ]
        ) {
          const foundNotification = getDynamicNotification(
            user.procedurePointInformation.current.procedure.name,
            DynamicNotificationTypes.AfterAllOfSpendTime,
            user.firstName
          );

          if (foundNotification) {
            dispatch(
              setSpendTimeInterval({
                ...spendTimeIntervalRef.current,
                [DynamicNotificationTypes.AfterAllOfSpendTime]: true,
              })
            );

            showLocalNotification("1", "diDENGE", foundNotification.message);
          }
        }
      } else {
        if (
          !spendTimeIntervalRef.current[
            DynamicNotificationTypes.FailedOfObeyingSpendTime
          ]
        ) {
          const foundNotification = getDynamicNotification(
            user.procedurePointInformation.current.procedure.name,
            DynamicNotificationTypes.FailedOfObeyingSpendTime,
            user.firstName
          );

          if (foundNotification) {
            dispatch(
              setSpendTimeInterval({
                ...spendTimeIntervalRef.current,
                [DynamicNotificationTypes.FailedOfObeyingSpendTime]: true,
              })
            );

            showLocalNotification("1", "diDENGE", foundNotification.message);
          }
        }
      }
    }
  };

  const getSpentTimeOfAllSocialMediaApplication = async () => {
    const currentTime = moment();

    const todayTime = currentTime.clone().startOf("day");

    const allStats = await UsageStats.getUsageStats(
      todayTime.valueOf(),
      currentTime.valueOf()
    );

    // FIX: Sosyal medya uygulamalari ön planda calisirken kullanım süresi değişmiyor fakat arkaplana alınca süre güncelleniyor.
    const totalSpentTime = getTotalSpentTimeOfSocialMediaApplications(allStats);
    const roundedTotalSpendTime = Math.floor(totalSpentTime / 60);

    //console.log(allStats);

    // console.log(
    //   `Harcadığı süre : ${roundedTotalSpendTime} dk , şu an ${currentTime}`
    // );

    return roundedTotalSpendTime;
  };
};

export default useExecuteBackgroundTask;
