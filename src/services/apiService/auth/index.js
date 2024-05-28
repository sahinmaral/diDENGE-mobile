import axios from "axios";
import { API_URL } from '@env';

const fetchRegisterUser = async (values) => {
  const url = `${API_URL}/Auth/Register`
  return axios.post(url, values);
};

const fetchLoginUser = async (values) => {
  const url = `${API_URL}/Auth/Login`
  return axios.post(url, values);
};

export { fetchRegisterUser, fetchLoginUser };
