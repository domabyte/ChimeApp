import React, {useState, useContext, useRef, createRef} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import {AuthContext} from '../../context/AuthContext';

const OtpVerification = ({route}) => {
  const {Mem_ID,message} = route.params;
  const [otpValues, setOtpValues] = useState(Array(6).fill(''));
  const {isLoading, otpVerify, error} = useContext(AuthContext);
  const inputRefs = useRef(otpValues.map(() => createRef()));

  const setOtpValue = (text, index) => {
    const newOtpValues = [...otpValues];
    newOtpValues[index] = text;
    setOtpValues(newOtpValues);
    if (text && index < otpValues.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleVerifyPress = () => {
    const otpString = otpValues.join('');
    if (otpString.length === 6) {
      otpVerify(Mem_ID, otpString);
    } else {
      Alert.alert("Error", "Please fill in all OTP fields.");
    }
  };

  return (
    <View style={styles.container}>
      <Spinner visible={isLoading} />
      <Text style={styles.message}>{message}</Text>
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
      <TouchableOpacity
        style={styles.verifyButton}
        onPress={handleVerifyPress}>
        <Text style={styles.buttonText}>Verify</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  otpInput: {
    width: 40,
    height: 40,
    textAlign: 'center',
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#CED4DA',
    borderRadius: 5,
  },
  verifyButton: {
    backgroundColor: '#1866B4',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
  },
});

export default OtpVerification;