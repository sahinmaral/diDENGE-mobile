import { useEffect, useMemo, useState } from "react";
import { View, Text, Pressable } from "react-native";
import socialMediaAddictiveLevelIdentificationTestQuestions from "../../constants/socialMediaAddictiveLevelIdentificationTestQuestions";
import { AntDesign } from "@expo/vector-icons";
import AnswerButton from "./AnswerButton";
import Container from "../../components/Container/Container";
import Row from "../../components/Container/Row";
import SocialMediaAddictiveLevelQuestionAnswers from "../../enums/SocialMediaAddictiveLevelQuestionAnswers";
import QuestionMove from "../../enums/QuestionMove";

function SocialMediaAddictiveLevelIdentification({ navigation }) {
  const [questionInformations, setQuestionInformations] = useState({
    currentIndex: 0,
    total: 0,
  });

  const currentQuestion = useMemo(() => {
    return socialMediaAddictiveLevelIdentificationTestQuestions[
      questionInformations.currentIndex
    ];
  }, [questionInformations.currentIndex]);

  const percentOfProgress = useMemo(() => {
    return Math.ceil(
      (questionInformations.currentIndex /
        socialMediaAddictiveLevelIdentificationTestQuestions.length) *
        100
    );
  }, [currentQuestion]);

  const isFirstQuestion = useMemo(() => {
    return questionInformations.currentIndex === 0;
  }, [questionInformations.currentIndex]);

  const isLastQuestion = useMemo(() => {
    return (
      questionInformations.currentIndex + 1 ===
      socialMediaAddictiveLevelIdentificationTestQuestions.length
    );
  }, [questionInformations.currentIndex]);

  const addPoints = (point) => {
    questionInformations.total += point;
    questionInformations.currentIndex++;

    setQuestionInformations({ ...questionInformations });

    if (isLastQuestion) {
      navigation.navigate("ResultOfAddictiveLevel", {
        addictiveLevelPoint: questionInformations.total,
      });
    }
  };

  const moveQuestion = (questionMove) => {
    switch (questionMove) {
      case QuestionMove.Previous:
        setQuestionInformations({
          ...questionInformations,
          currentIndex: questionInformations.currentIndex - 1,
        });
        break;
      case QuestionMove.Next:
        setQuestionInformations({
          ...questionInformations,
          currentIndex: questionInformations.currentIndex + 1,
        });
        break;
      default:
        break;
    }
  };

  const arrowButtonPlacement = useMemo(() => {
    if (isFirstQuestion) {
      return "justify-end";
    } else {
      if (isLastQuestion) {
        return "justify-start";
      } else {
        return "justify-between";
      }
    }
  }, [isFirstQuestion, isLastQuestion]);

  return (
    <Container>
      <Row
        customClasses="w-full flex items-center justify-center my-2"
        flex={1.7 / 10}
      >
        <Text className="font-semibold text-white text-[40px]">
          Soru {questionInformations.currentIndex + 1}
        </Text>
      </Row>
      <Row customClasses="w-full px-4" flex={1.5 / 10}>
        <View className="rounded-md bg-white p-4 items-center justify-center flex my-2">
          <Text className="text-[16px] text-center">{currentQuestion}</Text>
        </View>
      </Row>
      <Row
        customClasses={`w-full flex flex-row px-4 my-2 ${arrowButtonPlacement}`}
        flex={1 / 10}
      >
        {!isFirstQuestion ? (
          <Pressable
            className="w-[50px] h-[50px] rounded-full bg-white flex items-center justify-center"
            onPress={() => moveQuestion(QuestionMove.Previous)}
          >
            <AntDesign name="left" size={20} color="black" />
          </Pressable>
        ) : null}
        {!isLastQuestion ? (
          <Pressable
            className="w-[50px] h-[50px] rounded-full bg-white flex items-center justify-center"
            onPress={() => moveQuestion(QuestionMove.Next)}
          >
            <AntDesign name="right" size={20} color="black" />
          </Pressable>
        ) : null}
      </Row>
      <Row customClasses="w-full flex items-end my-2" flex={5 / 10}>
        {Object.entries(SocialMediaAddictiveLevelQuestionAnswers).map(
          ([answer, value], index) => (
            <AnswerButton
              key={answer}
              text={value}
              handlePress={() => addPoints(index + 1)}
            />
          )
        )}
      </Row>
      <Row customClasses="w-full bg-white relative mt-2" flex={0.8 / 10}>
        <View
          className="bg-saffronMango h-full"
          style={{ width: `${percentOfProgress}%` }}
        ></View>
        <View className="absolute w-full h-full flex justify-center">
          <Text className="text-center text-[20px] tracking-widest">
            {questionInformations.currentIndex}/
            {socialMediaAddictiveLevelIdentificationTestQuestions.length}
          </Text>
        </View>
      </Row>
    </Container>
  );
}

export default SocialMediaAddictiveLevelIdentification;
