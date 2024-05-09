import {View, Text, TouchableOpacity, Touchable, Image, SafeAreaView} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import Video from 'react-native-video';
import Slider from '@react-native-community/slider';
import Orientation from 'react-native-orientation-locker';

const VideoPlayer = ({documentPath}) => {
  const [clicked, setClicked] = useState(false);
  const [puased, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fullScreen, setFullScreen] = useState(false);
  const ref = useRef();
  const format = seconds => {
    let mins = parseInt(seconds / 60)
      .toString()
      .padStart(2, '0');
    let secs = (Math.trunc(seconds) % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };
  // useEffect(() => {
  //   let timer;
  //   if (clicked) {
  //     timer = setTimeout(() => {
  //       setClicked(false);
  //     }, 5000);
  //   }
  //   return () => {
  //     clearTimeout(timer);
  //   };
  // }, [clicked]);

  return (
    <View>
      <TouchableOpacity
        style={{width: '100%', height: fullScreen ? '100%' : 200}}
        onPress={() => {
          setClicked(true);
        }}>
        <Video
          paused={puased}
          source={{
            uri: documentPath,
          }}
          ref={ref}
          onProgress={x => {
            setProgress(x);
          }}
          style={{
            width: '100%',
            height: '100%',
            aspectRatio: fullScreen ? 20 / 9 : 16 / 9,
            backgroundColor: '#111',
          }}
          resizeMode="contain"
        />
        {clicked && (
          <TouchableOpacity
            style={{
              width: '100%',
              height: '100%',
              position: 'absolute',
              backgroundColor: 'rgba(0,0,0,.5)',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                onPress={() => {
                  ref.current.seek(parseInt(progress.currentTime) - 10);
                }}>
                <Image
                  source={require('../assets/png/Backward.png')}
                  style={{width: 30, height: 30, tintColor: 'white'}}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setPaused(!puased);
                }}>
                <Image
                  source={
                    puased
                      ? require('../assets/png/Play-button.png')
                      : require('../assets/png/Pause.png')
                  }
                  style={{
                    width: 30,
                    height: 30,
                    tintColor: 'white',
                    marginLeft: 50,
                  }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  ref.current.seek(parseInt(progress.currentTime) + 10);
                }}>
                <Image
                  source={require('../assets/png/PlayerForward.png')}
                  style={{
                    width: 30,
                    height: 30,
                    tintColor: 'white',
                    marginLeft: 50,
                  }}
                />
              </TouchableOpacity>
            </View>
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-between',
                position: 'absolute',
                bottom: 0,
                paddingLeft: 20,
                paddingRight: 20,
                alignItems: 'center',
              }}>
              <Text style={{color: 'white'}}>
                {format(progress.currentTime)}
              </Text>
              <Slider
                value={progress.currentTime}
                style={{width: '80%', height: 40}}
                minimumValue={0}
                maximumValue={progress.seekableDuration}
                minimumTrackTintColor="#FFFFFF"
                maximumTrackTintColor="#fff"
                onValueChange={x => {
                  ref.current.seek(x);
                }}
              />
              <Text style={{color: 'white'}}>
                {format(progress.seekableDuration)}
              </Text>
            </View>
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-between',
                position: 'absolute',
                top: 10,
                paddingLeft: 20,
                paddingRight: 20,
                alignItems: 'center',
              }}>
              <TouchableOpacity
                onPress={() => {
                  if (fullScreen) {
                    Orientation.lockToPortrait();
                  } else {
                    Orientation.lockToLandscape();
                  }
                  setFullScreen(!fullScreen);
                }}>
                <Image
                  source={
                    fullScreen
                      ? require('../assets/png/Minimize.png')
                      : require('../assets/png/Full-size.png')
                  }
                  style={{width: 24, height: 24, tintColor: 'white'}}
                />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default VideoPlayer;
