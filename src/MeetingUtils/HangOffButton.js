import React from 'react'
import {TouchableOpacity, Image, StyleSheet} from 'react-native'

export const HangOffButton = ({onPress}) => {
  return (  
  <TouchableOpacity 
    onPress={() => {
      onPress();
  }}>
    <Image
      style={styles.meetingButton}
      source={require('../assets/png/hang-off.png')}
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