import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {RootStackParamList} from '../utils/types';
import CommonStyles from '../styles/CommonStyles';
import {API_URL} from '../config';

type Props = NativeStackScreenProps<RootStackParamList, 'Screen5'>;

const {width} = Dimensions.get('window');

function Screen5({navigation, route}: Props) {
  const {result} = route.params;

  const content = {
    result: 'Your Result',
    readTimes: 'Read this',
    times: 'times',
    help: 'Do You Need Any Assistance?',
    assistanceDescription:
      'If you are facing any issues or have questions, feel free to reach out!',
  };

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [token, setToken] = useState('');
  const [messageError, setMessageError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserSession = async () => {
      try {
        const userSession = await AsyncStorage.getItem('userSession');
        if (userSession) {
          const {email, name, token} = JSON.parse(userSession);
          setEmail(email);
          setName(name);
          setToken(token);
        }
      } catch (error) {
        console.error('Error fetching user session:', error);
      }
    };
    fetchUserSession();
  }, []);

  const validateMessage = () => {
    if (message.trim().length < 20) {
      setMessageError('Message must be at least 20 characters long.');
      return false;
    }
    setMessageError('');
    return true;
  };

  const handleSendHelpRequest = async () => {
    if (!validateMessage()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/enquiries/new`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message,
          email,
          name,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert(
          'We have received your request.',
          'We will contact you shortly to assist with your issue.',
        );
        setIsModalVisible(false);
        setMessage('');
      } else {
        Alert.alert(
          'Error',
          data.message || 'Something went wrong. Please try again.',
        );
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred. Please try again.');
      console.error('Help request error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      style={styles.scrollView}>
      <View style={[CommonStyles.container, styles.container]}>
        <Text style={styles.label}>{content.result}</Text>
        <Text style={styles.readTimes}>
          {content.readTimes}{' '}
          <Text style={styles.boldText}>{result.data.result.ayah_no}</Text>{' '}
          {content.times}
        </Text>
        <View style={styles.quranTextContainer}>
          <Text style={styles.quranText}>
            بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
          </Text>
          <Text style={styles.quranText2}>
            {result.data.result.ayah.text}
            {'\n'}
          </Text>
          <View style={styles.surahContainer}>
            <Text style={styles.surahText}>
              Surah {result.data.result.surah.name_en}
            </Text>
            <Text style={styles.ayahText}>
              Ayah #{result.data.result.ayah_no}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.helpButton}
          onPress={() => setIsModalVisible(true)}>
          <Text style={styles.helpButtonText}>{content.help}</Text>
        </TouchableOpacity>
        <Text style={styles.assistanceDescription}>
          {content.assistanceDescription}
        </Text>
      </View>

      {/* Modal for Help Request */}
      <Modal
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Do You Need Any Assistance?</Text>
            <TextInput
              style={styles.input}
              placeholder="Type your message here..."
              placeholderTextColor="gray"
              multiline={true}
              value={message}
              onChangeText={setMessage}
            />
            {messageError ? (
              <Text style={styles.errorText}>{messageError}</Text>
            ) : null}
            <TouchableOpacity
              style={[
                styles.sendButton,
                loading ? styles.disabledButton : null,
              ]}
              onPress={handleSendHelpRequest}
              disabled={loading}>
              <Text style={styles.sendButtonText}>
                {loading ? 'Sending...' : 'Send'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setIsModalVisible(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#2f4f4f',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  assistanceDescription: {
    color: '#fff',
    fontSize: 15,
    textAlign: 'center',
    marginTop: 10,
    paddingHorizontal: 18,
  },

  container: {
    width: '100%',
    paddingTop: 20,
  },
  label: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  readTimes: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 20,
  },
  boldText: {
    fontWeight: 'bold',
  },
  quranTextContainer: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 10,
    marginBottom: 20,
    width: width * 0.9,
    alignSelf: 'center',
  },
  quranText: {
    color: '#000',
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 20,
  },
  quranText2: {
    color: '#000',
    fontSize: 30,
    textAlign: 'center',
    marginBottom: 20,
  },
  surahContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  surahText: {
    color: '#000',
    fontSize: 14,
  },
  ayahText: {
    color: '#000',
    fontSize: 14,
  },
  helpButton: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
  },
  helpButtonText: {
    color: '#2f4f4f',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: width * 0.9,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: 'black',
  },
  input: {
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    padding: 10,
    height: 100,
    textAlignVertical: 'top',
    marginBottom: 20,
    color: 'black',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
  sendButton: {
    backgroundColor: '#2f4f4f',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  cancelButton: {
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#2f4f4f',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Screen5;
