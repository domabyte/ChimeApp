import messaging from '@react-native-firebase/messaging';
import {PermissionsAndroid, Platform} from 'react-native';
import DeviceInfo from 'react-native-device-info';

export async function requestUserPermission() {
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      const fcmToken = await getFCMToken();
      const deviceToken = getDeviceToken();
      return {fcmToken, deviceToken};
    } else {
      console.log('Permission Denied');
    }
  } else {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (enabled) {
      console.log('Authorization status:', authStatus);
      const fcmToken = await getFCMToken();
      const deviceToken = getDeviceToken();
      return {fcmToken, deviceToken};
    }
  }
}

const getFCMToken = async () => {
  try {
    await messaging().registerDeviceForRemoteMessages();
    const token = await messaging().getToken();
    return token;
  } catch (err) {
    console.log('Failed to get token : ', err);
  }
};

const getDeviceToken = () => {
  try {
    const deviceId = DeviceInfo.getUniqueId();
    return deviceId;
  } catch (err) {
    console.log('Failed to get device token : ', err);
  }
};
