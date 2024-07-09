import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  TextInput,
  FlatList,
  RefreshControl,
  KeyboardAvoidingView,
  Keyboard
} from 'react-native';
import Header from '../../components/Header';
import {AuthContext} from '../../context/AuthContext';
import FriendHeader from '../../components/FriendsHeader';
const default_photo = require('../../assets/png/default-profile.png');
import Spinner from 'react-native-loading-spinner-overlay';
import {useIsFocused} from '@react-navigation/core';
import {SafeAreaView} from 'react-native-safe-area-context';
import Footer from '../../components/Footer';
import FriendShimmer from '../../Shimmer/FriendShimmer';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

const MyFriends = ({navigation}) => {
  const [myFriends, setMyFriends] = useState([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchButtonClicked, setSearchButtonClicked] = useState(false);
  const {isLoading, userInfo, getAllFriends, unFriendRequest, error, setError} =
    useContext(AuthContext);
  const [refreshing, setRefreshing] = useState(false);
  const isFocused = useIsFocused();
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);



  useEffect(() => {
    setError('');
    fetchMyFriend();
    return () => {
      setError('');
    };
  }, [isFocused]);

  useEffect(() => {
    if (searchKeyword === '') {
      handleGoBack();
    }
  }, [searchKeyword]);

  const fetchMyFriend = async () => {
    setIsInitialLoading(true);
    try {
      const response = await getAllFriends(
        userInfo.memberToken,
        userInfo.id,
        userInfo.LoginToken,
      );
      setMyFriends(response || []);
      setRefreshing(false);
    } catch (err) {
      console.log('Problem fetching MyFriend');
    } finally {
      setIsInitialLoading(false);
    }
  };

  const handleMyFriendRequest = async () => {
    try {
      if (searchKeyword) {
        const response = await getAllFriends(
          userInfo.memberToken,
          userInfo.id,
          userInfo.LoginToken,
          searchKeyword,
        );
        setSearchResults(response || []);
        setSearchButtonClicked(true);
      }
    } catch (err) {
      console.log('Error is : ', err);
    }
  };

  const handleGoBack = () => {
    setSearchKeyword('');
    setSearchButtonClicked(false);
  };

  const handleIgnore = index => {
    const newSearchResults = searchResults.filter((_, i) => i !== index);
    setSearchResults(newSearchResults);
    const newSuggestedFriendsData = myFriends.filter((_, i) => i !== index);
    setMyFriends(newSuggestedFriendsData);
  };

  const handleUnfriend = async (FriendList_Id, index) => {
    try {
      const response = await unFriendRequest(
        FriendList_Id,
        userInfo.memberToken,
        userInfo.LoginToken,
      );
      if (response) {
        handleIgnore(index);
      }
    } catch (err) {
      console.log('Error is : ', err);
    }
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true); // Keyboard is visible
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false); // Keyboard is hidden
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const renderItem = ({item, index}) => (
    <View style={styles.friendList}>
      <View style={styles.userImage}>
        <Image
          style={{width: '100%', height: '100%'}}
          source={
            item.Mem_Photo && typeof item.Mem_Photo === 'string'
              ? {uri: item.Mem_Photo}
              : default_photo
          }
        />
      </View>
      <View>
        <Text
          numberOfLines={1}
          style={{ fontSize: responsiveFontSize(2), color: 'black', fontWeight: '500', width: responsiveWidth(70) }}>
          {item.Mem_Name}
        </Text>
        <Text style={{fontSize: responsiveFontSize(1.5), color: '#1866B4', fontWeight: '500'}}>
          {item.Mem_Designation.trim() === 'Not Added'
            ? 'N/A'
            : item.Mem_Designation.trim()}
        </Text>
        <View style={styles.mutualBox}>
          <View style={{flexDirection: 'row'}}>
            <Image
              style={styles.mutualImg}
              source={require('../../assets/png/user1.png')}
            />
            <Image
              style={styles.mutualImg2nd}
              source={require('../../assets/png/user4.png')}
            />
            <Image
              style={styles.mutualImg2nd}
              source={require('../../assets/png/user2.png')}
            />
          </View>
          <Text style={{color: 'black', fontSize: responsiveFontSize(1.6)}}>
            {item.MutualFriends} mutual connections
          </Text>
        </View>
        <View style={styles.buttonArea}>
          <TouchableOpacity
            style={[styles.blueBtn, {backgroundColor: '#1e293c'}]}
            onPress={() => handleUnfriend(item?.FriendList_Id, index)}>
            <Text style={{color: 'white', fontSize: responsiveFontSize(1.6)}}>UnFriend</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.blueBtn, {backgroundColor: '#CED4DA'}]}
            onPress={() =>
              navigation.navigate('chatSection', {
                friendId: item?.Mem_ID,
                friendName: item?.Mem_Name,
                friendPhoto: item?.Mem_Photo,
              })
            }>
            <Text style={{color: 'black', fontSize: responsiveFontSize(1.6)}}>Message</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderNoResults = () => (
    <View style={styles.emptyBox}>
      <View style={styles.noResults}>
        <View>
          <Image
            style={{width: responsiveWidth(34), height: responsiveWidth(25)}}
            source={require('../../assets/png/no-post.png')}
          />
        </View>
        <View>
          <Text
            style={{
              fontSize: responsiveFontSize(2),
              width: responsiveWidth(70),
              textAlign: 'center',
              marginTop: responsiveWidth(4),
            }}>
            Here is no more member! Please wait for some days.
          </Text>
          <TouchableOpacity>
            <Text style={styles.goBackText} onPress={handleGoBack}>
              Go Back
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const handleRefresh = () => {
    setRefreshing(true);
    fetchMyFriend();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{flex: 1}}>
      <SafeAreaView style={{height: '100%'}}>
        <StatusBar barStyle={'dark-lite'} backgroundColor="#1E293C" />
        <Header navigation={navigation} />
        <View style={styles.container}>
          <Spinner visible={isLoading} />
          <View style={{marginHorizontal: 16, marginVertical: 10}}>
            <FriendHeader
              navigation={navigation}
              index={1}
              selectedTab="My Friends"
              searchResult={searchButtonClicked ? searchResults : myFriends}
            />
          </View>
          <View
            style={{
              marginHorizontal: 16,
              marginVertical: 10,
              flexDirection: 'row',
            }}>
            {searchButtonClicked && (
              <TouchableOpacity onPress={handleGoBack}>
                <Image
                  style={{width: 30, height: 30}}
                  source={require('../../assets/png/leftArrow.png')}
                />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.searchSection}>
            <TextInput
              placeholder="Search Friends"
              style={styles.searchBox}
              value={searchKeyword}
              onChangeText={text => setSearchKeyword(text)}
            />
            <TouchableOpacity
              style={styles.searchbtn}
              onPress={handleMyFriendRequest}>
              <Image
                style={{width: responsiveWidth(6), height: responsiveWidth(6)}}
                source={require('../../assets/png/search.png')}
              />
            </TouchableOpacity>
          </View>
          {isInitialLoading ? (
            <FriendShimmer />
          ) : (
            <FlatList
              data={searchButtonClicked ? searchResults : myFriends}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={handleRefresh}
                />
              }
              ListEmptyComponent={renderNoResults}
            />
          )}
        </View>
        {!isKeyboardVisible && 
          <Footer />
        }
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  searchSection: {
    marginHorizontal: 10,
    marginTop: -25,
    marginBottom: 10,
    position: 'relative',
  },
  searchBox: {
    backgroundColor: '#f4f4f4',
    borderRadius: responsiveWidth(5.5),
    height: responsiveWidth(11),
    paddingLeft: 20,
  },
  searchbtn: {
    position: 'absolute',
    top: responsiveWidth(2.6),
    right: responsiveWidth(4),
  },
  noResults: {
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  noResultsText: {
    fontSize: 18,
    color: 'black',
    marginBottom: 10,
  },
  goBackText: {
    fontSize: responsiveFontSize(2),
    color: 'blue',
    textAlign: 'center',
    marginTop: responsiveWidth(5),
  },
  userImage: {
    width: responsiveWidth(18),
    height: responsiveWidth(18),
    borderRadius: 100,
    overflow: 'hidden',
  },
  friendList: {
    flexDirection: 'row',
    gap: 15,
    marginHorizontal: responsiveWidth(4),
    marginVertical: responsiveWidth(1.2),
  },
  mutualImg: {
    width: responsiveWidth(5),
    height: responsiveWidth(5),
    borderRadius: responsiveWidth(5),
    borderWidth: 2,
    borderColor: 'white',
  },
  mutualImg2nd: {
    width: responsiveWidth(5),
    height: responsiveWidth(5),
    borderRadius: responsiveWidth(5),
    borderWidth: 2,
    borderColor: 'white',
    marginLeft: -5,
  },
  mutualBox: {
    flexDirection: 'row',
    gap: 5,
    marginTop: 0,
  },
  buttonArea: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 5,
  },
  blueBtn: {
    backgroundColor: '#1866B4',
    height: responsiveWidth(8),
    width: '42%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
  },
  FriendTex: {
    color: 'black',
    fontSize: 20,
    fontWeight: '700',
  },
  FriendText: {
    color: 'black',
    fontSize: 20,
    fontWeight: '100',
    paddingLeft: 15,
    marginBottom: 10,
  },
  emptyBox: {
    flex: 1,
    height: responsiveHeight(48),
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default MyFriends;
