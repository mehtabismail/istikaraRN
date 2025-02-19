import {Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {CommonActions} from '@react-navigation/native';
// import {
//   LoginManager,
//   AccessToken,
//   GraphRequest,
//   GraphRequestManager,
// } from 'react-native-fbsdk-next';
import appleAuth from '@invertase/react-native-apple-authentication';
import {jwtDecode} from 'jwt-decode';
import NetInfo from '@react-native-community/netinfo';
// import RNExitApp from 'react-native-exit-app';
import {API_URL} from '../config';

// export const handleFacebookLogin = async (
//   navigation: any,
//   setLoading: (loading: boolean) => void,
// ) => {
//   try {
//     setLoading(true);
//     const result = await LoginManager.logInWithPermissions([
//       'public_profile',
//       'email',
//     ]);

//     const tokendata = await AccessToken.getCurrentAccessToken();
//     if (!tokendata || result.isCancelled) {
//       setLoading(false);
//       return;
//     }

//     const fetchFacebookUserData = () => {
//       return new Promise<{
//         id: string;
//         name: string;
//         email: string;
//         picture: {data: {url: string}};
//       }>((resolve, reject) => {
//         const infoRequest = new GraphRequest(
//           '/me',
//           {
//             accessToken: tokendata.accessToken,
//             parameters: {
//               fields: {
//                 string: 'id, email, name, picture.type(large)',
//               },
//             },
//           },
//           (error, result) => {
//             if (error) {
//               reject(new Error('Error fetching data: ' + error.toString()));
//             } else {
//               resolve(
//                 result as {
//                   id: string;
//                   name: string;
//                   email: string;
//                   picture: {data: {url: string}};
//                 },
//               );
//             }
//           },
//         );
//         new GraphRequestManager().addRequest(infoRequest).start();
//       });
//     };

//     const userInfo = await fetchFacebookUserData();
//     if (userInfo) {
//       const registerBody = {
//         name: userInfo.name,
//         email: userInfo.email,
//         social_type: 'facebook',
//       };

//       const response = await fetch(`${API_URL}/api/register`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Accept: 'application/json',
//         },
//         body: JSON.stringify(registerBody),
//       });

//       const data = await response.json();

//       if (data.success) {
//         const userSession = {
//           name: data.data.user.name,
//           email: data.data.user.email,
//           id: userInfo.id,
//           photo: userInfo.picture.data.url,
//           socialtoken: tokendata.accessToken,
//           token: data.data.access_token,
//           facebookLogin: true,
//           squares: data.data.squares,
//           problems: data.data.problems,
//         };

//         await AsyncStorage.setItem('userSession', JSON.stringify(userSession));
//         setLoading(false);

//         navigation.dispatch(
//           CommonActions.reset({
//             index: 0,
//             routes: [{name: 'HomePage'}],
//           }),
//         );
//       } else {
//         throw new Error('Registration failed: ' + data.message);
//       }
//     } else {
//       throw new Error('Failed to fetch data');
//     }
//   } catch (error: unknown) {
//     setLoading(false);
//     Alert.alert(
//       'Error',
//       error instanceof Error ? error.message : 'An unknown error occurred',
//     );
//   }
// };

export const handleAppleAuth = async (
  navigation: any,
  setLoading: (loading: boolean) => void,
) => {
  try {
    setLoading(true);
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
    });

    if (!appleAuthRequestResponse.identityToken) {
      throw new Error('Apple Sign-In failed - no identity token returned');
    }

    const decodedToken: any = jwtDecode(appleAuthRequestResponse.identityToken);

    const email = decodedToken.email;
    const credentialState = await appleAuth.getCredentialStateForUser(
      appleAuthRequestResponse.user,
    );
    if (credentialState === appleAuth.State.AUTHORIZED) {
      const {fullName, identityToken, authorizationCode, user} =
        appleAuthRequestResponse;
      const {givenName, familyName} = fullName || {};
      const combineName =
        givenName && familyName != null
          ? `${givenName || ''} ${familyName || ''}`
          : 'Anonymous';

      const registerBody = {
        name: combineName,
        email: email,
        social_type: 'apple',
      };

      const response = await fetch(`${API_URL}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(registerBody),
      });

      const data = await response.json();

      if (data.success) {
        const userSession = {
          name: data.data.user.name,
          email: data.data.user.email,
          id: user,
          socialtoken: identityToken,
          token: data.data.access_token,
          authcode: authorizationCode,
          appleLogin: true,
          squares: data.data.squares,
          problems: data.data.problems,
        };

        await AsyncStorage.setItem('userSession', JSON.stringify(userSession));
        console.log(userSession);
        setLoading(false);

        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: 'HomePage'}],
          }),
        );
      } else {
        throw new Error('Registration failed: ' + data.message);
      }
    }
  } catch (error: unknown) {
    setLoading(false);
    // Alert.alert('Error', 'An error occurred during Apple authentication.');
  } finally {
    setLoading(false);
  }
};

export const handleGoogleSignIn = async (
  navigation: any,
  setLoading: (loading: boolean) => void,
) => {
  try {
    setLoading(true);
    await GoogleSignin.signOut();
    await GoogleSignin?.hasPlayServices();
    await GoogleSignin.revokeAccess();
    await GoogleSignin.signOut();
    const userInfo = await GoogleSignin?.signIn();
    const registerBody = {
      name: userInfo?.data?.user?.name,
      email: userInfo.data?.user.email,
      social_type: 'google',
    };

    const response = await fetch(`${API_URL}/api/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(registerBody),
    });

    const data = await response.json();

    if (data.success) {
      console.log(data.data);
      const userSession = {
        name: data.data.user.name,
        email: data.data.user.email,
        id: userInfo.data.user.id,
        photo: userInfo.data.user.photo,
        socialtoken: userInfo.data.idToken,
        token: data.data.access_token,
        googleLogin: true,
        squares: data.data.squares,
        problems: data.data.problems,
      };

      await AsyncStorage.setItem('userSession', JSON.stringify(userSession));
      setLoading(false);

      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'HomePage'}],
        }),
      );
    } else {
      throw new Error('Registration failed: ' + data.message);
    }
  } catch (error: unknown) {
    await GoogleSignin.signOut();
    setLoading(false);
    console.log(error);
    if (error instanceof Error) {
      if ((error as any).code === statusCodes.SIGN_IN_CANCELLED) {
      } else if (
        (error as any).code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE
      ) {
        Alert.alert('Error', 'Play services not available or outdated');
      } else {
        Alert.alert('Error', 'Something went wrong during Google Sign-In');
      }
    } else {
      Alert.alert('Error', 'An unknown error occurred');
    }
  }
};

