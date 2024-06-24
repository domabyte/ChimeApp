import React, {useContext, useState, useEffect} from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import {AuthContext} from '../context/AuthContext';
import {responsiveWidth} from 'react-native-responsive-dimensions';

let mutedImg = require('../assets/png/microphone-muted.png');

export const AttendeeItem = ({attendeeName, muted, meetingDuration}) => {
  const {getUserInfo, userInfo} = useContext(AuthContext);
  const [photoUrl, setPhotoUrl] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    const fetchPhoto = async () => {
      const result = await getUserInfo(
        userInfo?.memberToken,
        userInfo?.LoginToken,
        attendeeName,
      );
      if (result?.Mem_ID !== userInfo?.id) {
        setPhotoUrl(result?.Mem_Photo);
      }
      setName(result?.Mem_Name + result?.Mem_LName);
    };

    fetchPhoto();
  }, []);

  return (
    <View style={[styles.attendeeContainer]}>
      {photoUrl && (
        <>
          <Image source={{uri: photoUrl}} style={styles.attendeePhoto} />
          <Text style={styles.attendeeName}>{name}</Text>
          <Text style={styles.attendeeName}>{meetingDuration}</Text>
        </>
      )}
      {muted && <Image source={mutedImg} style={styles.attendeeMuteImage} />}
    </View>
  );
};

const styles = StyleSheet.create({
  attendeeContainer: {
    width: '100%',
    marginTop: responsiveWidth(20),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  attendeeName: {
    flex: 1,
    fontSize: 20,
    fontWeight: '500',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 10,
  },
  attendeePhoto: {
    width: 100,
    height: 100,
    borderRadius: 200,
    marginBottom: 10,
  },
  attendeeMuteImage: {
    resizeMode: 'contain',
    width: 20,
    height: 20,
  },
});
