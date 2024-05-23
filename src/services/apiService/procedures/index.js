import axios from "axios";
import { API_URL } from '@env';

const fetchGetProcedurePointInformationsByUserId = async (userId) => {
  return axios.get(
    `${API_URL}/Procedures/GetProcedurePointInformationsByUserId/${userId}`
  );
};

const fetchAddOrUpdateProcedurePointInformations = async (requestBody) => {
  return axios.post(
    `${API_URL}/Procedures/AddOrUpdateProcedurePointInformations`,
    requestBody
  );
};

export {
  fetchGetProcedurePointInformationsByUserId,
  fetchAddOrUpdateProcedurePointInformations,
};
