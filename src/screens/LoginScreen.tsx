import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  GestureResponderEvent,
  Alert,
  Platform,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../utils/types';
import CommonStyles from '../styles/CommonStyles';
import {handleLogin, handleSocialLogin} from '../utils/authService';
import {SafeAreaView} from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

function LoginScreen({navigation}: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSelected, setSelection] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);

  const onLoginPress = () => {
    handleLogin(
      email,
      password,
      navigation,
      setLoading,
      setEmailError,
      setPasswordError,
    );
  };

  return (
    <SafeAreaView style={CommonStyles.safeArea}>
      <ScrollView
        contentContainerStyle={CommonStyles.scrollContainer}
        style={CommonStyles.scrollView}>
        <View style={CommonStyles.container}>
          <Image source={require('../assets/logo.png')} style={styles.logo} />
          <Text style={CommonStyles.title}>Welcome back!</Text>
          <View style={CommonStyles.spacer} />
          <View style={CommonStyles.inputSection}>
            <View style={CommonStyles.inputContainer}>
              <Text style={CommonStyles.label}>Email Address</Text>
              <TextInput
                placeholder="Your email address here"
                placeholderTextColor="gray"
                style={[
                  CommonStyles.input,
                  emailError ? CommonStyles.inputError : null,
                ]}
                value={email}
                onChangeText={setEmail}
              />
              {emailError ? (
                <Text style={CommonStyles.errorText}>{emailError}</Text>
              ) : null}
            </View>
            <View style={CommonStyles.inputContainer}>
              <Text style={CommonStyles.label}>Password</Text>
              <TextInput
                placeholder="Your password here"
                placeholderTextColor="gray"
                style={[
                  CommonStyles.input,
                  passwordError ? CommonStyles.inputError : null,
                ]}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
              {passwordError ? (
                <Text style={CommonStyles.errorText}>{passwordError}</Text>
              ) : null}
            </View>
            <View style={styles.rememberMeRow}>
              {Platform.OS == 'ios' && (
                <CheckBox value={isSelected} onValueChange={setSelection} />
              )}
              {Platform.OS == 'android' && (
                <TouchableOpacity
                  onPress={() => setSelection(!isSelected)}
                  style={styles.rememberMeButton}>
                  <Text>
                    {isSelected && (
                      <View
                        style={{
                          height: 10,
                          width: 10,
                          backgroundColor: '#2973B2',
                          alignSelf: 'center',
                        }}
                      />
                    )}
                  </Text>
                </TouchableOpacity>
              )}
              <Text style={CommonStyles.checkboxLabel}>Remember me</Text>
              <View style={{flex: 1}} />
              <Text
                style={CommonStyles.forgotPassword}
                onPress={() => navigation.navigate('ForgotPassword')}>
                Forgot password?
              </Text>
            </View>
            <TouchableOpacity style={styles.loginButton} onPress={onLoginPress}>
              <Text style={CommonStyles.buttonText}>Login</Text>
            </TouchableOpacity>

            <View style={styles.separatorContainer}>
              <View style={styles.separator} />
              <Text style={styles.separatorText}>Login with</Text>
              <View style={styles.separator} />
            </View>

            <View style={styles.socialLoginContainer}>
              <TouchableOpacity
                style={styles.socialLoginButton}
                onPress={() =>
                  handleSocialLogin('google', navigation, setLoading)
                }>
                <Image
                  source={require('../assets/google.png')}
                  style={styles.socialLoginLogo}
                />
              </TouchableOpacity>
              {/* <TouchableOpacity style={styles.socialLoginButton} onPress={() => handleSocialLogin('facebook', navigation, setLoading)}>
                <Image source={require('../assets/facebook.png')} style={styles.socialLoginLogo} />
              </TouchableOpacity> */}

              {Platform.OS === 'ios' && (
                <TouchableOpacity
                  style={styles.socialLoginButton}
                  onPress={() =>
                    handleSocialLogin('apple', navigation, setLoading)
                  }>
                  <Image
                    source={require('../assets/apple.png')}
                    style={styles.socialLoginLogo}
                  />
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.linkContainer}>
              <Text style={CommonStyles.linkText}>Don't have an account? </Text>
              <Text
                style={[CommonStyles.linkText, CommonStyles.linkBoldText]}
                onPress={() => navigation.navigate('Register')}>
                Sign up
              </Text>
            </View>
          </View>

          <Modal
            transparent={true}
            animationType="none"
            visible={loading}
            onRequestClose={() => {}}>
            <View style={styles.modalBackground}>
              <View style={styles.activityIndicatorWrapper}>
                <ActivityIndicator
                  animating={loading}
                  size="large"
                  color="#0000ff"
                />
                <Text style={styles.loadingText}>Authenticating...</Text>
              </View>
            </View>
          </Modal>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 140,
    height: 120,
    resizeMode: 'contain',
  },
  rememberMeButton: {
    borderWidth: 2,
    borderRadius: 3,
    color: 'black',
    height: 18,
    width: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rememberMeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  loginButton: {
    ...CommonStyles.button,
    marginVertical: 10,
  },
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  separator: {
    flex: 1,
    height: 1,
    backgroundColor: '#fff',
  },
  separatorText: {
    marginHorizontal: 10,
    color: '#fff',
  },
  socialLoginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  socialLoginButton: {
    marginVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 50,
    padding: 10,
    marginHorizontal: 20,
  },
  socialLoginLogo: {
    width: 40,
    height: 40,
  },
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  activityIndicatorWrapper: {
    backgroundColor: '#FFFFFF',
    height: 100,
    width: 200,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#000',
  },
});

export default LoginScreen;
