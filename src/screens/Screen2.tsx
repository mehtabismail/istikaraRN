import React, {useState, useEffect} from 'react';
import {
  Platform,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../utils/types';
import CommonStyles from '../styles/CommonStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_URL} from '../config';
import DropDownPicker from 'react-native-dropdown-picker';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

type Props = NativeStackScreenProps<RootStackParamList, 'Screen2'>;

function Screen2({route, navigation}: Props) {
  const {language: selectedLanguage} = route.params;
  const [firstName, setFirstName] = useState('');
  const [motherName, setMotherName] = useState('');
  const [selectedValue, setSelectedValue] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [gridOptions, setGridOptions] = useState<{[key: string]: string}>({});
  const [healingSquare, setHealingSquare] = useState<any>(true);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('son_of');
  const [items, setItems] = useState([
    {label: 'Son Of', value: 'son_of'},
    {label: 'Daughter Of', value: 'daughter_of'},
  ]);

  const content = {
    title: "Please enter your first name and your mother's name here",
    name_heading: 'Your first name',
    motherName_heading: `Mother's first name`,
    placeholder: selectedLanguage === 'Arabic' ? 'أدخل هنا' : 'Enter here',
    submit: 'Submit',
    errorMessage: 'Name cannot be empty',
    motherNameErrorMessage: 'Mother name cannot be empty',
    healingSquareText: 'Do you want your Healing Square ?',
  };

  const isArabic = selectedLanguage === 'Arabic';

  useEffect(() => {
    const fetchUserSession = async () => {
      try {
        const userSession = await AsyncStorage.getItem('userSession');
        if (userSession) {
          const {squares} = JSON.parse(userSession);

          if (squares && Object.keys(squares).length > 0) {
            setGridOptions(squares);
            setSelectedValue(Object.keys(squares)[0]);
          }
        } else {
          const fallbackOptions = {'3': '3x3', '4': '4x4', '5': '5x5'};
          setGridOptions(fallbackOptions);
          setSelectedValue('3');
        }
      } catch (error) {
        console.error('Error loading user session:', error);
      }
    };
    fetchUserSession();
  }, []);

  const handleInputChange = (text: string) => {
    if (isArabic) {
      const arabicPattern = /^[\u0600-\u06FF\s]*$/;
      if (arabicPattern.test(text)) {
        setFirstName(text);
      }
    } else {
      const englishPattern = /^[A-Za-z\s]*$/;
      if (englishPattern.test(text)) {
        setFirstName(text);
      }
    }
  };

  const handleMotherNameChange = (text: string) => {
    if (isArabic) {
      const arabicPattern = /^[\u0600-\u06FF\s]*$/;
      if (arabicPattern.test(text)) {
        setMotherName(text);
      }
    } else {
      const englishPattern = /^[A-Za-z\s]*$/;
      if (englishPattern.test(text)) {
        setMotherName(text);
      }
    }
  };

  const handleSubmit = async () => {
    if (firstName.trim() === '' || firstName.trim() === null) {
      setError(content.errorMessage);
    }
    if (motherName.trim() === '' || motherName.trim() === null) {
      setError(content.motherNameErrorMessage);
    } else {
      setError('');
      setLoading(true);

      try {
        const userSession = await AsyncStorage.getItem('userSession');
        const token = userSession ? JSON.parse(userSession).token : null;

        if (!token) {
          setLoading(false);
          Alert.alert('Error', 'User not authenticated.');
          return;
        }

        const response = await fetch(`${API_URL}/api/ist/result`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: firstName.trim(),
            language: selectedLanguage === 'Arabic' ? 'ar' : 'en',
            square_size: selectedValue,
            mother_name: motherName,
            gender_title: value,
            show_healing_square: healingSquare,
          }),
        });

        const responseText = await response.text();

        try {
          const result = JSON.parse(responseText);
          if (response.ok) {
            setLoading(false);
            navigation.navigate('Screen3', {
              result: result,
              healing_square: healingSquare,
            });
          } else {
            setLoading(false);
            Alert.alert('Error', result.message || 'An error occurred');
          }
        } catch (jsonError) {
          console.error('JSON Parse Error:', jsonError);
          setLoading(false);
          Alert.alert('Error', 'Failed to parse response as JSON');
        }
      } catch (error) {
        setLoading(false);
        Alert.alert('Error', 'An error occurred');
      }
    }
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={CommonStyles.scrollContainer}
      style={CommonStyles.scrollView}>
      <View style={CommonStyles.container2}>
        <Text style={CommonStyles.title2}>{content.title}</Text>
        <View style={CommonStyles.spacerLarge} />
        <View style={[CommonStyles.inputSection]}>
          <View style={CommonStyles.inputContainer}>
            <Text style={styles.gridLabel}>{content.name_heading}</Text>
            <TextInput
              placeholder={content.placeholder}
              placeholderTextColor="gray"
              style={[CommonStyles.input, isArabic && styles.arabicInput]}
              value={firstName}
              onChangeText={handleInputChange}
              keyboardType={isArabic ? 'default' : 'default'}
            />
          </View>
          <View style={{height: 55}} />
          <View style={[{position: 'absolute', top: 95, left: 0, zIndex: 2}]}>
            <DropDownPicker
              open={open}
              value={value}
              items={items}
              setOpen={setOpen}
              setValue={setValue}
              setItems={setItems}
              style={{height: '100%', width: '100%'}}
            />
          </View>
          <View style={CommonStyles.inputContainer}>
            <Text style={styles.gridLabel}>{content.motherName_heading}</Text>
            <TextInput
              placeholder={content.placeholder}
              placeholderTextColor="gray"
              style={[CommonStyles.input, isArabic && styles.arabicInput]}
              value={motherName}
              onChangeText={handleMotherNameChange}
              keyboardType={isArabic ? 'default' : 'default'}
            />
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <View style={CommonStyles.spacer} />

          <View style={CommonStyles.inputContainerCenter}>
            <Text style={styles.gridLabel}>
              <Text>
                Please choose the <Text style={styles.boldText}>grid</Text> here
              </Text>
            </Text>

            <View
              style={[
                CommonStyles.input,
                {
                  borderWidth: 1,
                  height: Platform.OS === 'ios' ? 200 : 50,
                  justifyContent: 'center',
                  borderColor: 'gray',
                  borderRadius: 10,
                  backgroundColor: '#fff',
                },
              ]}>
              <Picker
                itemStyle={{color: '#000'}}
                selectedValue={selectedValue}
                style={{color: '#000'}}
                onValueChange={itemValue => setSelectedValue(itemValue)}>
                {Object.entries(gridOptions).map(([key, label]) => (
                  <Picker.Item key={key} label={label} value={key} />
                ))}
              </Picker>
            </View>
          </View>
          <View style={CommonStyles.inputContainer}>
            <Text style={styles.gridLabel}>{content.healingSquareText}</Text>
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                onPress={() => setHealingSquare(true)}
                style={{
                  height: 20,
                  borderWidth: 0.5,
                  borderRadius: 10,
                  width: 20,
                  borderColor: healingSquare == true ? 'blue' : 'black',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                {!!healingSquare && (
                  <View
                    style={{
                      height: 10,
                      width: 10,
                      borderRadius: 5,
                      backgroundColor: '#80C4E9',
                    }}
                  />
                )}
              </TouchableOpacity>
              <Text
                style={{
                  fontSize: 16,
                  marginLeft: 10,
                  marginRight: 15,
                  color: 'white',
                }}>
                Yes
              </Text>
              <TouchableOpacity
                onPress={() => setHealingSquare(false)}
                style={{
                  height: 20,
                  borderWidth: 0.5,
                  borderRadius: 10,
                  width: 20,
                  borderColor: healingSquare == false ? 'blue' : 'black',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                {!healingSquare && (
                  <View
                    style={{
                      height: 10,
                      width: 10,
                      borderRadius: 5,
                      backgroundColor: '#80C4E9',
                    }}
                  />
                )}
              </TouchableOpacity>
              <Text
                style={{fontSize: 16, marginHorizontal: 10, color: 'white'}}>
                No
              </Text>
            </View>
          </View>
          <View style={CommonStyles.spacerLarge} />

          <TouchableOpacity style={CommonStyles.button} onPress={handleSubmit}>
            <Text style={CommonStyles.buttonText}>{content.submit}</Text>
          </TouchableOpacity>
        </View>

        <Modal
          transparent={true}
          animationType="none"
          visible={loading}
          onRequestClose={() => {}}>
          <View style={styles.modalBackground}>
            <View style={styles.activityIndicatorWrapper}>
              <ActivityIndicator animating={loading} />
              <Text style={styles.loadingText}>Loading...</Text>
            </View>
          </View>
        </Modal>
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  gridLabel: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  boldText: {
    fontWeight: 'bold',
  },
  arabicInput: {
    textAlign: 'right',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  activityIndicatorWrapper: {
    backgroundColor: '#fff',
    height: 120,
    width: 120,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#000',
    fontSize: 16,
  },
});

export default Screen2;
