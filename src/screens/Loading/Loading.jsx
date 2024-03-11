import LottieView from 'lottie-react-native';
import React from 'react';
import { View } from 'react-native';
import Container from "../../components/Container/Container";
import styles from './Loading.styles'; 

const Loading = () => {
  return (
    <Container>
    <View style={styles.container}>
      <LottieView
        source={require('../../../assets/loading.json')}
        autoPlay
        style={styles.animation}
      />
    </View>
    </Container>
  );
};


export default Loading;
