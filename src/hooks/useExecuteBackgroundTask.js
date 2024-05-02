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
import {
  getObject,
  removeItem,
  storeObject,
} from "../utils/LocalStorageHelper";
import ProcedurePointInformationSaveStatusTypes from "../enums/ProcedurePointInformationSaveStatusTypes";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/slices/authSlice";
import {
  fetchAddOrUpdateProcedurePointInformations,
  fetchAddSocialMediaApplicationUsages,
} from "../services/APIService";
import {
  setSpendTimeInterval,
  refreshSpendTimeInterval,
} from "../redux/slices/appSlice";
import DynamicNotificationTypes from "../enums/DynamicNotificationTypes";

const { UsageStats } = NativeModules;

const useExecuteBackgroundTask = (user, spendTimeInterval) => {
  const sleep = (time) =>
    new Promise((resolve) => setTimeout(() => resolve(), time));

  const dispatch = useDispatch();

  const spendTimeIntervalRef = useRef(spendTimeInterval);
  const userRef = useRef(user);

  const handleExecuteBackgroundTask = async (taskDataArguments) => {
    const { delay } = taskDataArguments;
    await new Promise(async (resolve) => {
      for (let i = 0; BackgroundService.isRunning(); i++) {
        const networkState = await fetch();

        const isNetworkConnected =
          networkState.type !== "unknown" && networkState.isConnected;

        const spendTimeStats = await getSpentTimeOfAllSocialMediaApplication();

        const { totalSpentTime, allStats } = spendTimeStats;

        const socialMediaApplicationUsages = Object.values(allStats);

        await handleUpdateProcedurePointInformationAndSocialMediaApplicationUsages(
          isNetworkConnected,
          totalSpentTime,
          socialMediaApplicationUsages
        );

        if (isNetworkConnected) {
          const localProcedurePointInformation = await getObject(
            "procedurePointInformation"
          );

          const localSocialMediaApplicationUsage = await getObject(
            "socialMediaApplicationUsages"
          );

          const isLocalProcedurePointInformationStateMustUpdate =
            localProcedurePointInformation.status ===
            ProcedurePointInformationSaveStatusTypes.MustUpdate;

          const isLocalSocialMediaApplicationUsagesStateExist =
            localSocialMediaApplicationUsage !== null;

          if (
            isLocalProcedurePointInformationStateMustUpdate ||
            isLocalSocialMediaApplicationUsagesStateExist
          ) {
            try {
              showLocalNotification(
                "2",
                "diDENGE",
                "Kullanım süreleriniz kaydediliyor ..."
              );

              if (isLocalProcedurePointInformationStateMustUpdate) {
                const procedurePointInformationsResponse =
                  await fetchAddOrUpdateProcedurePointInformations({
                    userId: userRef.current.id,
                    procedurePointInformations:
                      localProcedurePointInformation.all,
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
                    ...userRef.current,
                    procedurePointInformation: {
                      all: procedurePointInformationsData,
                      current: currentProcedurePointInformation,
                      status: ProcedurePointInformationSaveStatusTypes.Lately,
                    },
                  })
                );
              }
              if (isLocalSocialMediaApplicationUsagesStateExist) {
                await fetchAddSocialMediaApplicationUsages({
                  userId: userRef.current.id,
                  addictionLevelId: userRef.current.addictionLevel.id,
                  socialMediaApplicationUsages,
                });

                await removeItem("socialMediaApplicationUsages");
              }
            } catch (error) {
              console.log(error);
            } finally {
              setTimeout(() => {
                clearLocalNotification();
              }, 12000);
            }
          }
        }

        await handleSendNotification(spendTimeStats.totalSpentTime);
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
    userRef.current = user;
  }, [user]);

  useEffect(() => {
    checkAndStartBackgroundService();
  }, []);

  const handleUpdateProcedurePointInformationAndSocialMediaApplicationUsages =
    async (
      isNetworkConnected,
      totalSpentTime,
      socialMediaApplicationUsages
    ) => {
      const startOfTheDay = moment().hours(0).minutes(0);
      const currentTime = moment();

      if (
        startOfTheDay.isSame(currentTime, "hour") &&
        startOfTheDay.isSame(currentTime, "minute")
      ) {
        dispatch(refreshSpendTimeInterval());

        const spentTimeGrade = calculateSpentTimeGrade(totalSpentTime);
        const currentProcedurePointInformationGrade =
          userRef.current.procedurePointInformation.current.overallGrade;

        let newProcedurePointInformationGrade =
          currentProcedurePointInformationGrade *
            Q_LEARNING_WEIGHT_VECTOR_COEFFICIENT +
          spentTimeGrade * (1 - Q_LEARNING_WEIGHT_VECTOR_COEFFICIENT);

        newProcedurePointInformationGrade = Number(
          newProcedurePointInformationGrade.toFixed(6)
        );

        const copiedProcedurePointInformation = {
          current: { ...userRef.current.procedurePointInformation.current },
          all: userRef.current.procedurePointInformation.all.map(
            (procedurePoint) => ({
              ...procedurePoint,
            })
          ),
        };

        const currentProcedurePointInformationFromAll =
          copiedProcedurePointInformation.all.find(
            (procedurePoint) =>
              procedurePoint.id ===
              userRef.current.procedurePointInformation.current.id
          );

        currentProcedurePointInformationFromAll.overallGrade =
          newProcedurePointInformationGrade;
        currentProcedurePointInformationFromAll.count += 1;

        copiedProcedurePointInformation.current =
          getCurrentProcedurePointInformation(
            copiedProcedurePointInformation.all
          );

        if (isNetworkConnected) {
          try {
            const [procedurePointInformationsResponse] = await Promise.all([
              await fetchAddOrUpdateProcedurePointInformations({
                userId: userRef.current.id,
                procedurePointInformations: copiedProcedurePointInformation.all,
              }),
              await fetchAddSocialMediaApplicationUsages({
                userId: userRef.current.id,
                addictionLevelId: userRef.current.addictionLevel.id,
                socialMediaApplicationUsages,
              }),
            ]);

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
                ...userRef.current,
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
              userRef.current
            );

            saveSocialMediaApplicationUsagesLocally(
              socialMediaApplicationUsages
            );
          }
        } else {
          console.log(socialMediaApplicationUsages);

          saveProcedurePointInformationLocally(
            copiedProcedurePointInformation,
            userRef.current
          );

          saveSocialMediaApplicationUsagesLocally(socialMediaApplicationUsages);
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

  const saveSocialMediaApplicationUsagesLocally = (
    socialMediaApplicationUsages
  ) => {
    storeObject("socialMediaApplicationUsages", [
      ...socialMediaApplicationUsages,
    ]);
  };

  const calculateSpentTimeGrade = (totalSpentTime) => {
    const userDailyLimit = userRef.current.addictionLevel.dailyLimit;
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
      userRef.current.procedurePointInformation.current.procedure.name,
      currentTime,
      userRef.current.firstName
    );

    if (foundNotification) {
      showLocalNotification("1", "diDENGE", foundNotification.message);
    }
  };

  const handleSendDynamicNotificationBySpentTimeOfUser = async (
    totalSpentTime
  ) => {
    const userDailyLimit = userRef.current.addictionLevel.dailyLimit;

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
          userRef.current.procedurePointInformation.current.procedure.name,
          DynamicNotificationTypes.BeginningOfSpendTime,
          userRef.current.firstName
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
          userRef.current.procedurePointInformation.current.procedure.name,
          DynamicNotificationTypes.NearlyHalfOfSpendTime,
          userRef.current.firstName
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
          userRef.current.procedurePointInformation.current.procedure.name,
          DynamicNotificationTypes.AfterHalfOfSpendTime,
          userRef.current.firstName
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
          userRef.current.procedurePointInformation.current.procedure.name,
          DynamicNotificationTypes.NearlyAllOfSpendTime,
          userRef.current.firstName
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
            userRef.current.procedurePointInformation.current.procedure.name,
            DynamicNotificationTypes.AfterAllOfSpendTime,
            userRef.current.firstName
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
            userRef.current.procedurePointInformation.current.procedure.name,
            DynamicNotificationTypes.FailedOfObeyingSpendTime,
            userRef.current.firstName
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

    // console.log(allStats);

    // console.log(
    //   `Harcadığı süre : ${roundedTotalSpendTime} dk , şu an ${currentTime}`
    // );

    return { roundedTotalSpendTime, allStats };
  };
};

export default useExecuteBackgroundTask;
