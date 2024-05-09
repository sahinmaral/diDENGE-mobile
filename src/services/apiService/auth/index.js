import axios from "axios";

const fetchRegisterUser = async (values) => {
  return axios.post(`${process.env.API_URL}/Auth/Register`, values);
};

const fetchLoginUser = async (values) => {
  return axios.post(`${process.env.API_URL}/Auth/Login`, values);
};

export { fetchRegisterUser, fetchLoginUser };
