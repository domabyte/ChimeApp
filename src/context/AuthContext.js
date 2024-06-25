import React, {createContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../config/config';
import axios from 'axios';
import * as Keychain from 'react-native-keychain';
import configURL from '../config/config';
import {requestUserPermission} from '../utils/NotificationService';
import {loginReplace} from '../utils/helper';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [userInfo, setUserInfo] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [splashLoading, setSplashLoading] = useState(false);
  const [error, setError] = useState('');

  const register = async (
    firstName,
    lastName,
    email,
    newPassword,
    confirmPassword,
    encryptedCaptcha,
    confirmCaptcha,
    isChecked,
    resend,
    navigationCallback,
  ) => {
    setIsLoading(true);
    const token = await requestUserPermission();
    const queryString =
      config.registrationURL +
      `?Mem_Name=${firstName}&Mem_LName=${lastName}&Email=${email}&Password=${newPassword}&ConfirmPassword=${confirmPassword}&Captcha=${encryptedCaptcha}&UserCaptcha=${confirmCaptcha}&termcondition=${isChecked}&DeviceId=${token.deviceToken}&DeviceToken=${token.fcmToken}`;
    try {
      const {data} = await axios.post(queryString);
      if (data.Mem_ID && data.Mem_ID > 0) {
        if (!resend) {
          navigationCallback(
            data.Mem_ID,
            data.message,
            firstName,
            lastName,
            email,
            newPassword,
            confirmPassword,
            encryptedCaptcha,
            confirmCaptcha,
            isChecked,
          );
        } else {
          return data.message;
        }
      } else {
        if (data.errorText) {
          setError(data.errorText || 'Registration failed.');
        }
      }
    } catch (err) {
      setError(`Registration error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const otpVerify = async (Mem_ID, otpString) => {
    setIsLoading(true);
    if (otpString.length !== 6) {
      setError('OTP must be 6 digits');
      setIsLoading(false);
      return;
    }
    const [OTP1, OTP2, OTP3, OTP4, OTP5, OTP6] = otpString.split('');

    const queryString = `${config.otpRegistrationURL}?Mem_Id=${Mem_ID}&OTP1=${OTP1}&OTP2=${OTP2}&OTP3=${OTP3}&OTP4=${OTP4}&OTP5=${OTP5}&OTP6=${OTP6}`;
    try {
      const {data} = await axios.post(queryString);
      if (data.Mem_ID && data.Mem_ID > 0) {
        const value = {
          name: data.Mem_Name + ' ' + data.Mem_LName,
          id: data.Mem_ID,
          friendid: data.FriendId,
          memberToken: data.MemberToken,
          LoginToken: data.LoginToken,
          encryptToken: data.EncryptMemId,
        };
        let userInfo = value;
        setIsLoading(false);
        return userInfo;
      } else {
        setError(data.errorText);
        setIsLoading(false);
        return false;
      }
    } catch (err) {
      setIsLoading(false);
      console.log(err.error);
    }
  };

  const getUserOnlineStatus = async (
    memberToken,
    loginToken,
    memId,
    username,
  ) => {
    setIsLoading(true);
    try {
      const {data} = await axios.get(
        `${configURL._getUserInfoURL}${memberToken}${
          memId ? `&MemId=${memId}` : ''
        }${username ? `&username=${username}` : ''}`,
        {
          headers: {
            'Content-Type': 'application/json',
            MemberToken: memberToken,
            LoginToken: loginToken,
          },
        },
      );
      if (data) {
        setIsLoading(false);
        return data;
      } else {
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const basicInfo = async (
    location,
    countryValue,
    id,
    stateValue,
    postalCode,
    name,
  ) => {
    setIsLoading(true);
    try {
      const {data} = await axios.post(config.basicInfoURL, {
        Mem_Address: location,
        Mem_CountryID: countryValue,
        Mem_ID: id,
        Mem_StateID: stateValue,
        Mem_ZipCode: postalCode,
        Mem_DOB: '1900-01-01',
        Mem_Name: name.split(' ')[0],
        Mem_LName: name.split(' ')[1],
      });
      if (data) {
        if (data.code === 1) {
          setIsLoading(false);
          return data;
        }
      } else {
        setIsLoading(false);
        setError(data.errorText);
        return false;
      }
    } catch (err) {
      setIsLoading(false);
      console.log(err.error);
    }
  };

  const updatePhotoInfo = async (image, userInfo) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('Photo', {
        uri: image.uri?.uri,
        name: image.uri?.fileName,
        type: image.uri?.type,
      });
      formData.append('Mem_id', userInfo.encryptToken);
      formData.append('MemberToken', userInfo.encryptToken);
      const {data} = await axios.post(config.uploadPhotoURL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          MemberToken: userInfo.encryptToken,
        },
      });
      if (data) {
        if (data.code === 1) {
          setIsLoading(false);
          return data;
        }
      } else {
        setIsLoading(false);
        setError(data.errorText);
        return false;
      }
    } catch (err) {
      setIsLoading(false);
      console.log(err.error);
    }
  };

  const login = async (email, password, rememberMe) => {
    setIsLoading(true);
    const token = await requestUserPermission();
    console.log('token : ', token);
    const url =
      config.loginURL +
      email +
      '&password=' +
      password +
      '&DeviceId=' +
      token.deviceToken +
      '&DeviceToken=' +
      token.fcmToken;
    try {
      const {data} = await axios.get(url);
      if (data.Mem_ID && data.Mem_ID > 0) {
        const value = {
          name: data.Mem_Name + ' ' + data.Mem_LName,
          id: data.Mem_ID,
          friendid: data.FriendId,
          memberToken: data.MemberToken,
          LoginToken: data.LoginToken,
          memberPhoto: data.Mem_photo,
          userId: data.UserName,
        };
        let userInfo = value;
        setUserInfo(userInfo);
        AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
        if (rememberMe) {
          await Keychain.setGenericPassword(email, password);
        }
        setIsLoading(false);
      } else {
        setError(data.errorText);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  const forgotPassword = async email => {
    setIsLoading(true);
    const url = config.forgotPassURL + '?mailid=' + email;
    try {
      const {data} = await axios.post(url);
      setIsLoading(false);
      if (data.Mem_ID && data.Mem_ID > 0) {
        const value = {
          id: data.Mem_ID,
          message: data.message,
          email,
        };
        return value;
      } else {
        setError(data.errorText);
        setIsLoading(false);
        return null;
      }
    } catch (err) {
      setIsLoading(false);
      console.log(error);
    }
  };

  const forgotOTPVerification = async (Mem_ID, otpString) => {
    setIsLoading(true);
    if (otpString.length !== 6) {
      setError('OTP must be 6 digits');
      setIsLoading(false);
      return;
    }
    const [OTP1, OTP2, OTP3, OTP4, OTP5, OTP6] = otpString.split('');

    const queryString = `${config.forgotOTPVerifyURL}?Mem_Id=${Mem_ID}&OTP1=${OTP1}&OTP2=${OTP2}&OTP3=${OTP3}&OTP4=${OTP4}&OTP5=${OTP5}&OTP6=${OTP6}`;
    try {
      const {data} = await axios.post(queryString);
      setIsLoading(false);
      if (data.Mem_ID && data.Mem_ID > 0) {
        return true;
      } else {
        setError(data.errorText);
        setIsLoading(false);
      }
    } catch (err) {
      setIsLoading(false);
      console.log(err.error);
    }
  };

  const changePassword = async (Mem_ID, password, confirmPassword) => {
    setIsLoading(true);
    try {
      const {data} = await axios.post(config.resetPasswordURL, {
        Mem_ID: Mem_ID,
        New_password: password,
        Confirm_password: confirmPassword,
      });
      setIsLoading(false);
      return data.code === 1 ? true : setError(data.errorText);
    } catch (err) {
      setIsLoading(false);
      console.log(err.error);
    }
  };

  const logout = async () => {
    console.log('User info is : ', userInfo);
    setIsLoading(true);
    const token = await requestUserPermission();
    const queryString = `${configURL.logoutURL}${userInfo.memberToken}&DeviceId=${token?.deviceToken}`;
    try {
      const {data} = await axios.get(queryString, {
        headers: {
          MemberToken: userInfo.memberToken,
          LoginToken: userInfo.LoginToken,
        },
      });
      if (data?.message) {
        AsyncStorage.removeItem('userInfo');
        setUserInfo({});
        setIsLoading(false);
        setError(null);
      }
    } catch (err) {
      console.log(`logout error ${err}`);
      setIsLoading(false);
    }
  };

  const isLoggedIn = async () => {
    setSplashLoading(true);
    try {
      let userInfo = await AsyncStorage.getItem('userInfo');
      userInfo = JSON.parse(userInfo);

      if (userInfo) {
        setUserInfo(userInfo);
      }
      setSplashLoading(false);
    } catch (e) {
      setSplashLoading(false);
      console.log(`is logged in error ${e}`);
    }
  };
  useEffect(() => {
    isLoggedIn();
  }, []);

  const getSuggestedUsers = async id => {
    setIsLoading(true);
    try {
      const {data} = await axios.get(configURL.suggestedUserURL, {
        Mem_ID: id,
      });
      setIsLoading(false);
      if (data.length > 0) {
        return data;
      } else {
        setError('Sorry could not find the requested users');
        return false;
      }
    } catch (err) {
      console.log(`Error getting suggestedUsers : ${err.error}`);
      setIsLoading(false);
    }
  };

  const searchFriends = async (userId, page, pageSize, keywords) => {
    setIsLoading(true);
    const url = keywords
      ? configURL.findFriendsURL +
        userId +
        '&page=' +
        page +
        '&pageSize=' +
        pageSize +
        '&keywords=' +
        keywords
      : configURL.findFriendsURL +
        userId +
        '&page=' +
        page +
        '&pageSize=' +
        pageSize;
    try {
      const {data} = await axios.post(url);
      setIsLoading(false);
      if (data.length > 0) {
        return data;
      } else {
        setError('Sorry could not find the requested users');
        return false;
      }
    } catch (err) {
      console.log(`Error finding Friends : ${err.error}`);
      setIsLoading(false);
    }
  };

  const sendFriendRequest = async (id, memberToken, loginToken) => {
    setIsLoading(true);
    try {
      const {data} = await axios.post(
        configURL.sentFriendRequestURL,
        {
          Mem_ID: id,
          MemberToken: memberToken,
        },
        {
          headers: {
            Membertoken: memberToken,
            loginToken: loginToken,
          },
        },
      );
      if (data.sendre === 1) {
        setIsLoading(false);
        return true;
      } else {
        setError(data.errorText);
        setIsLoading(false);
        return false;
      }
    } catch (err) {
      console.log(`Error sending friend request : ${err.error}`);
      setIsLoading(false);
    }
  };

  const getSentFriendRequest = async (
    memberToken,
    MemId,
    loginToken,
    keywords,
  ) => {
    setIsLoading(true);
    const url = keywords
      ? configURL.getSentFriendRequestURL +
        memberToken +
        '&MemId=' +
        MemId +
        '&page=1&pageSize=40&Status=4&IsSenderId=1&keywords=' +
        keywords
      : configURL.getSentFriendRequestURL +
        memberToken +
        '&MemId=' +
        MemId +
        '&page=1&pageSize=40&Status=4&IsSenderId=1';
    try {
      const {data} = await axios.get(url, {
        headers: {
          MemberToken: memberToken,
          LoginToken: loginToken,
        },
      });
      if (data.length > 0) {
        setIsLoading(false);
        return data;
      } else {
        setError('No any friend request sent.');
        setIsLoading(false);
      }
    } catch (err) {
      console.log(`Error getting sent friend request : ${err}`);
      setIsLoading(false);
    }
  };

  const cancelFriendRequest = async (id, memberToken, loginToken) => {
    setIsLoading(true);
    try {
      const {data} = await axios.post(
        configURL.cancelFriendRequestURL,
        {
          FriendList_Id: id,
          MemberToken: memberToken,
        },
        {
          headers: {
            Membertoken: memberToken,
            LoginToken: loginToken,
          },
        },
      );
      if (data.errorText) {
        setError(data.errorText);
        setIsLoading(false);
        return false;
      } else {
        setIsLoading(false);
        return true;
      }
    } catch (err) {
      console.log(`Error canceling friend request : ${err.error}`);
      setIsLoading(false);
    }
  };

  const receiveFriendRequest = async id => {
    setIsLoading(true);
    try {
      const {data} = await axios.post(configURL.receiveFriendRequestURL + id);
      if (data.length > 0) {
        setIsLoading(false);
        return data;
      } else {
        setError('No any friend request sent.');
        setIsLoading(false);
      }
    } catch (err) {
      console.log(`Error getting sent friend request : ${err}`);
      setIsLoading(false);
    }
  };

  const getReceiveFriendRequest = async (
    memberToken,
    MemId,
    loginToken,
    keywords,
  ) => {
    setIsLoading(true);
    try {
      const {data} = await axios.get(
        configURL.getSentFriendRequestURL +
          memberToken +
          '&MemId=' +
          MemId +
          '&page=1&Status=4&IsSenderId=0&pageSize=40&keywords=' +
          keywords,
        {
          headers: {
            MemberToken: memberToken,
            LoginToken: loginToken,
          },
        },
      );
      if (data.length > 0) {
        setIsLoading(false);
        return data;
      } else {
        setError('No any friend request received.');
        setIsLoading(false);
      }
    } catch (err) {
      console.log(`Error getting sent friend request : ${err}`);
      setIsLoading(false);
    }
  };

  const acceptFriendRequest = async (memberToken, id, loginToken) => {
    setIsLoading(true);
    try {
      const {data} = await axios.post(
        configURL.acceptFriendRequestURL,
        {
          FriendList_Id: id,
          MemberToken: memberToken,
        },
        {
          headers: {
            Membertoken: memberToken,
            LoginToken: loginToken,
          },
        },
      );
      if (data.errorText) {
        setError(data.errorText);
        setIsLoading(false);
        return false;
      } else {
        setIsLoading(false);
        return true;
      }
    } catch (err) {
      console.log(`Error accepting friend request : ${err}`);
      setIsLoading(false);
    }
  };

  const getAllFriends = async (memberToken, MemId, loginToken, keywords) => {
    setIsLoading(true);
    const url = keywords
      ? configURL.getSentFriendRequestURL +
        memberToken +
        '&MemId=' +
        MemId +
        '&page=1&pageSize=50&keywords=' +
        keywords
      : configURL.getSentFriendRequestURL +
        memberToken +
        '&MemId=' +
        MemId +
        '&page=1&pageSize=50';
    try {
      const {data} = await axios.get(url, {
        headers: {
          MemberToken: memberToken,
          LoginToken: loginToken,
        },
      });
      if (data.length > 0) {
        setIsLoading(false);
        return data;
      } else {
        setError('No friend found.');
        setIsLoading(false);
      }
    } catch (err) {
      console.log(`Error getting all friends : ${err.error}`);
      setIsLoading(false);
    }
  };

  const unFriendRequest = async (id, memberToken, loginToken) => {
    setIsLoading(true);
    try {
      const {data} = await axios.post(
        configURL.unFriendRequestURL,
        {
          FriendList_Id: id,
          MemberToken: memberToken,
        },
        {
          headers: {
            Membertoken: memberToken,
            LoginToken: loginToken,
          },
        },
      );
      if (data.errorText) {
        setError(data.errorText);
        setIsLoading(false);
        return false;
      } else {
        setIsLoading(false);
        return true;
      }
    } catch (err) {
      console.log(`Error unfriend request : ${err}`);
      setIsLoading(false);
    }
  };

  const messageFriends = async (memberToken, keywords) => {
    setIsLoading(true);
    const url = keywords
      ? configURL.friendListURL +
        memberToken +
        '&page=1&pageSize=30&keywords=' +
        keywords
      : configURL.friendListURL + memberToken + '&page=1&pageSize=30';
    try {
      const {data} = await axios.get(url);
      if (data.length > 0) {
        setIsLoading(false);
        return data;
      } else {
        setError('No friend found.');
        setIsLoading(false);
      }
    } catch (err) {
      console.log(`Error getting friend list : ${err}`);
      setIsLoading(false);
    }
  };

  const getGroups = async (memberToken, keywords) => {
    setIsLoading(true);
    try {
      const url = keywords
        ? config.groupURL +
          memberToken +
          '&page=1&pageSize=10&Group_Id=0&keyword=' +
          keywords
        : config.groupURL + memberToken + '&page=1&pageSize=10&Group_Id=0';

      const {data} = await axios.get(url);
      if (data.length > 0) {
        setIsLoading(false);
        return data;
      } else {
        setError('No group found.');
        setIsLoading(false);
      }
    } catch (err) {
      console.log(`Error getting groups : ${err}`);
      setIsLoading(false);
    }
  };

  const fetchChatHistory = async (memberToken, memID, page) => {
    setIsLoading(true);
    try {
      const {data} = await axios.get(
        configURL.chatHistoryURL +
          `${memberToken}&MemId=${memID}&pageSize=30&page=${page}`,
      );
      if (data.length > 0) {
        setIsLoading(false);
        return data;
      } else {
        setError('No chat history found.');
        setIsLoading(false);
        return null;
      }
    } catch (err) {
      console.log(`Error fetching chat history : ${err}`);
      setIsLoading(false);
    }
  };

  const getGroupMembers = async (
    loginToken,
    memberToken,
    groupId,
    page,
    pageSize = 30,
  ) => {
    try {
      const {data} = await axios.get(
        configURL.getGroupListURL +
          `${memberToken}&GroupId=${groupId}&page=${page}&pageSize=${pageSize}`,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            MemberToken: memberToken,
            LoginToken: loginToken,
          },
        },
      );
      return data;
    } catch (error) {
      console.log('Error in getting getGroupMembers : ', error);
      throw error;
    }
  };

  const sendMessage = async (
    memberToken,
    loginToken,
    messageText,
    friendId,
    msgId,
    isFriendCircle,
    groupMemberId,
  ) => {
    const formData = new FormData();
    formData.append('MemberToken', memberToken);
    formData.append('messageText', messageText);
    formData.append('ReceiverID', friendId);
    formData.append('MessageId', msgId);
    formData.append('IsCallMsg', false);
    formData.append('IsFriendCircle', isFriendCircle);
    if (isFriendCircle === 1) {
      groupMemberId.map(data => {
        formData.append('FriendsId', data);
      });
    }

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        MemberToken: memberToken,
        LoginToken: loginToken,
      },
    };
    try {
      const {data} = await axios.post(
        configURL.sendPrivateMsgURL,
        formData,
        config,
      );
      if (data?.MessageId) {
        return data?.message;
      } else {
        return false;
      }
    } catch (err) {
      console.log('Error sending the message ', err);
    }
  };

  const deleteMsg = async (memberToken, loginToken, msgId) => {
    try {
      const {data} = await axios.delete(configURL.deleteMsgURL, {
        headers: {
          LoginToken: loginToken,
          MemberToken: memberToken,
        },
        data: {
          MemberToken: memberToken,
          MessageId: msgId,
        },
      });
      if (data.message) {
        console.log('Data is : ', data.message);
        return data;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getFCMToken = async (memId, memberToken, loginToken) => {
    try {
      const {data} = await axios.post(
        configURL.getFCMTokenURL,
        {
          Mem_Id: memId,
        },
        {
          headers: {
            LoginToken: loginToken,
            MemberToken: memberToken,
          },
        },
      );
      if (data.length > 0) {
        const deviceTokens = data
          .map(item => item.DeviceToken)
          .filter(token => token !== null && token !== undefined);
        return deviceTokens;
      }
      return [];
    } catch (err) {
      console.log('Error fetching the FCM token : ', {err});
    }
  };

  const doCall = async (tokens, friendName, userId, id, token, type) => {
    try {
      const {data} = await axios.post(configURL.callURL, {
        fcmTokens: tokens,
        friendName,
        userId,
        id,
        token,
        type,
      });
      if (data.code) {
        return data;
      }
    } catch (err) {
      console.log('Error in doCall : ', {err});
    }
  };

  const getUserInfo = async (memberToken, loginToken, memId) => {
    setIsLoading(true);
    try {
      const url = configURL._getUserInfoURL + memberToken + '&MemId=' + memId;
      const {data} = await axios.get(url, {
        headers: {
          'Content-Type': 'application/json',
          MemberToken: memberToken,
          LoginToken: loginToken,
        },
      });
      if (data) {
        setIsLoading(false);
        return data;
      } else {
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const groupCall = async (groupId, memberToken, loginToken, calltype, isPublic) => {
    setIsLoading(true);
    try {
      const {data} = await axios.post(
        configURL.groupCallURL,
        {
          GroupId: groupId,
          MemberToken: memberToken,
          CallType: calltype,
          IsShared: isPublic,
        },
        {
          headers: {
            MemberToken: memberToken,
            LoginToken: loginToken,
          },
        },
      );
      if (data) {
        setIsLoading(false);
        return data;
      }
    } catch (err) {
      console.log('Error in groupCall : ', {err});
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        setIsLoading,
        userInfo,
        setUserInfo,
        splashLoading,
        error,
        getUserOnlineStatus,
        setError,
        register,
        otpVerify,
        basicInfo,
        updatePhotoInfo,
        login,
        forgotPassword,
        forgotOTPVerification,
        changePassword,
        logout,
        getSuggestedUsers,
        searchFriends,
        sendFriendRequest,
        getSentFriendRequest,
        cancelFriendRequest,
        receiveFriendRequest,
        getReceiveFriendRequest,
        acceptFriendRequest,
        getAllFriends,
        unFriendRequest,
        messageFriends,
        getGroups,
        fetchChatHistory,
        getGroupMembers,
        sendMessage,
        deleteMsg,
        getFCMToken,
        doCall,
        getUserInfo,
        groupCall,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
