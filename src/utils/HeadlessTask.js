// HeadlessTask.js

import messaging from '@react-native-firebase/messaging';

const HeadlessTask = async (message) => {
  console.log('Message handled in the background!', message);
  const url = buildDeepLinkFromNotificationData(message.data);
  if (typeof url === 'string') {
    console.log('Deeplink URL:', url);
  }
  return Promise.resolve();
};

messaging().setBackgroundMessageHandler(HeadlessTask);
