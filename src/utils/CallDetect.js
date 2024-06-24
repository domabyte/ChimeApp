import {Linking, NativeModules, Platform} from 'react-native';
import RNCallKeep from 'react-native-callkeep';
import messaging from '@react-native-firebase/messaging';
import configURL from '../config/config';
import axios from 'axios';

let callDetails = {};

RNCallKeep.addEventListener('answerCall', ({callUUID}) => {
    RNCallKeep.backToForeground();
    setTimeout(async () => {
      Linking.openURL(
        `actpal://${callDetails.type}Call?meetingName=${callUUID}&userName=${callDetails.name}`,
      );
      RNCallKeep.endCall(callUUID);
      try {
        const {data} = await axios.post(configURL.endCallURL, {
          token: callDetails?.fcmToken,
          callId: callUUID,
        })
        if (data.code){
          console.log('Data is : ', data.message);
        }
      } catch(err) {
        console.log("Error ending the call ",err);
      }
      for (const prop in callDetails) {
        if (callDetails.hasOwnProperty(prop)) {
          delete callDetails[prop];
        }
      }
    }, 1000);
  });
  RNCallKeep.addEventListener('endCall', () => console.log('End the call'));
  
  messaging().onMessage(async remoteMessage => {
    // console.log("Remote message: " + JSON.stringify(remoteMessage));
    callDetails = Object.assign({}, callDetails, {token: remoteMessage.data?.token, type: remoteMessage.data?.navigationId, name: remoteMessage.data?.friendName, fcmToken: remoteMessage.data?.fcmtoken});
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
    } 
    else if (remoteMessage.data?.pickUp === '2') {
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