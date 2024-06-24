import React from 'react'
import {TouchableOpacity, Image, StyleSheet} from 'react-native'

export const ShareScreenBtn = ({ onPress }) => (
    <TouchableOpacity onPress={onPress} style={styles.commanBtn}>
      <Image
      style={styles.meetingButton}
      source={require('../assets/png/screenShare.png')}
    />
    </TouchableOpacity>
  );

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