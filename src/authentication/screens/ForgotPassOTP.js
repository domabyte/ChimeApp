import React, {useState, useRef, createRef, useContext} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  ImageBackground,
  StatusBar,
  Image,
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import {AuthContext} from '../../context/AuthContext';

const ForgotPassOTP = ({navigation, route}) => {
  const {Mem_ID, message, email} = route.params;
  const [otpValues, setOtpValues] = useState(Array(6).fill(''));
  const {isLoading, forgotOTPVerification, forgotPassword, error} =
    useContext(AuthContext);

  const inputRefs = useRef(otpValues.map(() => createRef()));

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
        navigation.navigate('changePassword', {Mem_ID: Mem_ID});
      }
    } else {
      Alert.alert('Error', 'Please fill in all OTP fields.');
    }
  };

  const handleResendOTP = () => {
    forgotPassword(email);
  };

  const formatEmail = email => {
    const parts = email.split('@');
    return `${parts[0].slice(0, 2)}**********@${parts[1]}`;
  };

  return (
    <>
      <StatusBar barStyle={'dark-lite'} backgroundColor="#1E293C" />
      <ImageBackground
        source={require('../../assets/png/LoginBg.png')}
        style={Styles.backgroundImg}>
        <ScrollView style={Styles.mainView}>
          <Spinner visible={isLoading} />
          <View style={Styles.logo}>
            <Image
              style={{width: 100, height: 53, resizeMode: 'cover'}}
              source={require('../../assets/png/Actpal_logo.png')}
            />
          </View>
          <View style={[Styles.center, {marginTop: 20}]}>
            <Text style={{fontSize: 22, fontWeight: '600', color: 'black'}}>
              We sent a code to your email
            </Text>
            <Text
              style={{
                fontSize: 16,
                marginTop: 26,
                fontWeight: '400',
                color: 'black',
                textAlign: 'center',
              }}>
              We sent a code to your email {formatEmail(route.params.email)}
              <Text
                onPress={() => navigation.goBack()}
                style={{fontSize: 16, color: '#1866B4', lineHeight: 20}}>
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
                  onKeyPress={({nativeEvent}) => {
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
              <Text style={{fontWeight: '500'}}>19:50</Text>
            </Text>

            <TouchableOpacity onPress={handleResendOTP} style={{marginTop: 18}}>
              <Text
                style={{color: '#1866B4', textAlign: 'center', fontSize: 16}}>
                Security code sent !
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={Styles.blueBtn}
              onPress={handleVerifyPress}>
              <Text style={Styles.buttonStyle}>Send Security Code</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ImageBackground>
    </>
  );
};

export default ForgotPassOTP;

const Styles = StyleSheet.create({
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
    marginTop: 170,
  },
  mainView: {
    flex: 1,
    padding: 20,
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
    borderColor: '#ccc',
    borderRadius: 10,
    width: 50,
    height: 50,
    textAlign: 'center',
    fontSize: 20,
    marginHorizontal: 5,
    marginTop: 18,
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
    height: 45,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    marginTop: 20,
  },
  hide: {
    display: 'none',
  },
  show: {
    display: 'flex',
  },
});
