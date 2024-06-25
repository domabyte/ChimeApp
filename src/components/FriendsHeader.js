import {StyleSheet, Text, TouchableOpacity, ScrollView} from 'react-native';

const FriendHeader = ({navigation, index, selectedTab, searchResult}) => {
  return (
    <>
      {searchResult && (
        <Text
          style={{
            color: 'black',
            fontSize: 20,
            fontWeight: '700',
          }}>
          {selectedTab}{' '}
          <Text style={{color: '#1866B4'}}>{searchResult.length}</Text>
        </Text>
      )}
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
            {backgroundColor: index == 0 ? '#1866B4' : '#EAEAEA'},
          ]}
          onPress={() => {
            navigation.navigate('findFriends');
          }}>
          <Text
            style={{fontWeight: '500', color: index == 0 ? 'white' : 'black'}}>
            Find Friends
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.buttons,
            {backgroundColor: index == 1 ? '#1866B4' : '#EAEAEA'},
          ]}
          onPress={() => {
            navigation.navigate('myFriends');
          }}>
          <Text
            style={{fontWeight: '500', color: index == 1 ? 'white' : 'black'}}>
            My Friends
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.buttons,
            {backgroundColor: index == 2 ? '#1866B4' : '#EAEAEA'},
          ]}
          onPress={() => {
            navigation.navigate('receivedRequest');
          }}>
          <Text
            style={{fontWeight: '500', color: index == 2 ? 'white' : 'black'}}>
            Received 
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.buttons,
            {backgroundColor: index == 3 ? '#1866B4' : '#EAEAEA'},
          ]}
          onPress={() => {
            navigation.navigate('sentRequest');
          }}>
          <Text
            style={{fontWeight: '500', color: index == 3 ? 'white' : 'black'}}>
            Sent 
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
    marginVertical: 10,
    marginRight: 10,
  },
});
export default FriendHeader;
