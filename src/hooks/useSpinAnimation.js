import { useRef, useEffect } from 'react';
import { Animated, Easing } from 'react-native';

const useSpinAnimation = (isSpinning) => {
    const spinValue = useRef(new Animated.Value(0)).current;

    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    });

    useEffect(() => {
        const startAnimation = () => {
            spinValue.setValue(0);
            Animated.loop(
                Animated.timing(spinValue, {
                    toValue: 1,
                    duration: 900,
                    easing: Easing.linear,
                    useNativeDriver: true
                })
            ).start();
        };

        if (isSpinning) {
            startAnimation();
        } else {
            spinValue.stopAnimation();
            spinValue.setValue(0);  // Reset the spin value
        }
    }, [isSpinning, spinValue]);

    return spin;
};

export default useSpinAnimation;
