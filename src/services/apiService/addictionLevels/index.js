import axios from "axios";
import { API_URL } from "@env";

const fetchSaveAddictionLevelOfUser = async (input, accessToken) => {
  const config = {
    headers: { Authorization: `Bearer ${accessToken}` },
  };

  const url = `${API_URL}/AddictionLevels/SaveAddictionLevelOfUser`;

  return axios.post(url, input, config);
};

const fetchGetAddictionLevelByUserId = async (userId) => {
  const url = `${API_URL}/AddictionLevels/GetByUserId/${userId}`
  return axios.get(url);
};

export { fetchSaveAddictionLevelOfUser, fetchGetAddictionLevelByUserId };
