import React from 'react';
import {
  NavigationContainer,
  NavigationContainerRef,
  useNavigationContainerRef,
  useNavigationState,
} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackParamList} from './types';

import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import Screen4 from '../screens/Screen4';
import HomePage from '../screens/HomePage';
import Screen2 from '../screens/Screen2';
import Screen3 from '../screens/Screen3';
import Screen5 from '../screens/Screen5';
import CustomHeader from '../CustomHeader';
import ZikrScreen from '../screens/Zikr/ZikrScreen';
import ZikrDetailScreen from '../screens/Zikr/ZikrDetailScreen';
import AppleTesting from '../screens/AppleTesting';

const Stack = createStackNavigator<any>();

const AppNavigator = () => {
  const navigationRef = useNavigationContainerRef();

  const config = {
    screens: {
      ZikrScreen: {path: 'ZikrScreen/:slug'},
      ZikrDetailScreen: {
        path: 'ZikrDetailScreen',
      },
      // Register: {
      //   path: 'Register',
      // },
    },
  };

  const Linking = {
    prefixes: ['https://mychat.com', 'mychat.com://', 'mychat.com'],
    config,
  };

  return (
    <NavigationContainer linking={Linking as any} ref={navigationRef}>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
        }}>
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{headerShown: false, animation: 'ios'}}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{headerShown: false, animation: 'ios'}}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{headerShown: false, animation: 'ios'}}
        />
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPasswordScreen}
          options={{headerShown: false, animation: 'ios'}}
        />
        <Stack.Screen
          name="HomePage"
          component={HomePage}
          options={{headerShown: false, animation: 'ios'}}
        />
        <Stack.Screen
          name="Screen2"
          component={Screen2}
          options={{
            headerShown: true,
            header: () => <CustomHeader />,
            animation: 'ios',
          }}
        />
        <Stack.Screen
          name="Screen3"
          component={Screen3}
          options={{
            headerShown: true,
            header: () => <CustomHeader />,
            animation: 'ios',
          }}
        />
        <Stack.Screen
          name="Screen4"
          component={Screen4}
          options={{
            headerShown: true,
            header: () => <CustomHeader title="Situation" />,
            animation: 'ios',
          }}
        />
        <Stack.Screen
          name="Screen5"
          component={Screen5}
          options={{
            headerShown: true,
            header: () => <CustomHeader />,
            animation: 'ios',
          }}
        />
        <Stack.Screen
          name="ZikrScreen"
          component={ZikrScreen}
          options={{
            headerShown: true,
            header: () => <CustomHeader title="Zikr" />,
            animation: 'ios',
          }}
        />
        <Stack.Screen
          name="ZikrDetailScreen"
          component={ZikrDetailScreen}
          screenOptions={({route}) => {
            console.log(route, 'checking screen');
          }}
          options={({route}) => {
            const params = route.params?.item;
            if (params && params?.title) {
              console.log('Data received in navigator:', params);
            }
            return {
              headerShown: true,
              header: () => (
                <CustomHeader
                  title={params?.title ? `${params?.title}` : 'Zikr Screen'}
                />
              ),
              animation: 'ios',
            };
          }}
        />
        <Stack.Screen
          name="AppleTesting"
          component={AppleTesting}
          options={{
            headerShown: true,
            header: () => <CustomHeader title="Apple" />,
            animation: 'ios',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
