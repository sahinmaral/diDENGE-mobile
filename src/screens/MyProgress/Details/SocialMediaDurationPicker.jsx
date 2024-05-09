import React, { useMemo } from "react";
import { Pressable, Text, View } from "react-native";

const SocialMediaDurationPicker = ({ onPress, duration, selected }) => {
  const isSelected = duration === selected;

  const buttonStyle = useMemo(() => {
    return `w-[50] h-[50] p-2 mx-2 items-center justify-center rounded-full ${
      isSelected ? "bg-[#FFC857]" : "bg-funBlue"
    }`;
  }, [isSelected]);

  return (
    <Pressable className={buttonStyle} onPress={onPress}>
      <Text className="text-white">{duration}</Text>
    </Pressable>
  );
};

export default SocialMediaDurationPicker;
