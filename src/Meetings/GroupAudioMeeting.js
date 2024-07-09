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
import {MuteButton} from '../MeetingUtils/MuteButton';
import {HangOffButton} from '../MeetingUtils/HangOffButton';
import {GroupAttendeeItem} from '../MeetingUtils/GroupAttendeeItem';
import {SwitchMicrophoneToSpeakerButton} from '../MeetingUtils/SwitchMicrophoneToSpeakerButton';
const ringtone = require('../assets/audio/ringtone.mp3');

const attendeeNameMap = {};
export class GroupAudioMeeting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      attendees: [],
      mutedAttendee: [],
      meetingTitle: props.meetingTitle || '',
      isMeetingActive: false,
      meetingDuration: 0,
      isSpeakerActive: false,
    };
    this.timer = null;
    this.meetingTimer = null;
    this.startTime = null;
  }

  componentDidMount() {
    this.setupEventListeners();
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
      this.handleAttendeeJoin,
    );

    this.onAttendeesLeaveSubscription = getSDKEventEmitter().addListener(
      MobileSDKEvent.OnAttendeesLeave,
      this.handleAttendeeLeave,
    );

    this.onAttendeesMuteSubscription = getSDKEventEmitter().addListener(
      MobileSDKEvent.OnAttendeesMute,
      this.handleAttendeeMute,
    );

    this.onAttendeesUnmuteSubscription = getSDKEventEmitter().addListener(
      MobileSDKEvent.OnAttendeesUnmute,
      this.handleAttendeeUnmute,
    );

    this.onDataMessageReceivedSubscription = getSDKEventEmitter().addListener(
      MobileSDKEvent.OnDataMessageReceive,
      this.handleDataMessage,
    );

    this.onErrorSubscription = getSDKEventEmitter().addListener(
      MobileSDKEvent.OnError,
      this.handleError,
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
    if (this.onDataMessageReceivedSubscription) {
      this.onDataMessageReceivedSubscription.remove();
    }
    if (this.onErrorSubscription) {
      this.onErrorSubscription.remove();
    }
  };

  handleAttendeeJoin = ({attendeeId, externalUserId}) => {
    console.log(`Attendee joined: ${attendeeId}, ${externalUserId}`);
    if (!(attendeeId in attendeeNameMap)) {
      attendeeNameMap[attendeeId] = externalUserId.split('#')[1];
    }
    if (!this.state.attendees.includes(attendeeId)) {
      this.setState(prevState => ({
        attendees: [...prevState.attendees, attendeeId],
      }));
    }
  };

  handleAttendeeLeave = ({attendeeId}) => {
    console.log(`Attendee left: ${attendeeId}`);
    this.setState(prevState => ({
      attendees: prevState.attendees.filter(
        attendeeToCompare => attendeeId !== attendeeToCompare,
      ),
    }));
  };

  handleAttendeeMute = attendeeId => {
    console.log(`Attendee muted: ${attendeeId}`);
    this.setState(prevState => ({
      mutedAttendee: [...prevState.mutedAttendee, attendeeId],
    }));
  };

  handleAttendeeUnmute = attendeeId => {
    console.log(`Attendee unmuted: ${attendeeId}`);
    this.setState(prevState => ({
      mutedAttendee: prevState.mutedAttendee.filter(
        attendeeToCompare => attendeeId !== attendeeToCompare,
      ),
    }));
  };

  handleDataMessage = dataMessage => {
    console.log(`Data message received: ${JSON.stringify(dataMessage)}`);
    const str = `Received Data message (topic: ${dataMessage.topic}) ${dataMessage.data} from ${dataMessage.senderAttendeeId}:${dataMessage.senderExternalUserId} at ${dataMessage.timestampMs} throttled: ${dataMessage.throttled}`;
    NativeFunction.sendDataMessage(dataMessage.topic, str, 1000);
  };

  handleError = errorType => {
    console.error(`Error received: ${errorType}`);
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
    const {selfAttendeeId} = this.props;
    const currentMuted = this.state.mutedAttendee.includes(selfAttendeeId);
    return (
      <SafeAreaView style={styles.container}>
      <View style={[styles.container, {justifyContent: 'flex-start'}]}>
        <View
          style={[
            styles.videoContainer,
            this.state.attendees.length > 2 ? styles.flexDirectionRow : '',
          ]}>
          {/* <FlatList
          data={this.state.attendees}
          renderItem={({item}) => (
            <GroupAttendeeItem
              attendeeName={attendeeNameMap[item] || item}
              muted={this.state.mutedAttendee.includes(item)}
            />
          )}
          keyExtractor={item => item}
        /> */}
          {this.state.attendees.length > 0 &&
            this.state.attendees.map((item, index) => (
              <View style={
                this.state.attendees.length == 1
                  ? styles.oneVideo
                  : this.state.attendees.length == 2
                  ? styles.twoVideo
                  : this.state.attendees.length == 3
                  ? styles.threeVideo
                  : this.state.attendees.length == 4
                  ? styles.threeVideo
                  : this.state.attendees.length == 5
                  ? styles.manyVideoVideo
                  : styles.manyVideo
              }>
              <GroupAttendeeItem
                key={index}
                attendeeName={attendeeNameMap[item] || item}
                muted={this.state.mutedAttendee.includes(item)}
              />
              </View>
            ))}
        </View>
        <View style={styles.buttonContainer}>
          <MuteButton
            muted={currentMuted}
            onPress={() => NativeFunction.setMute(!currentMuted)}
          />
          <SwitchMicrophoneToSpeakerButton
            onPress={this.switchMicrophoneToSpeaker}
            isSpeakerActive={this.state.isSpeakerActive}
          />
          <HangOffButton onPress={this.HangUp} />
        </View>
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
    width: '70%',
  },

  screenShare: {
    width: '90%',
    margin: '1%',
    aspectRatio: 16 / 9,
  },

  attendeeMuteImage: {
    resizeMode: 'contain',
    width: 20,
    height: 20,
  },
  ringingText: {
    alignContent: 'center',
    textAlign: 'center',
    justifyContent: 'center',
  },
  inputBox: {
    height: 40,
    borderColor: 'black',
    borderWidth: 1,
    margin: 5,
    width: '50%',
    padding: 10,
    color: 'black',
  },
  meetingButton: {
    resizeMode: 'contain',
    width: 50,
    height: 50,
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
  oneVideo: {
    width: '100%',
    height: '100%',
  },
  twoVideo: {
    flex: 1,
    
    flexDirection: 'row',
    width: '100%',
    height: '40%',
  },
  threeVideo: {
    marginTop:'2%',
    width: '50%',
    height: '45%',
  },
  fourVideo: {
    width: '100%',
    height: '50%',
  },
});
