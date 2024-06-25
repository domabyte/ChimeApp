import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';

let mutedImg = require('../assets/png/microphone-muted.png');

export const GroupAttendeeItem = ({attendeeName, muted}) => {
  return (
    <View style={styles.attendeeContainer}>
      <Text>{attendeeName}</Text>
      {muted && <Image source={mutedImg} style={styles.attendeeMuteImage} />}
    </View>
  );
};

const styles = StyleSheet.create({
  attendeeContainer: {
    fontSize: 20,
    margin: 5,
    padding: 5,
    height: 30,
    backgroundColor: '#eee',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  attendeeMuteImage: {
    resizeMode: 'contain',
    width: 20,
    height: 20,
  },
});
