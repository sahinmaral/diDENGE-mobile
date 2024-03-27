import axios from "axios";

const fetchRegisterUser = async (values) => {
  return axios.post("http://localhost:5178/api/Auth/Register", values);
};

const fetchLoginUser = async (values) => {
  return axios.post("http://localhost:5178/api/Auth/Login", values);
};

const fetchSaveAddictionLevelOfUser = async (input, accessToken) => {
  const config = {
    headers: { Authorization: `Bearer ${accessToken}` },
  };

  return axios.post(
    "http://localhost:5178/api/AddictionLevels/SaveAddictionLevelOfUser",
    input,
    config
  );
};

const fetchGetAddictionLevelByUserId = async (userId) => {
  return axios.get(
    `http://localhost:5178/api/AddictionLevels/GetByUserId/${userId}`
  );
};

const fetchGetRandomWordOfTheDay = async () => {
  return axios.get("http://localhost:5178/api/WordOfTheDays/GetByRandom");
};

export {
  fetchRegisterUser,
  fetchLoginUser,
  fetchGetAddictionLevelByUserId,
  fetchSaveAddictionLevelOfUser,
  fetchGetRandomWordOfTheDay,
};
