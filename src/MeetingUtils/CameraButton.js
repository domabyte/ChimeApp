import React, {forwardRef} from 'react';
import {TouchableOpacity, Image, StyleSheet} from 'react-native';

let videoDisabledImg = require('../assets/png/video-disabled.png');
let videoImg = require('../assets/png/video.png');

export const CameraButton = forwardRef((props, ref) => {
  return (  
  <TouchableOpacity ref={ref} style={styles.commanBtn} 
    onPress={props.onPress}>
    <Image
      style={styles.meetingButton}
      source={props.disabled ? videoDisabledImg : videoImg}
    />
  </TouchableOpacity>
  ) 
});

const styles = StyleSheet.create({
  meetingButton: {
    resizeMode: 'contain',
    width: 35,
    height: 35
  },
  commanBtn:{
    backgroundColor:'#fff',
    borderRadius:100,
    height: 50,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center'
  }
});