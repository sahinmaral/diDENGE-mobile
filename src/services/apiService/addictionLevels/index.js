import axios from "axios";
import { API_URL } from '@env';

const fetchSaveAddictionLevelOfUser = async (input, accessToken) => {
  const config = {
    headers: { Authorization: `Bearer ${accessToken}` },
  };

  return axios.post(
    `${API_URL}/AddictionLevels/SaveAddictionLevelOfUser`,
    input,
    config
  );
};

const fetchGetAddictionLevelByUserId = async (userId) => {
  return axios.get(
    `${API_URL}/AddictionLevels/GetByUserId/${userId}`
  );
};

export { fetchSaveAddictionLevelOfUser, fetchGetAddictionLevelByUserId };
