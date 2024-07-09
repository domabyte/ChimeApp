import {Linking, NativeModules, Platform} from 'react-native';
import RNCallKeep from 'react-native-callkeep';
import messaging from '@react-native-firebase/messaging';
import configURL from '../config/config';
import axios from 'axios';

let callDetails = {};

RNCallKeep.addEventListener('answerCall', ({callUUID}) => {
  RNCallKeep.backToForeground();
  setTimeout(async () => {
    if (callDetails.isGroup === 'true') {
      Linking.openURL(
        `actpal://group${
          callDetails.type === 'audio' ? 'Audio' : 'Video'
        }Call?meetingName=${callUUID}&fcmToken=${''}&host=${callDetails.id}`,
      );
    } else {
      Linking.openURL(
        `actpal://${callDetails.type}Call?meetingName=${callUUID}&userName=${callDetails.name}`,
      );
      try {
        await axios.post(configURL.endCallURL, {
          token: callDetails?.fcmToken,
          callId: callUUID,
        });
      } catch (err) {
        console.log('Error ending the call ', err);
      }
    }
    RNCallKeep.endCall(callUUID);
    for (const prop in callDetails) {
      if (callDetails.hasOwnProperty(prop)) {
        delete callDetails[prop];
      }
    }
  }, 1000);
});
RNCallKeep.addEventListener('endCall', () => console.log('End the call'));

messaging().onMessage(async remoteMessage => {
  callDetails = Object.assign({}, callDetails, {
    token: remoteMessage.data?.token,
    type: remoteMessage.data?.navigationId,
    name: remoteMessage.data?.friendName,
    fcmToken: remoteMessage.data?.fcmtoken,
    isGroup: remoteMessage.data?.isGroup,
    id: remoteMessage.data?.id,
  });
  if (remoteMessage.data?.pickUp === '1') {
    RNCallKeep.displayIncomingCall(
      remoteMessage.data?.callId,
      remoteMessage.data?.userId,
      remoteMessage.data?.friendName,
      'generic',
      true,
      {
        supportsDTMF: true,
        supportsHolding: true,
      },
    );
  } else if (remoteMessage.data?.pickUp === '2') {
    RNCallKeep.endCall(remoteMessage.data?.callId);
  }
});

messaging().onNotificationOpenedApp(remoteMessage => {
  console.log('Background Notification', JSON.stringify(remoteMessage));
});

messaging().setBackgroundMessageHandler(async remoteMessage => {
  if (remoteMessage) {
    RNCallKeep.displayIncomingCall(
      remoteMessage.data?.callId,
      remoteMessage.data?.userId,
      remoteMessage.data?.friendName,
      'generic',
      true,
      {
        supportsDTMF: true,
        supportsHolding: true,
      },
    );
    if (Platform.OS === 'android') {
      const {CallkeepHelperModule} = NativeModules;
      CallkeepHelperModule.startActivity();
    }
  }
});
