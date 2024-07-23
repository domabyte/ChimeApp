import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
import "./src/utils/CallDetect";
import RNCallKeep from 'react-native-callkeep';

const options = {
  ios: {
    appName: 'ChimeApp',
  },
  android: {
    alertTitle: 'Permissions required',
    alertDescription: 'This application needs to access your phone accounts',
    cancelButton: 'Cancel',
    okButton: 'ok',
    imageName: 'ChimeApp',
    foregroundService: {
      channelId: 'com.chimeapp',
      channelName: 'Foreground service for my app',
      notificationTitle: 'My app is running on background',
      notificationIcon: 'Path to the resource icon of the notification',
    },
  },
};
RNCallKeep.setup(options);
RNCallKeep.setAvailable(true);
AppRegistry.registerComponent(appName, () => App);
