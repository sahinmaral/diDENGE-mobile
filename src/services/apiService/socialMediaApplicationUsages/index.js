import axios from "axios";
import { API_URL } from "@env";

const fetchAddSocialMediaApplicationUsages = async (input) => {
  return axios.post(`${API_URL}/SocialMediaApplicationUsages`, input);
};

const fetchGetSocialMediaApplicationUsagesByStartAndEndTime = async (
  userId,
  startTime,
  endTime
) => {
  return axios.get(
    `${API_URL}/SocialMediaApplicationUsages/GetSocialMediaApplicationUsagesByStartAndEndTime`,
    {
      params: { userId, startTime, endTime },
    }
  );
};

export {
  fetchGetSocialMediaApplicationUsagesByStartAndEndTime,
  fetchAddSocialMediaApplicationUsages,
};
