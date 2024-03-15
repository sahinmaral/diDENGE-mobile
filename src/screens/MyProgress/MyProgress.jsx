import { useCallback, useEffect, useMemo, useState } from "react";
import Container from "../../components/Container/Container";
import GoBackButton from "../../components/GoBackButton";
import MyProgressSwitchButtons from "./MyProgressSwitchButtons";
import { View } from "react-native";
import myProgressPages from "../../constants/myProgressPages";
import ProgressPageMove from "../../enums/ProgressPageMove";
import Calendar from "./Calendar";
import Details from "./Details";
import { useNavigation } from "@react-navigation/native";
import getApplicationBasedResultGraphJsCode from "./Details/ApplicationBasedResultGraphJsCode";

function MyProgress({ updateCurrentScreen }) {
  const navigation = useNavigation();

  const [myProgressPageIndex, setMyProgressPageIndex] = useState(1);

  useEffect(() => {
    updateCurrentScreen("MyProgress");
  }, []);

  const countOfMyProgressPages = useMemo(() => {
    return Object.keys(myProgressPages).length;
  });

  const myProgressPage = useMemo(() => {
    const keyOfCurrentMyProgressPage =
      Object.keys(myProgressPages)[myProgressPageIndex];
    return myProgressPages[keyOfCurrentMyProgressPage];
  }, [myProgressPageIndex]);

  const handleChangeMyProgressPage = (progressPageMove) => {
    switch (progressPageMove) {
      case ProgressPageMove.Previous:
        if (myProgressPageIndex === 0) {
          setMyProgressPageIndex(countOfMyProgressPages - 1);
        } else {
          setMyProgressPageIndex(myProgressPageIndex - 1);
        }
        break;
      case ProgressPageMove.Next:
        if (myProgressPageIndex === countOfMyProgressPages - 1) {
          setMyProgressPageIndex(0);
        } else {
          setMyProgressPageIndex(myProgressPageIndex + 1);
        }
        break;
      default:
        break;
    }
  };

  const renderContentOfMyProgressPage = useCallback(() => {
    switch (myProgressPageIndex) {
      case 0:
        return <Calendar />;
      case 1:
        return <Details />;
    }
  }, [myProgressPageIndex]);

  const exampleResultData = [
    {
      name: "Instagram",
      data: [4000, 3000, 2000, 1000, 500, 250],
      color: {
        linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
        stops: [
          [0, "#405de6"],
          [1, "#833ab4"],
        ],
      },
    },
    {
      name: "Twitter",
      data: [3000, 2500, 2000, 1500, 1000, 0],
      color: {
        linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
        stops: [
          [0, "#1DA1F2"],
          [1, "#1877f2"],
        ],
      },
    },
    {
      name: "Facebook",
      data: [2000, 500, 250, 0, 0, 0],
      color: {
        linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
        stops: [
          [0, "#1877f2"],
          [1, "#3b5998"],
        ],
      },
    },
    {
      name: "Youtube",
      data: [5000, 4000, 3000, 2000, 1000, 1000],
      color: {
        linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
        stops: [
          [0, "#ff0000"],
          [1, "#ff4500"],
        ],
      },
    },
  ];

  const exampleCategory = ["Ay 1", "Ay 2", "Ay 3", "Ay 4", "Ay 5", "Ay 6"];

  const applicationBasedResultGraphJsCode = useMemo(() => {
    return getApplicationBasedResultGraphJsCode(
      exampleCategory,
      exampleResultData
    );
  }, []);

  return (
    <Container customClasses="px-4">
      <GoBackButton navigation={navigation} header="İlerlemeler" />
      <View className="flex-[8]">{renderContentOfMyProgressPage()}</View>
      <MyProgressSwitchButtons
        myProgressPage={myProgressPage}
        handleChangeMyProgressPage={handleChangeMyProgressPage}
      />
    </Container>
  );
}

export default MyProgress;
