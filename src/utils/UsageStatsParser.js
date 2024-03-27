const getTotalSpentTimeOfSocialMediaApplications = (stats) => {
  const values = Object.values(stats);
  const totalTime = values.reduce(
    (value, curr) => value.totalTimeInForeground + curr.totalTimeInForeground
  );
  return totalTime;
};

export { getTotalSpentTimeOfSocialMediaApplications };
