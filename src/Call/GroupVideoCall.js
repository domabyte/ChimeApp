import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StatusBar,
  Alert,
  ActivityIndicator,
  View,
} from 'react-native';
import {GroupVideoMeeting} from '../Meetings/GroupVideoMeeting';
import {createMeetingRequest} from '../utils/Api';
import {
  getSDKEventEmitter,
  MobileSDKEvent,
  NativeFunction,
} from '../utils/Bridge';

const GroupVideoCall = ({navigation, route}) => {
  const [isInMeeting, setIsInMeeting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [meetingTitle, setMeetingTitle] = useState('');
  const [selfAttendeeId, setSelfAttendeeId] = useState('');
  const {meetingName, userName} = route.params;

  useEffect(() => {
    const onMeetingStartSubscription = getSDKEventEmitter().addListener(
      MobileSDKEvent.OnMeetingStart,
      () => {
        setIsInMeeting(true);
        setIsLoading(false);
      },
    );

    const onMeetingEndSubscription = getSDKEventEmitter().addListener(
      MobileSDKEvent.OnMeetingEnd,
      () => {
        setIsInMeeting(false);
        setIsLoading(false);
      },
    );

    const onErrorSubscription = getSDKEventEmitter().addListener(
      MobileSDKEvent.OnError,
      message => {
        Alert.alert('SDK Error', message);
        setIsLoading(false);
      },
    );

    initializeMeetingSession(meetingName, userName);

    return () => {
      onMeetingStartSubscription.remove();
      onMeetingEndSubscription.remove();
      onErrorSubscription.remove();
    };
  }, [route.params]);

  const initializeMeetingSession = async (meetingName, userName) => {
    setIsLoading(true);
    await createMeetingRequest(meetingName, userName)
      .then(meetingResponse => {
        setMeetingTitle(meetingName);
        setSelfAttendeeId(
          meetingResponse.JoinInfo.Attendee.Attendee.AttendeeId,
        );
        NativeFunction.startMeeting(
          meetingResponse.JoinInfo.Meeting.Meeting,
          meetingResponse.JoinInfo.Attendee.Attendee,
        );
      })
      .catch(error => {
        Alert.alert(
          'Unable to find meeting',
          `There was an issue finding that meeting. The meeting may have already ended, or your authorization may have expired.\n ${error}`,
        );
        setIsLoading(false);
        navigation.goBack();
      });
  };

  return (
    <>
      <StatusBar />
      <SafeAreaView>
        {isLoading && (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        )}
        {isInMeeting && !isLoading && (
          <GroupVideoMeeting
            meetingTitle={meetingTitle}
            userName={userName}
            selfAttendeeId={selfAttendeeId}
            navigation={navigation}
          />
        )}
      </SafeAreaView>
    </>
  );
};

export default GroupVideoCall;
