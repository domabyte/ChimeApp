import React from 'react';
import {
  View,
  Text,
  FlatList,
  Alert,
  StyleSheet,
  BackHandler,
} from 'react-native';
import {
  NativeFunction,
  getSDKEventEmitter,
  MobileSDKEvent,
  MeetingError,
} from '../utils/Bridge';
import {MuteButton} from '../MeetingUtils/MuteButton';
import {HangOffButton} from '../MeetingUtils/HangOffButton';
import {AttendeeItem} from '../MeetingUtils/AttendeeItem';
import {SwitchMicrophoneToSpeakerButton} from '../MeetingUtils/SwitchMicrophoneToSpeakerButton';
import Sound from 'react-native-sound';
const ringtone = require('../assets/audio/ringtone.mp3');

const attendeeNameMap = {};
Sound.setCategory('Playback', true);

export class AudioMeeting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      attendees: [],
      mutedAttendee: [],
      meetingTitle: props.meetingTitle || '',
      isMeetingActive: false,
      meetingDuration: 0,
      isSpeakerActive: false,
      startTime: null,
    };
    this.sound = null;
    this.timer = null;
    this.meetingTimer = null;
  }

  componentDidMount() {
    this.setupEventListeners();
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
      this.setState({isMeetingActive: true, startTime: Date.now()}, () => {
        this.startMeetingTimer();
      });
      try {
        this.sound.release();
      } catch (err) {
        console.log('Cannot stop the sound file ', err);
      }
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
    } else if (
      this.state.attendees.length < 2 &&
      prevState.attendees.length >= 2
    ) {
      this.setState({isMeetingActive: false});
      this.stopMeetingTimer();
      this.HangUp();
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
    if (this.meetingTimer) {
      clearTimeout(this.meetingTimer);
      this.meetingTimer = null;
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
        Alert.alert('Error', `${errorType}. Something is wrong. Please try again`);
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

  startMeetingTimer = () => {
    this.meetingTimer = setInterval(() => {
      this.setState({meetingDuration: Date.now() - this.state.startTime});
    }, 1000);
  };

  stopMeetingTimer = () => {
    if (this.meetingTimer) {
      clearInterval(this.meetingTimer);
      this.meetingTimer = null;
    }
  };

  formatDuration = milliseconds => {
    if (!milliseconds || milliseconds < 0) return '00:00:00';

    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      seconds.toString().padStart(2, '0'),
    ].join(':');
  };

  render() {
    const {selfAttendeeId} = this.props;
    const currentMuted = this.state.mutedAttendee.includes(selfAttendeeId);
    const meetingDuration = this.formatDuration(this.state.meetingDuration);

    return (
      <View style={[styles.container, {justifyContent: 'flex-start'}]}>
        <FlatList
          style={styles.attendeeList}
          data={this.state.attendees}
          renderItem={({item}) => (
            <AttendeeItem
              attendeeName={attendeeNameMap[item] || item}
              muted={this.state.mutedAttendee.includes(item)}
              meetingDuration={meetingDuration}
            />
          )}
          keyExtractor={item => item}
        />
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
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    backgroundColor: 'white',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    marginBottom: 15,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    marginTop: 50,
  },
  title1: {
    fontSize: 30,
    fontWeight: '500',
    marginTop: 30,
  },
  attendeeList: {
    flex: 1,
    width: '80%',
    marginTop: 30,
  },
  attendeeContainer: {
    fontSize: 20,
    margin: 5,
    padding: 5,
    height: 30,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  attendeeMuteImage: {
    resizeMode: 'contain',
    width: 20,
    height: 20,
  },
});
