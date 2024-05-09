import * as users from './users';
import * as wordOfTheDays from './wordOfTheDays';
import * as socialMediaApplicationUsages from './socialMediaApplicationUsages';;
import * as procedures from './procedures';
import * as auth from './auth'
import * as addictionLevels from './addictionLevels'

const apiService = {
  auth,
  users,
  wordOfTheDays,
  socialMediaApplicationUsages,
  addictionLevels,
  procedures,
};

export default apiService;