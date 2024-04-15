import React, {useState, useEffect, useContext} from 'react';
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
import FriendHeader from '../../components/FriendsHeader';
const default_photo = require('../../assets/png/default-profile.png');

const MyFriends = ({navigation}) => {
  const [myFriends, setMyFriends] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchButtonClicked, setSearchButtonClicked] = useState(false);
  const {isLoading, userInfo, getAllFriends, unFriendRequest, error, setError} =
    useContext(AuthContext);

  useEffect(() => {
    const fetchMyFriend = async () => {
      try {
        const response = await getAllFriends(
          userInfo.memberToken,
          userInfo.id,
          userInfo.LoginToken,
        );
        if (response) {
          setMyFriends(response);
        }
      } catch (err) {
        console.log('Problem fetching MyFriend');
      }
    };
    fetchMyFriend();
  }, []);

  const handleMyFriendRequest = async () => {
    try {
      if (searchKeyword) {
        const response = await getAllFriends(
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

  return (
    <>
      <StatusBar barStyle={'dark-lite'} backgroundColor="#1E293C" />
      <Header />
      <View style={styles.container}>
        <Spinner visible={isLoading} />
        <View style={{marginHorizontal: 16, marginVertical: 10}}>
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
                style={{width: 30, height: 30}}
                source={require('../../assets/png/leftArrow.png')}
              />
            </TouchableOpacity>
          )}
          <Text style={styles.FriendTex}>
            {' '}
            Friends{' '}
            <Text style={{color: '#1866B4'}}>
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
                        item.Mem_Photo && typeof item.Mem_Photo === 'string'
                          ? {uri: item.Mem_Photo}
                          : default_photo
                      }
                    />
                  </View>
                  <View>
                    <Text
                      ellipsizeMode="tail"
                      style={{fontSize: 18, color: 'black', fontWeight: '500'}}>
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
                        style={[styles.blueBtn, {backgroundColor: '#1e293c'}]}
                        onPress={() =>
                          handleUnfriend(item?.FriendList_Id, index)
                        }>
                        <Text style={{color: 'white'}}>UnFriend</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.blueBtn, {backgroundColor: '#CED4DA'}]}>
                        <Text style={{color: 'black'}}>Message</Text>
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
                      setSearchKeyword('');
                    }}>
                    <Text style={styles.goBackText} onPress={handleGoBack}>
                      Go Back
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )
          ) : myFriends.length > 0 ? (
            myFriends.map((item, index) => (
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
                    ellipsizeMode="tail"
                    style={{fontSize: 18, color: 'black', fontWeight: '500'}}>
                    {item.Mem_Name}
                  </Text>
                  <Text
                    style={{fontSize: 12, color: '#1866B4', fontWeight: '500'}}>
                    {item.Mem_Designation.trim() === 'Not Added'
                      ? ''
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
                    <Text style={{color: 'black'}}>
                      {item.MutualFriends} mutual connections
                    </Text>
                  </View>
                  <View style={styles.buttonArea}>
                    <TouchableOpacity
                      style={[styles.blueBtn, {backgroundColor: '#192334'}]}
                      onPress={() =>
                        handleUnfriend(item?.FriendList_Id, index)
                      }>
                      <Text style={{color: 'white'}}>UnFriend</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.blueBtn, {backgroundColor: '#CED4DA'}]}>
                      <Text style={{color: 'black'}}>Message</Text>
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
              </View>
            </View>
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
  buttons: {
    backgroundColor: '#EAEAEA',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginVertical: 12,
  },
});

export default MyFriends;
