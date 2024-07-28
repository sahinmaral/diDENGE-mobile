import { faArrowsRotate } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import React from "react";
import { Animated } from "react-native";
import useSpinAnimation from "../../hooks/useSpinAnimation";

function LoadingSpin({spinStatus}) {
  const spin = useSpinAnimation(spinStatus);

  return (
    <Animated.View style={{ transform: [{ rotate: spin }], marginLeft: 10 }}>
      <FontAwesomeIcon icon={faArrowsRotate} color="white" size={20} />
    </Animated.View>
  );
}

export default LoadingSpin;
