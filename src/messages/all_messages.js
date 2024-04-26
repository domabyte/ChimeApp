import {useState, useEffect, useContext} from 'react';
import {
  View,
  StatusBar,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
  Text,
  ScrollView,
} from 'react-native';
import Header from '../components/Header';
import Spinner from 'react-native-loading-spinner-overlay';
import {AuthContext} from '../context/AuthContext';
const default_photo = require('../assets/png/default-profile.png');
import {useIsFocused} from '@react-navigation/core';

const AllMessages = ({navigation}) => {
  const [isNavBtn, setIsNavBtn] = useState(0);
  const [friendList, setFriendList] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchButtonClicked, setSearchButtonClicked] = useState(false);
  const {isLoading, userInfo, messageFriends, error, setError} = useContext(AuthContext);
  const isFocused = useIsFocused();

  useEffect(() => {
    setError('');
    const fetchFriendList = async () => {
      try {
        const response = await messageFriends(
          userInfo.memberToken,
          (keywords = null),
        );
        if (response) {
          setFriendList(response);
        }
      } catch (err) {
        console.log('Problem fetching friend list ', err);
      }
    };
    fetchFriendList();
    return () => {
      setError('');
    };
  }, [isFocused]);

  const handleGoBack = () => {
    setSearchKeyword('');
    setSearchButtonClicked(false);
  };

  const handleSearchResult = async () => {
    try {
      if (searchKeyword) {
        const response = await messageFriends(
          userInfo.memberToken,
          (keywords = searchKeyword),
        );
        setSearchResults(response || []);
        setSearchButtonClicked(true);
      }
    } catch (err) {
      console.log('Error is : ', err);
    }
  };

  return (
    <>
      <StatusBar barStyle={'dark-lite'} backgroundColor="#1E293C" />
      <Header navigation={navigation} />
      <View style={styles.container}>
        <Spinner visible={isLoading} />
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
                source={require('../assets/png/leftArrow.png')}
              />
            </TouchableOpacity>
          )}
          <Text style={styles.messageText}>All Messages</Text>
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
            onPress={handleSearchResult}>
            <Image
              style={{width: 24, height: 24}}
              source={require('../assets/png/search.png')}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.navbtnbox}>
          <TouchableOpacity
            onPress={() => setIsNavBtn(0)}
            style={[
              styles.navbtn,
              {backgroundColor: isNavBtn == 0 ? '#F0F0F0' : '#fff'},
            ]}>
            <Text>Chat</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setIsNavBtn(1)}
            style={[
              styles.navbtn,
              {backgroundColor: isNavBtn == 1 ? '#F0F0F0' : '#fff'},
            ]}>
            <Text>Group</Text>
          </TouchableOpacity>
        </View>
        <ScrollView>
          {isNavBtn === 0 ? (
            searchButtonClicked ? (
              searchResults.length > 0 ? (
                searchResults.map((item, index) => (
                  <TouchableOpacity
                    style={styles.listBox}
                    key={index}
                    onPress={() => navigation.navigate('chatSection', {
                      friendId: item?.Mem_ID,
                      friendName: item?.Mem_Name,
                      friendPhoto: item?.Mem_Photo
                    })}>
                    <View style={styles.userImg}>
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
                      <Text numberOfLines={3} style={styles.userName}>
                        {item.Mem_Name}
                      </Text>
                      <View style={styles.magtextarea}>
                        <Text
                          numberOfLines={1}
                          style={[styles.msgText, {width: '50%'}]}>
                          Lorem ipsum dolor sit Lorem ipsum dolor sit
                        </Text>
                        <View style={styles.dot}></View>
                        <Text style={styles.msgText}>20 Jun, 2024</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
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
                      source={require('../assets/png/no-post.png')}
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
            ) : friendList.length > 0 ? (
              friendList.map((item, index) => (
                <TouchableOpacity
                  style={styles.listBox}
                  key={index}
                  onPress={() =>
                    navigation.navigate('chatSection', {
                      friendId: item?.Mem_ID,
                      friendName: item?.Mem_Name,
                      friendPhoto: item?.Mem_Photo,
                    })
                  }>
                  <View style={styles.userImg}>
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
                    <Text numberOfLines={3} style={styles.userName}>
                      {item.Mem_Name}
                    </Text>
                    <View style={styles.magtextarea}>
                      <Text
                        numberOfLines={1}
                        style={[styles.msgText, {width: '50%'}]}>
                        Lorem ipsum dolor sit Lorem ipsum dolor sit
                      </Text>
                      <View style={styles.dot}></View>
                      <Text style={styles.msgText}>20 Jun, 2024</Text>
                    </View>
                  </View>
                </TouchableOpacity>
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
                    source={require('../assets/png/no-post.png')}
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
          ) : (
            <View>
              <Text>group section</Text>
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
  messageText: {
    color: 'black',
    fontSize: 20,
    fontWeight: '700',
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
  userName: {
    fontSize: 18,
    fontWeight: '500',
    color: 'black',
    marginBottom: 0,
    width: '70%',
  },
  msgText: {
    fontSize: 14,
    color: '#696969',
  },
  dot: {
    width: 6,
    height: 6,
    backgroundColor: '#696969',
    borderRadius: 10,
    marginHorizontal: 8,
  },
  magtextarea: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userImg: {
    width: 55,
    height: 55,
    borderRadius: 50,
    overflow: 'hidden',
  },
  listBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    marginHorizontal: 10,
    marginVertical: 6,
  },
  navbtnbox: {
    flexDirection: 'row',
    marginHorizontal: 10,
    marginBottom: 8,
  },
  navbtn: {
    width: '50%',
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
});

export default AllMessages;
