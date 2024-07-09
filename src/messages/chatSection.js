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
  SafeAreaView,
  KeyboardAvoidingView,
  Linking,
  Alert,
  Pressable,
} from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import HTMLView from 'react-native-htmlview';
import LongPressPopup from './ForwordMsg';
import VideoThumbnail from '../utils/Video';
import {AuthContext} from '../context/AuthContext';
import SocketContext from '../context/SocketContext';
import {IOScrollView, InView} from 'react-native-intersection-observer';
import {requestUserPermission} from '../utils/NotificationService';
import Clipboard from '@react-native-clipboard/clipboard';
import ChatShimmer from '../Shimmer/ChatShimmer';
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
  launchCamera,
  urlRegex,
} from '../utils/helper';
import ImageViewer from 'react-native-image-zoom-viewer';
import VideoPlayer from '../utils/VideoPlayer';
import Orientation from 'react-native-orientation-locker';
import AudioPlayer from '../utils/AudioPlayer';
import MediaUploadLoader from '../utils/MediaUploadLoader';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import AttachmentPopup from './AttachmentPopup';

const default_photo = require('../assets/png/default-profile.png');
const doc_photo = require('../assets/png/doc.png');
const cross_photo = require('../assets/png/Cross.png');

const ChatSection = ({navigation, route}) => {
  const {friendId, friendName, friendPhoto, tabIndex} = route.params;
  const {width} = Dimensions.get('window');
  const [isOnline, setIsOnline] = useState('Offline');
  const {
    userInfo,
    isLoading,
    fetchChatHistory,
    deleteMsg,
    setIsLoading,
    getUserOnlineStatus,
    sendMessage,
    getGroupMembers,
    getFCMToken,
    doCall,
    groupCall,
    groupBelong,
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
  const [attachmentPopupVisible, setattachmentPopupVisible] = useState(false);
  const [showCallOptions, setShowCallOptions] = useState(false);
  const [callType, setCallType] = useState(null);
  const [currMsgType, setCurrMsgType] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const fetchMessages = async () => {
    setIsLoading(true);
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
          await sendMessage(
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
      setShowButtons(true);
    }
  };

  const extractDeviceTokens = (groupMembers, currentUserId) => {
    const deviceTokens = [];
    groupMembers.forEach(member => {
      if (member.Mem_ID === currentUserId) {
        return;
      }
      if (member.DeviceToken) {
        const tokens = member.DeviceToken.split(',');
        tokens.forEach(token => {
          const trimmedToken = token.trim();
          if (trimmedToken) {
            deviceTokens.push(trimmedToken);
          }
        });
      }
    });

    return deviceTokens;
  };

  const handlePhotoVideoPress = async () => {
    await pickImage(
      userInfo.memberToken,
      userInfo.LoginToken,
      friendId,
      setIsMediaUploading,
      tabIndex,
      groupMemberId,
    );
    setattachmentPopupVisible(false);
  };

  const handleDocumentPress = async () => {
    await pickDocument(
      userInfo.memberToken,
      userInfo.LoginToken,
      friendId,
      setIsMediaUploading,
      tabIndex,
      groupMemberId,
    );
    setattachmentPopupVisible(false);
  };

  const handleCameraPress = async () => {
    await launchCamera(
      userInfo?.memberToken,
      userInfo?.LoginToken,
      friendId,
      setIsMediaUploading,
      tabIndex,
      groupMemberId,
    );
    setattachmentPopupVisible(false);
  };

  const fetchTokensForCalls = async (type, isGroup) => {
    if (isGroup) {
      setCallType(type);
      setShowCallOptions(true);
    } else {
      const data = await getFCMToken(
        friendId,
        userInfo.memberToken,
        userInfo.LoginToken,
      );
      if (data) {
        const token = await requestUserPermission();
        const callId = await doCall(
          data,
          userInfo?.name,
          userInfo.userId,
          userInfo.id,
          token.fcmToken,
          type,
          false,
          '',
        );
        Linking.openURL(
          `actpal://${type}Call?meetingName=${callId.callId}&fcmToken=${callId.fcmTokens}`,
        );
      }
    }
  };

  const handleCallOptionSelection = async isPrivate => {
    setShowCallOptions(false);
    try {
      const response = await groupCall(
        friendId,
        userInfo?.memberToken,
        userInfo?.LoginToken,
        callType === 'audio' ? 'voice' : 'video',
        isPrivate,
      );
      const allDeviceTokens = extractDeviceTokens(groupMembers, userInfo?.id);
      const token = await requestUserPermission();
      const parsedResult = parseGroupMeetingMessage(response);
      if (parsedResult) {
        const {meetingId, callType: responseCallType, userId} = parsedResult;
        const callId = await doCall(
          allDeviceTokens,
          userInfo?.name,
          userInfo.userId,
          userInfo.id,
          token.fcmToken,
          callType,
          true,
          meetingId,
        );
        Linking.openURL(
          `actpal://group${
            responseCallType === 'voice' ? 'Audio' : 'Video'
          }Call?meetingName=${
            callId?.callId
          }&fcmToken=${allDeviceTokens}&host=${userId}`,
        );
      } else {
        console.error('Failed to parse group call response');
        Alert.alert(
          'Error',
          'Failed to initiate group call. Please try again.',
        );
      }
    } catch (error) {
      console.error('Error initiating group call:', error);
      Alert.alert('Error', 'Failed to initiate group call. Please try again.');
    }
  };

  const handleEdit = () => {
    setInputValue(pressMsg);
    setPopupVisible(false);
    setimgPopupVisible(false);
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
    setCurrMsgType(true);
  };

  const handleClosePopup = () => {
    setPopupVisible(false);
    setimgPopupVisible(false);
    setPopupSend(false);
    setLongPressedIndex(null);
    setInputValue('');
    setCurrMsgType(false);
  };

  const handleMsgDelete = async () => {
    try {
      const response = await deleteMsg(
        userInfo.memberToken,
        userInfo.LoginToken,
        msgId,
      );
      if (response) {
        setMessages(prevMessages =>
          prevMessages.filter(message => message.Id !== msgId),
        );
      } else {
        Alert.alert('Error', 'You are not allowed to delete this message.');
      }
      handleClosePopup();
      setMsgID(null);
    } catch (error) {
      console.log('Failed to delete message: ', error);
    }
  };

  const handlePopSend = () => {
    setPopupSend(true);
    setPopupVisible(false);
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

  const parseGroupMeetingMessage = message => {
    const regex =
      /@@GroupMeeting\?meetingid=([0-9a-f-]+)&calltype=(\w+)&IsShared=(\d)&UserId=(\d+)&GroupId=([^&]+)/i;
    const match = message.match(regex);
    if (match) {
      const meetingId = match[1];
      const callType = match[2];
      const isShared = match[3];
      const userId = match[4];
      const groupId = match[5];
      return {message, meetingId, callType, isShared, userId, groupId};
    }
    return null;
  };

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const truncateHtml = html => {
    const words = html.split(' ');
    return words.length > 50 ? words.slice(0, 50).join(' ') + '...' : html;
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
              paddingLeft: isCurrentUser ? 0 : 10,
              paddingRight: isCurrentUser ? 10 : 0,
              flexDirection: 'row',
              alignSelf: isCurrentUser ? 'flex-end' : 'flex-start',
              alignItems: 'flex-start',
              backgroundColor:
                longPressedIndex === index ? '#619EE355' : '#fff',
              width: responsiveWidth(100),
              justifyContent: isCurrentUser ? 'flex-end' : 'flex-start',
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
                  marginVertical: responsiveWidth(1),
                  marginHorizontal: responsiveWidth(2.5),
                  borderRadius: responsiveWidth(3.5),
                  backgroundColor: '#EAEAEA',
                },
                isMedia && {
                  backgroundColor:
                    longPressedIndex == index ? 'transperent' : 'transperent',
                  marginVertical: responsiveWidth(0),
                  marginHorizontal: responsiveWidth(0),
                  borderColor: longPressedIndex == index ? null : 'white',
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
                            width: responsiveWidth(60),
                          }}>
                          <View
                            style={{
                              borderRadius: responsiveWidth(2),
                              overflow: 'hidden',
                              width: responsiveWidth(54.5),
                              marginTop: responsiveWidth(1),
                            }}>
                            <YoutubePlayer
                              key={index}
                              height={responsiveWidth(30)}
                              width={responsiveWidth(54.5)}
                              videoId={extractYouTubeID(item?.Message)}
                              play={false}
                              onChangeState={event => console.log(event)}
                            />
                          </View>
                          <Text
                            key={`${index}` + 1}
                            style={{
                              fontSize: responsiveFontSize(1.8),
                              width: responsiveWidth(54.5),
                              marginTop: responsiveWidth(1),
                              color: '#000',
                            }}
                            onPress={() => openURL(item?.Message)}>
                            {item?.Message}
                          </Text>
                        </View>
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
                                {color: isCurrentUser ? 'black' : 'black'},
                              ]}
                              onPress={() => openURL(messagePart)}>
                              {messagePart}
                            </Text>
                          );
                        }
                        if (parseGroupMeetingMessage(messagePart)) {
                          const result = parseGroupMeetingMessage(messagePart);
                          const isShared = result.isShared === '1';
                          return (
                            <View
                              style={{
                                height: 50,
                                width: 150,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                              }}
                              key={index}>
                              <TouchableOpacity
                                onPress={async () => {
                                  if (isShared) {
                                    Linking.openURL(
                                      `actpal://group${
                                        result?.callType === 'voice'
                                          ? 'Audio'
                                          : 'Video'
                                      }Call?meetingName=${
                                        result?.meetingId
                                      }&fcmToken=${''}&host=${result?.userId}`,
                                    );
                                  } else {
                                    const response = await groupBelong(
                                      friendId,
                                      userInfo?.memberToken,
                                      userInfo?.LoginToken,
                                    );
                                    if (response) {
                                      Linking.openURL(
                                        `actpal://group${
                                          result?.callType === 'voice'
                                            ? 'Audio'
                                            : 'Video'
                                        }Call?meetingName=${
                                          result?.meetingId
                                        }&fcmToken=${''}&host=${
                                          result?.userId
                                        }`,
                                      );
                                    } else {
                                      Alert.alert(
                                        'Error',
                                        'You are not a member of this group.',
                                      );
                                    }
                                  }
                                }}>
                                <Text
                                  style={{
                                    backgroundColor: 'green',
                                    color: 'white',
                                    padding: 10,
                                  }}>
                                  Join Now
                                </Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                style={{height: '50', marginLeft: '10%'}}
                                onPress={() =>
                                  Clipboard.setString(result?.message)
                                }>
                                <Text
                                  style={{
                                    backgroundColor: 'gray',
                                    color: 'white',
                                    padding: 10,
                                  }}>
                                  Copy
                                </Text>
                              </TouchableOpacity>
                            </View>
                          );
                        } else {
                          const longHtmlContent = `<p><a>${messagePart}</a></p>`;
                          return (
                            <View style={{flexDirection: 'column'}}>
                              <HTMLView
                                value={
                                  expanded
                                    ? longHtmlContent
                                    : truncateHtml(longHtmlContent)
                                }
                                key={`${index}_${idx}`}
                                stylesheet={isCurrentUser ? styles2 : styles3}
                              />
                              {longHtmlContent.split(' ').length > 50 && (
                                <TouchableOpacity onPress={toggleExpanded}>
                                  <Text style={styles.readMore}>
                                    {expanded ? 'Read Less' : 'Read More'}
                                  </Text>
                                </TouchableOpacity>
                              )}
                            </View>
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
                marginBottom: responsiveWidth(2),
              },
            ]}>
            {isCurrentUser && (
              <Image
                style={{width: responsiveWidth(5), height: responsiveWidth(2)}}
                source={require('../assets/png/check-double-fill.png')}
              />
            )}
            {messageTime}
          </Text>
        </IOScrollView>
      </>
    );
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <KeyboardAvoidingView behavior="padding" style={styles1.container}>
        <Modal
          visible={showCallOptions}
          transparent={true}
          animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Call Type</Text>
              <TouchableOpacity
                style={styles.optionButton}
                onPress={() => handleCallOptionSelection(0)}>
                <Text style={styles.optionText}>Private Call</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.optionButton}
                onPress={() => handleCallOptionSelection(1)}>
                <Text style={styles.optionText}>Public Call</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowCallOptions(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <View style={styles.chatHead}>
          <View style={styles.chatTop}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Image
                style={{
                  width: responsiveWidth(6),
                  height: responsiveWidth(6),
                  tintColor: 'white',
                }}
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
                  fontSize: responsiveFontSize(2),
                  fontWeight: '600',
                  color: 'white',
                  width: responsiveWidth(50),
                }}>
                {friendName}
              </Text>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <View
                  style={
                    isOnline == 'Online' ? styles.liveBtn : styles.offlineBtn
                  }></View>
                <Text
                  style={{
                    alignItems: 'center',
                    fontSize: responsiveFontSize(1.5),
                    color: '#fff',
                    paddingLeft: responsiveWidth(1),
                  }}>
                  {isOnline}{' '}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.callSection}>
            <TouchableOpacity
              onPress={() => fetchTokensForCalls('audio', !!tabIndex)}
              style={styles.callbtn}>
              <Image
                style={{
                  width: responsiveWidth(4),
                  height: responsiveWidth(4.5),
                }}
                source={require('../assets/png/whiteCall.png')}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => fetchTokensForCalls('video', !!tabIndex)}
              style={styles.callbtn}>
              <Image
                style={{
                  width: responsiveWidth(4),
                  height: responsiveWidth(3),
                }}
                source={require('../assets/png/whiteVideo.png')}
              />
            </TouchableOpacity>
          </View>
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

        {isLoading ? (
          <ChatShimmer />
        ) : messages.length > 0 ? (
          <FlatList
            inverted
            data={messages}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            refreshing={refreshing}
            contentContainerStyle={{flexGrow: 1}}
          />
        ) : (
          <View
            style={{
              flexBasis: 'auto',
              flexShrink: 0,
              flexGrow: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View>
              <View style={styles.endToend}>
                <Image
                  style={{
                    width: responsiveWidth(20),
                    height: responsiveWidth(20),
                    marginBottom: responsiveWidth(3),
                  }}
                  source={require('../assets/png/CustomIcon.png')}
                />
                <Text
                  style={{
                    fontSize: responsiveFontSize(1.8),
                    textAlign: 'center',
                    color: '#0E121B',
                  }}>
                  Messages and calls are end-to-end encrypted. No one outside of
                  this chat, not even ACTPAL, can read or listen to them. Tap to
                  learn more.
                </Text>
              </View>
            </View>
          </View>
        )}
        {isMediaUploading && <MediaUploadLoader />}

        <View style={[styles.sendBox, {width: width}]}>
          {showButtons && (
            <View style={styles.leftAreaBtn}>
              <TouchableOpacity
                style={styles.pushBtn}
                onPress={() => setattachmentPopupVisible(true)}>
                <Text
                  style={{
                    fontSize: responsiveFontSize(3.5),
                    color: 'white',
                    fontWeight: '400',
                    lineHeight: responsiveWidth(8),
                  }}>
                  +
                </Text>
              </TouchableOpacity>
            </View>
          )}
          <TextInput
            multiline
            value={inputValue}
            onChangeText={handleInputChange}
            onContentSizeChange={handleContentSizeChange}
            style={[
              styles.messageBox,
              {
                minHeight: responsiveWidth(11),
                maxHeight: responsiveWidth(33),
                width: showButtons ? '72%' : '86.4%',
              },
            ]}
            placeholder="Type message..."
            placeholderTextColor="#888"
          />
          {showButtons ? (
            <>
              <TouchableOpacity style={styles.sendBtn}>
                <Image
                  style={{
                    width: responsiveHeight(3),
                    height: responsiveHeight(3),
                  }}
                  source={require('../assets/png/mic-white.png')}
                />
              </TouchableOpacity>
            </>
          ) : (
            <>
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
                    style={{
                      width: responsiveWidth(5),
                      height: responsiveWidth(5),
                    }}
                    source={require('../assets/png/SendBtn.png')}
                  />
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
        <Modal
          transparent={true}
          visible={isPopupVisible || imgPopupVisible}
          animationType="slide"
          onRequestClose={handleClosePopup}>
          <Pressable
            style={{flex: 1, justifyContent: 'flex-end', alignItems: 'center'}}
            onPress={handleClosePopup}>
            <View style={styles.popup}>
              <TouchableOpacity style={styles.btn} onPress={handleMsgDelete}>
                <Image
                  style={styles.icon}
                  source={require('../assets/png/delete.png')}
                />
                <Text style={styles.btnText}>Delete</Text>
              </TouchableOpacity>
              {currMsgType && (
                <>
                  <TouchableOpacity style={styles.btn} onPress={handleEdit}>
                    <Image
                      style={styles.icon}
                      source={require('../assets/png/edit.png')}
                    />
                    <Text style={styles.btnText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.btn} onPress={handlePopSend}>
                    <Image
                      style={styles.icon}
                      source={require('../assets/png/forward.png')}
                    />
                    <Text style={styles.btnText}>Forward</Text>
                  </TouchableOpacity>
                </>
              )}
              <TouchableOpacity style={styles.btn} onPress={handleClosePopup}>
                <Image
                  style={styles.icon}
                  source={require('../assets/png/Cross.png')}
                />
                <Text style={styles.btnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Modal>
        <LongPressPopup
          isVisible={isPopupSend}
          onClose={handleClosePopup}
          pressMsg={pressMsg}
          handleClosePopup={handleClosePopup}
        />
      </KeyboardAvoidingView>
      <AttachmentPopup
        visible={attachmentPopupVisible}
        onClose={() => setattachmentPopupVisible(false)}
        onCameraPress={handleCameraPress}
        onPhotoVideoPress={handlePhotoVideoPress}
        onDocumentPress={handleDocumentPress}
      />
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
    marginVertical: responsiveWidth(3),
    fontSize: responsiveFontSize(1.6),
    color: 'black',
  },
  longPressed: {
    backgroundColor: '#619EE355',
    fontSize: responsiveFontSize(1.8),
    paddingHorizontal: responsiveWidth(2.8),
    paddingVertical: responsiveWidth(1.8),
    alignSelf: 'flex-end',
    color: 'black',
    minWidth: 50,
    maxWidth: responsiveWidth(60),
    borderWidth: 1,
    borderColor: '#B0D5FF',
  },
  sendMsg: {
    backgroundColor: '#1866B4',
    fontSize: responsiveFontSize(1.8),
    paddingHorizontal: responsiveWidth(2.8),
    paddingVertical: responsiveWidth(1.8),
    alignSelf: 'flex-end',
    color: 'black',
    minWidth: 50,
    maxWidth: responsiveWidth(60),
    borderWidth: 1,
    borderColor: '#B0D5FF',
  },
  rcvMsg: {
    backgroundColor: '#EAEAEA',
    paddingHorizontal: responsiveWidth(2.8),
    paddingVertical: responsiveWidth(1.8),
    alignSelf: 'flex-end',
    color: 'black',
    minWidth: 50,
    maxWidth: responsiveWidth(60),
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: responsiveWidth(1),
    marginHorizontal: responsiveWidth(2.5),
    maxWidth: responsiveWidth(60),
    borderRadius: responsiveWidth(3.5),
    backgroundColor: '#F2F2F2',
  },
  currentUserMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
  },
  messageText: {
    fontSize: responsiveFontSize(1.8),
  },
  media: {
    width: responsiveWidth(50),
    height: responsiveWidth(50),
    resizeMode: 'cover',
    borderRadius: responsiveWidth(2),
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
    color: 'black',
    textDecorationLine: 'underline',
  },
  messageTime: {
    fontSize: responsiveFontSize(1.6),
    alignSelf: 'flex-end',
    marginRight: 15,
    color: '#999',
  },
});

const styles = StyleSheet.create({
  popup: {
    backgroundColor: 'white',
    paddingHorizontal: responsiveWidth(6),
    paddingVertical: responsiveWidth(4),
    borderRadius: responsiveWidth(5),
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: responsiveWidth(5),
    width: responsiveWidth(92),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.36,
    shadowRadius: 6,

    elevation: 5,
  },
  btn: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: responsiveWidth(10),
    height: responsiveWidth(10),
  },
  btnText: {
    fontSize: responsiveFontSize(1.8),
    fontWeight: '600',
    color: '#000',
  },
  container: {
    flex: 1,
  },
  image: {
    width: 30,
    height: 30,
  },
  userImag: {
    width: responsiveWidth(9),
    height: responsiveWidth(9),
    borderRadius: responsiveWidth(5),
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
    height: responsiveWidth(2),
    width: responsiveWidth(2),
    backgroundColor: '#80FF00',
    borderRadius: 50,
  },
  offlineBtn: {
    height: responsiveWidth(2),
    width: responsiveWidth(2),
    backgroundColor: 'red',
    borderRadius: 50,
  },
  liveText: {
    color: '#80FF00',
    fontSize: responsiveFontSize(1.5),
  },
  callSection: {
    flexDirection: 'row',
    gap: 12,
    right: responsiveWidth(2),
  },
  popupOption: {
    flexDirection: 'row',
    gap: 25,
    right: responsiveWidth(3),
  },
  chatHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1E293C',
    paddingHorizontal: 15,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    elevation: 5,
  },
  sendBox: {
    backgroundColor: '#1E293C',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: responsiveWidth(3.5),
    paddingVertical: responsiveWidth(2.5),
    alignItems: 'flex-end',
  },
  leftAreaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  messageBox: {
    backgroundColor: '#F6F6F6',
    borderRadius: responsiveWidth(5.5),
    paddingLeft: responsiveWidth(4),
    paddingRight: responsiveWidth(4),
    fontSize: responsiveFontSize(1.8),
    lineHeight: responsiveWidth(5),
    color: '#000',
    paddingVertical: responsiveWidth(2.1),
  },
  sendBtn: {
    backgroundColor: '#1866B4',
    width: responsiveWidth(11),
    height: responsiveWidth(11),
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
    fontSize: responsiveFontSize(1.8),
    paddingHorizontal: 10,
    paddingVertical: 6,
    color: 'black',
    width: 300,
  },
  sendMsg: {
    backgroundColor: '#E6EEF7',
    borderRadius: responsiveWidth(4),
    alignSelf: 'flex-end',
    paddingHorizontal: responsiveWidth(2.8),
    paddingVertical: responsiveWidth(1.8),
    color: '#000',
    minWidth: 50,
    maxWidth: responsiveWidth(60),
    borderWidth: 1,
    borderColor: '#B0D5FF',
  },
  recvImg: {
    width: responsiveWidth(6),
    height: responsiveWidth(6),
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'red',
    marginTop: responsiveWidth(2.2),
  },
  recvMsgBox: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-end',
    marginHorizontal: 10,
    marginVertical: 10,
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
    fontSize: responsiveFontSize(1.8),
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 10,
    alignSelf: 'flex-end',
  },
  closeButtonText: {
    fontSize: responsiveFontSize(1.8),
    color: 'blue',
  },
  popupBtn: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  callbtn: {
    width: responsiveWidth(10),
    height: responsiveWidth(10),
    backgroundColor: '#293446',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: responsiveWidth(10),
  },
  pushBtn: {
    backgroundColor: '#1866B4',
    height: responsiveWidth(11),
    width: responsiveWidth(11),
    borderRadius: responsiveWidth(6),
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptymsg: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: responsiveWidth(8),
  },
  emptymsgCont: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: responsiveWidth(3),
  },
  endToend: {
    width: responsiveWidth(80),
    backgroundColor: '#F5F7FA',
    justifyContent: 'center',
    alignItems: 'center',
    padding: responsiveWidth(3),
    borderRadius: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
  },
  modalTitle: {
    fontSize: responsiveFontSize(1.8),
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  optionButton: {
    backgroundColor: '#1866B4',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  optionText: {
    color: 'white',
    textAlign: 'center',
    fontSize: responsiveFontSize(1.8),
  },
  cancelButton: {
    marginTop: 10,
  },
  cancelText: {
    color: '#1866B4',
    textAlign: 'center',
    fontSize: responsiveFontSize(1.8),
  },
  readMore: {
    fontSize: responsiveFontSize(1.8),
    fontWeight: '600',
    color: '#1866B4',
  },
});

const styles2 = StyleSheet.create({
  a: {
    color: 'black',
    fontSize: responsiveFontSize(1.8),
  },
});

const styles3 = StyleSheet.create({
  a: {
    color: 'black',
    fontSize: responsiveFontSize(1.8),
  },
});

export default ChatSection;
