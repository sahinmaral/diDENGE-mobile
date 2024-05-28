import axios from "axios";
import { API_URL } from "@env";

const fetchGetRandomWordOfTheDay = async () => {
  const url = `${API_URL}/WordOfTheDays/GetByRandom`;
  return axios.get(url);
};

export { fetchGetRandomWordOfTheDay };
