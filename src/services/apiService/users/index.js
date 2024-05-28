import axios from "axios";
import { API_URL } from "@env";

const fetchUpdateNameSurname = async (values, userId, accessToken) => {
  const config = {
    headers: { Authorization: `Bearer ${accessToken}` },
  };

  const url = `${API_URL}/Users/UpdateNameSurname/${userId}`;

  return axios.put(url, values, config);
};

const fetchUpdatePassword = async (values, userId, accessToken) => {
  const config = {
    headers: { Authorization: `Bearer ${accessToken}` },
  };

  const url = `${API_URL}/Users/UpdatePassword/${userId}`;

  return axios.put(url, values, config);
};

const fetchUpdateProfileImage = async (values, userId, accessToken) => {
  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "multipart/form-data",
    },
  };

  const url = `${API_URL}/Users/UpdateProfileImage/${userId}`;

  return axios.put(url, values, config);
};

const fetchDeleteProfileImage = async (userId, accessToken) => {
  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };

  const url = `${API_URL}/Users/DeleteProfileImage/${userId}`

  return axios.delete(url, config);
};

export {
  fetchUpdateNameSurname,
  fetchUpdatePassword,
  fetchUpdateProfileImage,
  fetchDeleteProfileImage,
};
