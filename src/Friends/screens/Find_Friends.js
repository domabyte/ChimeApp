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
} from 'react-native';
import Header from '../../components/Header';
import Spinner from 'react-native-loading-spinner-overlay';
import {AuthContext} from '../../context/AuthContext';
const default_photo = require('../../assets/png/default-profile.png');

const FindFriends = ({navigation}) => {
  const [selectedItemIndex, setSelectedItemIndex] = useState([]);
  const [suggestedFriendsData, setSuggestedFriendsData] = useState([]);
  const [searchKeywords, setSearchKeywords] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchButtonClicked, setSearchButtonClicked] = useState(false);

  const {
    isLoading,
    setIsLoading,
    userInfo,
    getSuggestedUsers,
    searchFriends,
    sendFriendRequest,
    cancelFriendRequest,
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
    const fetchSuggestedUsers = async () => {
      const result = await getSuggestedUsers(userInfo.id);
      if (result) {
        setSuggestedFriendsData(result);
      }
    };
    fetchSuggestedUsers();
  }, []);

  const handleSearchKeyword = async () => {
    try {
      if (searchKeywords) {
        setIsLoading(true);
        const result = await searchFriends(userInfo.id, 1, 100, searchKeywords);
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

  return (
    <>
      <StatusBar barStyle={'dark-lite'} backgroundColor="#1E293C" />
      <Header />
      <View style={styles.container}>
        <Spinner visible={isLoading} />
        <View style={{marginHorizontal: 16, marginVertical: 10, flexDirection: 'row'}}>
        {searchButtonClicked && (
              <TouchableOpacity onPress={handleGoBack}>
                <Image
                  style={{width: 30, height: 30}}
                  source={require('../../assets/png/leftArrow.png')}
                />
              </TouchableOpacity>
            )}
          <Text style={styles.FriendTex}>Find Friend</Text>
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
                    <Text style={styles.goBackText}>Go Back</Text>
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
                    {item.Mem_Name}
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
    </>
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
  userImage: {
    width: 90,
    height: 90,
    borderRadius: 100,
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
  buttons: {
    backgroundColor: '#EAEAEA',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginVertical: 12,
  },
});

export default FindFriends;
