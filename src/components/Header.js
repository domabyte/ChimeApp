import {useState, useContext} from 'react';
import {Image, StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {AuthContext} from '../context/AuthContext';
const default_photo = require('../assets/png/default-profile.png');

const Header = ({navigation}) => {
  const [selectTab, setselectTab] = useState(0);
  const {userInfo} =
  useContext(AuthContext);
  return (
    <>
      <View style={styles.Bottomheader}>
        <View style={styles.logo}>
          <Image
            style={{width: 50, height: 28}}
            source={require('../assets/png/WhiteLogo.png')}
          />
          <Text style={{fontSize: 18, fontWeight: '500', color: 'white'}}>
            Actpal
          </Text>
        </View>
        <View style={styles.BottomheaderArea}>
          <TouchableOpacity
            style={[
              styles.icon2,
              {backgroundColor: selectTab == 0 ? '#192334' : '#1E293C'},
            ]}
            onPress={() => {
              setselectTab(0);
              navigation.navigate('allMessages')
            }}>
            <Image
              style={{width: 22, height: 22}}
              source={require('../assets/png/message.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.icon2,
              {backgroundColor: selectTab == 1 ? '#192334' : '#1E293C'},
            ]}
            onPress={() => {
              setselectTab(1);
              navigation.navigate('findFriends');
            }}>
            <Image
              style={{width: 22, height: 22}}
              source={require('../assets/png/FindFriend.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.icon2,
              {backgroundColor: selectTab == 2 ? '#192334' : '#1E293C'},
            ]}
            onPress={() => {
              setselectTab(2);
              navigation.navigate('myFriends');
            }}>
            <Image
              style={{width: 22, height: 22}}
              source={require('../assets/png/my-friend.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.profile}
            onPress={() => navigation.navigate('myProfile')}>
            <Image
              style={{width: '100%', height: '100%'}}
              source={
                userInfo.memberPhoto && typeof userInfo.memberPhoto === 'string'
                ? {uri: userInfo.memberPhoto}
                : default_photo
              }
              />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#1E293C',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  logo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  leftHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  icon: {
    width: 30,
    height: 30,
  },
  reword: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#192334',
    borderRadius: 50,
  },
  Bottomheader: {
    backgroundColor: '#1E293C',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  icon2: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
  },
  profile: {
    width: 40,
    height: 40,
    borderRadius: 50,
    overflow: 'hidden',
    marginRight: 10,
  },
  BottomheaderArea: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
});

export default Header;
