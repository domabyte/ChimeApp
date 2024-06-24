import React from 'react';
import {TouchableOpacity, Image, StyleSheet} from 'react-native';

export const SwitchMicrophoneToSpeakerButton = ({onPress, isSpeakerActive}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.commanBtn}>
      <Image
        style={styles.meetingButton}
        source={
          isSpeakerActive
            ? require('../assets/png/speaker.png')
            : require('../assets/png/notSpeaker.png')
        }
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  meetingButton: {
    resizeMode: 'contain',
    width: 25,
    height: 25
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
