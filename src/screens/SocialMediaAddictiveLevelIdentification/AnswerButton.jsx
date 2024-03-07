import { Pressable, Text } from "react-native";

function AnswerButton({ text, handlePress }) {
  return (
    <Pressable
      className="rounded-l-full w-[75%] bg-white flex justify-center pl-5 py-3 my-2"
      onPress={handlePress}
    >
      <Text className="text-[16px]">{text}</Text>
    </Pressable>
  );
}

export default AnswerButton;
