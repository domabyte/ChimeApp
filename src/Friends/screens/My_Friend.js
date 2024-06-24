import React, { useState, useEffect, useContext } from 'react';
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
} from 'react-native';
import Header from '../../components/Header';
import { AuthContext } from '../../context/AuthContext';
import FriendHeader from '../../components/FriendsHeader';
const default_photo = require('../../assets/png/default-profile.png');
import Spinner from 'react-native-loading-spinner-overlay';
import { useIsFocused } from '@react-navigation/core';
import { SafeAreaView } from 'react-native-safe-area-context';
import Footer from '../../components/Footer';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';

const MyFriends = ({ navigation }) => {
  const [myFriends, setMyFriends] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchButtonClicked, setSearchButtonClicked] = useState(false);
  const { isLoading, userInfo, getAllFriends, unFriendRequest, error, setError } =
    useContext(AuthContext);
  const [refreshing, setRefreshing] = useState(false);
  const isFocused = useIsFocused();

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
          ellipsizeMode="tail"
          style={{ fontSize: 18, color: 'black', fontWeight: '500' }}>
          {item.Mem_Name}
        </Text>
        <Text style={{ fontSize: 12, color: '#1866B4', fontWeight: '500' }}>
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
            style={[styles.blueBtn, { backgroundColor: '#1e293c' }]}
            onPress={() => handleUnfriend(item?.FriendList_Id, index)}>
            <Text style={{ color: 'white' }}>UnFriend</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.blueBtn, { backgroundColor: '#CED4DA' }]}
            onPress={() =>
              navigation.navigate('chatSection', {
                friendId: item?.Mem_ID,
                friendName: item?.Mem_Name,
                friendPhoto: item?.Mem_Photo,
              })
            }>
            <Text style={{ color: 'black' }}>Message</Text>
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
            style={{ width: responsiveWidth(34), height: responsiveWidth(25) }}
            source={require('../../assets/png/no-post.png')}
          />
        </View>
        <View>
          <Text style={{ fontSize: responsiveFontSize(2), width: responsiveWidth(70), textAlign: 'center', marginTop: responsiveWidth(4) }}>Here is no more member! Please wait for some days.</Text>
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
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ height: '100%' }}>
        <StatusBar barStyle={'dark-lite'} backgroundColor="#1E293C" />
        <Header navigation={navigation} />
        <View style={styles.container}>
          <Spinner visible={isLoading} />
          <View style={{ marginHorizontal: 16, marginVertical: 10 }}>
            <FriendHeader navigation={navigation} index={0} />
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
                  style={{ width: 30, height: 30 }}
                  source={require('../../assets/png/leftArrow.png')}
                />
              </TouchableOpacity>
            )}
            <Text style={styles.FriendTex}>
              {' '}
              Friends{' '}
              <Text style={{ color: '#1866B4' }}>
                {searchButtonClicked ? searchResults.length : myFriends.length}
              </Text>
            </Text>
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
                style={{ width: 24, height: 24 }}
                source={require('../../assets/png/search.png')}
              />
            </TouchableOpacity>
          </View>
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
        </View>
        <Footer />
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
  userImage: {
    width: 100,
    height: 100,
    borderRadius: 100,
    overflow: 'hidden',
  },
  friendList: {
    flexDirection: 'row',
    gap: 15,
    paddingHorizontal: 10,
    marginVertical: 6,
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
    marginTop: 5,
  },
  buttonArea: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 5,
  },
  blueBtn: {
    backgroundColor: '#1866B4',
    height: 34,
    width: '40%',
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
    justifyContent: 'center'
  }
});

export default MyFriends;
