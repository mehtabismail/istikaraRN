import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../utils/types';
import CommonStyles from '../styles/CommonStyles';
import {SafeAreaView} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = NativeStackScreenProps<RootStackParamList, 'HomePage'>;

function HomePage({navigation}: Props) {
  return (
    <SafeAreaView style={CommonStyles.safeArea}>
      <ScrollView
        contentContainerStyle={CommonStyles.scrollContainer}
        style={CommonStyles.scrollView}>
        <View style={CommonStyles.container}>
          <Image
            source={require('../assets/logo.png')}
            style={CommonStyles.bigLogo}
          />
          <View style={CommonStyles.spacerLarge} />
          <Text style={CommonStyles.title2}>
            Please select the language on which your name is based in
          </Text>
          <Text style={CommonStyles.smallText}>
            * Select the Language carefully because the result will be based on
            your name
          </Text>
          <View style={CommonStyles.spacer} />
          <TouchableOpacity
            style={[CommonStyles.button, styles.button]}
            onPress={() => {
              AsyncStorage.setItem('language', 'English');
              navigation.navigate('Screen2', {language: 'English'});
            }}>
            <Text style={CommonStyles.buttonText}>English</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[CommonStyles.button, styles.button]}
            onPress={() => {
              AsyncStorage.setItem('language', 'Arabic');
              navigation.navigate('Screen2', {language: 'Arabic'});
            }}>
            <Text style={CommonStyles.buttonText}>العربية</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '80%',
    alignSelf: 'center',
    marginTop: 10,
  },
});

export default HomePage;
