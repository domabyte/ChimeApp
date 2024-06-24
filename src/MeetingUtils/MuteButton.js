import React from 'react'
import {TouchableOpacity, Image, StyleSheet} from 'react-native'

let mutedImg = require('../assets/png/microphone-muted.png');
let normalImg = require('../assets/png/microphone.png');

export const MuteButton = ({muted, onPress}) => {
  return (  
  <TouchableOpacity 
    onPress={() => {
      onPress();
  }} style={styles.commanBtn}>
    <Image
      style={styles.meetingButton}
      source={muted ? mutedImg : normalImg}
    />
  </TouchableOpacity>
  );
};

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