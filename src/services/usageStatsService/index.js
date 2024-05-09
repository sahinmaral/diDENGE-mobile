import { NativeModules } from "react-native";
import * as LocalStorageKeys from '../../constants/localStorageKeys'

const { UsageStats } = NativeModules;

class UsageStatsService {
  async getUsageStats(startTime, endTime) {
    return await UsageStats.getUsageStats(startTime, endTime);
  }

  async checkForPermission(){
    return await UsageStats.checkForPermission();
  }

  getTotalSpentTimeOfSocialMediaApplications(allSocialMediaApplicationUsages) {
    const allSocialMediaApplicationUsagesAsValues = Object.values(
      allSocialMediaApplicationUsages
    );
    if (allSocialMediaApplicationUsagesAsValues.length === 0) return 0;

    const totalSpentTimeOfSocialMediaApplications =
      allSocialMediaApplicationUsagesAsValues
        .map((stat) => stat.totalTimeInForeground)
        .reduce((value, curr) => value + curr);

    return totalSpentTimeOfSocialMediaApplications;
  }

  async saveSocialMediaApplicationUsagesLocally(
    localStorageService,
    socialMediaApplicationUsages
  ) {
    await localStorageService.storeObject(
      LocalStorageKeys.SOCIAL_MEDIA_APPLICATION_USAGES,
      [...socialMediaApplicationUsages]
    );
  }
}

export default UsageStatsService;
