import axios from "axios";
import { API_URL } from '@env';

const fetchGetRandomWordOfTheDay = async () => {
  return axios.get(`${API_URL}/WordOfTheDays/GetByRandom`);
};

export { fetchGetRandomWordOfTheDay };
