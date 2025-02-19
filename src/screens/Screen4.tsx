import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { RadioButton } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../utils/types';
import CommonStyles from '../styles/CommonStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = NativeStackScreenProps<RootStackParamList, 'Screen4'>;

function Screen4({ navigation, route }: Props) {
  const { result } = route.params;
  const [checked, setChecked] = useState('');
  const [problems, setProblems] = useState<{ [key: string]: string }>({});

  const content = {
    title: "Please select your",
    situation: "situation",
    noOptions: "No options available",
    submit: "Submit",
  };

  useEffect(() => {
    const fetchUserSession = async () => {
      try {
        const userSession = await AsyncStorage.getItem('userSession');
        if (userSession) {
          const { problems } = JSON.parse(userSession);
          setProblems(problems || {});
        }
      } catch (error) {
        console.error('Error loading user session:', error);
      }
    };
    fetchUserSession();
  }, []);

  const hasProblems = Object.keys(problems).length > 0;

  return (
    <ScrollView contentContainerStyle={CommonStyles.scrollContainer} style={CommonStyles.scrollView}>
      <View style={[CommonStyles.container, styles.container]}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
        <Text style={styles.title}>
          {content.title} <Text style={styles.boldText}>{content.situation}</Text>
        </Text>
        <View style={styles.radioContainer}>
          {hasProblems ? (
            Object.entries(problems).map(([key, label]) => (
              <TouchableOpacity key={key} style={styles.radioItem} onPress={() => setChecked(key)}>
                <RadioButton
                  value={key}
                  status={checked === key ? 'checked' : 'unchecked'}
                  onPress={() => setChecked(key)}
                  color="#fff"
                  uncheckedColor="#fff"
                />
                <Text style={styles.radioLabel}>{label}</Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noOptionsText}>{content.noOptions}</Text>
          )}
        </View>
        <TouchableOpacity
          style={[
            CommonStyles.button,
            (checked === '' || !hasProblems) && styles.disabledButton,
          ]}
          onPress={() => navigation.navigate('Screen5', { result: result })}
          disabled={checked === '' || !hasProblems}
        >
          <Text style={CommonStyles.buttonText}>{content.submit}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    paddingHorizontal: 20,
  },
  logo: {
    width: 150,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 30,
  },
  title: {
    fontSize: 20,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  boldText: {
    fontWeight: 'bold',
  },
  radioContainer: {
    alignItems: 'flex-start',
    width: '100%',
    marginBottom: 20,
    marginLeft: 50,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  radioLabel: {
    color: '#fff',
    fontSize: 16,
  },
  noOptionsText: {
    color: 'gray',
    fontSize: 16,
    textAlign: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
});

export default Screen4;
