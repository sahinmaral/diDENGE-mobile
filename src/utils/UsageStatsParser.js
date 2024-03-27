const getTotalSpentTimeOfSocialMediaApplications = (stats) => {
  const values = Object.values(stats).map((stat) => stat.totalTimeInForeground);

  const totalTime = values.reduce((value, curr) => value + curr);
  return totalTime;
};

export { getTotalSpentTimeOfSocialMediaApplications };
