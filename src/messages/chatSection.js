import React, {useContext, useState, useEffect, useRef} from 'react';
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
  useWindowDimensions,
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import YoutubePlayer from 'react-native-youtube-iframe';
import EmojiSelector, {Categories} from 'react-native-emoji-selector';
import LongPressPopup from './ForwordMsg';
import VideoThumbnail from '../utils/Video';
import {AuthContext} from '../context/AuthContext';
import SocketContext from '../context/SocketContext';
import {IOScrollView, InView} from 'react-native-intersection-observer';
import configURL from '../config/config';

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
import axios from 'axios';
import AudioPlayer from '../utils/AudioPlayer';
import MediaUploadLoader from '../utils/MediaUploadLoader';

const default_photo = require('../assets/png/default-profile.png');
const doc_photo = require('../assets/png/doc.png');
const cross_photo = require('../assets/png/Cross.png');

const ChatSection = ({navigation, route}) => {
  const {friendId, friendName, friendPhoto} = route.params;
  const {width} = Dimensions.get('window');
  const {isLoading, userInfo, fetchChatHistory, setIsLoading} =
    useContext(AuthContext);
  const {socket, joinRoom, leaveRoom} = useContext(SocketContext);
  const [messages, setMessages] = useState([]);
  const [scrollPos, setScrollPos] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [showButtons, setShowButtons] = useState(true);
  const [isPopupVisible, setPopupVisible] = useState(false);
  const maxHeight = 100;
  const [height, setHeight] = useState(40);
  const [isPopupForward, setPopupForward] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [documentPath, setDocumentPath] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [showEmojiSelector, setShowEmojiSelector] = useState(false);
  const [isMediaUploading, setIsMediaUploading] = useState(false);
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

  useEffect(() => {
    joinRoom({userId: userInfo.id, friendId}, fetchMessages);
    return () => {
      leaveRoom({userId: userInfo.id, friendId});
    };
  }, []);

  const handleContentSizeChange = event => {
    const newHeight = event.nativeEvent.contentSize.height;
    setHeight(newHeight > maxHeight ? maxHeight : newHeight);
  };

  const sendMessage = async () => {
    if (inputValue.trim() !== '') {
      const formData = new FormData();
      formData.append('MemberToken', userInfo?.memberToken);
      formData.append('messageText', inputValue);
      formData.append('ReceiverID', friendId);
      formData.append('IsCallMsg', false);
      formData.append('EventType', 'Click');

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          MemberToken: userInfo?.memberToken,
          LoginToken: userInfo?.LoginToken,
        },
      };

      try {
        const {data} = await axios.post(
          configURL.sendPrivateMsgURL,
          formData,
          config,
        );
        if (data?.Result?.MessageId) {
          setInputValue('');
        }
      } catch (err) {
        console.log('Failed to send message to the server : ', err);
      }
    }
  };

  const handleReceiveMessage = data => {
    setMessages(prevMessages => [data.msgResp, ...prevMessages]);
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
  }, [socket]);

  const handleRefresh = () => {
    setRefreshing(true);
  };

  const handleLongPress = () => {
    setPopupVisible(true);
  };

  const handleClosePopup2 = () => {
    setPopupForward(false);
  };

  const handleInputChange = text => {
    setInputValue(text);
    setShowButtons(text.length === 0);
  };

  const toggleEmojiSelector = () => {
    setShowEmojiSelector(!showEmojiSelector);
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
    return (
      <>
        <IOScrollView>
          <InView
            onChange={e => {
              if (e && index == messages.length - 1) fetchMessages();
            }}>
            {item.IsDateShow == item.Id && (
              <Text style={styles1.date}>
                {formatDateString(item.EntryDate)}
              </Text>
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
                  isCurrentUser && styles.sendMsg,
                  isYoutubeUrl(item?.Message) && {
                    backgroundColor: 'white',
                  },
                  isMedia && {
                    backgroundColor: 'white',
                  },
                ]}>
                {isMedia ? (
                  <TouchableWithoutFeedback onLongPress={handleLongPress}>
                    <View>
                      {messageType === 'video' ? (
                        <VideoThumbnail
                          thumbnailUri={
                            messageType === 'image'
                              ? item.MediaPath
                              : item.Media_Thumbnail
                          }
                          onPress={() => handleOpenModal(item.MediaPath)}
                        />
                      ) : messageType === 'image' ? (
                        <TouchableOpacity
                          onPress={() => handleOpenModal(item.MediaPath)}>
                          <Image
                            style={styles1.media}
                            source={{uri: item.MediaPath}}
                          />
                        </TouchableOpacity>
                      ) : messageType === 'audio' ? (
                        <AudioPlayer documentPath={item?.MediaPath} />
                      ) : (
                        <TouchableOpacity
                          onPress={() =>
                            downloadFile(item?.MediaPath, getDocType(item))
                          }>
                          <Image style={styles1.media1} source={doc_photo} />
                        </TouchableOpacity>
                      )}
                    </View>
                  </TouchableWithoutFeedback>
                ) : (
                  <TouchableWithoutFeedback onLongPress={handleLongPress}>
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
                        item?.Message.split(urlRegex).map(
                          (messagePart, idx) => {
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
                              return (
                                <Text
                                  style={{
                                    color: isCurrentUser ? 'white' : 'black',
                                  }}
                                  key={`${index}_${idx}`}>
                                  {messagePart}
                                </Text>
                              );
                            }
                          },
                        )
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
                        ? {uri: userInfo.memberPhoto}
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
          </InView>
        </IOScrollView>
      </>
    );
  };

  return (
    <View style={styles1.container}>
      <View style={styles.chatHead}>
        <Spinner visible={isLoading} />
        <View style={styles.chatTop}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              style={{width: 25, height: 25, marginBottom: 10}}
              source={require('../assets/png/leftArrow2.png')}
            />
          </TouchableOpacity>
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
            <Text style={{alignItems: 'center', color: 'black'}}>
              Online <View style={styles.liveBtn}></View>
            </Text>
          </View>
        </View>
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
      </View>
      <Modal visible={openModal}>
        <View style={styles1.modalContainer}>
          <TouchableOpacity
            style={styles1.closeButton}
            onPress={handleCloseModal}>
            <Image source={cross_photo} style={styles1.closeIcon} />
          </TouchableOpacity>
          {documentPath && allowMedia(documentPath) === 'image' ? (
            <ImageViewer
              imageUrls={[{url: documentPath}]}
              enableSwipeDown={true}
              onCancel={handleCloseModal}
            />
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
                )
              }>
              <Image
                style={{width: 25, height: 25}}
                source={require('../assets/png/AddDocument.png')}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => pickImage(
                  userInfo.memberToken,
                  userInfo.LoginToken,
                  friendId,
                  setIsMediaUploading,
                )}
              style={styles.leftBtn}>
              <Image
                style={{width: 25, height: 25}}
                source={require('../assets/png/AddImage.png')}
              />
            </TouchableOpacity>
          </View>
        )}
        {showEmojiSelector && (
          <View style={styles.emojiSelectorContainer}>
            <EmojiSelector
              category={Categories.symbols}
              onEmojiSelected={emoji => {
                setInputValue(prev => prev + emoji);
              }}
              columns={8}
            />
          </View>
        )}

        <View
          style={{position: 'relative', width: showButtons ? '65%' : '86.4%'}}>
          <TextInput
            multiline
            value={inputValue}
            onChangeText={handleInputChange}
            onContentSizeChange={handleContentSizeChange}
            style={[styles.messageBox, {height: Math.min(height, maxHeight)}]}
            placeholder="Type message..."
            placeholderTextColor="#888"
          />
          <TouchableOpacity
            style={styles.emojiBtn}
            onPress={toggleEmojiSelector}>
            <Image
              style={{width: 26, height: 26}}
              source={require('../assets/png/emojiBtn.png')}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
          <Image
            style={{width: 24, height: 24}}
            source={require('../assets/png/SendBtn.png')}
          />
        </TouchableOpacity>
      </View>
      <LongPressPopup isVisible={isPopupForward} onClose={handleClosePopup2} />
    </View>
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
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    marginHorizontal: 16,
    maxWidth: '80%',
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
  userImag: {
    width: 40,
    height: 40,
    borderRadius: 50,
    overflow: 'hidden',
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
  callSection: {
    flexDirection: 'row',
    gap: 12,
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

export default ChatSection;