export const printUserSession = async () => {
  try {
    const userSession = await AsyncStorage.getItem('userSession');
    if (userSession) {
      console.log('User Session:', JSON.parse(userSession));
    } else {
      console.log('Session not found.');
    }
  } catch (error) {
    console.error('Failed to retrieve user session:', error);
  }
};

export const verifyFacebookToken = async (
  accessToken: string,
  userID: string,
) => {
  try {
    const response = await fetch(
      `https://graph.facebook.com/me?access_token=${accessToken}`,
    );
    const json = await response.json();

    if (json.id === userID) {
      return true;
    } else {
      throw new Error('Session expired. Please login again.');
    }
  } catch (error) {
    Alert.alert('Error', 'Session expired. Please login again.');
    return false;
  }
};

export const verifyGoogleToken = async (token: string, userId: string) => {
  try {
    const response = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${token}`,
    );
    const json = await response.json();

    if (json.sub === userId) {
      return true;
    } else {
      throw new Error('Session expired. Please login again.');
    }
  } catch (error) {
    Alert.alert('Error', 'Session expired. Please login again.');
    return false;
  }
};

export const handleSocialLogin = async (
  platform: 'google' | 'facebook' | 'apple',
  navigation: any,
  setLoading: (loading: boolean) => void,
) => {
  if (platform === 'google') {
    await handleGoogleSignIn(navigation, setLoading);
  } else if (platform === 'facebook') {
    // await handleFacebookLogin(navigation, setLoading);
  } else if (platform === 'apple') {
    await handleAppleAuth(navigation, setLoading);
  }
};

export const checkUserSession = async (navigation: any) => {
  try {
    const state = await NetInfo.fetch();
    if (!state.isConnected) {
      Alert.alert(
        'No Internet Connection',
        'Please connect to the internet and restart the app.',
        [
          {
            text: 'OK',
            // onPress: () => RNExitApp.exitApp(),
            onPress: () => console.log('opening app...'),
          },
        ],
      );
      return;
    }

    const userData = await AsyncStorage.getItem('userSession');
    if (userData) {
      const user = JSON.parse(userData);
      const {socialtoken, id, googleLogin, facebookLogin, token} = user;

      if (facebookLogin) {
        const isValidToken = await verifyFacebookToken(socialtoken, id);
        if (isValidToken) {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{name: 'HomePage'}],
            }),
          );
          return;
        }
      } else if (googleLogin) {
        const isValidToken = await verifyGoogleToken(socialtoken, id);
        if (isValidToken) {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{name: 'HomePage'}],
            }),
          );
          return;
        }
      } else if (token) {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: 'HomePage'}],
          }),
        );
        return;
      }

      await AsyncStorage.removeItem('userSession');
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'Login'}],
        }),
      );
    } else {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'Login'}],
        }),
      );
    }
  } catch (error) {
    console.error('Error checking user session:', error);
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'Login'}],
      }),
    );
  }
};

export const validateEmail = (email: string): boolean => {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 8;
};

export const handleLogin = async (
  email: string,
  password: string,
  navigation: any,
  setLoading: (loading: boolean) => void,
  setEmailError: (error: string) => void,
  setPasswordError: (error: string) => void,
) => {
  let valid = true;

  if (!validateEmail(email)) {
    setEmailError('Please enter a valid email address.');
    valid = false;
  } else {
    setEmailError('');
  }

  if (!validatePassword(password)) {
    setPasswordError('Please enter a valid password.');
    valid = false;
  } else {
    setPasswordError('');
  }

  if (valid) {
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        const user = data.data.user;
        const token = data.data.access_token;
        const squares = data.data.squares;
        const problems = data.data.problems;

        const userSession = {
          name: user.name,
          email: user.email,
          token: token,
          squares: squares,
          problems: problems,
        };

        await AsyncStorage.setItem('userSession', JSON.stringify(userSession));
        setLoading(false);

        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: 'HomePage'}],
          }),
        );
      } else {
        Alert.alert('Error', data.message || 'Login failed.');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred during login.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  }
};

export const handleRegister = async (
  name: string,
  email: string,
  password: string,
  navigation: any,
  isSelected: boolean,
  setLoading: (loading: boolean) => void,
  setNameError: (error: string) => void,
  setEmailError: (error: string) => void,
  setPasswordError: (error: string) => void,
  setTermsError?: (error: string) => void,
) => {
  let valid = true;

  if (!name) {
    setNameError('Please enter your name.');
    valid = false;
  } else {
    setNameError('');
  }

  if (!validateEmail(email)) {
    setEmailError('Please enter a valid email address.');
    valid = false;
  } else {
    setEmailError('');
  }

  if (!validatePassword(password)) {
    setPasswordError('Please enter a valid password.');
    valid = false;
  } else {
    setPasswordError('');
  }

  if (setTermsError) {
    if (!isSelected) {
      setTermsError('Please agree to the terms and conditions.');
      valid = false;
    } else {
      setTermsError('');
    }
  }

  if (valid) {
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        const user = data.data.user;
        const token = data.data.access_token;
        const squares = data.data.squares;
        const problems = data.data.problems;

        const userSession = {
          name: user.name,
          email: user.email,
          token: token,
          squares: squares,
          problems: problems,
        };

        await AsyncStorage.setItem('userSession', JSON.stringify(userSession));
        setLoading(false);

        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: 'HomePage'}],
          }),
        );
      } else {
        Alert.alert('Error', data.message || 'Registration failed.');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred during registration.');
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  }
};
