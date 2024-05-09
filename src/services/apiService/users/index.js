import axios from "axios";

const fetchUpdateNameSurname = async (values, userId, accessToken) => {
  const config = {
    headers: { Authorization: `Bearer ${accessToken}` },
  };

  return axios.put(
    `${process.env.API_URL}/Users/UpdateNameSurname/${userId}`,
    values,
    config
  );
};

const fetchUpdatePassword = async (values, userId, accessToken) => {
  const config = {
    headers: { Authorization: `Bearer ${accessToken}` },
  };

  return axios.put(
    `${process.env.API_URL}/Users/UpdatePassword/${userId}`,
    values,
    config
  );
};

const fetchUpdateProfileImage = async (values, userId, accessToken) => {
  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "multipart/form-data",
    },
  };

  return axios.put(
    `${process.env.API_URL}/Users/UpdateProfileImage/${userId}`,
    values,
    config
  );
};

const fetchDeleteProfileImage = async (userId, accessToken) => {
  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };

  return axios.delete(
    `${process.env.API_URL}/Users/DeleteProfileImage/${userId}`,
    config
  );
};

export {
  fetchUpdateNameSurname,
  fetchUpdatePassword,
  fetchUpdateProfileImage,
  fetchDeleteProfileImage,
};
