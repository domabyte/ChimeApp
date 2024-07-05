import React, {useState, useContext, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
} from 'react-native';
import {AuthContext} from '../../context/AuthContext';
import Spinner from 'react-native-loading-spinner-overlay';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
const default_photo = require('../../assets/png/default-profile.png');

const SuggestedFriends = ({navigation, route}) => {
  const {userInfo} = route.params;
  const [selectedItemIndex, setSelectedItemIndex] = useState([]);
  const [suggestedFriendsData, setSuggestedFriendsData] = useState([]);
  const [searchKeywords, setSearchKeywords] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchButtonClicked, setSearchButtonClicked] = useState(false);
  const [skipButton, setSkipButton] = useState(false);
  const {
    isLoading,
    setIsLoading,
    getSuggestedUsers,
    searchFriends,
    sendFriendRequest,
    error,
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
      setSkipButton(true);
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

  useEffect(() => {
    setError('');
    const fetchSuggestedUsers = async () => {
      const result = await getSuggestedUsers(userInfo.id);
      if (result) {
        setSuggestedFriendsData(result);
      }
    };
    fetchSuggestedUsers();
    return () => {
      setError('');
    };
  }, []);

  useEffect(() => {
    if (searchKeywords === '') {
      handleGoBack();
    }
  }, [searchKeywords]);

  const handleSearchKeyword = async () => {
    try {
      if (searchKeywords) {
        setIsLoading(true);
        const result = await searchFriends(userInfo.id, 1, 100, searchKeywords);
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

  const handleCred = async () => {
    AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
    navigation.navigate('myFriend');
  };

  return (
    <SafeAreaView style={{height: '100%'}}>
      <StatusBar barStyle={'dark-lite'} backgroundColor="#1E293C" />
      <View style={styles.container}>
        <Spinner visible={isLoading} />
        <View style={styles.head}>
          <View style={styles.leftBtn}>
            {searchButtonClicked && (
              <TouchableOpacity onPress={handleGoBack}>
                <Image
                  style={{width: 30, height: 30}}
                  source={require('../../assets/png/leftArrow.png')}
                />
              </TouchableOpacity>
            )}
            <Text style={{color: 'black', fontSize: responsiveFontSize(3)}}>Find Friend</Text>
          </View>
          <TouchableOpacity onPress={handleCred}>
            <Text style={{color: 'black', fontSize: 18}}>
              {skipButton ? 'Next' : 'Skip'}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.searchSection}>
          <TextInput
            placeholder="Search Friends"
            style={styles.searchBox}
            value={searchKeywords}
            onChangeText={text => setSearchKeywords(text)}
          />
          <TouchableOpacity
            style={styles.searchbtn}
            onPress={handleSearchKeyword}>
            <Image
              style={{width: 24, height: 24}}
              source={require('../../assets/png/search.png')}
            />
          </TouchableOpacity>
        </View>
        <ScrollView>
          {searchButtonClicked ? (
            searchResults.length > 0 ? (
              searchResults.map((item, index) => (
                <View key={index} style={styles.friendList}>
                  <View style={styles.userImage}>
                    <Image
                      style={{width: '100%', height: '100%'}}
                      source={
                        item.Mem_photo && typeof item.Mem_photo === 'string'
                          ? {uri: item.Mem_photo}
                          : default_photo
                      }
                    />
                  </View>
                  <View>
                    <Text
                      style={{fontSize: 18, color: 'black', fontWeight: '500'}}>
                      {item.Mem_name}
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
                      <Text style={{color: 'black'}}>
                        {item.MutualFriends} mutual connections
                      </Text>
                    </View>
                    <View style={styles.buttonArea}>
                      <TouchableOpacity
                        style={styles.blueBtn}
                        onPress={() => handleAddFriend(index, item.Mem_ID)}>
                        <Text style={{color: 'white'}}>Add Friend</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.blueBtn, {backgroundColor: '#CED4DA'}]}
                        onPress={() => handleIgnore(index)}>
                        <Text style={{color: 'black'}}>Ignore</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.noResults}>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignContent: 'center',
                  }}>
                  <Image
                    style={{width: 200, height: 200}}
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
                    <Text style={styles.goBackText} onPress={handleGoBack}>
                      Go Back
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )
          ) : (
            suggestedFriendsData.map((item, index) => (
              <View key={index} style={styles.friendList}>
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
                    style={{fontSize: 18, color: 'black', fontWeight: '500'}}>
                    {item.Mem_Name + ' ' + item.Mem_LName}
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
                    <Text style={{color: 'black'}}>
                      {item.MutualFriends} mutual connections
                    </Text>
                  </View>
                  <View style={styles.buttonArea}>
                    <TouchableOpacity
                      style={styles.blueBtn}
                      onPress={() => handleAddFriend(index, item.Mem_ID)}>
                      <Text style={{color: 'white'}}>Add Friend</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.blueBtn, {backgroundColor: '#CED4DA'}]}
                      onPress={() => handleIgnore(index)}>
                      <Text style={{color: 'black'}}>Ignore</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  head: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomColor: '#CCCCCC',
    borderBottomWidth: 1,
  },
  leftBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchSection: {
    margin: 10,
    position: 'relative',
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
    width: 90,
    height: 90,
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
});

export default SuggestedFriends;
