import React, { useState, useEffect, useRef, createRef, useContext } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  ImageBackground,
  KeyboardAvoidingView,
  StatusBar,
  Image,
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { AuthContext } from '../../context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions';
import LinearGradient from 'react-native-linear-gradient';

const ForgotPassOTP = ({ navigation, route }) => {
  const { Mem_ID, email } = route.params;
  const [otpValues, setOtpValues] = useState(Array(6).fill(''));
  const [timer, setTimer] = useState(60);
  const [securityCodeTimer, setSecurityCodeTimer] = useState(20 * 60);
  const { isLoading, forgotOTPVerification, forgotPassword, error, setError } =
    useContext(AuthContext);

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
      const response = await forgotOTPVerification(Mem_ID, otpString);
      if (response) {
        navigation.navigate('changePassword', { Mem_ID: Mem_ID });
      }
    } else {
      setError('Please fill in all OTP fields');
    }
  };

  const handleResendOTP = async () => {
    await forgotPassword(email);
    setTimer(60);
    setSecurityCodeTimer(20 * 60);
  };

  const formatEmail = email => {
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
      <SafeAreaView style={{ height: '100%' }}>
        <ScrollView style={Styles.mainView}>
          <View  >
            <KeyboardAvoidingView behavior='padding' style={{ marginBottom: 100 }}>
              <Spinner visible={isLoading} />
              <View style={Styles.logo}>
                <Image
                  style={{ width: responsiveWidth(25), height: responsiveWidth(25), resizeMode: 'cover' }}
                  source={require('../../assets/png/EmailVerify.png')}
                />
              </View>
              <View style={[Styles.center, { marginTop: 20 }]}>
                <Text style={{ fontSize: 22, fontWeight: '600', color: 'black' }}>
                  Enter Verification Code
                </Text>
                <Text
                  style={{
                    fontSize: responsiveFontSize(2),
                    marginTop: responsiveWidth(3),
                    fontWeight: '400',
                    color: 'black',
                    textAlign: 'center',
                  }}>
                  We’ve sent a code to {formatEmail(email)}
                </Text>
                <Text
                  onPress={() => navigation.goBack()}
                  style={{ fontSize: 16, color: '#1866B4', lineHeight: 20 }}>
                  {' '}
                  change e-mail address
                </Text>
                {/* <Text
                  style={{
                    fontSize: 16,
                    color: 'black',
                    marginTop: 18,
                    fontWeight: '500',
                  }}>
                  Your Code
                </Text> */}
              </View>
              <View>
                <View style={Styles.otpContainer}>
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
                      style={Styles.otpInput}
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
                    <Text style={{ color: '#1866B4' }}>Security code sent.</Text>{' '}
                    Resend in <Text style={{ color: '#111' }}>{timer}</Text> seconds
                  </Text>
                ) : (
                  <TouchableOpacity style={{ marginTop: 18 }}>
                    <Text
                      style={{ color: '#1866B4', textAlign: 'center', fontSize: 16 }}
                      onPress={handleResendOTP}>
                      Resend OTP
                    </Text>
                  </TouchableOpacity>
                )}
                {error ? <Text style={Styles.errorText}>{error}</Text> : null}
                <TouchableOpacity onPress={handleVerifyPress}>
                  <LinearGradient style={Styles.blueBtn} colors={['#3B7DBF', '#1866B4']} >
                    <Text style={Styles.buttonStyle}>Confirm Security Code</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </View>
        </ScrollView>
      </SafeAreaView>

    </>
  );
};
export default ForgotPassOTP;

const Styles = StyleSheet.create({
  backgroundImg: {
    resizeMode: 'cover',
    height: '100%',
    alignContent: 'center',
    backgroundColor: '#333333'
  },
  container: {
    flex: 1,
    alignContent: 'center',
  },
  center: {
    alignItems: 'center',
    display: 'flex',
  },
  logo: {
    justifyContent: 'center',
    display: 'flex',
    alignItems: 'center',
    marginTop: responsiveWidth(30),
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
  mainView: {
    flex: 1,
    paddingHorizontal: responsiveWidth(2),
    backgroundColor: 'white'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subTitle: {
    fontSize: 16,
    marginBottom: 20,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  otpInput: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: responsiveWidth(3),
    width: responsiveWidth(12),
    height: responsiveWidth(12),
    textAlign: 'center',
    fontSize: 20,
    marginHorizontal: 5,
    marginTop: responsiveWidth(7),
  },
  timerText: {
    fontSize: 14,
    marginBottom: 15,
  },
  errorMsg: {
    color: 'red',
    marginBottom: 15,
  },
  buttonStyle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },
  blueBtn: {
    backgroundColor: '#1866B4',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: responsiveWidth(4),
    marginTop: responsiveWidth(5),
    padding: responsiveWidth(3),
    marginHorizontal: responsiveWidth(4)
  },
  hide: {
    display: 'none',
  },
  show: {
    display: 'flex',
  },
});
