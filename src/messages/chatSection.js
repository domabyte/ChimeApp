import React, {useContext, useState, useEffect, useRef, memo} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Modal,
  TouchableWithoutFeedback,
  FlatList,
  TextInput,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import HTMLView from 'react-native-htmlview';
import LongPressPopup from './ForwordMsg';
import VideoThumbnail from '../utils/Video';
import {AuthContext} from '../context/AuthContext';
import SocketContext from '../context/SocketContext';
import {IOScrollView, InView} from 'react-native-intersection-observer';
import {
  allowMedia,
  downloadFile,
  extractYouTubeID,
  formatDateString,
  getDocType,
  getTimeFromDateByZone,
  isYoutubeUrl,
  openURL,
  pickDocument,
  pickImage,
  urlRegex,
} from '../utils/helper';
import ImageViewer from 'react-native-image-zoom-viewer';
import VideoPlayer from '../utils/VideoPlayer';
import Orientation from 'react-native-orientation-locker';
import AudioPlayer from '../utils/AudioPlayer';
import MediaUploadLoader from '../utils/MediaUploadLoader';

const default_photo = require('../assets/png/default-profile.png');
const doc_photo = require('../assets/png/doc.png');
const cross_photo = require('../assets/png/Cross.png');

const ChatSection = ({navigation, route}) => {
  const {friendId, friendName, friendPhoto, tabIndex} = route.params;
  const {width} = Dimensions.get('window');
  const [isOnline, setIsOnline] = useState('Offline');
  const {
    userInfo,
    fetchChatHistory,
    deleteMsg,
    setIsLoading,
    getUserOnlineStatus,
    sendMessage,
    getGroupMembers,
  } = useContext(AuthContext);
  const {socket, joinRoom, leaveRoom} = useContext(SocketContext);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [showButtons, setShowButtons] = useState(true);
  const [isPopupVisible, setPopupVisible] = useState(false);
  const maxHeight = 100;
  const [height, setHeight] = useState(40);
  const [isPopupSend, setPopupSend] = useState(false);
  const [imgPopupVisible, setimgPopupVisible] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [documentPath, setDocumentPath] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [isMediaUploading, setIsMediaUploading] = useState(false);
  const [longPressedIndex, setLongPressedIndex] = useState(null);
  const [msgId, setMsgID] = useState(null);
  const [pressMsg, setPressMsg] = useState('');
  const [pressMedia, setPressMedia] = useState({});
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [groupMembers, setGroupMembers] = useState([]);
  const [groupMemberId, setGroupMemberId] = useState([]);
  const curPage = useRef(1);

  const fetchMessages = async () => {
    try {
      const result = await fetchChatHistory(
        userInfo.memberToken,
        friendId,
        curPage.current,
      );
      if (!result.length > 0) {
        return;
      }
      const result1 = result.reverse();
      setMessages(prevMessages => [...prevMessages, ...result1]);
      curPage.current += 1;
    } catch (err) {
      console.log('Failed to fetch chat history');
    } finally {
      setRefreshing(false);
      setIsLoading(false);
    }
  };

  const fetchUserOnlineStatus = async () => {
    const resp = await getUserOnlineStatus(
      userInfo.memberToken,
      userInfo.LoginToken,
      friendId,
    );
    if (
      resp.ConnectionID == null ||
      resp.ConnectionID === '' ||
      resp.ConnectionID === '0' ||
      resp.LoginStatus === 0
    ) {
      setIsOnline('Offline');
    } else if (resp.LoginStatus === 1) {
      setIsOnline('Online');
    } else if (resp.LoginStatus === 2) {
      setIsOnline('Away');
    } else if (resp.LoginStatus === 3) {
      setIsOnline('Do not Disturb');
    } else if (resp.LoginStatus === 4) {
      setIsOnline('Offline');
    } else {
      setIsOnline('Offline');
    }
  };

  const getGroupList = async () => {
    try {
      const response = await getGroupMembers(
        userInfo.memberToken,
        userInfo.LoginToken,
        friendId,
      );
      if (response) {
        setGroupMembers(response);
      }
    } catch (err) {
      console.log('Error in getGroupList : ', err);
    }
  };

  useEffect(() => {
    joinRoom({userId: userInfo.id, friendId}, fetchMessages);
    fetchUserOnlineStatus();
    if (tabIndex) {
      getGroupList();
    }
    return () => {
      leaveRoom({userId: userInfo.id, friendId});
      setIsOnline(false);
    };
  }, []);

  useEffect(() => {
    if (groupMembers && groupMembers.length > 0) {
      const ids = groupMembers.map(member => member.Mem_ID);
      setGroupMemberId(ids.filter(data => data != userInfo?.id));
    }
  }, [groupMembers]);

  const handleContentSizeChange = event => {
    const newHeight = event.nativeEvent.contentSize.height;
    setHeight(newHeight > maxHeight ? maxHeight : newHeight);
  };

  const handleSendMessage = async () => {
    setIsSendingMessage(true);
    try {
      if (msgId) {
        if (inputValue.trim() !== '') {
          const response = await sendMessage(
            userInfo?.memberToken,
            userInfo?.LoginToken,
            inputValue,
            friendId,
            msgId,
            tabIndex,
            groupMemberId,
          );
          if (response) {
            const updatedMessage = {
              ...messages.find(msg => msg.Id === msgId),
              Message: inputValue,
            };
            setMessages(prevMessages =>
              prevMessages.map(msg =>
                msg.Id === msgId ? updatedMessage : msg,
              ),
            );
          }
        }
      } else {
        if (inputValue.trim() !== '') {
          const response = await sendMessage(
            userInfo?.memberToken,
            userInfo?.LoginToken,
            inputValue,
            friendId,
            '',
            tabIndex,
            groupMemberId,
          );
        }
      }
    } catch (err) {
      console.log('Failed to send message to the server : ', err);
    } finally {
      setIsSendingMessage(false);
    }
  };

  const handleEdit = () => {
    setInputValue(pressMsg);
  };

  const handleReceiveMessage = data => {
    if (!msgId) {
      setMessages(prevMessages => [data.msgResp, ...prevMessages]);
    } else {
      setPopupVisible(false);
      setLongPressedIndex(null);
      setMsgID(null);
      setPressMsg('');
    }
    setInputValue('');
  };

  useEffect(() => {
    if (socket) {
      socket.on('receiveMessage', handleReceiveMessage);
    }
    return () => {
      if (socket) {
        socket.off('receiveMessage', handleReceiveMessage);
      }
    };
  }, [socket, msgId]);

  const handleLongPress = () => {
    setPopupVisible(true);
  };

  const handleClosePopup = () => {
    setPopupVisible(false);
    setimgPopupVisible(false);
    setLongPressedIndex(null);
    setInputValue('');
  };

  const handleClosePopup2 = () => {
    setPopupSend(false);
  };

  const handleMsgDelete = async () => {
    try {
      await deleteMsg(userInfo.memberToken, userInfo.LoginToken, msgId);
      setMessages(prevMessages =>
        prevMessages.filter(message => message.Id !== msgId),
      );
      handleClosePopup();
      setMsgID(null);
    } catch (error) {
      console.log('Failed to delete message: ', error);
    }
  };

  const handlePopSend = () => {
    setPopupSend(true);
  };

  const handleInputChange = text => {
    setInputValue(text);
    setShowButtons(text.length === 0);
  };

  const handleLongPress1 = () => {
    setimgPopupVisible(true);
  };

  const handleOpenModal = item => {
    setDocumentPath(item);
    if (
      allowMedia(item) === 'image' ||
      allowMedia(item) === 'video' ||
      allowMedia(item) === 'audio'
    ) {
      setOpenModal(true);
    } else {
      console.log('Reach for documents is limited');
    }
  };

  const handleCloseModal = () => {
    Orientation.lockToPortrait();
    setOpenModal(false);
  };

  const renderItem = ({item, index}) => {
    const isCurrentUser = item.SenderID === userInfo?.id;
    const isMedia = !!item.MediaPath;
    const messageType = isMedia ? allowMedia(item.MediaPath) : null;
    const messageTime = getTimeFromDateByZone(item.EntryDate);
    const messageDate = formatDateString(item.EntryDate);
    return (
      <>
        <IOScrollView>
          {item.IsDateShow == item.Id && (
            <Text style={styles1.date}>{messageDate}</Text>
          )}
          <View
            style={{
              display: 'flex',
              paddingLeft: isCurrentUser ? 0 : 10,
              paddingRight: isCurrentUser ? 10 : 0,
              flexDirection: 'row',
              alignSelf: isCurrentUser ? 'flex-end' : 'flex-start',
            }}>
            {!isCurrentUser && (
              <View style={styles.recvImg}>
                <Image
                  style={{
                    width: '100%',
                    height: '100%',
                    resizeMode: 'cover',
                    alignSelf: 'baseline',
                    backgroundColor: 'white',
                  }}
                  source={
                    isCurrentUser
                      ? {uri: userInfo.memberPhoto}
                      : friendPhoto
                      ? {uri: friendPhoto}
                      : default_photo
                  }
                />
              </View>
            )}
            <View
              style={[
                styles1.messageContainer,
                longPressedIndex === index
                  ? styles1.longPressed
                  : isCurrentUser
                  ? styles.sendMsg
                  : styles1.rcvMsg,
                isYoutubeUrl(item?.Message) && {
                  backgroundColor: 'white',
                },
                isMedia && {
                  backgroundColor:
                    longPressedIndex == index ? 'lightgreen' : 'white',
                },
              ]}>
              {isMedia ? (
                <TouchableWithoutFeedback>
                  <View>
                    {messageType === 'video' ? (
                      <VideoThumbnail
                        thumbnailUri={
                          messageType === 'image' ? item : item.Media_Thumbnail
                        }
                        onPress={() => handleOpenModal(item.MediaPath)}
                        onLongPress={() => {
                          setLongPressedIndex(index);
                          handleLongPress1();
                          setMsgID(item.Id);
                          setPressMedia(item);
                        }}
                      />
                    ) : messageType === 'image' ? (
                      <TouchableOpacity
                        onPress={() => handleOpenModal(item.MediaPath)}
                        onLongPress={() => {
                          setLongPressedIndex(index);
                          handleLongPress1();
                          setMsgID(item.Id);
                          setPressMedia(item);
                        }}>
                        <Image
                          o
                          style={styles1.media}
                          source={{uri: item.MediaPath}}
                        />
                      </TouchableOpacity>
                    ) : messageType === 'audio' ? (
                      <TouchableOpacity
                        onLongPress={() => {
                          setLongPressedIndex(index);
                          handleLongPress1();
                          setMsgID(item.Id);
                          setPressMedia(item);
                        }}>
                        <AudioPlayer documentPath={item?.MediaPath} />
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        onPress={() =>
                          downloadFile(item?.MediaPath, getDocType(item))
                        }
                        onLongPress={() => {
                          setLongPressedIndex(index);
                          handleLongPress1();
                          setMsgID(item.Id);
                          setPressMsg(item);
                        }}>
                        <Image style={styles1.media1} source={doc_photo} />
                      </TouchableOpacity>
                    )}
                  </View>
                </TouchableWithoutFeedback>
              ) : (
                <TouchableWithoutFeedback
                  onLongPress={() => {
                    handleLongPress();
                    setLongPressedIndex(index);
                    setMsgID(item.Id);
                    setPressMsg(item?.Message);
                  }}>
                  <View style={{flexDirection: 'row'}}>
                    {isYoutubeUrl(item?.Message) ? (
                      <View style={{flexDirection: 'column'}}>
                        <View
                          style={{
                            backgroundColor: 'white',
                            height: 150,
                            width: 250,
                            padding: 5,
                          }}>
                          <View
                            style={{
                              borderRadius: 10,
                            }}>
                            <YoutubePlayer
                              key={index}
                              height={150}
                              width={250}
                              videoId={extractYouTubeID(item?.Message)}
                              play={false}
                              onChangeState={event => console.log(event)}
                            />
                          </View>
                        </View>
                        <Text
                          key={`${index}` + 1}
                          style={styles.sendMsg}
                          onPress={() => openURL(item?.Message)}>
                          {item?.Message}
                        </Text>
                      </View>
                    ) : (
                      item?.Message.split(urlRegex).map((messagePart, idx) => {
                        if (urlRegex.test(messagePart)) {
                          return (
                            <Text
                              key={`${index}_${idx}`}
                              style={[
                                styles1.messageText,
                                styles1.link,
                                {color: isCurrentUser ? 'white' : 'blue'},
                              ]}
                              onPress={() => openURL(messagePart)}>
                              {messagePart}
                            </Text>
                          );
                        } else {
                          const htmlContent = `<p><a>${messagePart}</a></p>`;
                          return (
                            <HTMLView
                              value={htmlContent}
                              key={`${index}_${idx}`}
                              stylesheet={isCurrentUser ? styles2 : styles3}
                            />
                          );
                        }
                      })
                    )}
                  </View>
                </TouchableWithoutFeedback>
              )}
            </View>
            {isCurrentUser && (
              <View style={styles.recvImg}>
                <Image
                  style={{
                    width: '100%',
                    height: '100%',
                    resizeMode: 'cover',
                    alignSelf: 'baseline',
                    backgroundColor: 'white',
                  }}
                  source={
                    isCurrentUser
                      ? {uri: item?.Mem_photo}
                      : friendPhoto
                      ? {uri: friendPhoto}
                      : default_photo
                  }
                />
              </View>
            )}
          </View>
          <Text
            style={[
              styles1.messageTime,
              {
                marginRight: 50,
                alignSelf: isCurrentUser ? 'flex-end' : 'flex-start',
                marginLeft: !isCurrentUser ? 50 : 0,
              },
            ]}>
            {messageTime} {isCurrentUser && '✔️'}
          </Text>
        </IOScrollView>
      </>
    );
  };

  return (
    <SafeAreaView style={{height: '100%'}}>
      <View style={styles1.container}>
        <View style={styles.chatHead}>
          <View style={styles.chatTop}>
            {!isPopupVisible && !imgPopupVisible ? (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Image
                  style={{width: 25, height: 25, marginBottom: 5}}
                  source={require('../assets/png/leftArrow2.png')}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={handleClosePopup}>
                <Image
                  style={{width: 25, height: 25}}
                  source={require('../assets/png/optionClose.png')}
                />
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.userImag}>
              <Image
                style={{width: '100%', height: '100%', resizeMode: 'cover'}}
                source={
                  friendPhoto && typeof friendPhoto === 'string'
                    ? {uri: friendPhoto}
                    : default_photo
                }
              />
            </TouchableOpacity>
            <View>
              <Text
                numberOfLines={1}
                style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: 'black',
                  width: 190,
                }}>
                {friendName}
              </Text>
              <View style={{display: 'flex', flexDirection: 'row'}}>
                <Text style={{alignItems: 'center', color: 'black'}}>
                  {isOnline}{' '}
                </Text>
                <View
                  style={
                    isOnline == 'Online' ? styles.liveBtn : styles.offlineBtn
                  }></View>
              </View>
            </View>
          </View>
          {isPopupVisible ? (
            <View style={styles.popupOption}>
              <TouchableOpacity onPress={handleMsgDelete}>
                <Image
                  style={{width: 25, height: 25}}
                  source={require('../assets/png/delete.png')}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleEdit}>
                <Image
                  style={{width: 25, height: 25}}
                  source={require('../assets/png/edit.png')}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={handlePopSend}>
                <Image
                  style={{width: 25, height: 25}}
                  source={require('../assets/png/forward.png')}
                />
              </TouchableOpacity>
            </View>
          ) : imgPopupVisible ? (
            <View style={styles.popupOption}>
              <TouchableOpacity onPress={handleMsgDelete}>
                <Image
                  style={{width: 25, height: 25}}
                  source={require('../assets/png/delete.png')}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={handlePopSend}>
                <Image
                  style={{width: 25, height: 25}}
                  source={require('../assets/png/forward.png')}
                />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.callSection}>
              <TouchableOpacity>
                <Image
                  style={{width: 22, height: 22}}
                  source={require('../assets/png/videoCall.png')}
                />
              </TouchableOpacity>
              <TouchableOpacity>
                <Image
                  style={{width: 22, height: 22}}
                  source={require('../assets/png/call.png')}
                />
              </TouchableOpacity>
            </View>
          )}
        </View>
        <Modal visible={openModal}>
          <View style={styles1.modalContainer}>
            <TouchableOpacity
              style={styles1.closeButton}
              onPress={handleCloseModal}>
              <SafeAreaView style={{height: '100%'}}>
                <Image source={cross_photo} style={styles1.closeIcon} />
              </SafeAreaView>
            </TouchableOpacity>
            {documentPath && allowMedia(documentPath) === 'image' ? (
              <SafeAreaView style={{height: '100%'}}>
                <ImageViewer
                  imageUrls={[{url: documentPath}]}
                  enableSwipeDown={true}
                  onCancel={handleCloseModal}
                />
              </SafeAreaView>
            ) : allowMedia(documentPath) === 'video' ? (
              <View
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  height: '100%',
                }}>
                <VideoPlayer
                  documentPath={
                    'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
                  }
                />
                <View style={styles1.videoOverlay}></View>
              </View>
            ) : null}
          </View>
        </Modal>
        <FlatList
          // ref={flatListRef}
          inverted
          data={messages}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          refreshing={refreshing}
          contentContainerStyle={{flexGrow: 1}}
        />
        {isMediaUploading && <MediaUploadLoader />}
        <View style={[styles.sendBox, {width: width}]}>
          {showButtons && (
            <View style={styles.leftAreaBtn}>
              <TouchableOpacity
                style={styles.leftBtn}
                onPress={() =>
                  pickDocument(
                    userInfo.memberToken,
                    userInfo.LoginToken,
                    friendId,
                    setIsMediaUploading,
                    tabIndex,
                    groupMemberId,
                  )
                }>
                <Image
                  style={{width: 25, height: 25}}
                  source={require('../assets/png/AddDocument.png')}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  pickImage(
                    userInfo.memberToken,
                    userInfo.LoginToken,
                    friendId,
                    setIsMediaUploading,
                    tabIndex,
                    groupMemberId,
                  )
                }
                style={styles.leftBtn}>
                <Image
                  style={{width: 25, height: 25}}
                  source={require('../assets/png/AddImage.png')}
                />
              </TouchableOpacity>
            </View>
          )}
          <View
            style={{
              position: 'relative',
              width: showButtons ? '65%' : '86.4%',
            }}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
              <TextInput
                multiline
                value={inputValue}
                onChangeText={handleInputChange}
                onContentSizeChange={handleContentSizeChange}
                style={[
                  styles.messageBox,
                  {height: Math.min(height, maxHeight)},
                ]}
                placeholder="Type message..."
                placeholderTextColor="#888"
              />
            </KeyboardAvoidingView>
          </View>
          {isSendingMessage ? (
            <Image
              source={require('../assets/png/mediaLoader.png')}
              style={styles.image}
            />
          ) : (
            <TouchableOpacity
              style={styles.sendBtn}
              onPress={handleSendMessage}>
              <Image
                style={{width: 24, height: 24}}
                source={require('../assets/png/SendBtn.png')}
              />
            </TouchableOpacity>
          )}
        </View>
        <LongPressPopup
          isVisible={isPopupSend}
          onClose={handleClosePopup2}
          pressMsg={pressMsg}
          handleClosePopup={handleClosePopup}
        />
      </View>
    </SafeAreaView>
  );
};

