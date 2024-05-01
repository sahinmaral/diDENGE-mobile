import ProcedureTypes from "../enums/ProcedureTypes";

const getMaxProcedurePointInformation = (procedurePointInformations) => {
  let maxGrade = -Infinity;
  let itemWithMaxGrade = null;

  procedurePointInformations.forEach((item) => {
    if (item.overallGrade > maxGrade) {
      maxGrade = item.overallGrade;
      itemWithMaxGrade = item;
    }
  });

  return itemWithMaxGrade;
};

const getCurrentProcedurePointInformation = (procedurePointInformations) => {

  const admirationProcedure = procedurePointInformations.find(
    (procedurePointInformation) =>
      procedurePointInformation.procedure.name === ProcedureTypes.Admiration
  );

  const reminderProcedure = procedurePointInformations.find(
    (procedurePointInformation) =>
      procedurePointInformation.procedure.name === ProcedureTypes.Reminder
  );
  
  const warningProcedure = procedurePointInformations.find(
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
    return getMaxProcedurePointInformation(procedurePointInformations);
  }
};

export { getCurrentProcedurePointInformation };
