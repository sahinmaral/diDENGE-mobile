import axios from "axios";
import { API_URL } from "@env";

const fetchGetProcedurePointInformationsByUserId = async (userId) => {
  const url = `${API_URL}/Procedures/GetProcedurePointInformationsByUserId/${userId}`;
  return axios.get(url);
};

const fetchAddOrUpdateProcedurePointInformations = async (input) => {
  const url = `${API_URL}/Procedures/AddOrUpdateProcedurePointInformations`;
  return axios.post(url, input);
};

export {
  fetchGetProcedurePointInformationsByUserId,
  fetchAddOrUpdateProcedurePointInformations,
};
