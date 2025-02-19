import {View, Text, ScrollView, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import CommonStyles from '../../styles/CommonStyles';
import {API_URL} from '../../config';
import SoundPlayer from '../../components/SoundPlayer';
import Share from 'react-native-share';

const ZikrDetailScreen = ({route, navigation}: any) => {
  const {title, description, content, slug, audio} = route?.params?.item;
  const [stop, setStop] = useState(false);

  const shareMessage = async () => {
    const options = {
      message: 'Check out this awesome content!',
      url: `https://mychat.com/ZikrScreen//${slug}`, // URL or file to share
    };

    try {
      await Share.open(options);
    } catch (error) {
      console.log('Error =>', error);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={CommonStyles.scrollContainer}
      style={[CommonStyles.scrollView, {backgroundColor: 'white'}]}>
      <View style={[CommonStyles.flexContainer, {backgroundColor: 'white'}]}>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            width: '90%',
            alignSelf: 'center',
          }}>
          <Text style={{fontSize: 18, fontWeight: '600', marginVertical: 10}}>
            {title}
          </Text>
          <Text style={{fontSize: 14, fontWeight: '400', marginVertical: 20}}>
            {description}
          </Text>
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
          <View style={{marginTop: 20}}>
            {audio && <SoundPlayer audio={audio} stop={stop} />}
          </View>
        </View>
      </View>
      <TouchableOpacity
        onPress={shareMessage}
        // onPress={async () => {
        //   try {
        //     await Share.share({
        //       message: `mychat://ZikrScreen//${slug}`,
        //     });
        //   } catch (error) {
        //     console.log('Error sharing:', error);
        //   }
        //   // Share.sharedAction;
        //   // console.log(`https://mychat.com/ZikrScreen//${slug}`);
        //   // Linking.openURL(`${API_URL}/zikr/${slug}`);
        // }}
        style={{
          width: '90%',
          alignSelf: 'center',
          marginVertical: 10,
          borderRadius: 10,
          backgroundColor: 'lightgrey',
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: 10,
          marginBottom: 30,
        }}>
        <Text style={{color: 'black'}}>{'Share'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ZikrDetailScreen;
