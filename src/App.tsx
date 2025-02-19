import React, {useEffect, useRef} from 'react';
import {BackHandler, Alert, Platform} from 'react-native';
import {enableScreens} from 'react-native-screens';
import AppNavigator from './utils/Navigation';
import {NavigationContainerRef} from '@react-navigation/native';
// import RNExitApp from 'react-native-exit-app';
import {RootStackParamList} from './utils/types';

enableScreens();

const App = () => {
  const navigationRef =
    useRef<NavigationContainerRef<RootStackParamList>>(null);

  useEffect(() => {
    const backAction = () => {
      if (navigationRef.current && navigationRef.current.canGoBack()) {
        navigationRef.current.goBack();
      } else {
        Alert.alert('Exit App', 'Are you sure you want to exit?', [
          {
            text: 'Cancel',
            onPress: () => null,
            style: 'cancel',
          },
          {
            text: 'OK',
            onPress: () => console.log('closing app'),
            // onPress: () => RNExitApp.exitApp(),
          },
        ]);
      }
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    let removeCredentialRevokedListener: () => void | undefined;

    if (Platform.OS === 'ios') {
      const {
        appleAuth,
      } = require('@invertase/react-native-apple-authentication');
      removeCredentialRevokedListener = appleAuth.onCredentialRevoked(
        async () => {
          console.warn('User Credentials have been Revoked');
        },
      );
    }

    return () => {
      backHandler.remove();
      if (removeCredentialRevokedListener) {
        removeCredentialRevokedListener();
      }
    };
  }, []);

  return <AppNavigator />;
};

export default App;
