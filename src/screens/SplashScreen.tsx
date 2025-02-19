import React, {useEffect} from 'react';
import {View, Image, ActivityIndicator, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {checkUserSession} from '../utils/authService';

const SplashScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    checkUserSession(navigation);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />
      <ActivityIndicator size="large" color="#fff" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2f4f4f',
  },
  logo: {
    width: 160,
    height: 150,
    resizeMode: 'contain',
  },
});

export default SplashScreen;
