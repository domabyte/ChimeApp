import React from 'react';
import {
  View,
  Text,
  FlatList,
  Alert,
  StyleSheet,
  BackHandler,
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
import {CameraButton} from '../MeetingUtils/CameraButton';
import {SwitchCameraButton} from '../MeetingUtils/SwitchCameraButton';
import {SwitchMicrophoneToSpeakerButton} from '../MeetingUtils/SwitchMicrophoneToSpeakerButton';
import {ShareScreenBtn} from '../MeetingUtils/ShareScreenBtn';
import {GroupAttendeeItem} from '../MeetingUtils/GroupAttendeeItem';
const ringtone = require('../assets/audio/ringtone.mp3');

const attendeeNameMap = {};

export class GroupVideoMeeting extends React.Component {
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
      isSwitchCameraActive: false,
    };
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
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackPress,
    );
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.attendees.length >= 2 && prevState.attendees.length < 2) {
      this.setState({isMeetingActive: true});
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
    } else if (
      this.state.attendees.length === 1 &&
      prevState.attendees.length === 0
    ) {
      this.startOneMinuteTimer();
      setTimeout(() => {
        if (this.state.attendees.length === 1) {
          if (this.props.host !== attendeeNameMap[this.props.selfAttendeeId]) {
            this.showCallEndedAlert();
          }
        }
      }, 5000);
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
            Alert.alert('Error', errorType);
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
    this.props.navigation.goBack();
  };

  endHangUp = async () => {
    await NativeFunction.stopMeeting();
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

  showCallEndedAlert = async () => {
    await this.endHangUp();
    Alert.alert(
      'Call Ended',
      'The call has ended as there are no other participants.',
      [
        {
          text: 'OK',
          onPress: () => {},
        },
      ],
      {cancelable: false},
    );
  };

  render() {
    const currentMuted = this.state.mutedAttendee.includes(
      this.props.selfAttendeeId,
    );

    return (
      <SafeAreaView style={styles.container}>
        <View style={[styles.container, {justifyContent: 'flex-start'}]}>
          <View
            style={[
              styles.videoContainer,
              this.state.videoTiles.length > 2 ? styles.flexDirectionRow : '',
            ]}>
            {this.state.videoTiles.length > 0 ? (
              this.state.videoTiles.map(tileId => (
                <RNVideoRenderView
                  style={
                    this.state.videoTiles.length == 1
                      ? styles.oneVideo
                      : this.state.videoTiles.length == 2
                      ? styles.twoVideo
                      : this.state.videoTiles.length == 3
                      ? styles.threeVideo
                      : this.state.videoTiles.length == 4
                      ? styles.threeVideo
                      : this.state.videoTiles.length == 5
                      ? styles.manyVideoVideo
                      : styles.manyVideo
                  }
                  key={tileId}
                  tileId={tileId}
                  mirror={this.state.isSwitchCameraActive ? false : true}
                />
              ))
            ) : (
              <Text style={styles.subtitle}>
                No one is sharing video at this moment
              </Text>
            )}
          </View>
          {!!this.state.screenShareTile && (
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
          )}

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
            {/* <ShareScreenBtn onPress={() => this.startScreenShare(true)} /> */}
            {/* <SwitchCameraButton onPress={()=> this.startScreenShare(true)} /> */}
            {/* <SwitchCameraButton onPress={this.stopScreenShare} /> */}
            <HangOffButton onPress={this.HangUp} />
          </View>

          {/* <Text style={styles.title}>Attendee</Text>
        <FlatList
          style={styles.attendeeList}
          data={this.state.attendees}
          renderItem={({item}) => (
            <GroupAttendeeItem
              attendeeName={
                attendeeNameMap[item] ? attendeeNameMap[item] : item
              }
              muted={this.state.mutedAttendee.includes(item)}
            />
          )}
          keyExtractor={item => item}
        /> */}
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
    backgroundColor: 'white',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 15,
    gap: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
  },
  viewContainer: {
    flex: 1,
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
    flex: 1,
    width: '100%',
    flexDirection: 'column',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignItems: 'top',
    width: '100%',
    height: '100%',
    minHeight: '100%',
    gap: 5,
  },
  flexDirectionRow: {
    flexDirection: 'column',
  },
  screenShare: {
    width: '90%',
    height: 400,
  },
  oneVideo: {
    width: '100%',
    height: '100%',
  },
  twoVideo: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    height: '50%',
  },
  threeVideo: {
    width: '50%',
    height: '45%',
  },
  fourVideo: {
    width: '100%',
    height: '50%',
  },
  attendeeList: {
    width: '90%',
  },
});
