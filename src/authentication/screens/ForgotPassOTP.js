import React, {useState, useRef, createRef, useContext} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
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
    return `${parts[0].slice(0, 2)}........@${parts[1]}`;
  };

  return (
    <ScrollView style={Styles.mainView}>
      <Spinner visible={isLoading} />
      <View>
        <Text style={Styles.title}>Forgot Password</Text>
        <Text style={Styles.subTitle}>We sent a code to your email</Text>
        <Text style={Styles.subTitle}>{formatEmail(route.params.email)}</Text>

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

        <TouchableOpacity onPress={handleResendOTP} style={{marginTop: 15}}>
          <Text style={Styles.buttonStyle}>Resend Code</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleVerifyPress} style={{marginTop: 15}}>
          <Text style={Styles.buttonStyle}>Submit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{marginTop: 15}}>
          <Text style={Styles.buttonStyle}>Change e-mail Address</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ForgotPassOTP;

const Styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: '#fff',
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
    marginBottom: 20,
  },
  otpInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    width: 40,
    height: 40,
    textAlign: 'center',
    fontSize: 20,
    marginHorizontal: 5,
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
    backgroundColor: '#1866B4',
    color: '#fff',
    padding: 10,
    textAlign: 'center',
    borderRadius: 5,
    width: '100%',
  },
  hide: {
    display: 'none',
  },
  show: {
    display: 'flex',
  },
});
