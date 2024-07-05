import React, { useEffect, useState, useContext } from 'react';
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
  SafeAreaView,
  KeyboardAvoidingView,
  Keyboard
} from 'react-native';
import Header from '../../components/Header';
import Spinner from 'react-native-loading-spinner-overlay';
import { AuthContext } from '../../context/AuthContext';
import FriendHeader from '../../components/FriendsHeader';
import { useIsFocused } from '@react-navigation/core';
import FriendShimmer from '../../Shimmer/FriendShimmer';
import Footer from '../../components/Footer';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
const default_photo = require('../../assets/png/default-profile.png');

const SentRequest = ({ navigation }) => {
  const [sentRequest, setSentRequest] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchButtonClicked, setSearchButtonClicked] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  const {
    isLoading,
    userInfo,
    getSentFriendRequest,
    cancelFriendRequest,
    error,
    setError,
  } = useContext(AuthContext);
  const [refreshing, setRefreshing] = useState(false);
  const isFocused = useIsFocused();

  const fetchSentFriendRequest = async () => {
    setIsInitialLoading(true);
    try {
      const response = await getSentFriendRequest(
        userInfo.memberToken,
        userInfo.id,
        userInfo.LoginToken,
        (keywords = null),
      );
      if (response) {
        setSentRequest(response);
        setRefreshing(false);
      }
    } catch (err) {
      console.log('Problem fetching sent friend', err);
    } finally {
      setIsInitialLoading(false);
    }
  };
  useEffect(() => {
    setError('');
    fetchSentFriendRequest();
    return () => {
      setError('');
    };
  }, [isFocused]);

  useEffect(() => {
    if (searchKeyword === '') {
      handleGoBack();
    }
  }, [searchKeyword]);

  const handleCancelFriendRequest = async (FriendList_Id, index) => {
    try {
      const response = await cancelFriendRequest(
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

  const handleIgnore = index => {
    const newSearchResults = searchResults.filter((_, i) => i !== index);
    setSearchResults(newSearchResults);
    const newSuggestedFriendsData = sentRequest.filter((_, i) => i !== index);
    setSentRequest(newSuggestedFriendsData);
  };

  const handleGoBack = () => {
    setSearchKeyword('');
    setSearchButtonClicked(false);
  };

  const handleFriendRequest = async () => {
    try {
      if (searchKeyword) {
        const response = await getSentFriendRequest(
          userInfo.memberToken,
          userInfo.id,
          userInfo.LoginToken,
          (keywords = searchKeyword),
        );
        setSearchResults(response || []);
        setSearchButtonClicked(true);
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

  const renderItem = ({ item, index }) => (
    <View style={styles.friendList}>
      <View style={styles.userImage}>
        <Image
          style={{ width: '100%', height: '100%' }}
          source={
            item.Mem_Photo && typeof item.Mem_Photo === 'string'
              ? { uri: item.Mem_Photo }
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
        <Text
          style={{
            fontSize: 12,
            color: '#1866B4',
            fontWeight: '500',
          }}>
          {item.Mem_Designation.trim() === 'Not Added'
            ? ''
            : item.Mem_Designation.trim()}
        </Text>
        <View style={styles.mutualBox}>
          <View style={{ flexDirection: 'row' }}>
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
          <Text style={{ color: 'black' }}>
            {item.MutualFriends} mutual connections
          </Text>
        </View>
        <View style={styles.buttonArea}>
          <TouchableOpacity
            style={[styles.blueBtn, { backgroundColor: '#CED4DA' }]}
            onPress={() =>
              handleCancelFriendRequest(item?.FriendList_Id, index)
            }>
            <Text style={{ color: 'black' }}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.blueBtn, { backgroundColor: '#1e293c' }]}>
            <Text style={{ color: 'white' }}>View Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const handleRefresh = () => {
    setRefreshing(true);
    fetchSentFriendRequest();
  };

  return (
    <KeyboardAvoidingView>
      <SafeAreaView style={{ height: '100%' }}>
        <StatusBar barStyle={'dark-lite'} backgroundColor="#1E293C" />
        <Header navigation={navigation} />
        <View style={styles.container}>
          <Spinner visible={isLoading} />
          <View
            style={{
              marginHorizontal: 16,
              marginVertical: 10,
            }}>
            <FriendHeader
              navigation={navigation}
              index={3}
              selectedTab="Sent"
              searchResult={searchButtonClicked ? searchResults : sentRequest}
            />
            {searchButtonClicked && (
              <TouchableOpacity onPress={handleGoBack}>
                <Image
                  style={{ width: 30, height: 30 }}
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
              onPress={handleFriendRequest}>
              <Image
                style={{ width: 24, height: 24 }}
                source={require('../../assets/png/search.png')}
              />
            </TouchableOpacity>
          </View>
          {isInitialLoading ? (
            <FriendShimmer />
          ) : (
            <FlatList
              data={searchButtonClicked ? searchResults : sentRequest}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={handleRefresh}
                />
              }
              ListEmptyComponent={
                <View style={styles.emptyBox}>
                  <View style={styles.noResults}>
                    <View>
                      <Image
                        style={{
                          width: responsiveWidth(34),
                          height: responsiveWidth(25),
                        }}
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
              }
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
    marginBottom: 10,
    marginTop: -5,
    position: 'relative',
  },
  searchBox: {
    backgroundColor: '#f4f4f4',
    borderRadius: 50,
    height: 45,
    paddingLeft: 20,
  },
  searchbtn: {
    position: 'absolute',
    top: 10,
    right: 15,
  },
  userImage: {
    width: responsiveWidth(18),
    height: responsiveWidth(18),
    borderRadius: 100,
    overflow: 'hidden',
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
    fontSize: 18,
    color: 'blue',
    textAlign: 'center',
    marginTop: 20,
  },
  friendList: {
    flexDirection: 'row',
    gap: 15,
    paddingHorizontal: 10,
    marginVertical: 6,
    marginBottom: 10,
  },
  mutualImg: {
    width: 20,
    height: 20,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'white',
  },
  mutualImg2nd: {
    width: 20,
    height: 20,
    borderRadius: 20,
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
    height: 34,
    width: '42%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
  },
  FriendTex: {
    color: 'black',
    fontSize: 20,
    fontWeight: '700',
    paddingTop: 10,
  },
  buttons: {
    backgroundColor: '#EAEAEA',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginVertical: 12,
  },
  emptyBox: {
    flex: 1,
    height: responsiveHeight(48),
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SentRequest;
