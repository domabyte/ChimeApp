import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  TextInput,
  FlatList,
  SafeAreaView,
  KeyboardAvoidingView,
  Keyboard
} from 'react-native';
import Header from '../../components/Header';
import Spinner from 'react-native-loading-spinner-overlay';
import Footer from '../../components/Footer';
import { AuthContext } from '../../context/AuthContext';
import FriendHeader from '../../components/FriendsHeader';
import { useIsFocused } from '@react-navigation/core';
import FriendShimmer from '../../Shimmer/FriendShimmer';
import { responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions';
const default_photo = require('../../assets/png/default-profile.png');

const FindFriends = ({ navigation }) => {
  const [selectedItemIndex, setSelectedItemIndex] = useState([]);
  const [suggestedFriendsData, setSuggestedFriendsData] = useState([]);
  const [searchKeywords, setSearchKeywords] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchButtonClicked, setSearchButtonClicked] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  const {
    isLoading,
    setIsLoading,
    userInfo,
    searchFriends,
    sendFriendRequest,
    setError,
  } = useContext(AuthContext);

  const handleAddFriend = async (index, id) => {
    const response = await handleFriendRequest(id);
    if (response) {
      setSelectedItemIndex(prev => {
        if (prev.includes(index)) {
          return prev.filter(itemIndex => itemIndex !== index);
        } else {
          return [...prev, index];
        }
      });
      handleIgnore(index);
    }
  };

  const handleIgnore = index => {
    if (searchButtonClicked) {
      const newSearchResults = searchResults.filter((_, i) => i !== index);
      setSearchResults(newSearchResults);
    } else {
      const newSuggestedFriendsData = suggestedFriendsData.filter(
        (_, i) => i !== index,
      );
      setSuggestedFriendsData(newSuggestedFriendsData);
    }
    setSelectedItemIndex(prev => prev.filter(itemIndex => itemIndex !== index));
  };

  const isFocused = useIsFocused();
  useEffect(() => {
    setError('');
    const fetchSuggestedUsers = async () => {
      setIsInitialLoading(true);
      try {
        const result = await searchFriends(userInfo.id, 1, 20, null);
        if (result) {
          setSuggestedFriendsData(result);
        }
      } catch (err) {
        console.log('Error is : ', err);
      } finally {
        setIsInitialLoading(false);
      }
    };
    fetchSuggestedUsers();
    return () => {
      setError('');
    };
  }, [isFocused]);

  useEffect(() => {
    if (searchKeywords === '') {
      handleGoBack();
    }
  }, [searchKeywords]);

  const handleSearchKeyword = async () => {
    try {
      if (searchKeywords) {
        setIsLoading(true);
        const result = await searchFriends(userInfo.id, 1, 20, searchKeywords);
        setIsLoading(false);
        setSearchResults(result || []);
        setSearchButtonClicked(true);
      }
    } catch (err) {
      console.log('Error is : ', err);
    }
  };

  const handleFriendRequest = async id => {
    try {
      const response = await sendFriendRequest(
        id,
        userInfo.memberToken,
        userInfo.LoginToken,
      );
      return response ? true : false;
    } catch (err) {
      console.log('Error is : ', err);
    }
  };

  const handleGoBack = () => {
    setSearchKeywords('');
    setSearchButtonClicked(false);
  };

  const fetchMoreData = async () => {
    if (isLoadingMore) return;
    try {
      setIsLoadingMore(true);
      const nextPage = page + 1;
      const result = await searchFriends(
        userInfo.id,
        nextPage,
        20,
        searchKeywords || null,
      );
      if (result && result.length > 0) {
        if (searchButtonClicked) {
          setSearchResults(prevResults => [...prevResults, ...result]);
        } else {
          setSuggestedFriendsData(prevData => [...prevData, ...result]);
        }
        setPage(nextPage);
      }
    } catch (err) {
      console.log('Error fetching more data:', err);
    } finally {
      setIsLoadingMore(false);
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

  const renderFriendItem = ({ item, index }) => (
    <View key={index} style={styles.friendList}>
      <View style={styles.userImage}>
        <TouchableOpacity onPress={() => navigation.navigate('myProfile')}>
          <Image
            style={{ width: '100%', height: '100%' }}
            source={
              item.Mem_photo && typeof item.Mem_photo === 'string'
                ? { uri: item.Mem_photo }
                : default_photo
            }
          />
        </TouchableOpacity>
      </View>
      <View>
        <Text numberOfLines={1}
          style={{ fontSize: responsiveFontSize(2), color: 'black', fontWeight: '500', width: responsiveWidth(70) }}>
          {item.Mem_name}
        </Text>
        <Text
          style={{
            fontSize: responsiveFontSize(1.5),
            color: '#1866B4',
            fontWeight: '500',
          }}>
          {item.Mem_Designation.trim() === 'Not Added'
            ? 'N/A'
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
          <Text style={{ color: 'black', fontSize: responsiveFontSize(1.6) }}>
            {item.MutualFriends} mutual connections
          </Text>
        </View>
        <View style={styles.buttonArea}>
          <TouchableOpacity
            style={styles.blueBtn}
            onPress={() => handleAddFriend(index, item.Mem_ID)}>
            <Text style={{ color: 'white', fontSize: responsiveFontSize(1.6) }}>Add Friend</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.blueBtn, { backgroundColor: '#CED4DA' }]}
            onPress={() => handleIgnore(index)}>
            <Text style={{ color: 'black', fontSize: responsiveFontSize(1.6) }}>Ignore</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

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
              index={0}
              selectedTab="Find Friends"
              searchResult={
                searchButtonClicked ? searchResults : suggestedFriendsData
              }
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
              value={searchKeywords}
              style={styles.searchBox}
              onChangeText={text => setSearchKeywords(text)}
            />
            <TouchableOpacity
              style={styles.searchbtn}
              onPress={handleSearchKeyword}>
              <Image
                style={{ width: responsiveWidth(6), height: responsiveWidth(6) }}
                source={require('../../assets/png/search.png')}
              />
            </TouchableOpacity>
          </View>
          {isInitialLoading ? (
            <FriendShimmer />
          ) : (
            <FlatList
              data={searchButtonClicked ? searchResults : suggestedFriendsData}
              renderItem={renderFriendItem}
              keyExtractor={(item, index) => index.toString()}
              ListEmptyComponent={() => (
                <View style={styles.noResults}>
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignContent: 'center',
                    }}>
                    <Image
                      style={{ width: 200, height: 200 }}
                      source={require('../../assets/png/no-post.png')}
                    />
                  </View>
                  <View>
                    <Text>Here is no more member!</Text>
                    <Text>Please wait for some days.</Text>
                    <TouchableOpacity
                      onPress={() => {
                        setSearchButtonClicked(false);
                        setSearchKeywords('');
                      }}>
                      <Text style={styles.goBackText}>Go Back</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              onEndReached={fetchMoreData}
              onEndReachedThreshold={0.5}
              ListFooterComponent={() =>
                isLoadingMore && <Spinner visible={true} />
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
    borderRadius: responsiveWidth(5.5),
    height: responsiveWidth(11),
    paddingLeft: responsiveWidth(5),
    fontSize: responsiveFontSize(1.8)
  },
  searchbtn: {
    position: 'absolute',
    top: responsiveWidth(2.6),
    right: responsiveWidth(4),
  },
  userImage: {
    width: responsiveWidth(18),
    height: responsiveWidth(18),
    borderRadius: responsiveWidth(10),
    overflow: 'hidden',
  },
  noResults: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    textAlign: 'center',
    marginBottom: 20,
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
    marginHorizontal: responsiveWidth(4),
    marginVertical: responsiveWidth(1.2),
  },
  mutualImg: {
    width: responsiveWidth(5),
    height: responsiveWidth(5),
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'white',
  },
  mutualImg2nd: {
    width: responsiveWidth(5),
    height: responsiveWidth(5),
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
    height: responsiveWidth(8),
    width: '42%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: responsiveWidth(1.6),
  },
  FriendTex: {
    color: 'black',
    fontSize: 20,
    fontWeight: '700',
  },
});

export default FindFriends;
