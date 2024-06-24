import {useState, useContext} from 'react';
import {Image, StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {AuthContext} from '../context/AuthContext';
import { responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions';
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
            style={{width: responsiveWidth(13), height: responsiveWidth(8)}}
            source={require('../assets/png/WhiteLogo.png')}
          />
        </View>
        <View style={styles.BottomheaderArea}>
          {/* <TouchableOpacity
            style={[
              styles.icon2,
            ]}
            onPress={() => {
              setselectTab(0);
              navigation.navigate('allMessages')
            }}>
            <View style={styles.ActivePoint}></View>
            <Image
              style={styles.icon}
              source={require('../assets/png/notificationIcon.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.icon2,
            ]}
            onPress={() => {
              setselectTab(1);
              navigation.navigate('findFriends');
            }}>
            <View style={styles.ActivePoint}></View>
            <Image
              style={styles.icon}
              source={require('../assets/png/cartIcon.png')}
            />
          </TouchableOpacity> */}
          <TouchableOpacity
            style={[
              styles.icon2,
            ]}
            onPress={() => {
              setselectTab(2);
              navigation.navigate('myFriends');
            }}>
            <Image
              style={styles.icon}
              source={require('../assets/png/search2.png')}
            />
          </TouchableOpacity>
          {/* <TouchableOpacity style={styles.reword}>
            <Image style={{width: responsiveWidth(5), height: responsiveWidth(5)}} source={require('../assets/png/reword.png')}/>
            <Text style={{fontSize: responsiveFontSize(1.8), color: '#fff'}}>0.00</Text>
          </TouchableOpacity> */}
          {/* <TouchableOpacity
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
          </TouchableOpacity> */}
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
    width: responsiveWidth(6), 
    height: responsiveWidth(6)
  },
  reword: {
    flexDirection: 'row', 
    gap: responsiveWidth(1), 
    backgroundColor: '#293446', 
    height: responsiveWidth(9), 
    paddingHorizontal: responsiveWidth(3), 
    borderRadius: responsiveWidth(10), 
    alignItems: 'center'
  },
  Bottomheader: {
    backgroundColor: '#1E293C',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: responsiveWidth(3),
    paddingVertical: responsiveWidth(3),
  },
  icon2: {
    width: responsiveWidth(9),
    height: responsiveWidth(9),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: responsiveWidth(5),
    position: 'relative',
    backgroundColor: '#293446'
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
    gap: responsiveWidth(2),
  },
  ActivePoint: {
    width: responsiveWidth(2.5),
    height: responsiveWidth(2.5),
    backgroundColor: '#FB3748',
    borderRadius: responsiveWidth(5),
    position: 'absolute',
    top: responsiveWidth(0),
    right: responsiveWidth(0)
  }
});

export default Header;
