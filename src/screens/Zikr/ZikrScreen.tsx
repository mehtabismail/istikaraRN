import React, {useState, useEffect, useCallback} from 'react';
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
  FlatList,
  RefreshControl,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DropDownPicker from 'react-native-dropdown-picker';
import {RootStackParamList} from '../../utils/types';
import {API_URL} from '../../config';
import CommonStyles from '../../styles/CommonStyles';
import {FlashList} from '@shopify/flash-list';
import {CustomZikrCard} from '../../components';

type Props = NativeStackScreenProps<RootStackParamList, 'ZikrScreen'>;

function ZikrScreen({navigation, route}: Props) {
  const {language: selectedLanguage} = route.params;

  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleFetchingData = async () => {
    console.log('feetching data...');
    const userSession = await AsyncStorage.getItem('userSession');
    const token = userSession ? JSON.parse(userSession).token : null;

    if (!token) {
      setLoading(false);
      Alert.alert('Error', 'User not authenticated.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/zikr`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setData(data?.data);
      } else {
        Alert.alert(
          'Error',
          data.message || 'An error occurred. Please try again later.',
        );
      }
    } catch (error) {
      console.error('Zikr listing error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    handleFetchingData();
    setRefreshing(false);
  };

  useEffect(() => {
    handleFetchingData();

    return () => {};
  }, []);

  useEffect(() => {
    if (data?.zikr) {
      if (route?.params?.slug) {
        const slug = route?.params?.slug;
        const filteredData = data?.zikr?.filter(
          (item: any) => item.slug === slug,
        );

        if (filteredData.length > 0) {
          navigation.navigate('ZikrDetailScreen', {
            item: filteredData[0],
            title: filteredData[0]?.title,
          });
        }
      }
    }

    return () => {};
  }, [data]);

  return (
    <View style={[CommonStyles.flexContainer]}>
      <FlashList
        scrollEnabled={true}
        data={data?.zikr}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['white']}
          />
        }
        renderItem={item => <CustomZikrCard item={item?.item} />}
        showsVerticalScrollIndicator={false}
        estimatedItemSize={50}
      />
      <Modal transparent={true} animationType="none" visible={loading}>
        <View style={styles.modalBackground}>
          <View style={styles.activityIndicatorWrapper}>
            <ActivityIndicator
              animating={loading}
              size="large"
              color="#0000ff"
            />
            <Text style={styles.loadingText}>loading...</Text>
          </View>
        </View>
      </Modal>
    </View>
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

export default ZikrScreen;
