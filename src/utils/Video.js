import React from 'react';
import { View, ImageBackground, TouchableOpacity, Text, StyleSheet, SafeAreaView } from 'react-native';
import { responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions';

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
    borderRadius: responsiveWidth(2),
  },
  thumbnail: {
    width: responsiveWidth(50),
    height: responsiveWidth(30),
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: responsiveWidth(6),
    width: responsiveWidth(12),
    height: responsiveWidth(12),
    justifyContent: 'center',
    alignItems: 'center',

  },
  playButtonText: {
    color: 'white',
    fontSize: responsiveFontSize(3),
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: responsiveWidth(1),
  },
});

export default VideoThumbnail;
