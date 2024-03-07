import { useMemo, useState } from "react";
import { View, Text, Pressable } from "react-native";
import socialMediaAddictiveLevelIdentificationTestQuestions from "../../constants/socialMediaAddictiveLevelIdentificationTestQuestions";
import { AntDesign } from "@expo/vector-icons";
import AnswerButton from "./AnswerButton";
import Container from "../../components/Container/Container";
import SocialMediaAddictiveLevelQuestionAnswers from "../../enums/SocialMediaAddictiveLevelQuestionAnswers";
import QuestionMove from "../../enums/QuestionMove";

function SocialMediaAddictiveLevelIdentification({ navigation }) {
  const [questionInformations, setQuestionInformations] = useState({
    totalAnsweredQuestions: {},
    currentPage: 0,
  });

  const currentQuestion = useMemo(() => {
    return socialMediaAddictiveLevelIdentificationTestQuestions[
      questionInformations.currentPage
    ];
  }, [questionInformations.currentPage]);

  const percentOfProgress = useMemo(() => {
    return Math.ceil(
      (questionInformations.currentPage /
        socialMediaAddictiveLevelIdentificationTestQuestions.length) *
        100
    );
  }, [questionInformations.currentPage]);

  const isFirstQuestion = useMemo(() => {
    return questionInformations.currentPage === 0;
  }, [questionInformations.currentPage]);

  const isLastQuestion = useMemo(() => {
    return (
      Object.keys(questionInformations.totalAnsweredQuestions).length + 1 ===
        socialMediaAddictiveLevelIdentificationTestQuestions.length &&
      socialMediaAddictiveLevelIdentificationTestQuestions.length ===
        questionInformations.currentPage + 1
    );
  }, [questionInformations.currentPage]);

  const addPoints = (point) => {
    questionInformations.totalAnsweredQuestions[
      questionInformations.currentPage
    ] = point;

    questionInformations.currentPage++;

    setQuestionInformations({ ...questionInformations });

    if (isLastQuestion) {
      navigation.navigate("ResultOfAddictiveLevel", {
        addictiveLevelPoint: Object.values(
          questionInformations.totalAnsweredQuestions
        ).reduce((prev, curr) => prev + curr),
      });
    }
  };

  const moveQuestion = (questionMove) => {
    switch (questionMove) {
      case QuestionMove.Previous:
        setQuestionInformations({
          ...questionInformations,
          currentPage: questionInformations.currentPage - 1,
        });
        break;
      case QuestionMove.Next:
        setQuestionInformations({
          ...questionInformations,
          currentPage: questionInformations.currentPage + 1,
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
      <View className="flex-[1] items-center justify-center my-2">
        <Text className="font-semibold text-white text-[40px]">
          Soru {questionInformations.currentPage + 1}
        </Text>
      </View>
      <View className="px-4 flex-[2.2]">
        <View className="h-3/4 rounded-md bg-white p-4 items-center justify-center flex my-2">
          <Text className="text-[16px] text-center">{currentQuestion}</Text>
        </View>
      </View>
      <View className={`flex-[1] flex-row px-4 my-2 ${arrowButtonPlacement}`}>
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
      </View>
      <View className="flex items-end my-2 flex-[5]">
        {Object.entries(SocialMediaAddictiveLevelQuestionAnswers).map(
          ([answer, value], index) => (
            <AnswerButton
              key={answer}
              text={value}
              handlePress={() => addPoints(index + 1)}
            />
          )
        )}
      </View>
      <View className="bg-white relative mt-2 flex-[0.8]">
        <View
          className="bg-saffronMango h-full"
          style={{ width: `${percentOfProgress}%` }}
        ></View>
        <View className="absolute w-full h-full flex justify-center">
          <Text className="text-center text-[20px] tracking-widest">
            {questionInformations.currentPage}/
            {socialMediaAddictiveLevelIdentificationTestQuestions.length}
          </Text>
        </View>
      </View>
    </Container>
  );
}

export default SocialMediaAddictiveLevelIdentification;
