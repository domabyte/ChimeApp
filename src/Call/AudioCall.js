import React, {useEffect, useState, useContext} from 'react';
import {
  SafeAreaView,
  StatusBar,
  Alert,
  ActivityIndicator,
  View,
} from 'react-native';
import {AudioMeeting} from '../Meetings/AudioMeeting';
import {AuthContext} from '../context/AuthContext';
import {createMeetingRequest} from '../utils/Api';
import {
  getSDKEventEmitter,
  MobileSDKEvent,
  NativeFunction,
} from '../utils/Bridge';
import axios from 'axios';
import configURL from '../config/config';

const AudioCall = ({navigation, route}) => {
  const [isInMeeting, setIsInMeeting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [meetingTitle, setMeetingTitle] = useState('');
  const [selfAttendeeId, setSelfAttendeeId] = useState('');
  const {meetingName, fcmToken} = route.params;
  const {userInfo, doWebCall} = useContext(AuthContext);

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

    initializeMeetingSession(meetingName, userInfo?.id);

    return () => {
      onMeetingStartSubscription.remove();
      onMeetingEndSubscription.remove();
      onErrorSubscription.remove();
    };
  }, [route.params]);

  const initializeMeetingSession = async (meetingName, userName) => {
    setIsLoading(true);
    await createMeetingRequest(meetingName, userName)
      .then(async meetingResponse => {
        setMeetingTitle(meetingName);
        setSelfAttendeeId(
          meetingResponse.JoinInfo.Attendee.Attendee.AttendeeId,
        );
        NativeFunction.startMeeting(
          meetingResponse.JoinInfo.Meeting.Meeting,
          meetingResponse.JoinInfo.Attendee.Attendee,
        );
        await doWebCall(
          userInfo?.memberToken,
          meetingResponse?.JoinInfo.Meeting.Meeting?.MeetingId,
          'Sonam Sharma',
          1216,
          false,
          'audio',
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

  const endCall = async () => {
    try {
      await axios.post(configURL.endCallURL, {
        token: fcmToken,
        callId: meetingName,
      });
    } catch (err) {
      console.log('Error ending the call ', err);
    }
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
          <AudioMeeting
            meetingTitle={meetingTitle}
            selfAttendeeId={selfAttendeeId}
            endCall={endCall}
            navigation={navigation}
          />
        )}
      </SafeAreaView>
    </>
  );
};

export default AudioCall;
