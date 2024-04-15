import {useState} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {AuthContext} from '../../context/AuthContext';

const FriendHeader = ({navigation}) => {
  const [isSelect, setisSelect] = useState(0);

  return (
    <View
      style={{
        flexDirection: 'row',
        gap: 10,
        borderBottomColor: '#ddd',
        borderBottomWidth: 1,
      }}>
      <Text
        style={{
          color: 'black',
          fontSize: 20,
          fontWeight: '700',
        }}>
        My Friends
      </Text>
      <TouchableOpacity
        style={[
          styles.buttons,
          {backgroundColor: isSelect == 0 ? '#1866B4' : '#EAEAEA'},
        ]}
        // onPress={() => setisSelect(0)}
        onPress={() => navigation.navigate('myFriends')}>
        <Text
          style={{fontWeight: '500', color: isSelect == 0 ? 'white' : 'black'}}>
          All Members
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.buttons,
          {backgroundColor: isSelect == 1 ? '#1866B4' : '#EAEAEA'},
        ]}
        onPress={() => navigation.navigate('receivedRequest')}>
        <Text
          style={{fontWeight: '500', color: isSelect == 0 ? 'white' : 'black'}}>
          Received Request
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.buttons,
          {backgroundColor: isSelect == 2 ? '#1866B4' : '#EAEAEA'},
        ]}
        onPress={() => navigation.navigate('sentRequest')}>
        <Text
          style={{fontWeight: '500', color: isSelect == 0 ? 'white' : 'black'}}>
          Send Request
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  buttons: {
    backgroundColor: '#EAEAEA',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginVertical: 12,
  },
});
export default FriendHeader;
