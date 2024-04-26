import RNFetchBlob from 'rn-fetch-blob';
import RNFS from 'react-native-fs';
import {DateTime} from 'luxon';
import {
  PermissionsAndroid,
  Platform,
  ToastAndroid,
  Linking,
} from 'react-native';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
export function allowMedia(mediapath) {
  if (mediapath) {
    if (mediapath.indexOf('youtube') > -1) {
      console.log('Inside');
      return 'youtube';
    }
    var url = mediapath.split('.');
    var ext = '.' + url[url.length - 1].toLowerCase();

    if (mediapath == null || mediapath == '') {
      return '';
    } else {
      if (
        ext == '.wv' ||
        ext == '.wma' ||
        ext == '.webm' ||
        ext == '.wav' ||
        ext == '.vox' ||
        ext == '.voc' ||
        ext == '.tta' ||
        ext == '.sln' ||
        ext == '.rf64' ||
        ext == '.raw' ||
        ext == '.ra' ||
        ext == '.rm' ||
        ext == '.opus' ||
        ext == '.ogg' ||
        ext == '.oga' ||
        ext == '.mogg' ||
        ext == '.nmf' ||
        ext == '.msv' ||
        ext == '.mpc' ||
        ext == '.mp3' ||
        ext == '.mmf' ||
        ext == '.m4p' ||
        ext == '.m4b' ||
        ext == '.m4a' ||
        ext == '.ivs' ||
        ext == '.iklax' ||
        ext == '.gsm' ||
        ext == '.flac' ||
        ext == '.dvf' ||
        ext == '.dss' ||
        ext == '.cda' ||
        ext == '.awb' ||
        ext == '.au' ||
        ext == '.ape' ||
        ext == '.amr' ||
        ext == '.alac' ||
        ext == '.aiff' ||
        ext == '.act' ||
        ext == '.aax' ||
        ext == '.aac' ||
        ext == '.aa' ||
        ext == '.8svx' ||
        ext == '.3gp'
      ) {
        return 'audio';
      } else if (
        ext == '.jpg' ||
        ext == '.jpeg' ||
        ext == '.png' ||
        ext == '.gif' ||
        ext == '.jfif' ||
        ext == '.webp' ||
        ext == '.bmp' ||
        ext == '.svg'
      ) {
        return 'image';
      } else if (
        ext == '.webm' ||
        ext == '.flv' ||
        ext == '.vob' ||
        ext == '.ogg' ||
        ext == '.avi' ||
        ext == '.mov' ||
        ext == '.wmv' ||
        ext == '.mp4' ||
        ext == '.3gp'
      ) {
        return 'video';
      } else if (
        ext == '.zip' ||
        ext == '.rar' ||
        ext == '.doc' ||
        ext == '.docx' ||
        ext == '.xls' ||
        ext == '.csv' ||
        ext == '.pdf' ||
        ext == '.xlsx' ||
        ext == '.vsdx' ||
        ext == '.rtf' ||
        ext == '.bmp' ||
        ext == '.ppt' ||
        ext == '.pptx' ||
        ext == '.txt'
      ) {
        return 'document';
      } else {
        return '';
      }
    }
  }
}

export const urlRegex =
  /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,}|[a-zA-Z0-9][a-zA-Z0-9-]+\.com(?:\/\S*)?)/g;

export const isYoutubeUrl = url => {
  return url.match(/(youtube\.com|youtu\.be)\/(watch)?(\?v=)?(\S+)?/);
};

export const extractYouTubeID = url => {
  const match = url.match(
    /(?:youtube\.com.*(?:\\?|&)(?:v)=|youtu\.be\/)([^&?]*)(?:[?&]t=([^&\s]+))?/,
  );
  return match ? match[1] : null;
};

export const openURL = url => {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'http://' + url;
  }
  Linking.openURL(url);
};
export function getDocType(data) {
  if (data.MediaPath) {
    const urlSp = data.MediaPath.split('/');
    const name = urlSp[urlSp.length - 1].toLowerCase();
    const result = name.split('.');
    return result;
  }
  return null;
}

export function getTimeFromDateByZone(UserDateTime) {
  const localDate = DateTime.fromISO(UserDateTime, {zone: 'utc'}).toLocal();
  const displayDate = localDate.toFormat('t');
  return displayDate;
}

export function formatDateString(dateStr) {
  const options = {year: 'numeric', month: 'short', day: '2-digit'};
  return new Date(dateStr).toLocaleDateString('en-US', options);
}

export async function downloadFile(documentPath, result) {
  const {dirs} = RNFetchBlob.fs;
  const dirToSave = Platform.OS === 'ios' ? dirs.DocumentDir : dirs.DownloadDir;

  let granted = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
  );

  if (!granted) {
    granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
      {
        title: 'Storage Permission',
        message: 'App needs access to your storage to read files.',
        buttonPositive: 'OK',
      },
    );
  }

  if (granted) {
    console.log('Storage permission granted');
    try {
      if (result.length == 2) {
        const downloadDest = `${dirToSave}/${result[0]}.${result[1]}`;
        const options = {
          fromUrl: documentPath,
          toFile: downloadDest,
          background: true,
          begin: res => {
            if (Platform.OS === 'ios') {
              PushNotificationIOS.presentLocalNotification({
                alertBody: 'Download started...',
                sound: 'default',
              });
            } else {
              ToastAndroid.show('Download started...', ToastAndroid.LONG);
            }
          },
          progress: res => {
            const progressPercent =
              (res.bytesWritten / res.contentLength) * 100;
            console.log(`Download progress: ${progressPercent.toFixed(2)}%`);
          },
        };

        const downloadTask = RNFS.downloadFile(options);

        downloadTask.promise
          .then(response => {
            if (Platform.OS === 'ios') {
              PushNotificationIOS.presentLocalNotification({
                alertBody: 'Download complete!',
                sound: 'default',
              });
            } else {
              ToastAndroid.show(
                `File ${result[0]}.${result[1]} saved in Downloader Folder`,
                ToastAndroid.SHORT,
              );
            }
          })
          .catch(error => {
            console.error('Download failed:', error);
            if (Platform.OS === 'ios') {
              PushNotificationIOS.presentLocalNotification({
                alertBody: 'Download failed!',
                sound: 'default',
              });
            } else {
              ToastAndroid.show('Download failed!', ToastAndroid.SHORT);
            }
          });
      } else {
        if (Platform.OS === 'ios') {
          PushNotificationIOS.presentLocalNotification({
            alertBody: 'File is corrupted or no result provided!',
            sound: 'default',
          });
        } else {
          ToastAndroid.show(
            'File is corrupted or no result provided!',
            ToastAndroid.SHORT,
          );
        }
      }
    } catch (error) {
      console.error('Error downloading file:', error);
      if (Platform.OS === 'ios') {
        PushNotificationIOS.presentLocalNotification({
          alertBody: 'Error downloading file!',
          sound: 'default',
        });
      } else {
        ToastAndroid.show('Error downloading file!', ToastAndroid.SHORT);
      }
    }
  } else {
    console.log('Storage permission denied');
    if (Platform.OS === 'ios') {
      PushNotificationIOS.presentLocalNotification({
        alertBody: 'Storage permission denied!',
        sound: 'default',
      });
    } else {
      ToastAndroid.show('Storage permission denied!', ToastAndroid.SHORT);
    }
  }
}
