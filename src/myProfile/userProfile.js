import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  StatusBar,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import React, {useState} from 'react';

const UserProfile = ({navigation}) => {
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
        <View style={styles.profileHead}>
          <TouchableOpacity onPress={()=> navigation.goBack()}>
            <Image
              style={styles.topIcon}
              source={require('../assets/png/leftArrow2.png')}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.profileSection}>
          <Text
            style={{
              color: 'black',
              marginVertical: 10,
              fontSize: 18,
              fontWeight: '500',
            }}>
            User Profile
          </Text>
          <View style={styles.imgBox}>
            <Image
              style={styles.userProfile}
              source={require('../assets/png/user9.png')}
            />
          </View>
          <Text numberOfLines={1} style={styles.userName}>
            Brooklyn Simmons
          </Text>
          <Text numberOfLines={1} style={styles.userTitle}>
            Developer
          </Text>
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
            <Text style={styles.counts}>35</Text>
            <Text style={styles.label}>Posts</Text>
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
        <View style={styles.followingBtnArea}>
          <TouchableOpacity
            style={[styles.followingBtn, {backgroundColor: '#1866B4'}]}>
            <Text style={{color: 'white'}}>Following</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.followingBtn,
              {borderColor: '#1866B4', borderWidth: 1},
            ]}>
            <Text style={{color: '#1866B4'}}>Message</Text>
          </TouchableOpacity>
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
    width: 340,
    textAlign: 'center',
  },
  userTitle: {
    fontSize: 14,
    color: '#1866B4',
    width: 340,
    textAlign: 'center',
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
  },
  post: {
    width: 130,
    height: 130,
    resizeMode: 'cover',
  },
  followerBox: {
    width: 100,
  },
  followingBtnArea: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  followingBtn: {
    height: 35,
    width: '45%',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
});

export default UserProfile;
