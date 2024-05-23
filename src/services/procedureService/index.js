import StoreProcedurePointInformationDto from "../../classes/StoreProcedurePointInformationDto";
import { MAX_GRADE_INTERVAL, MIN_GRADE_INTERVAL } from "../../constants";
import * as LocalStorageKeys from "../../constants/localStorageKeys";
import ProcedurePointInformationSaveStatusTypes from "../../enums/ProcedurePointInformationSaveStatusTypes";
import ProcedureTypes from "../../enums/ProcedureTypes";
import { setUser } from "../../redux/slices/authSlice";
import LocalStorageService from "../localStorageService";

class ProcedureService {
  constructor() {
    this.localStorageService = new LocalStorageService();
  }

  calculateCurrentProcedurePointInformationGrade = (
    currentUser,
    totalSpentTime
  ) => {
    const userDailyLimit = currentUser.addictionLevel.dailyLimit;
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

  calculateNewProcedurePointInformationGrade = (
    userProcedurePointInformationOverallGrade,
    currentProcedurePointInformationGrade
  ) => {
    let newProcedurePointInformationGrade =
      userProcedurePointInformationOverallGrade *
        Q_LEARNING_WEIGHT_VECTOR_COEFFICIENT +
      currentProcedurePointInformationGrade *
        (1 - Q_LEARNING_WEIGHT_VECTOR_COEFFICIENT);

    newProcedurePointInformationGrade = Number(
      newProcedurePointInformationGrade.toFixed(6)
    );

    return newProcedurePointInformationGrade;
  };

  getOverallProcedurePointInformationGrade = (currentUser) => {
    return currentUser.procedurePointInformation.current.overallGrade;
  };

  getCurrentProcedurePointInformation = (userProcedurePointInformations) => {
    const admirationProcedure = userProcedurePointInformations.find(
      (procedurePointInformation) =>
        procedurePointInformation.procedure.name === ProcedureTypes.Admiration
    );

    const reminderProcedure = userProcedurePointInformations.find(
      (procedurePointInformation) =>
        procedurePointInformation.procedure.name === ProcedureTypes.Reminder
    );

    const warningProcedure = userProcedurePointInformations.find(
      (procedurePointInformation) =>
        procedurePointInformation.procedure.name === ProcedureTypes.Warning
    );

    if (admirationProcedure.count >= 0 && admirationProcedure.count < 3) {
      return admirationProcedure;
    } else if (reminderProcedure.count >= 0 && reminderProcedure.count < 3) {
      return reminderProcedure;
    } else if (warningProcedure.count >= 0 && warningProcedure.count < 3) {
      return warningProcedure;
    } else {
      return this.getMaxProcedurePointInformation(
        userProcedurePointInformations
      );
    }
  };

  getMaxProcedurePointInformation = (userProcedurePointInformations) => {
    let maxGrade = -Infinity;
    let itemWithMaxGrade = null;

    userProcedurePointInformations.forEach((item) => {
      if (item.overallGrade > maxGrade) {
        maxGrade = item.overallGrade;
        itemWithMaxGrade = item;
      }
    });

    return itemWithMaxGrade;
  };

  updateNewSavedProcedurePointInformations = async (
    currentUser,
    savedProcedurePointInformation,
    procedurePointInformationStatus,
    dispatch
  ) => {
    const currentSavedProcedurePointInformation =
      this.getCurrentProcedurePointInformation(savedProcedurePointInformation);

    await this.localStorageService.storeObject(
      LocalStorageKeys.PROCEDURE_POINT_INFORMATION,
      new StoreProcedurePointInformationDto(
        savedProcedurePointInformation,
        currentSavedProcedurePointInformation,
        ProcedurePointInformationSaveStatusTypes.Lately
      )
    );

    const updatedUser = {
      ...currentUser,
      procedurePointInformation: {
        all: savedProcedurePointInformation,
        current: currentSavedProcedurePointInformation,
        status: procedurePointInformationStatus,
      },
    };
    
    dispatch(setUser(updatedUser));
  };

  copyProcedurePointInformation = (currentUser) => {
    return {
      current: { ...currentUser.procedurePointInformation.current },
      all: currentUser.procedurePointInformation.all.map((procedurePoint) => ({
        ...procedurePoint,
      })),
    };
  };

  updateProcedurePointInformationCountAndReturn = (
    currentUser,
    newProcedurePointInformationGrade
  ) => {
    const copiedProcedurePointInformation =
      this.copyProcedurePointInformation(currentUser);

    const currentProcedurePointInformationFromAll =
      copiedProcedurePointInformation.all.find(
        (procedurePoint) =>
          procedurePoint.id === currentUser.procedurePointInformation.current.id
      );

    currentProcedurePointInformationFromAll.overallGrade =
      newProcedurePointInformationGrade;

    currentProcedurePointInformationFromAll.count += 1;

    copiedProcedurePointInformation.current =
      this.getCurrentProcedurePointInformation(
        copiedProcedurePointInformation.all
      );

    return copiedProcedurePointInformation;
  };
}

export default ProcedureService;
