import React, { useState, useContext, useRef, createRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  StatusBar,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { AuthContext } from '../../context/AuthContext';

const OtpVerification = ({ navigation, route }) => {
  const {Mem_ID, message, firstName, lastName, email, newPassword, confirmPassword, encryptedCaptcha, confirmCaptcha, isChecked} = route.params;
  const [otpValues, setOtpValues] = useState(Array(6).fill(''));
  const [timer, setTimer] = useState(60);
  const [securityCodeTimer, setSecurityCodeTimer] = useState(20 * 60);
  const {isLoading, register, otpVerify, error, setError} = useContext(AuthContext);
  const inputRefs = useRef(otpValues.map(() => createRef()));

  useEffect(() => {
    setError('');
    const timerId = timer > 0 && setInterval(() => setTimer(timer - 1), 1000);
    return () => clearInterval(timerId);
  }, [timer]);

  useEffect(() => {
    const securityTimerId =
      securityCodeTimer > 0 &&
      setInterval(() => setSecurityCodeTimer(securityCodeTimer - 1), 1000);
    return () => clearInterval(securityTimerId);
  }, [securityCodeTimer]);

  const setOtpValue = (text, index) => {
    const newOtpValues = [...otpValues];
    newOtpValues[index] = text;
    setOtpValues(newOtpValues);
    if (text && index < otpValues.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleVerifyPress = async () => {
    const otpString = otpValues.join('');
    if (otpString.length === 6) {
      const userInfo = await otpVerify(Mem_ID, otpString);
      if(userInfo){
        navigation.navigate('information', {userInfo});
      }
    } else {
      setError('Please fill in all OTP fields');
    }
  };

  const handleResendOTP = async () => {
    try{
    const response = await register(
      firstName,
      lastName,
      email,
      newPassword,
      confirmPassword,
      encryptedCaptcha,
      confirmCaptcha,
      isChecked,
      resend=true);
      if (response) {
        setTimer(60);
        setSecurityCodeTimer(20 * 60);
      } else{
        setError(response);
      }
    } catch(err){
      console.log("Failed to send the OTP response : ", err);
    }
  } 

  const formatEmail = () => {
    const parts = email.split('@');
    return `${parts[0].slice(0, 2)}**********@${parts[1]}`;
  };

  const formatTimer = time => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <>
      <StatusBar barStyle={'dark-lite'} backgroundColor="#1E293C" />
      <ImageBackground
        source={require('../../assets/png/LoginBg.png')}
        style={styles.backgroundImg}>
        <ScrollView style={styles.mainView}>
          <View style={styles.container}>
            <Spinner visible={isLoading} />
            <View style={styles.logo}>
              <Image
                style={{ width: 100, height: 53, resizeMode: 'cover' }}
                source={require('../../assets/png/Actpal_logo.png')}
              />
            </View>
            <View style={[styles.center, { marginTop: 20 }]}>
              <Text style={{ fontSize: 22, fontWeight: '600', color: 'black' }}>
                We sent a code to your email 
              </Text>
              <Text style={styles.subtext}>The security code will be <Text style={{ fontWeight: '600' }}>sent to your account's email address</Text> within the next couple of minutes. Please check your email inbox. If you do not see it there, be sure to <Text style={{ fontWeight: '600' }}>check your spam folder</Text> as well.</Text>
              <Text
                style={{ fontSize: 16, marginTop: 10, fontWeight: '600', color: 'black', textAlign: 'center' }}>
                Enter the 6-digit verification code sent to
              </Text>
              <Text onPress={() => navigation.goBack()}
                style={{ fontSize: 16, color: 'black', lineHeight: 20 }}>
                  {formatEmail(email)}
                <Text style={{ color: '#1866B4', lineHeight: 20 }} onPress={()=> navigation.goBack()}>
                {' '}
                .change e-mail address
                </Text>
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  color: 'black',
                  marginTop: 18,
                  fontWeight: '500',
                }}>
                Your Code
              </Text>
            </View>
            <View style={styles.otpContainer}>
              {otpValues.map((value, index) => (
                <TextInput
                  key={index}
                  ref={input => {
                    inputRefs.current[index] = input;
                  }}
                  onChangeText={text => setOtpValue(text, index)}
                  value={value}
                  maxLength={1}
                  keyboardType="numeric"
                  style={styles.otpInput}
                  onKeyPress={({ nativeEvent }) => {
                    if (
                      nativeEvent.key === 'Backspace' &&
                      index !== 0 &&
                      otpValues[index] === ''
                    ) {
                      inputRefs.current[index - 1].focus();
                    }
                  }}
                />
              ))}
            </View>
            <Text
              style={{
                color: 'black',
                textAlign: 'center',
                fontSize: 16,
                marginTop: 18,
              }}>
              Security Code will be valid for{' '}
              <Text style={{ fontWeight: '500' }}>
              {formatTimer(securityCodeTimer)}
              </Text>
            </Text>
            {timer > 0 ? (
              <Text
                style={{
                  color: '#666',
                  textAlign: 'center',
                  fontSize: 16,
                  marginTop: 10,
                }}>
                <Text style={{color: '#1866B4'}}>Security code sent.</Text>{' '}
                Resend in <Text style={{color: '#111'}}>{timer}</Text> seconds
              </Text>
            ) : (
              <TouchableOpacity style={{marginTop: 18}}>
                <Text
                  style={{color: '#1866B4', textAlign: 'center', fontSize: 16}}
                  onPress={handleResendOTP}>
                  Resend OTP
                </Text>
              </TouchableOpacity>
            )}
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            <TouchableOpacity style={styles.verifyButton} onPress={handleVerifyPress}>
              <Text style={styles.buttonText}>Verify</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ImageBackground>
    </>

  );
};
const styles = StyleSheet.create({
  backgroundImg: {
    resizeMode: 'cover',
    height: '100%',
  },
  container: {
    flex: 1,
  },
  center: {
    alignItems: 'center',
    display: 'flex',
  },
  logo: {
    justifyContent: 'center',
    display: 'flex',
    alignItems: 'center',
    marginTop: 150,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
  otpInput: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
    width: 50,
    height: 50,
    textAlign: 'center',
    fontSize: 20,
    marginHorizontal: 5,
    marginTop: 18,
  },
  verifyButton: {
    backgroundColor: '#1866B4',
    height: 45,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    marginTop: 20,
    marginHorizontal: 20,
    marginBottom: 25
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },
  subtext: {
    fontSize: 14,
    textAlign: 'center',
    marginHorizontal: 25,
    marginTop: 10,
    color: 'black'
  }
});

export default OtpVerification;
