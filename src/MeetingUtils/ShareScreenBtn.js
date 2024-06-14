import React from 'react'
import {TouchableOpacity, Image, StyleSheet} from 'react-native'

export const ShareScreenBtn = ({ onPress }) => (
    <TouchableOpacity onPress={onPress}>
      <Image
      style={styles.meetingButton}
      source={require('../assets/png/screenShare.png')}
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