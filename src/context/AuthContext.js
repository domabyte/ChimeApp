import React, {createContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../config/config';
import axios from 'axios';
import * as Keychain from 'react-native-keychain';

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
    const queryString =
      config.registrationURL +
      `?Mem_Name=${firstName}&Mem_LName=${lastName}&Email=${email}&Password=${newPassword}&ConfirmPassword=${confirmPassword}&Captcha=${encryptedCaptcha}&UserCaptcha=${confirmCaptcha}&termcondition=${isChecked}`;
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
        setError(data.errorText || 'Registration failed.');
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
        };
        let userInfo = value;
        setUserInfo(userInfo);
        AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
        setIsLoading(false);
      } else {
        setError(data.errorText);
        setIsLoading(false);
      }
    } catch (err) {
      setIsLoading(false);
      console.log(err.error);
    }
  };

  const login = async (email, password, rememberMe) => {
    setIsLoading(true);
    const url = config.loginURL + email + '&password=' + password;
    try {
      const {data} = await axios.get(url);
      if (data.Mem_ID && data.Mem_ID > 0) {
        const value = {
          name: data.Mem_Name + ' ' + data.Mem_LName,
          id: data.Mem_ID,
          friendid: data.FriendId,
          memberToken: data.MemberToken,
          LoginToken: data.LoginToken,
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

  const logout = () => {
    setIsLoading(true);
    try {
      AsyncStorage.removeItem('userInfo');
      setUserInfo({});
      setIsLoading(false);
      setError(null);
    } catch (err) {
      console.log(`logout error ${e}`);
      setIsLoading(false);
    }
  };

  const isLoggedIn = async () => {
    try {
      setSplashLoading(true);

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

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        userInfo,
        splashLoading,
        error,
        setError,
        register,
        otpVerify,
        login,
        forgotPassword,
        forgotOTPVerification,
        changePassword,
        logout,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
