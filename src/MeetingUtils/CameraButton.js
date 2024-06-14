import React from 'react';
import {TouchableOpacity, Image, StyleSheet} from 'react-native';

let videoDisabledImg = require('../assets/png/video-disabled.png');
let videoImg = require('../assets/png/video.png');

export const CameraButton = ({disabled, onPress}) => {
  return (  
  <TouchableOpacity 
    onPress={() => {
      onPress();
  }}>
    <Image
      style={styles.meetingButton}
      source={disabled ? videoDisabledImg : videoImg}
    />
  </TouchableOpacity>
  ) 
}


const styles = StyleSheet.create({
  meetingButton: {
    resizeMode: 'contain',
    width: 50,
    height: 50
  }
});