import React from 'react'
import {TouchableOpacity, Image, StyleSheet} from 'react-native'

export const HangOffButton = ({onPress}) => {
  return (  
  <TouchableOpacity style={styles.HangBtn}
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
    width: 35,
    height: 35
  },
  HangBtn:{
    backgroundColor:'#ff0000',
    borderRadius:100,
    height: 50,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center'
  }
});