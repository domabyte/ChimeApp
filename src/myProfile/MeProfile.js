import React, {useContext, useEffect, useState} from 'react';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  StatusBar,
  ScrollView,
  Button,
  SafeAreaView,
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import {AuthContext} from '../context/AuthContext';
import Footer from '../components/Footer';
import { responsiveWidth } from 'react-native-responsive-dimensions';
const default_photo = require('../assets/png/user9.png');

const Myprofile = ({navigation}) => {
  const {isLoading, logout, userInfo} = useContext(AuthContext);
  const longText =
    'Your long paragraph goes here. Lorem ipsum dolLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate ';
  const [expanded, setExpanded] = useState(false);

  const toggleText = () => {
    setExpanded(!expanded);
  };

  return (
    <SafeAreaView style={{height:'100%'}}>
    <View style={styles.container}>
      <StatusBar barStyle={'dark-lite'} backgroundColor="#1E293C" />
      <ScrollView>
        {/* <Spinner visible={isLoading} /> */}
        <View style={styles.profileHead}>
          <TouchableOpacity onPress={()=> navigation.goBack()}>
            <Image
              style={styles.topIcon}
              source={require('../assets/png/leftArrow2.png')}
            />
          </TouchableOpacity>
          {/* <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 5,
            }}>
            <Image
              style={{width: 60, height: 30}}
              source={require('../assets/png/Actpal_logo.png')}
            />
          </View> */}
          <TouchableOpacity>
            <Image
              style={styles.topIcon}
              source={require('../assets/png/share.png')}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.profileSection}>
          <Text
            style={{
              color: 'black',
              fontSize: 18,
              marginBottom: 20,
              fontWeight: '500',
            }}>
            My Profile
          </Text>
          <View style={styles.imgBox}>
            <Image
              style={styles.userProfile}
              // source={require('../assets/png/user9.png')}
              source={
                userInfo?.memberPhoto && typeof userInfo?.memberPhoto === 'string'
                  ? {uri: userInfo?.memberPhoto}
                  : default_photo
              }
            />
          </View>
          <Text style={styles.userName}>{userInfo?.name}</Text>
          {/* <Text style={styles.userTitle}>Developer</Text> */}
          <Button title="Logout" color="red" onPress={logout} />
          <View
            style={{
              width: 280,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 5,
            }}>
            <Text
              onPress={toggleText}
              style={{color: '#696969', textAlign: 'center'}}
              numberOfLines={expanded ? undefined : 2}>
              {longText}
              {longText.length > 100 && (
                <Text style={[styles.readBtn, {color: '#1866B4'}]}>
                  {expanded ? 'Read less' : 'Read more'}
                </Text>
              )}
              
            </Text>
          </View>
        </View>
        <View style={styles.followerDetail}>
          <View style={styles.followerBox}>
            <Text style={styles.counts}>356</Text>
            <Text style={styles.label}>Post</Text>
          </View>
          <View style={styles.line}></View>
          <View style={styles.followerBox}>
            <Text style={styles.counts}>5K</Text>
            <Text style={styles.label}>Followers</Text>
          </View>
          <View style={styles.line}></View>
          <View style={styles.followerBox}>
            <Text style={styles.counts}>2K</Text>
            <Text style={styles.label}>Followings</Text>
          </View>
        </View>
        <View style={styles.posts}>
          <Image
            style={styles.post}
            source={require('../assets/png/user9.png')}
          />
          <Image
            style={styles.post}
            source={require('../assets/png/user8.png')}
          />
          <Image
            style={styles.post}
            source={require('../assets/png/user7.png')}
          />
          <Image
            style={styles.post}
            source={require('../assets/png/user6.png')}
          />
          <Image
            style={styles.post}
            source={require('../assets/png/user5.png')}
          />
          <Image
            style={styles.post}
            source={require('../assets/png/user4.png')}
          />
          <Image
            style={styles.post}
            source={require('../assets/png/user3.png')}
          />
          <Image
            style={styles.post}
            source={require('../assets/png/user2.png')}
          />
          <Image
            style={styles.post}
            source={require('../assets/png/user1.png')}
          />
          <Image
            style={styles.post}
            source={require('../assets/png/user10.png')}
          />
        </View>
      </ScrollView>
    </View>
    <Footer/>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
  topIcon: {
    width: 28,
    height: 28,
  },
  profileHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  userProfile: {
    width: '100%',
    height: '100%',
    borderRadius: 75,
    borderWidth: 8,
    borderColor: 'white',
  },
  profileSection: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  imgBox: {
    width: 130,
    height: 130,
    borderRadius: 100,
    shadowColor: '#000',
    shadowOffset: {
      width: 5,
      height: 10,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 10,
  },
  userName: {
    fontSize: 18,
    color: 'black',
    fontWeight: '500',
    marginTop: 10,
  },
  userTitle: {
    fontSize: 14,
    color: '#1866B4',
  },
  followerDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  counts: {
    color: 'black',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '500',
  },
  label: {
    color: 'black',
    textAlign: 'center',
  },
  line: {
    height: 60,
    width: 1,
    backgroundColor: '#B4B4B4',
  },
  posts: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  post: {
    width: responsiveWidth(33.3),
    height: responsiveWidth(33),
    resizeMode: 'cover',
  },
  followerBox: {
    width: 100,
  },
  sendBtn: {
    backgroundColor: '#1866B4',
    width: 80,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    margin: 20,
  },
});

export default Myprofile;
