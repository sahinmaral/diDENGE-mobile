import { useMemo, useState, useCallback } from "react";
import { View, Text, Pressable, BackHandler } from "react-native";
import socialMediaAddictiveLevelIdentificationTestQuestions from "../../constants/socialMediaAddictiveLevelIdentificationTestQuestions";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import AnswerButton from "./AnswerButton";
import SocialMediaAddictiveLevelQuestionAnswers from "../../enums/SocialMediaAddictiveLevelQuestionAnswers";
import QuestionMove from "../../enums/QuestionMove";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import apiService from "../../services/apiService";
import { useDispatch, useSelector } from "react-redux";
import LottieView from "lottie-react-native";
import { BlurView } from "@react-native-community/blur";
import { useToast } from "react-native-toast-notifications";
import { clearUser, selectUser, setUser } from "../../redux/slices/authSlice";
import ProcedurePointInformationSaveStatusTypes from "../../enums/ProcedurePointInformationSaveStatusTypes";
import ToastService from "../../services/toastService";
import { ERROR_DURING_SAVING_USER_ADDICTION_LEVEL } from "../../constants/messages";
import ToastOptions from "../../classes/ToastOptions";
import ToastTypes from "../../enums/ToastTypes";
import { sleep } from "../../utils/timeUtils";
import ProcedureService from "../../services/procedureService";
import { setModalContent } from "../../redux/slices/modalSlice";
import { useFocusEffect } from "@react-navigation/native";
import ModalContentTypes from "../../enums/ModalContentTypes";

function SocialMediaAddictiveLevelIdentification({ navigation }) {
  const user = useSelector(selectUser);

  const dispatch = useDispatch();

  const toast = useToast();
  const toastService = new ToastService(toast);

  const procedureService = new ProcedureService();

  const [isFetchProcessing, setIsFetchProcessing] = useState(false);

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

  const handleHardwareBackPress = () => {
    dispatch(setModalContent(ModalContentTypes.VerifyExitSocialMediaAddictionLevelIdentification));

    return true;
  };

  useFocusEffect(
    useCallback(() => {
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        handleHardwareBackPress
      );

      return () => {
        backHandler.remove();
      };
    }, [])
  );

  const addPoints = async (point) => {
    questionInformations.totalAnsweredQuestions[
      questionInformations.currentPage
    ] = point;

    questionInformations.currentPage++;

    setQuestionInformations({ ...questionInformations });

    if (isLastQuestion) {
      const grade = Object.values(
        questionInformations.totalAnsweredQuestions
      ).reduce((prev, curr) => prev + curr);

      setIsFetchProcessing(true);

      try {
        const savedAddictionLevelResponse =
          await apiService.addictionLevels.fetchSaveAddictionLevelOfUser(
            {
              userId: user.id,
              grade,
            },
            user.accessToken
          );

        const savedAddictionLevelData = savedAddictionLevelResponse.data;

        const savedUser = {
          ...user,
          addictionLevel: savedAddictionLevelData.addictionLevel,
        };

        const savedProcedurePointInformationsResponse =
          await apiService.procedures.fetchAddOrUpdateProcedurePointInformations(
            {
              userId: user.id,
            }
          );

        const savedProcedurePointInformationsData =
          savedProcedurePointInformationsResponse.data.items;

        await procedureService.updateNewSavedProcedurePointInformations(
          savedUser,
          savedProcedurePointInformationsData,
          ProcedurePointInformationSaveStatusTypes.Lately,
          dispatch
        );

        navigation.navigate("ResultOfAddictiveLevel", {
          dailyLimit: savedAddictionLevelData.addictionLevel.dailyLimit,
          addictionLevel: savedAddictionLevelData.addictionLevel.name,
          userGrade: savedAddictionLevelData.grade,
          minumumGrade: savedAddictionLevelData.addictionLevel.minimumGrade,
          maximumGrade: savedAddictionLevelData.addictionLevel.maximumGrade,
        });
      } catch (error) {
        console.log(error);

        toastService.showToast(
          ERROR_DURING_SAVING_USER_ADDICTION_LEVEL,
          new ToastOptions(ToastTypes.Warning)
        );

        await sleep(3000);
        dispatch(clearUser());

        navigation.navigate("Login");
      } finally {
        setIsFetchProcessing(false);
      }
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
    <View className="relative h-screen bg-funBlue">
      {isFetchProcessing ? (
        <View className="absolute top-0 left-0 w-full h-screen z-10 px-4">
          <View className="flex-1 items-center justify-center gap-y-10">
            <LottieView
              source={require("../../../assets/loading.json")}
              autoPlay
              style={{ width: 200, height: 200 }}
            />
            <Text className="text-center font-semibold text-lg text-black">
              Sosyal medya bağımlılık seviyeniz kaydedilirken lütfen bekleyin
            </Text>
          </View>
        </View>
      ) : null}

      {isFetchProcessing ? (
        <BlurView
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            zIndex: 5,
          }}
          blurType="light"
          blurAmount={10}
        />
      ) : null}
      <View className="h-screen">
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
              <FontAwesomeIcon icon={faAngleLeft} size={20} color="black" />
            </Pressable>
          ) : null}
          {!isLastQuestion ? (
            <Pressable
              className="w-[50px] h-[50px] rounded-full bg-white flex items-center justify-center"
              onPress={() => moveQuestion(QuestionMove.Next)}
            >
              <FontAwesomeIcon icon={faAngleRight} size={20} color="black" />
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
      </View>
    </View>
  );
}

export default SocialMediaAddictiveLevelIdentification;