const styles1 = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  date: {
    textAlign: 'center',
    marginTop: 5,
  },
  longPressed: {
    backgroundColor: 'lightgreen',
    fontSize: 16,
    paddingHorizontal: 10,
    alignSelf: 'flex-end',
    paddingVertical: 6,
    color: 'white',
    minWidth: 50,
    maxWidth: 260,
  },
  sendMsg: {
    backgroundColor: '#1866B4',
    fontSize: 16,
    paddingHorizontal: 10,
    alignSelf: 'flex-end',
    paddingVertical: 6,
    color: 'white',
    minWidth: 50,
    maxWidth: 260,
  },
  rcvMsg: {
    backgroundColor: '#EAEAEA',
    fontSize: 16,
    paddingHorizontal: 10,
    alignSelf: 'flex-end',
    paddingVertical: 6,
    color: 'white',
    minWidth: 50,
    maxWidth: 260,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    marginHorizontal: 16,
    maxWidth: '80%',
    padding: 5,
    borderRadius: 8,
    padding: 8,
    backgroundColor: '#F2F2F2',
  },
  currentUserMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
  },
  messageText: {
    fontSize: 16,
  },
  media: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
    borderRadius: 8,
  },
  media1: {
    width: 70,
    height: 70,
    resizeMode: 'cover',
    borderRadius: 8,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 8,
  },
  modalImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#111',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 999,
  },
  closeIcon: {
    width: 25,
    height: 25,
    backgroundColor: 'white',
  },
  link: {
    color: 'white',
    textDecorationLine: 'underline',
  },
  messageTime: {
    fontSize: 12,
    alignSelf: 'flex-end',
    marginRight: 15,
    color: '#999',
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: 30,
    height: 30,
  },
  userImag: {
    width: 40,
    height: 40,
    borderRadius: 50,
    overflow: 'hidden',
  },
  msgText: {
    color: 'white',
  },
  msgText1: {
    color: 'black',
  },
  chatTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  liveBtn: {
    height: 10,
    width: 10,
    backgroundColor: '#80FF00',
    borderRadius: 50,
  },
  offlineBtn: {
    height: 10,
    width: 10,
    backgroundColor: 'red',
    borderRadius: 50,
  },
  callSection: {
    flexDirection: 'row',
    gap: 12,
  },
  popupOption: {
    flexDirection: 'row',
    gap: 30,
    right: 90,
  },
  chatHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    elevation: 5,
  },
  sendBox: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
    alignItems: 'flex-end',
  },
  leftAreaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  messageBox: {
    backgroundColor: '#F6F6F6',
    borderRadius: 20,
    paddingLeft: 20,
    paddingRight: 38,
  },
  sendBtn: {
    backgroundColor: '#1866B4',
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
  },
  emojiBtn: {
    position: 'absolute',
    right: 8,
    bottom: 8,
  },
  scrollView: {
    flex: 1,
  },
  recvMsg: {
    backgroundColor: '#EAEAEA',
    borderRadius: 16,
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
    color: 'black',
    width: 300,
  },
  sendMsg: {
    backgroundColor: '#1866B4',
    borderRadius: 16,
    fontSize: 16,
    paddingHorizontal: 10,
    alignSelf: 'flex-end',
    paddingVertical: 6,
    color: 'white',
    minWidth: 50,
    maxWidth: 260,
  },
  recvImg: {
    width: 24,
    height: 24,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'red',
    alignSelf: 'center',
  },
  recvMsgBox: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-end',
    marginHorizontal: 10,
    marginVertical: 10,
  },
  sendMsgBox: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-end',
    marginHorizontal: 10,
    marginVertical: 10,
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
  },
  img: {
    width: 200,
    height: 200,
    resizeMode: 'cover',
    borderRadius: 16,
  },
  leftBtn: {
    height: 40,
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 10,
    alignSelf: 'flex-end',
  },
  closeButtonText: {
    fontSize: 16,
    color: 'blue',
  },
  popupBtn: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const styles2 = StyleSheet.create({
  a: {
    color: 'white',
  },
});

const styles3 = StyleSheet.create({
  a: {
    color: 'black',
  },
});

export default ChatSection;
