import { useRef, useEffect } from 'react';
import { Animated, Easing } from 'react-native';

const useSpinAnimation = () => {
    const spinValue = useRef(new Animated.Value(0)).current;

    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    });

    useEffect(() => {
        Animated.loop(
            Animated.timing(spinValue, {
                toValue: 1,
                duration: 900,
                easing: Easing.linear,
                useNativeDriver: true
            })
        ).start();

        return () => {
            spinValue.setValue(0);
        };
    }, []);

    return spin;
};

export default useSpinAnimation;
