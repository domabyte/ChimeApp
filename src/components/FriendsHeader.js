import { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { AuthContext } from '../../context/AuthContext';

const FriendHeader = ({ navigation , index }) => {
  return (
    <>
      <Text
        style={{
          color: 'black',
          fontSize: 20,
          fontWeight: '700',
        }}>
        My Friends
      </Text>
      <ScrollView
        horizontal
        style={{
          flexDirection: 'row',
          borderBottomColor: '#ddd',
          maxHeight: 50,
          borderBottomWidth: 1,
        }}>

        <TouchableOpacity
          style={[
            styles.buttons,
            { backgroundColor: index == 0 ? '#1866B4' : '#EAEAEA' },
          ]}
          onPress={() => {navigation.navigate('myFriends')}}>
          <Text
            style={{ fontWeight: '500', color: index == 0 ? 'white' : 'black' }}>
            All Members
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.buttons,
            { backgroundColor: index == 1 ? '#1866B4' : '#EAEAEA' },
          ]}
          onPress={() =>{navigation.navigate('receivedRequest')}}>
          <Text
            style={{ fontWeight: '500', color: index == 1 ? 'white' : 'black' }}>
            Received Request
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.buttons,
            { backgroundColor: index == 2 ? '#1866B4' : '#EAEAEA' },
          ]}
          onPress={() =>{navigation.navigate('sentRequest')}}>
          <Text
            style={{ fontWeight: '500', color: index == 2 ? 'white' : 'black' }}>
            Send Request
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  buttons: {
    backgroundColor: '#EAEAEA',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginLeft: 10,
    marginVertical: 10,
  },
});
export default FriendHeader;
