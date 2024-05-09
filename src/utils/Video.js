import React from 'react';
import { View, ImageBackground, TouchableOpacity, Text, StyleSheet, SafeAreaView } from 'react-native';

const VideoThumbnail = ({ thumbnailUri, onPress, onLongPress}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} onLongPress={onLongPress}>
      <ImageBackground
        style={styles.thumbnail}
        source={{ uri: thumbnailUri }}
        resizeMode="cover">
        <View style={styles.playButton}>
          <Text style={styles.playButtonText}>▶</Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    borderRadius: 8,
  },
  thumbnail: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',

  },
  playButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default VideoThumbnail;
