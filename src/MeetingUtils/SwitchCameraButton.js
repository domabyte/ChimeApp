import React from 'react'
import {TouchableOpacity, Image, StyleSheet} from 'react-native'

export const SwitchCameraButton = ({ onPress }) => (
    <TouchableOpacity onPress={onPress}>
      <Image
      style={styles.meetingButton}
      source={require('../assets/png/switchCamera.png')}
    />
    </TouchableOpacity>
  );

const styles = StyleSheet.create({
  meetingButton: {
    resizeMode: 'contain',
    width: 50,
    height: 50
  },
});