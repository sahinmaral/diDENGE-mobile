const getTotalSpentTimeOfSocialMediaApplications = (stats) => {
  const values = Object.values(stats);
  if (values.length === 0) return 0;

  const totalTime = values
    .map((stat) => stat.totalTimeInForeground)
    .reduce((value, curr) => value + curr);

  return totalTime;
};

export { getTotalSpentTimeOfSocialMediaApplications };
