import axios from "axios";

const fetchGetProcedurePointInformationsByUserId = async (userId) => {
  return axios.get(
    `${process.env.API_URL}/Procedures/GetProcedurePointInformationsByUserId/${userId}`
  );
};

const fetchAddOrUpdateProcedurePointInformations = async (requestBody) => {
  return axios.post(
    `${process.env.API_URL}/Procedures/AddOrUpdateProcedurePointInformations`,
    requestBody
  );
};

export {
  fetchGetProcedurePointInformationsByUserId,
  fetchAddOrUpdateProcedurePointInformations,
};
