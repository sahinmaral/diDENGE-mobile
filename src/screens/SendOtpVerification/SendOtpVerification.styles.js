import { Dimensions, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  pinCodeText: {
    color: "white",
  },
  pinCodeContainer: {
    width: Dimensions.get("screen").width / 7,
    height: Dimensions.get("screen").width / 7,
    borderRadius: Dimensions.get("screen").width / 12,
  },
});

export default styles;
