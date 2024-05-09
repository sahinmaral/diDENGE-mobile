import axios from "axios";

const fetchGetRandomWordOfTheDay = async () => {
  return axios.get(`${process.env.API_URL}/WordOfTheDays/GetByRandom`);
};

export { fetchGetRandomWordOfTheDay };
