import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity } from 'react-native';
import { responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions';
import SoundPlayer from 'react-native-sound-player'
import Slider from '@react-native-community/slider';

const AudioPlayer = ({ documentPath }) => {
  const isSender = true;
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    SoundPlayer.onFinishedPlaying(() => {
      setPlaying(false);
      setCurrentTime(0);
    });
    SoundPlayer.onFinishedLoading(info => {
      setDuration(info.duration);
    });

    return () => {
      SoundPlayer.unmount();
    };
  }, []);

  useEffect(() => {
    let interval = null;
    if (playing) {
      interval = setInterval(() => {
        SoundPlayer.getInfo().then(info => {
          setCurrentTime(info.currentTime);
          setDuration(info.duration);
        }).catch(error => {
          console.log('Error getting audio info:', error);
        });
      }, 1000);
    } else {
      if (interval) {
        clearInterval(interval);
      }
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [playing]);

  const handlePlay = () => {
    try {
      setPlaying(true);
      SoundPlayer.playUrl(documentPath);
    } catch (e) {
      console.log('Cannot play the sound file', e);
    }
  };

  const handlePause = () => {
    try {
      setPlaying(false);
      SoundPlayer.pause();
    } catch (err) {
      console.log('Cannot pause the sound file', err);
    }
  };

  const handleSeek = (value) => {
    SoundPlayer.seek(value);
    setCurrentTime(value);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <>
      <View style={styles.audioBody}>
        {isSender && (
          !playing ? (
            <TouchableOpacity onPress={handlePlay}>
              <Image style={styles.playBtn} source={require('../assets/png/AudioPlay.png')} />
            </TouchableOpacity>
          ) : <TouchableOpacity onPress={handlePause}>
            <Image style={styles.playBtn} source={require('../assets/png/AudioPause.png')} />
          </TouchableOpacity>
        )}
        <Image style={styles.audioSymble} source={require('../assets/png/AudioLine.png')} />
        <Slider
          style={{ width: responsiveWidth(25), height: 40 }}
          minimumValue={0}
          maximumValue={duration}
          value={currentTime}
          onSlidingComplete={handleSeek}
          minimumTrackTintColor="#1866B4"
          maximumTrackTintColor="#d3d3d3"
          thumbTintColor="#1866B4"
        />
        <View>
          <Text style={styles.timing}>{formatTime(currentTime)}</Text>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({

  audioBody: {
    backgroundColor: '#E6EEF7',
    borderColor: '#B0D5FF',
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: responsiveWidth(3.5),
    paddingVertical: responsiveWidth(1),
    borderRadius: responsiveWidth(5),
  },
  playBtn: {
    height: responsiveWidth(6),
    width: responsiveWidth(6),
    tintColor: '#1866B4'
  },
  audioSymble: {
    height: responsiveWidth(7),
    width: responsiveWidth(7),
    marginLeft: responsiveWidth(1)
  },
  timing: {
    fontSize: responsiveFontSize(2),
    fontWeight: '400',
    color: 'black'
  }

});

export default AudioPlayer;
