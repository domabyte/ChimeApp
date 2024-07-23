import React from 'react';
import {
  View,
  Text,
  FlatList,
  Alert,
  StyleSheet,
  BackHandler,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {
  NativeFunction,
  getSDKEventEmitter,
  MobileSDKEvent,
  MeetingError,
} from '../utils/Bridge';
import {RNVideoRenderView} from '../MeetingUtils/RNVideoRenderView';
import {MuteButton} from '../MeetingUtils/MuteButton';
import {HangOffButton} from '../MeetingUtils/HangOffButton';
import {AttendeeItem} from '../MeetingUtils/AttendeeItem';
import {CameraButton} from '../MeetingUtils/CameraButton';
import {SwitchCameraButton} from '../MeetingUtils/SwitchCameraButton';
import {SwitchMicrophoneToSpeakerButton} from '../MeetingUtils/SwitchMicrophoneToSpeakerButton';
import {ShareScreenBtn} from '../MeetingUtils/ShareScreenBtn';
import Sound from 'react-native-sound';
const ringtone = require('../assets/audio/ringtone.mp3');

const attendeeNameMap = {};
Sound.setCategory('Playback', true);

export class VideoMeeting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      attendees: [],
      videoTiles: [],
      mutedAttendee: [],
      selfVideoEnabled: false,
      screenShareTile: null,
      isMeetingActive: false,
      isSpeakerActive: true,
      tileVideoId: null,
      isSwitchCameraActive: false,
    };
    this.sound = null;
    this.timer = null;
    this.meetingTimer = null;
    this.startTime = null;
    this.cameraButtonRef = React.createRef();
  }

  componentDidMount() {
    this.setupEventListeners();
    setTimeout(() => {
      NativeFunction.setCameraOn(true);
    }, 1000);

    this.switchMicrophoneToSpeaker();

    this.sound = new Sound(ringtone, error => {
      if (error) {
        console.log('Failed to load the sound', error);
        return;
      }
      this.sound.setVolume(1.0);
      this.sound.setNumberOfLoops(-1);
      this.sound.play(success => {
        if (success) {
          console.log('Sound played successfully');
          this.sound.release();
        } else {
          console.log('Sound playback failed');
        }
      });
    });
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackPress,
    );
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.attendees.length >= 2 && prevState.attendees.length < 2) {
      this.setState({isMeetingActive: true});
      try {
        this.sound.release();
      } catch (err) {
        console.log('Cannot stop the sound file', err);
      }
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
    } else if (
      this.state.attendees.length === 1 &&
      prevState.attendees.length === 0
    ) {
      this.startOneMinuteTimer();
    } else if (
      this.state.attendees.length === 1 &&
      prevState.attendees.length > 1
    ) {
      this.setState({isMeetingActive: false});
      this.HangUp();
    }
  }

  componentWillUnmount() {
    this.removeEventListeners();
    try {
      this.sound.release();
    } catch (e) {
      console.log(`Cannot stop the sound file`, e);
    }
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.backHandler.remove();
  }

  setupEventListeners = () => {
    this.onAttendeesJoinSubscription = getSDKEventEmitter().addListener(
      MobileSDKEvent.OnAttendeesJoin,
      ({attendeeId, externalUserId}) => {
        if (!(attendeeId in attendeeNameMap)) {
          attendeeNameMap[attendeeId] = externalUserId.split('#')[1];
        }
        this.setState(oldState => ({
          ...oldState,
          attendees: oldState.attendees.concat([attendeeId]),
        }));
      },
    );

    this.onAttendeesLeaveSubscription = getSDKEventEmitter().addListener(
      MobileSDKEvent.OnAttendeesLeave,
      ({attendeeId}) => {
        this.setState(oldState => ({
          ...oldState,
          attendees: oldState.attendees.filter(
            attendeeToCompare => attendeeId !== attendeeToCompare,
          ),
        }));
      },
    );

    this.onAttendeesMuteSubscription = getSDKEventEmitter().addListener(
      MobileSDKEvent.OnAttendeesMute,
      attendeeId => {
        this.setState(oldState => ({
          ...oldState,
          mutedAttendee: oldState.mutedAttendee.concat([attendeeId]),
        }));
      },
    );

    this.onAttendeesUnmuteSubscription = getSDKEventEmitter().addListener(
      MobileSDKEvent.OnAttendeesUnmute,
      attendeeId => {
        this.setState(oldState => ({
          ...oldState,
          mutedAttendee: oldState.mutedAttendee.filter(
            attendeeToCompare => attendeeId !== attendeeToCompare,
          ),
        }));
      },
    );

    this.onAddVideoTileSubscription = getSDKEventEmitter().addListener(
      MobileSDKEvent.OnAddVideoTile,
      tileState => {
        if (tileState.isScreenShare) {
          this.setState(oldState => ({
            ...oldState,
            screenShareTile: tileState.tileId,
          }));
        } else {
          this.setState(oldState => ({
            ...oldState,
            videoTiles: [...oldState.videoTiles, tileState.tileId],
            selfVideoEnabled: tileState.isLocal
              ? true
              : oldState.selfVideoEnabled,
          }));
        }
      },
    );

    this.onRemoveVideoTileSubscription = getSDKEventEmitter().addListener(
      MobileSDKEvent.OnRemoveVideoTile,
      tileState => {
        if (tileState.isScreenShare) {
          this.setState(oldState => ({
            ...oldState,
            screenShareTile: null,
          }));
        } else {
          this.setState(oldState => ({
            ...oldState,
            videoTiles: oldState.videoTiles.filter(
              tileIdToCompare => tileIdToCompare !== tileState.tileId,
            ),
            selfVideoEnabled: tileState.isLocal
              ? false
              : oldState.selfVideoEnabled,
          }));
        }
      },
    );

    this.onDataMessageReceivedSubscription = getSDKEventEmitter().addListener(
      MobileSDKEvent.OnDataMessageReceive,
      dataMessage => {
        const str = `Received Data message (topic: ${dataMessage.topic}) ${dataMessage.data} from ${dataMessage.senderAttendeeId}:${dataMessage.senderExternalUserId} at ${dataMessage.timestampMs} throttled: ${dataMessage.throttled}`;
        NativeFunction.sendDataMessage(dataMessage.topic, str, 1000);
      },
    );

    this.onErrorSubscription = getSDKEventEmitter().addListener(
      MobileSDKEvent.OnError,
      errorType => {
        switch (errorType) {
          case MeetingError.OnMaximumConcurrentVideoReached:
            Alert.alert(
              'Failed to enable video',
              'Maximum number of concurrent videos reached!',
            );
            break;
          default:
            Alert.alert('Error', `${errorType}. Something is wrong. Please try again`);
            break;
        }
      },
    );
  };

  removeEventListeners = () => {
    if (this.onAttendeesJoinSubscription) {
      this.onAttendeesJoinSubscription.remove();
    }
    if (this.onAttendeesLeaveSubscription) {
      this.onAttendeesLeaveSubscription.remove();
    }
    if (this.onAttendeesMuteSubscription) {
      this.onAttendeesMuteSubscription.remove();
    }
    if (this.onAttendeesUnmuteSubscription) {
      this.onAttendeesUnmuteSubscription.remove();
    }
    if (this.onAddVideoTileSubscription) {
      this.onAddVideoTileSubscription.remove();
    }
    if (this.onRemoveVideoTileSubscription) {
      this.onRemoveVideoTileSubscription.remove();
    }
    if (this.onDataMessageReceivedSubscription) {
      this.onDataMessageReceivedSubscription.remove();
    }
    if (this.onErrorSubscription) {
      this.onErrorSubscription.remove();
    }
  };

  HangUp = async () => {
    await NativeFunction.stopMeeting();
    this.props.endCall();
    this.props.navigation.goBack();
  };

  endHangUp = async () => {
    await NativeFunction.stopMeeting();
    this.props.endCall();
    this.props.navigation.goBack();
  };

  switchMicrophoneToSpeaker = () => {
    NativeFunction.switchMicrophoneToSpeaker()
      .then(response => {
        console.log(response);
        this.setState(prevState => ({
          isSpeakerActive: !prevState.isSpeakerActive,
        }));
      })
      .catch(error => {
        console.error(error);
      });
  };

  startScreenShare = async arg => {
    await NativeFunction.startScreenShare(arg);
  };

  stopScreenShare = async () => {
    await NativeFunction.stopScreenShare();
  };

  switchCamera = () => {
    NativeFunction.switchCamera()
      .then(response => {
        console.log(response);
        this.setState(prevState => ({
          isSwitchCameraActive: !prevState.isSwitchCameraActive,
        }));
      })
      .catch(error => {
        console.error(error);
      });
  };

  startOneMinuteTimer = async () => {
    this.timer = setTimeout(() => {
      if (this.state.attendees.length === 1) {
        this.endHangUp();
      }
    }, 60000);
  };

  handleBackPress = () => {
    console.log('Back button pressed');
    Alert.alert('Hang up to go back', 'Please hang up the call to go back.', [
      {text: 'OK'},
    ]);
    return true;
  };

  handleTilePress = tileId => {
    console.log('Tile id : ', tileId);
    this.setState({tileVideoId: tileId});
  };

  render() {
    const currentMuted = this.state.mutedAttendee.includes(
      this.props.selfAttendeeId,
    );

    return (
      <SafeAreaView>
        <View style={[styles.container]}>
          <View
            style={[
              styles.videoContainer,
              this.state.videoTiles.length == 1 &&
              this.state.tileVideoId === null
                ? styles.oneVideo
                : this.state.videoTiles.length == 2 &&
                  this.state.tileVideoId === null
                ? styles.twoVideo
                : styles.NoVideo,
              this.state.tileVideoId !== null ? styles.fullScreenVideo : '',
            ]}>
            {this.state.videoTiles.length > 0 ? (
              this.state.videoTiles.map(tileId => (
                <TouchableOpacity
                  key={tileId}
                  onPress={() => this.handleTilePress(tileId)}
                  style={[
                    this.state.tileVideoId === null
                      ? styles.videoWrapper
                      : this.state.tileVideoId === tileId
                      ? styles.fullWrapper
                      : styles.smallWrapper,
                  ]}>
                  <RNVideoRenderView
                    style={
                      this.state.tileVideoId === null
                        ? styles.video
                        : [
                            this.state.tileVideoId === tileId
                              ? styles.selectedVideo
                              : styles.smallVideo,
                          ]
                    }
                    tileId={tileId}
                    mirror={this.state.isSwitchCameraActive ? false : true}
                  />
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.subtitle}>
                No one is sharing video at this moment
              </Text>
            )}
          </View>
          {/* {!!this.state.screenShareTile && (
          <React.Fragment>
            <Text style={styles.title}>Screen Share</Text>
            <View style={styles.videoContainer}>
              <RNVideoRenderView
                style={styles.screenShare}
                key={this.state.screenShareTile}
                tileId={this.state.screenShareTile}
              />
            </View>
          </React.Fragment>
        )} */}
          {/* <Text style={styles.title}>Attendee</Text>
        <FlatList
          style={styles.attendeeList}
          data={this.state.attendees}
          renderItem={({item}) => (
            <AttendeeItem
              attendeeName={
                attendeeNameMap[item] ? attendeeNameMap[item] : item
              }
              muted={this.state.mutedAttendee.includes(item)}
            />
          )}
          keyExtractor={item => item}
        /> */}
          <View style={styles.buttonContainer}>
            <MuteButton
              muted={currentMuted}
              onPress={() => NativeFunction.setMute(!currentMuted)}
            />
            <SwitchMicrophoneToSpeakerButton
              onPress={this.switchMicrophoneToSpeaker}
              isSpeakerActive={this.state.isSpeakerActive}
            />
            <CameraButton
              disabled={this.state.selfVideoEnabled}
              onPress={() =>
                NativeFunction.setCameraOn(!this.state.selfVideoEnabled)
              }
            />
            <SwitchCameraButton onPress={this.switchCamera} />
            <ShareScreenBtn onPress={() => this.startScreenShare(true)} />
            {/* <SwitchCameraButton onPress={()=> this.startScreenShare(true)} /> */}
            {/* <SwitchCameraButton onPress={this.stopScreenShare} /> */}
            <HangOffButton onPress={this.HangUp} />
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    height: '100%',
    backgroundColor: 'gray',
  },
  oneVideo: {
    width: '100%',
    height: '100%',
  },
  twoVideo: {
    flex: 1,
    flexDirection: 'column',
    borderColor: '#333',
    borderTopColor: '#f00',
    borderWidth: 2,
    width: '100%',
    height: '100%',
  },
  NoVideo: {
    width: '100%',
    height: '100%',
  },
  videoWrapper: {
    width: '100%',
    height: '50%',
  },

  video: {
    flex: 1,
    width: '100%',
    height: '50%',
    objectFit: 'cover',
  },
  selectedVideo: {
    width: '100%',
    height: '100%',
    position: 'relative',
    zIndex: 1,
  },
  fullScreenVideo: {
    width: '100%',
    height: '100%',
    flex: 1,
    position: 'relative',
    zIndex: 0,
  },
  fullWrapper: {
    width: '100%',
    height: '100%',
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    flexDirection: 'row',
    bottom: 10,
    gap: 10,
    zIndex: 99,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
  },
  viewContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  subtitle: {
    marginBottom: 25,
    marginTop: 10,
    color: 'grey',
  },
  videoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    height: 400,
  },
  screenShare: {
    width: '90%',
    height: 400,
  },
  attendeeList: {
    width: '90%',
  },
  smallWrapper: {
    width: 100,
    height: 100,
    position: 'absolute',
    bottom: 100,
    right: 20,
    zIndex: 999,
    borderRadius: 10,
    borderColor: '#333',
    borderWidth: 2,
  },
  smallVideo: {
    flex: 1,
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    zIndex: 9999,
    position: 'relative',
    width: '100%',
    height: '100%',
  },
});

export default VideoMeeting;
