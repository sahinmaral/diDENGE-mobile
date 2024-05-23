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
        return <Calendar navigation={navigation} />;
      case 1:
        return <Details />;
    }
  }, [myProgressPageIndex]);

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
