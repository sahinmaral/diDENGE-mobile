import axios from "axios";

const fetchAddSocialMediaApplicationUsages = async (input) => {
  return axios.post(
    `${process.env.API_URL}/SocialMediaApplicationUsages`,
    input
  );
};

const fetchGetSocialMediaApplicationUsagesByStartTime = async (
  userId,
  startTime
) => {
  return axios.get(
    `${process.env.API_URL}/SocialMediaApplicationUsages/GetSocialMediaApplicationUsagesByStartTime`,
    {
      params: { userId, startTime },
    }
  );
};

export {
  fetchGetSocialMediaApplicationUsagesByStartTime,
  fetchAddSocialMediaApplicationUsages,
};
