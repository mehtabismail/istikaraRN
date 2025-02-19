import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../utils/types';
import CommonStyles from '../styles/CommonStyles';
import {SafeAreaView} from 'react-native-safe-area-context';
import {StyleSheet} from 'react-native';
import {API_URL} from '../config';

type Props = NativeStackScreenProps<RootStackParamList, 'ForgotPassword'>;

function ResetPasswordScreen({navigation}: Props) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');

  const validateEmail = (email: string) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const handleResetPassword = async () => {
    if (!email) {
      setEmailError('Please enter your email address.');
      return;
    } else if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address.');
      return;
    } else {
      setEmailError('');
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({email}),
      });

      const data = await response.json();

      if (data.success) {
        Alert.alert('Success', data.message);
        navigation.goBack();
      } else {
        Alert.alert(
          'Error',
          data.message || "Couldn't reset password. Please try again.",
        );
      }
    } catch (error) {
      setEmailError('An error occurred. Please try again later.');
      console.error('Reset password error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={CommonStyles.safeArea}>
      <ScrollView
        contentContainerStyle={CommonStyles.scrollContainer}
        style={CommonStyles.scrollView}>
        <View style={CommonStyles.container}>
          <Image
            source={require('../assets/logo.png')}
            style={CommonStyles.logo}
          />
          <View style={CommonStyles.spacerLarge} />
          <Text style={CommonStyles.title}>Reset password!</Text>
          <View style={CommonStyles.spacer} />
          <Text style={CommonStyles.instruction}>
            You will receive an email containing a reset password link. Click on
            the link to reset your password.
          </Text>
          <View style={CommonStyles.spacerLarge} />
          <View style={CommonStyles.inputSection}>
            <View style={CommonStyles.inputContainer}>
              <Text style={CommonStyles.label}>Email Address</Text>
              <TextInput
                placeholder="Your email address here"
                placeholderTextColor="gray"
                style={CommonStyles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {emailError ? (
                <Text style={styles.errorText}>{emailError}</Text>
              ) : null}
            </View>
            <TouchableOpacity
              style={CommonStyles.button}
              onPress={handleResetPassword}
              disabled={loading}>
              <Text style={CommonStyles.buttonText}>
                {loading ? 'Sending...' : 'Send reset password link'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Loading Dialog */}
        <Modal transparent={true} animationType="none" visible={loading}>
          <View style={styles.modalBackground}>
            <View style={styles.activityIndicatorWrapper}>
              <ActivityIndicator
                animating={loading}
                size="large"
                color="#0000ff"
              />
              <Text style={styles.loadingText}>Sending reset link...</Text>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  errorText: {
    color: 'orange',
    fontSize: 14,
    textAlign: 'center',
    width: '100%',
    marginTop: 5,
  },
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  activityIndicatorWrapper: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#000',
  },
});

export default ResetPasswordScreen;
