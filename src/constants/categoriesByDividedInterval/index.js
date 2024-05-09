import MyProgressDetailScreenCategory from "../../enums/MyProgressDetailScreenCategory";

const categoriesByDividedInterval = {
    [MyProgressDetailScreenCategory.OneWeek]: [
      "1. Gün",
      "2. Gün",
      "3. Gün",
      "4. Gün",
      "5. Gün",
      "6. Gün",
      "7. Gün",
    ],
    [MyProgressDetailScreenCategory.TwoWeeks]: [
      "2. Gün",
      "4. Gün",
      "6. Gün",
      "8. Gün",
      "10. Gün",
      "12. Gün",
      "14. Gün",
    ],
    [MyProgressDetailScreenCategory.OneMonths]: [
      "5. Gün",
      "10. Gün",
      "15. Gün",
      "20. Gün",
      "25. Gün",
      "30. Gün",
    ],
    [MyProgressDetailScreenCategory.ThreeMonths]: [
      "15. Gün",
      "1. Ay",
      "1.5 Ay",
      "2. Ay",
      "2.5 Ay",
      "3. Ay",
    ],
    [MyProgressDetailScreenCategory.SixMonths]: [
      "1. Ay",
      "2. Ay",
      "3. Ay",
      "4. Ay",
      "5. Ay",
      "6. Ay",
    ],
  };

  export default categoriesByDividedInterval;