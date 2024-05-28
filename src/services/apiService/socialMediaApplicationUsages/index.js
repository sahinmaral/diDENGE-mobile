import axios from "axios";
import { API_URL } from "@env";

const fetchAddSocialMediaApplicationUsages = async (input) => {
  const url = `${API_URL}/SocialMediaApplicationUsages`
  return axios.post(url, input);
};

const fetchGetSocialMediaApplicationUsagesByStartAndEndTime = async (
  userId,
  startTime,
  endTime
) => {
  const url = `${API_URL}/SocialMediaApplicationUsages/GetSocialMediaApplicationUsagesByStartAndEndTime`;
  return axios.get(url, {
    params: { userId, startTime, endTime },
  });
};

export {
  fetchGetSocialMediaApplicationUsagesByStartAndEndTime,
  fetchAddSocialMediaApplicationUsages,
};
