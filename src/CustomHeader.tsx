import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Animated,
  Dimensions,
  Alert,
  PanResponder,
  Linking,
} from 'react-native';
import {
  useNavigation,
  NavigationProp,
  useNavigationState,
} from '@react-navigation/native';
import AntIcon from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SafeAreaView} from 'react-native-safe-area-context';
import {RootStackParamList} from './utils/types';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
// import {LoginManager} from 'react-native-fbsdk-next';
import CommonStyles from './styles/CommonStyles';
import {API_URL} from './config';

interface CustomHeaderProps {
  title?: string;
}

const {width} = Dimensions.get('window');

const CustomHeader: React.FC<CustomHeaderProps> = ({title}) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const routesLength = useNavigationState(state => state.routes.length);
  const [loading, setLoading] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [userSession, setUserSession] = useState<any>(null);
  const slideAnim = useRef(new Animated.Value(width)).current;

  useEffect(() => {
    const fetchUserSession = async () => {
      const session = await AsyncStorage.getItem('userSession');
      if (session) {
        setUserSession(JSON.parse(session));
      }
    };

    fetchUserSession();
  }, []);

  const openDrawer = () => {
    setDrawerVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeDrawer = () => {
    Animated.timing(slideAnim, {
      toValue: width,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setDrawerVisible(false));
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dx > 20,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx > 0) {
          slideAnim.setValue(gestureState.dx);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > width / 4) {
          closeDrawer();
        } else {
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }).start();
        }
      },
    }),
  ).current;

  const handleLogout = async () => {
    closeDrawer();
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: async () => {
            setLoading(true);
            try {
              if (userSession?.token) {
                const response = await fetch(`${API_URL}/api/logout`, {
                  method: 'POST',
                  headers: {
                    Authorization: `Bearer ${userSession.token}`,
                    'Content-Type': 'application/json',
                  },
                });

                if (response.status === 200) {
                  if (userSession.googleLogin) {
                    await GoogleSignin.signOut();
                  } else if (userSession.facebookLogin) {
                    // await LoginManager.logOut();
                  }

                  await AsyncStorage.removeItem('userSession');
                  setLoading(false);
                  navigation.reset({
                    index: 0,
                    routes: [{name: 'Login' as keyof RootStackParamList}],
                  });
                } else {
                  if (userSession.googleLogin) {
                    await GoogleSignin.signOut();
                  } else if (userSession.facebookLogin) {
                    // await LoginManager.logOut();
                  }

                  await AsyncStorage.removeItem('userSession');
                  setLoading(false);
                  navigation.reset({
                    index: 0,
                    routes: [{name: 'Login' as keyof RootStackParamList}],
                  });
                }
              }
            } catch (error) {
              Alert.alert('Error', 'An error occurred while signing out');
            } finally {
              setLoading(false);
            }
          },
        },
      ],
      {cancelable: true},
    );
  };
  const handleZikr = async () => {
    closeDrawer();
    const language = await AsyncStorage.getItem('language');
    navigation.navigate('ZikrScreen', {language: language});
  };

  const openPrivacyPolicy = () => {
    Linking.openURL(`${API_URL}/privacy-policy`);
  };

  const handleDeleteAccount = async () => {
    closeDrawer();
    Alert.alert(
      'Confirm Account Deletion',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes, Delete',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              if (userSession?.token) {
                const response = await fetch(`${API_URL}/api/delete-my-data`, {
                  method: 'POST',
                  headers: {
                    Authorization: `Bearer ${userSession.token}`,
                    'Content-Type': 'application/json',
                  },
                });

                if (response.status === 200) {
                  await AsyncStorage.removeItem('userSession');
                  setLoading(false);
                  navigation.reset({
                    index: 0,
                    routes: [{name: 'Login' as keyof RootStackParamList}],
                  });
                  Alert.alert(
                    'Account Deleted',
                    'Your account has been successfully deleted.',
                  );
                } else {
                  throw new Error('Failed to delete account');
                }
              }
            } catch (error) {
              Alert.alert(
                'Error',
                'An error occurred while deleting your account',
              );
            } finally {
              setLoading(false);
            }
          },
        },
      ],
      {cancelable: true},
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        {routesLength > 1 && (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <AntIcon name="left" size={26} color="#fff" />
          </TouchableOpacity>
        )}

        {title ? (
          <Text style={styles.headerTitle}>
            {title?.length < 15 ? title : title?.slice(0, 15) + '...'}
          </Text>
        ) : (
          <Image
            source={require('./assets/logo.png')}
            style={styles.headerImage}
          />
        )}

        <TouchableOpacity onPress={openDrawer}>
          <Ionicons name="menu" size={30} color="#fff" />
        </TouchableOpacity>

        <Modal
          transparent={true}
          animationType="none"
          visible={drawerVisible}
          onRequestClose={closeDrawer}>
          <View style={styles.modalBackground} {...panResponder.panHandlers}>
            <TouchableOpacity
              style={styles.modalOverlay}
              onPress={closeDrawer}></TouchableOpacity>
            <Animated.View
              style={[
                styles.drawerContainer,
                {transform: [{translateX: slideAnim}]},
              ]}>
              <TouchableOpacity
                onPress={closeDrawer}
                style={styles.closeButton}>
                <Ionicons name="close" size={30} color="#fff" />
              </TouchableOpacity>
              {userSession && (
                <View style={styles.userInfo}>
                  <Image
                    source={
                      userSession.photo
                        ? {uri: userSession.photo}
                        : require('./assets/default_avatar.png')
                    }
                    style={styles.avatar}
                  />
                  <Text style={styles.userName}>{userSession.name}</Text>
                  <Text style={styles.userEmail}>{userSession.email}</Text>
                  <View style={styles.separator} />
                  {title != 'Zikr' && (
                    <TouchableOpacity
                      style={styles.logoutButton}
                      onPress={handleZikr}>
                      {/* <Ionicons
                      name="exit-outline"
                      size={20}
                      color="#000"
                      style={styles.logoutIcon}
                    /> */}
                      <Text style={styles.logoutText}>Zikr</Text>
                    </TouchableOpacity>
                  )}
                  <View style={CommonStyles.spacer} />
                  <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={handleLogout}>
                    <Ionicons
                      name="exit-outline"
                      size={20}
                      color="#000"
                      style={styles.logoutIcon}
                    />
                    <Text style={styles.logoutText}>Logout</Text>
                  </TouchableOpacity>
                  <View style={CommonStyles.spacer} />
                  <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={handleDeleteAccount}>
                    <AntIcon
                      name="delete"
                      size={20}
                      color="red"
                      style={styles.logoutIcon}
                    />
                    <Text style={styles.deleteText}>Delete Account</Text>
                  </TouchableOpacity>
                </View>
              )}
              <View style={styles.footerContainer}>
                <TouchableOpacity onPress={openPrivacyPolicy}>
                  <Text style={styles.footerText}>Privacy Policy</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </View>
        </Modal>

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
              <Text style={styles.loadingText}>Signing out...</Text>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#2f4f4f',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 64,
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: '#2f4f4f',
  },

  headerImage: {
    width: 120,
    height: 80,
    resizeMode: 'contain',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
  },

  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  drawerContainer: {
    position: 'absolute',
    right: 0,
    width: width * 0.75,
    height: '100%',
    backgroundColor: '#2f4f4f',
    padding: 20,
    paddingTop: 50,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    justifyContent: 'flex-start',
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  userInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  userName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  userEmail: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 20,
  },
  separator: {
    height: 1,
    width: '100%',
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    width: '100%',
    paddingLeft: 20,
    paddingVertical: 15,
    borderRadius: 10,
  },
  logoutIcon: {
    marginRight: 10,
  },
  logoutText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },

  deleteText: {
    color: 'red',
    fontSize: 16,
    fontWeight: 'bold',
  },

  activityIndicatorWrapper: {
    backgroundColor: '#fff',
    height: 120,
    width: 150,
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

  footerContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },

  footerText: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
    marginVertical: 10,
  },
});

export default CustomHeader;
