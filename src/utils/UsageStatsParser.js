const getTotalSpentTimeOfSocialMediaApplications = (stats) => {
  const values = Object.values(stats);
  if (values.length === 0) return 0;

  const totalTime = values.reduce(
    (value, curr) => value.totalTimeInForeground + curr.totalTimeInForeground
  );
  return totalTime;
};

export { getTotalSpentTimeOfSocialMediaApplications };
