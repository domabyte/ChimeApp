import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  StatusBar,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
  Text,
  FlatList,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import Header from '../components/Header';
import {AuthContext} from '../context/AuthContext';
import {formatDateString} from '../utils/helper';
import { useIsFocused } from '@react-navigation/core';

const default_photo = require('../assets/png/default-profile.png');

const AllMessages = ({navigation}) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [friendList, setFriendList] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchButtonClicked, setSearchButtonClicked] = useState(false);
  const [groupSearchKeyword, setGroupSearchKeyword] = useState('');
  const [groupSearchResults, setGroupSearchResults] = useState([]);
  const [groupSearchBtnClicked, setGroupSearchBtnClicked] = useState(false);
  const {isLoading, userInfo, messageFriends, error, setError} =
    useContext(AuthContext);
  const [refreshing, setRefreshing] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    setError('');
    fetchFriendList();
  }, [isFocused]);

  useEffect(() => {
    if (searchKeyword === '') {
      handleGoBack();
    }
  }, [searchKeyword]);

  useEffect(() => {
    if (groupSearchKeyword === '') {
      handleGoBack();
    }
  }, [groupSearchKeyword]);

  const fetchFriendList = async () => {
    try {
      const response = await messageFriends(
        userInfo.memberToken,
        searchKeyword || null,
      );
      setFriendList(response || []);
      setRefreshing(false);
    } catch (err) {
      console.log('Problem fetching friend list ', err);
    }
  };

  const handleGoBack = () => {
    setSearchKeyword('');
    setGroupSearchKeyword('');
    setSearchButtonClicked(false);
    setGroupSearchBtnClicked(false);
  };

  const handleSearch = async (keyword, setSearchResults, setButtonClicked) => {
    try {
      if (keyword) {
        const response = await messageFriends(userInfo.memberToken, keyword);
        setSearchResults(response || []);
        setButtonClicked(true);
      }
    } catch (err) {
      console.log('Error is : ', err);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchFriendList();
  };

  const renderList = data => (
    <FlatList
      data={data}
      renderItem={({item}) => (
        <TouchableOpacity
          style={styles.listBox}
          onPress={() =>
            navigation.navigate('chatSection', {
              friendId: item?.Mem_ID,
              friendName: item?.Mem_Name,
              friendPhoto: item?.Mem_Photo,
              tabIndex: item?.IsFriendCircle === 1 ? 1 : 0,
            })
          }>
          <View style={styles.userImg}>
            <TouchableOpacity onPress={()=> {
              navigation.navigate('myProfile');
            }}>
            <Image
              style={{width: '100%', height: '100%'}}
              source={
                item.Mem_Photo && typeof item.Mem_Photo === 'string'
                ? {uri: item.Mem_Photo}
                : default_photo
              }
              />
              </TouchableOpacity>
          </View>
          <View>
            <View style={{flexDirection: 'row'}}>
              <Text numberOfLines={3} style={styles.userName}>
                {item.Mem_Name}
              </Text>
              {item?.CountUnreadMsg > 0 && (
                <View style={styles.selectCount}>
                  <Text
                    style={{fontSize: 14, fontWeight: '500', color: '#1866B4'}}>
                    {item?.CountUnreadMsg}
                  </Text>
                </View>
              )}
            </View>
            <View style={styles.magtextarea}>
              <Text numberOfLines={1} style={[styles.msgText, {width: '50%'}]}>
                {item?.LastMessage !== null && item?.LastMessage !== ''
                  ? item?.LastMessage
                  : item?.MediaPath !== null && item?.MediaPath !== ''
                  ? 'Media'
                  : 'No message available'}
              </Text>
              <View style={styles.dot}></View>
              <Text style={styles.msgText}>
                {item?.LastMessageDateTime !== '0001-01-01T00:00:00'
                  ? formatDateString(item?.LastMessageDateTime)
                  : 'No date available'}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      )}
      keyExtractor={(item, index) => index.toString()}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
      ListEmptyComponent={renderNoResults}
    />
  );

  const renderNoResults = () => (
    <View style={styles.noResults}>
      <View style={{flex: 1, justifyContent: 'center', alignContent: 'center'}}>
        <Image
          style={{width: 200, height: 200}}
          source={require('../assets/png/no-post.png')}
        />
      </View>
      <View>
        <Text>Here is no more member!</Text>
        <Text>Please wait for some days.</Text>
        <TouchableOpacity>
          <Text style={styles.goBackText} onPress={handleGoBack}>
            Go Back
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{height: '100%'}}>
      <StatusBar barStyle={'dark-lite'} backgroundColor="#1E293C" />
      <Header navigation={navigation} />
      <View style={styles.container}>
        <View
          style={{
            marginHorizontal: 16,
            marginVertical: 10,
            flexDirection: 'row',
          }}>
          {(searchButtonClicked || groupSearchBtnClicked ) && (
            <TouchableOpacity onPress={handleGoBack}>
              <Image
                style={{width: 30, height: 30}}
                source={require('../assets/png/leftArrow.png')}
              />
            </TouchableOpacity>
          )}
          <Text style={styles.messageText}>All Messages</Text>
        </View>
        <View style={styles.navbtnbox}>
          <TouchableOpacity
            onPress={() => setTabIndex(0)}
            style={[
              styles.navbtn,
              {backgroundColor: tabIndex === 0 ? '#F0F0F0' : '#fff'},
            ]}>
            <Text>Chat</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setTabIndex(1)}
            style={[
              styles.navbtn,
              {backgroundColor: tabIndex === 1 ? '#F0F0F0' : '#fff'},
            ]}>
            <Text>Group</Text>
          </TouchableOpacity>
        </View>
        {tabIndex === 0 ? (
          <View>
            <View style={styles.searchSection}>
              <TextInput
                placeholder="Search Friends"
                style={styles.searchBox}
                value={searchKeyword}
                onChangeText={text => setSearchKeyword(text)}
              />
              <TouchableOpacity
                style={styles.searchbtn}
                onPress={() =>
                  handleSearch(
                    searchKeyword,
                    setSearchResults,
                    setSearchButtonClicked,
                  )
                }>
                <Image
                  style={{width: 24, height: 24}}
                  source={require('../assets/png/search.png')}
                />
              </TouchableOpacity>
            </View>
            {renderList(searchButtonClicked ? searchResults : friendList)}
          </View>
        ) : (
          <View>
            <View style={styles.searchSection}>
              <TextInput
                placeholder="Search Friends in Group"
                style={styles.searchBox}
                value={groupSearchKeyword}
                onChangeText={text => setGroupSearchKeyword(text)}
              />
              <TouchableOpacity
                style={styles.searchbtn}
                onPress={() =>
                  handleSearch(
                    groupSearchKeyword,
                    setGroupSearchResults,
                    setGroupSearchBtnClicked,
                  )
                }>
                <Image
                  style={{width: 24, height: 24}}
                  source={require('../assets/png/search.png')}
                />
              </TouchableOpacity>
            </View>
            {renderList(
              groupSearchBtnClicked
                ? groupSearchResults.filter(item => item?.IsFriendCircle === 1)
                : friendList.filter(item => item?.IsFriendCircle === 1),
            )}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: 'white'},
  searchSection: {marginHorizontal: 10, marginBottom: 10, position: 'relative'},
  searchBox: {
    backgroundColor: '#f4f4f4',
    borderRadius: 50,
    height: 45,
    paddingLeft: 20,
  },
  searchbtn: {position: 'absolute', top: 10, right: 15},
  messageText: {color: 'black', fontSize: 20, fontWeight: '700'},
  noResults: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    textAlign: 'center',
    marginBottom: 20,
  },
  goBackText: {fontSize: 18, color: 'blue', textAlign: 'center', marginTop: 20},
  userName: {
    fontSize: 18,
    fontWeight: '500',
    color: 'black',
    marginBottom: 0,
    width: '70%',
  },
  msgText: {fontSize: 14, color: '#696969'},
  dot: {
    width: 6,
    height: 6,
    backgroundColor: '#696969',
    borderRadius: 10,
    marginHorizontal: 8,
  },
  magtextarea: {flexDirection: 'row', alignItems: 'center'},
  userImg: {width: 55, height: 55, borderRadius: 50, overflow: 'hidden'},
  listBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    marginHorizontal: 10,
    marginVertical: 6,
  },
  navbtnbox: {flexDirection: 'row', marginHorizontal: 10, marginBottom: 8},
  navbtn: {
    width: '50%',
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  selectCount: {
    backgroundColor: '#CEE7FF',
    justifyContent: 'center',
    alignItems: 'center',
    height: 26,
    width: 26,
    borderRadius: 20,
    marginLeft: 10,
  },
});

export default AllMessages;
