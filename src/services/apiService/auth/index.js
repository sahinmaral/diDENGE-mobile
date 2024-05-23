import axios from "axios";
import { API_URL } from '@env';

const fetchRegisterUser = async (values) => {
  return axios.post(`${API_URL}/Auth/Register`, values);
};

const fetchLoginUser = async (values) => {
  return axios.post(`${API_URL}/Auth/Login`, values);
};

export { fetchRegisterUser, fetchLoginUser };
