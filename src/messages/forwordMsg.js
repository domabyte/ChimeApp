import React, {useState, useEffect, useContext} from 'react';
import {
  Modal,
  View,
  Text,
  TouchableWithoutFeedback,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  FlatList,
} from 'react-native';
import {AuthContext} from '../context/AuthContext';
import {useIsFocused} from '@react-navigation/core';
const default_photo = require('../assets/png/default-profile.png');

const LongPressPopup = ({isVisible, onClose, pressMsg, handleClosePopup}) => {
  const [friendList, setFriendList] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchButtonClicked, setSearchButtonClicked] = useState(false);
  const [selectedReceivers, setSelectedReceivers] = useState([]);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const {isLoading, userInfo, messageFriends, error, setError, forwardSendMessage} =
    useContext(AuthContext);
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
          const friendsWithBtns = response.map(friend => ({
            ...friend,
            sendBtn: true,
            undoBtn: false,
          }));
          setFriendList(friendsWithBtns);
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

  const handleSearchResult = async () => {
    try {
      if (searchKeyword) {
        const response = await messageFriends(
          userInfo.memberToken,
          (keywords = searchKeyword),
        );
        const resultsWithBtns = response.map(result => ({
          ...result,
          sendBtn: true,
          undoBtn: false,
        }));
        setSearchResults(resultsWithBtns || []);
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

  const handleOverlayPress = () => {
    onClose();
  };

  const toggleSendBtn = (index, isSearchResult) => {
    const listToUpdate = isSearchResult ? searchResults : friendList;
    const updatedList = [...listToUpdate];
    const item = updatedList[index];
    item.sendBtn = !item.sendBtn;
    setFriendList(updatedList);
  
    const receivers = isSearchResult ? searchResults : friendList;
    const selectedReceiverID = receivers[index]?.Mem_ID;
    const isGroup = receivers[index]?.IsFriendCircle === 1;
  
    if (!item.sendBtn) {
      setSelectedReceivers(prevState => [...prevState, { id: selectedReceiverID, isGroup }]);
    } else {
      setSelectedReceivers(prevState =>
        prevState.filter(receiver => receiver.id !== selectedReceiverID)
      );
    }
  };

  const handleDone = async () => {
    setIsSendingMessage(true);
    const result = await sendMessageToReceivers(selectedReceivers);
    if (result) {
      setSelectedReceivers([]);
      setFriendList(prevList =>
        prevList.map(item => ({...item, sendBtn: true})),
      );
      setSearchResults(prevResults =>
        prevResults.map(item => ({...item, sendBtn: true})),
      );
      onClose();
      handleClosePopup();
      setIsSendingMessage(false);
    }
  };

  const sendMessageToReceivers = async receivers => {
    if (pressMsg.trim() !== '') {
      try {
        for (const receiver of receivers) {
          await forwardSendMessage(
            userInfo?.memberToken,
            userInfo?.LoginToken,
            pressMsg,
            receiver.id,
            receiver.isGroup ? '1' : ''
          );
        }
        return true;
      } catch (error) {
        console.log('Failed to send message:', error);
      }
    }
  };

  const renderEmptySearchResults = () => (
    <View style={styles.noResults}>
      <View style={{flex: 1, justifyContent: 'center', alignContent: 'center'}}>
        <Image
          style={{width: 200, height: 200}}
          source={require('../assets/png/no-post.png')}
        />
      </View>
      <View>
        <Text>Here are no matching members!</Text>
        <Text>Please try a different search.</Text>
        <TouchableOpacity onPress={handleGoBack}>
          <Text style={styles.goBackText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyFriendList = () => (
    <View style={styles.noResults}>
      <View style={{flex: 1, justifyContent: 'center', alignContent: 'center'}}>
        <Image
          style={{width: 200, height: 200}}
          source={require('../assets/png/no-post.png')}
        />
      </View>
      <View>
        <Text>No friends found!</Text>
        <Text>Please wait for some days or add friends.</Text>
      </View>
    </View>
  );

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}>
      <View style={{flex: 1}}>
        <TouchableWithoutFeedback onPress={handleOverlayPress}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
        <View style={styles.modalContainer}>
          <View style={styles.popupHead}>
            {searchButtonClicked ? (
              <TouchableOpacity onPress={handleGoBack}>
                <Image
                  style={{width: 30, height: 30}}
                  source={require('../assets/png/leftArrow.png')}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={onClose}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            )}
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.modalText}>Forward To</Text>
              <View style={styles.selectCount}>
                <Text
                  style={{fontSize: 14, fontWeight: '500', color: '#1866B4'}}>
                  {selectedReceivers.length}
                </Text>
              </View>
            </View>
            {isSendingMessage ? (
              <Image
                source={require('../assets/png/mediaLoader.png')}
                style={styles.image}
              />
            ) : (
              <TouchableOpacity onPress={handleDone}>
                <Text style={styles.closeButtonText}>Done</Text>
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
              onPress={handleSearchResult}>
              <Image
                style={{width: 24, height: 24}}
                source={require('../assets/png/search.png')}
              />
            </TouchableOpacity>
          </View>
          <FlatList
            data={searchButtonClicked ? searchResults : friendList}
            renderItem={({item, index}) => (
              <View style={styles.userList}>
                <View style={styles.leftside}>
                  <Image
                    style={styles.userImg}
                    source={
                      item.Mem_Photo && typeof item.Mem_Photo === 'string'
                        ? {uri: item.Mem_Photo}
                        : default_photo
                    }
                  />
                  <Text
                    numberOfLines={1}
                    style={{
                      fontSize: 18,
                      fontWeight: '500',
                      color: 'black',
                      width: '65%',
                    }}>
                    {item?.Mem_Name}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => toggleSendBtn(index, searchResults.length > 0)}
                  style={[
                    styles.sendBtn,
                    {backgroundColor: item.sendBtn ? '#CEE7FF' : '#1E293C'},
                  ]}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: '500',
                      color: item.sendBtn ? '#1866B4' : 'white',
                    }}>
                    {item.sendBtn ? 'Send' : 'Undo'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
            ListEmptyComponent={
              searchButtonClicked
                ? renderEmptySearchResults
                : renderEmptyFriendList
            }
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    height: 200,
  },
  modalContainer: {
    backgroundColor: 'white',
    height: 800,
    minHeight: '80%',
    overflow: 'hidden',
  },
  modalText: {
    fontSize: 18,
    color: 'black',
    fontWeight: '500',
    top: 5,
  },
  closeButtonText: {
    fontSize: 16,
    color: '#1866B4',
  },
  popupHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
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
  searchSection: {
    marginHorizontal: 10,
    position: 'relative',
    marginVertical: 10,
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
  userImg: {
    width: 50,
    height: 50,
    overflow: 'hidden',
    borderRadius: 40,
    resizeMode: 'cover',
  },
  leftside: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  userList: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  sendBtn: {
    width: 60,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  noResults: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    textAlign: 'center',
    marginBottom: 320,
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
});

export default LongPressPopup;
