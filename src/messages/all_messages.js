import React, { useState, useEffect, useContext } from 'react';
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
  Pressable,
  KeyboardAvoidingView,
  Keyboard,
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { useIsFocused } from '@react-navigation/core';
import Footer from '../components/Footer';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import { Swipeable } from 'react-native-gesture-handler';
import MessageShimmer from '../Shimmer/MessageShimmer';
const default_photo = require('../assets/png/default-profile.png');

const AllMessages = ({ navigation }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [friendList, setFriendList] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchButtonClicked, setSearchButtonClicked] = useState(false);
  const [groupSearchKeyword, setGroupSearchKeyword] = useState('');
  const [groupSearchResults, setGroupSearchResults] = useState([]);
  const [groupSearchBtnClicked, setGroupSearchBtnClicked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { userInfo, messageFriends, setError } = useContext(AuthContext);
  const [refreshing, setRefreshing] = useState(false);
  const isFocused = useIsFocused();
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);


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
    setIsLoading(true);
    try {
      const response = await messageFriends(
        userInfo.memberToken,
        searchKeyword || null,
      );
      setFriendList(response || []);
      setRefreshing(false);
    } catch (err) {
      console.log('Problem fetching friend list ', err);
    } finally {
      setIsLoading(false);
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

  const leftSwip = () => {
    return (
      <Pressable style={{ backgroundColor: '#ddd', width: responsiveWidth(20) }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Image
            source={require('../assets/png/delete.png')}
            style={{ width: responsiveWidth(8), height: responsiveWidth(8) }}
          />
          <Text style={{ fontSize: responsiveFontSize(1.8), fontWeight: '500' }}>
            Delete
          </Text>
        </View>
      </Pressable>
    );
  };
  const rightSwip = () => {
    return (
      <Pressable
        style={{ backgroundColor: '#1866B4', width: responsiveWidth(20) }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Image
            source={require('../assets/png/archive-fill.png')}
            style={{ width: responsiveWidth(8), height: responsiveWidth(8) }}
          />
          <Text
            style={{
              fontSize: responsiveFontSize(1.8),
              fontWeight: '500',
              color: 'white',
            }}>
            Archive
          </Text>
        </View>
      </Pressable>
    );
  };

  const renderList = data => (
    <FlatList
      data={data}
      renderItem={({ item }) => (
        <Swipeable renderLeftActions={leftSwip} renderRightActions={rightSwip}>
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
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('myProfile');
                }}>
                <Image
                  style={{ width: '100%', height: '100%' }}
                  source={
                    item.Mem_Photo && typeof item.Mem_Photo === 'string'
                      ? { uri: item.Mem_Photo }
                      : default_photo
                  }
                />
              </TouchableOpacity>
            </View>
            <View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text numberOfLines={1} style={styles.userName}>
                  {item.Mem_Name}
                </Text>
                {item?.CountUnreadMsg > 0 && (
                  <View style={styles.selectCount}>
                    <Text
                      style={{
                        fontSize: responsiveFontSize(1.5),
                        fontWeight: '500',
                        color: '#fff',
                      }}>
                      {item?.CountUnreadMsg}
                    </Text>
                  </View>
                )}
              </View>
              <View style={styles.magtextarea}>
                <Text
                  numberOfLines={1}
                  style={[styles.msgText, { width: '90%' }]}>
                  {item?.LastMessage &&
                    item?.LastMessage.includes('@@GroupMeeting')
                    ? 'Meeting 💼'
                    : item?.LastMessage !== null && item?.LastMessage !== ''
                      ? item?.LastMessage
                      : item?.MediaPath !== null && item?.MediaPath !== ''
                        ? 'Media'
                        : 'No message available'}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </Swipeable>
      )}
      keyExtractor={(item, index) => index.toString()}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
      ListEmptyComponent={renderNoResults}
    />
  );

  const [isTextboxVisible, setTextboxVisible] = useState(false);

  const toggleTextbox = () => {
    setTextboxVisible(!isTextboxVisible);
  };

  const renderNoResults = () => (
    <View style={styles.emptyBox}>
      <View style={styles.noResults}>
        <View>
          <Image
            style={{ width: responsiveWidth(15), height: responsiveWidth(15) }}
            source={require('../assets/png/emptyMsg.png')}
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

  return (
    <KeyboardAvoidingView style={styles.container}>
      <SafeAreaView style={{ height: '100%' }}>
        <StatusBar barStyle={'dark-lite'} backgroundColor="#1E293C" />
        <View
            style={{
              flexDirection: 'row',
              backgroundColor: '#1E293C',
              paddingHorizontal: responsiveWidth(3),
              paddingVertical: responsiveWidth(2.5),
              justifyContent: 'space-between',
            }}>
            {/* {(searchButtonClicked || groupSearchBtnClicked) && (
            <TouchableOpacity onPress={handleGoBack}>
              <Image
                style={{ width: 30, height: 30 }}
                source={require('../assets/png/leftArrow.png')}
              />
            </TouchableOpacity>
          )} */}
            <Text style={styles.messageText}>All Messages</Text>
            <TouchableOpacity
              onPress={toggleTextbox}
              style={{
                width: responsiveWidth(10),
                height: responsiveWidth(10),
                backgroundColor: '#293446',
                borderRadius: responsiveWidth(10),
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                style={{
                  width: responsiveHeight(3.5),
                  height: responsiveHeight(3.5),
                }}
                source={require('../assets/png/search2.png')}
              />
            </TouchableOpacity>
          </View>
        <View style={{ flexBasis: 'auto', flexShrink: 1, flexGrow: 0 }}>          
          <View style={styles.navbtnbox}>
            <TouchableOpacity
              onPress={() => setTabIndex(0)}
              style={[
                styles.navbtn,
                { borderColor: tabIndex === 0 ? '#1866B4' : '#E1E4EA' },
              ]}>
              <Text
                style={[
                  styles.tabtext,
                  { color: tabIndex === 0 ? '#1866B4' : '#717784' },
                ]}>
                All
              </Text>
            </TouchableOpacity>
            {/* <TouchableOpacity
            onPress={() => setTabIndex(1)}
            style={[
              styles.navbtn,
              {borderColor: tabIndex === 1 ? '#1866B4' : '#E1E4EA'},
            ]}>
            <View
              style={[
                styles.unreadDot,
                {backgroundColor: tabIndex === 1 ? '#1866B4' : '#717784'},
              ]}
            />
            <Text
              style={[
                styles.tabtext,
                {color: tabIndex === 1 ? '#1866B4' : '#717784'},
              ]}>
              Unread
            </Text>
          </TouchableOpacity> */}
            {/* <TouchableOpacity
            onPress={() => setTabIndex(2)}
            style={[
              styles.navbtn,
              {borderColor: tabIndex === 2 ? '#1866B4' : '#E1E4EA'},
            ]}>
            <Text
              style={[
                styles.tabtext,
                {color: tabIndex === 2 ? '#1866B4' : '#717784'},
              ]}>
              Friends
            </Text>
          </TouchableOpacity> */}
            <TouchableOpacity
              onPress={() => setTabIndex(3)}
              style={[
                styles.navbtn,
                { borderColor: tabIndex === 3 ? '#1866B4' : '#E1E4EA' },
              ]}>
              <Image
                source={require('../assets/png/group-line.png')}
                style={{
                  width: responsiveWidth(5),
                  height: responsiveWidth(5),
                  tintColor: tabIndex === 3 ? '#1866B4' : '#717784',
                }}
              />
              <Text
                style={[
                  styles.tabtext,
                  { color: tabIndex === 3 ? '#1866B4' : '#717784' },
                ]}>
                Group
              </Text>
            </TouchableOpacity>
          </View>
          {tabIndex === 0 ? (
            <View>
              {isTextboxVisible && (
                <View style={styles.searchSection}>
                  <TextInput
                    placeholder="Search friends and groups"
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
                      resizeMode='cover'
                      style={{ width: responsiveWidth(5), height: responsiveWidth(5)}}
                      source={require('../assets/png/search.png')}
                    />
                  </TouchableOpacity>
                </View>
              )}
              {isLoading ? (
                <MessageShimmer />
              ) : (
                renderList(searchButtonClicked ? searchResults : friendList)
              )}
            </View>
          ) : (
            <View>
              {isTextboxVisible && (
                <View style={styles.searchSection}>
                  <TextInput
                    placeholder="Search groups"
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
                      style={{ width: 24, height: 24 }}
                      source={require('../assets/png/search.png')}
                    />
                  </TouchableOpacity>
                </View>
              )}

              {isLoading ? (
                <MessageShimmer />
              ) : (
                renderList(
                  groupSearchBtnClicked
                    ? groupSearchResults.filter(
                      item => item?.IsFriendCircle === 1,
                    )
                    : friendList.filter(item => item?.IsFriendCircle === 1),
                )
              )}
            </View>
          )}
        </View>
        {!isKeyboardVisible &&
          <View style={{ flexBasis: 'auto', flexShrink: 0, flexGrow: 1, alignItems: 'flex-end', justifyContent: 'space-between', flexDirection: 'row' }}>
            <Footer />
          </View>
        }
      </SafeAreaView>
    </KeyboardAvoidingView>

  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  searchSection: {
    marginHorizontal: responsiveWidth(3),
    marginBottom: 10,
    position: 'relative',
  },
  searchBox: {
    backgroundColor: '#fff',
    borderRadius: responsiveWidth(2.5),
    paddingLeft: responsiveWidth(12),
    borderColor: '#E1E4EA',
    borderWidth: 1.5,
    fontSize: responsiveFontSize(2),
    height: responsiveWidth(12)
  },
  searchbtn: {
    position: 'absolute',
    top: responsiveWidth(3.5),
    left: responsiveWidth(4),
  },
  messageText: {
    color: 'white',
    fontSize: responsiveFontSize(3),
    fontWeight: '600',
  },
  noResults: {
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  goBackText: { fontSize: 18, color: 'blue', textAlign: 'center', marginTop: 10 },
  userName: {
    fontSize: responsiveFontSize(2),
    fontWeight: '500',
    color: 'black',
    marginBottom: 0,
    width: '70%',
  },
  msgText: { fontSize: responsiveFontSize(1.6), color: '#696969' },
  dot: {
    width: 6,
    height: 6,
    backgroundColor: '#696969',
    borderRadius: 10,
    marginHorizontal: 8,
  },
  magtextarea: { flexDirection: 'row', alignItems: 'center',fontSize: responsiveFontSize(1.6) },
  userImg: { width: responsiveWidth(12), height: responsiveWidth(12), borderRadius: responsiveWidth(6), overflow: 'hidden' },
  listBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveWidth(2),
    backgroundColor: 'white',
  },
  navbtnbox: {
    flexDirection: 'row',
    marginHorizontal: responsiveWidth(3),
    marginVertical: responsiveWidth(3),
    gap: responsiveWidth(2),
  },
  navbtn: {
    borderRadius: responsiveWidth(2),
    borderWidth: 1.5,
    paddingHorizontal: responsiveWidth(3),
    paddingVertical: responsiveWidth(1.6),
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsiveWidth(1),
  },
  selectCount: {
    backgroundColor: '#1866B4',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: responsiveWidth(2),
    paddingVertical: responsiveWidth(0.5),
    borderRadius: 20,
    marginRight: responsiveWidth(5)
  },
  emptyBox: {
    flex: 1,
    height: responsiveHeight(60),
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabtext: {
    fontSize: responsiveFontSize(1.8),
  },
  unreadDot: {
    width: responsiveWidth(3.5),
    height: responsiveWidth(3.5),
    borderRadius: responsiveWidth(2),
  },
});

export default AllMessages;
