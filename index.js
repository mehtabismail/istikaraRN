/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';

import {GoogleSignin} from '@react-native-google-signin/google-signin';
// import {Settings} from 'react-native-fbsdk-next';

// Settings.initializeSDK();

GoogleSignin.configure({
  webClientId:
    '381322393942-073v2k9koffaibfke7cbbqdf7hph108o.apps.googleusercontent.com',
  offlineAccess: true,
  iosClientId:
    '381322393942-loein73s1rpqlj3r2hv3vvmfburuai09.apps.googleusercontent.com',
});

AppRegistry.registerComponent(appName, () => App);
