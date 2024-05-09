import axios from "axios";

const fetchSaveAddictionLevelOfUser = async (input, accessToken) => {
  const config = {
    headers: { Authorization: `Bearer ${accessToken}` },
  };

  return axios.post(
    `${process.env.API_URL}/AddictionLevels/SaveAddictionLevelOfUser`,
    input,
    config
  );
};

const fetchGetAddictionLevelByUserId = async (userId) => {
  return axios.get(
    `${process.env.API_URL}/AddictionLevels/GetByUserId/${userId}`
  );
};

export { fetchSaveAddictionLevelOfUser, fetchGetAddictionLevelByUserId };
