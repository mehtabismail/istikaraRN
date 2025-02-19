import {View, Text, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {Layout} from 'react-native-reanimated';
import SoundPlayer from './SoundPlayer';

const CustomZikrCard = ({item}: any) => {
  const {title, description, content, audio} = item;

  const navigation = useNavigation();

  return (
    <View
      style={{
        backgroundColor: 'white',
        width: '90%',
        marginVertical: 10,
        alignSelf: 'center',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
      }}>
      <View style={{marginVertical: 10}}>
        <Text>{title ?? ''}</Text>
      </View>
      <View style={{marginVertical: 10}}>
        <Text>{description ?? ''}</Text>
      </View>
      <View
        style={{
          width: '100%',
          marginVertical: 10,
          borderRadius: 10,
          backgroundColor: '#2f4f4f',
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: 5,
        }}>
        <Text style={{color: 'white'}}>{content ?? ''}</Text>
      </View>
      <View>
        {audio && (
          //   <Text>{audio}</Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {/* <Image
              source={require('../assets/play.png')}
              style={{width: 20, height: 20}}
            /> */}
            <SoundPlayer audio={audio} />
          </View>
        )}
      </View>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('ZikrDetailScreen', {item: item, title: title});
        }}
        style={{
          width: '100%',
          marginVertical: 10,
          borderRadius: 10,
          backgroundColor: 'lightgrey',
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: 10,
        }}>
        <Text style={{color: 'black'}}>{'View'}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CustomZikrCard;
