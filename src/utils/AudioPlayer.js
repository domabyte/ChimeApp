import React, { useState } from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity } from 'react-native';
import SoundPlayer from 'react-native-sound-player'

const AudioPlayer = ({ documentPath }) => {
  const isSender = true;
  const [playing, setPlaying] = useState(false);
  const bubbleStyle = {
    backgroundColor: isSender ? '#DCF8C6' : '#E4E4E4',
    borderRadius: 15,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: isSender ? 'flex-end' : 'flex-start',
  };

  const handlePlay = () => {
    try {
      setPlaying(true);
      SoundPlayer.playUrl(documentPath);
  } catch (e) {
      console.log(`cannot play the sound file`, e)
  }
  }

  const handlePause = () => {
    try{
      setPlaying(false);
      SoundPlayer.pause();
    }catch(err){
      console.log(`cannot pause the sound file`,err)
    }
  }

  const durationBarLength = 100;

  return (
    <View style={bubbleStyle}>
      <View style={styles.messageContainer}>
        <Text style={styles.messageText}>{"Hljsdf"}</Text>
        <View style={styles.durationBar}>
          <View style={[styles.durationSegment, { width: durationBarLength }]} />
        </View>
      </View>
      {isSender && (
        !playing? (
          <TouchableOpacity onPress={handlePlay}>
            <Image source={require('../assets/png/Backward.png')} style={styles.userIcon} />
          </TouchableOpacity>
      ) :   <TouchableOpacity onPress={handlePause}>
      <Image source={require('../assets/png/forward.png')} style={styles.userIcon} />
    </TouchableOpacity>
     )}
    </View>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginLeft: 10,
    marginRight: 10,
  },
  messageText: {
    fontSize: 16,
  },
  durationBar: {
    marginTop: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#ccc',
  },
  durationSegment: {
    backgroundColor: '#4CAF50',
    borderRadius: 2.5,
  },
  userIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    margin: 5,
  },
});

export default AudioPlayer;
