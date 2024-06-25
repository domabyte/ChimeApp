import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  StatusBar,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import passwordShow from '../../assets/png/eye-open.png';
import passwordHide from '../../assets/png/eye-close.png';
import Spinner from 'react-native-loading-spinner-overlay';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import config from '../../config/config';
import { responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions';
import LinearGradient from 'react-native-linear-gradient';
import { replacePlaceholdersWithLinks } from '../../utils/helper';

const Signup = ({ navigation }) => {
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [email, setEmail] = useState(null);
  const [newPassword, setNewPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [captcha, setCaptcha] = useState(null);
  const [encryptedCaptcha, setEncryptedCaptcha] = useState(null);
  const [confirmCaptcha, setConfirmCaptcha] = useState(null);
  const [isChecked, setIsChecked] = useState(false);
  const { isLoading, register, error, setError } = useContext(AuthContext);

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const toggleCheckbox = () => {
    setIsChecked(!isChecked);
  };

  const fetchCaptcha = async () => {
    const { data } = await axios.get(config.captchaURL);
    setCaptcha(data.SecurityCode1 + data.SecurityCode2);
    setEncryptedCaptcha(data.SecurityCodeEncrypt);
  };

  useEffect(() => {
    setError('');
    return () => {
      setError('');
    };
  }, []);

  const validateInputs = () => {
    let valid = true;
    switch (true) {
      case !firstName:
        setError('First name is required');
        valid = false;
        break;
      case !lastName:
        setError('Last name is required');
        valid = false;
        break;
      case !email:
        setError('Email is required');
        valid = false;
        break;
      case !newPassword:
        setError('Password is required');
        valid = false;
        break;
      case newPassword !== confirmPassword:
        setError('Passwords do not match');
        valid = false;
        break;
      case !confirmCaptcha:
        setError('Captcha is required');
        valid = false;
        break;
      case !isChecked:
        setError('Please agree to the terms and conditions');
        valid = false;
        break;
      default:
        break;
    }
    return valid;
  };

  useEffect(() => {
    fetchCaptcha();
  }, []);

  const handleSignup = () => {
    if (validateInputs()) {
      if (isChecked) {
        register(
          firstName,
          lastName,
          email,
          newPassword,
          confirmPassword,
          encryptedCaptcha,
          confirmCaptcha,
          isChecked,
          resend = false,
          (Mem_ID, message, firstName, lastName, email, newPassword, confirmPassword, encryptedCaptcha, confirmCaptcha, isChecked) =>
            navigation.navigate('OtpVerification', {
              Mem_ID,
              message,
              firstName,
              lastName,
              email,
              newPassword,
              confirmPassword,
              encryptedCaptcha,
              confirmCaptcha,
              isChecked,
            }),
        );
      }
    }
  };
  const renderError = () => {
    if (error) {
      if (error.includes('@@LoginLink')) {
        const message = error.replace('@@LoginLink', '');
        return (
          <Text style={styles.errorText}>
            {message}
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={{color: '#1866B4', textDecorationLine: 'underline'}}>Please login.</Text>
            </TouchableOpacity>
          </Text>
        );
      }
      return <Text style={styles.errorText}>{error}</Text>;
    }
    return null;
  };

  return (
    <>
      <StatusBar barStyle={'dark-lite'} backgroundColor="#1E293C" />
      <ScrollView>
        <Spinner visible={isLoading} />
        <View sytle={styles.container}>
          {/* <View style={styles.logo}>
            <Image
              style={{ width: 100, height: 53, resizeMode: 'cover' }}
              source={require('../../assets/png/Actpal_logo.png')}
            />
          </View> */}
          <View style={[styles.center, { marginTop: responsiveWidth(10) }]}>
            <Text style={{ fontSize: responsiveFontSize(3), color: '#0E121B' }}>Create Account</Text>
            <Text style={{ fontSize: responsiveFontSize(2), fontWeight: '400', color: '#525866' }}>
              Sign up to your account to continue
            </Text>
          </View>
          <View style={{ marginHorizontal: 20, marginTop: 20 }}>
            <Text style={styles.Label}>First Name <Text style={{ color: '#1866B4' }}>*</Text></Text>
            <Image source={require('../../assets/png/user.png')} style={styles.icon} />
            <TextInput
              value={firstName}
              placeholder="First name"
              onChangeText={text => setFirstName(text)}
              style={styles.inputBox}
            />
          </View>
          <View style={{ marginHorizontal: 20, marginTop: 15 }}>
            <Text style={styles.Label}>Last Name <Text style={{ color: '#1866B4' }}>*</Text></Text>
            <Image source={require('../../assets/png/user.png')} style={styles.icon} />
            <TextInput
              value={lastName}
              placeholder="Last name"
              onChangeText={text => setLastName(text)}
              style={styles.inputBox}
            />
          </View>
          <View style={{ marginHorizontal: 20, marginTop: 15 }}>
            <Text style={styles.Label}>Email Address <Text style={{ color: '#1866B4' }}>*</Text></Text>
            <Image source={require('../../assets/png/mail-line.png')} style={styles.icon} />
            <TextInput
              value={email}
              placeholder="Email"
              onChangeText={text => setEmail(text)}
              style={styles.inputBox}
            />
          </View>
          <View
            style={{
              marginHorizontal: 20,
              marginTop: 15,
              position: 'relative',
            }}>
            <Text style={styles.Label}>Password <Text style={{ color: '#1866B4' }}>*</Text></Text>
            <Image source={require('../../assets/png/lock-2-line.png')} style={styles.icon} />
            <TextInput
              style={styles.inputBox}
              secureTextEntry={!showNewPassword}
              placeholder="New Password"
              value={newPassword}
              onChangeText={text => setNewPassword(text)}
            />
            <TouchableOpacity
              style={{ position: 'absolute', top: responsiveWidth(9), right: responsiveWidth(3.5) }}
              onPress={toggleNewPasswordVisibility}>
              <Image
                source={showNewPassword ? passwordShow : passwordHide}
                style={{ width: responsiveWidth(5.8), height: responsiveWidth(5.8) }}
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              marginHorizontal: 20,
              marginTop: 15,
              position: 'relative',
            }}>
            <Text style={styles.Label}>Confirm Password <Text style={{ color: '#1866B4' }}>*</Text></Text>
            <Image source={require('../../assets/png/lock-2-line.png')} style={styles.icon} />
            <TextInput
              style={styles.inputBox}
              secureTextEntry={!showConfirmPassword}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={text => setConfirmPassword(text)}
            />
            <TouchableOpacity
              style={{ position: 'absolute', top: responsiveWidth(9), right: responsiveWidth(3.5) }}
              onPress={toggleConfirmPasswordVisibility}>
              <Image
                source={showConfirmPassword ? passwordShow : passwordHide}
                style={{ width: responsiveWidth(5.8), height: responsiveWidth(5.8) }}
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              marginHorizontal: 20,
              flexDirection: 'row',
              gap: 12,
              marginTop: 15,
            }}>
            <View style={styles.captcha}>
              <Text
                style={{
                  fontSize: 20,
                  color: '#ccc',
                  textAlign: 'center',
                  position: 'relative',
                  textDecorationLine: 'line-through',
                }}>
                {captcha}
              </Text>
              <View sytle={styles.captchaLine}></View>
            </View>
            <View style={{ width: responsiveWidth(44) }}>
              <TextInput
                value={confirmCaptcha}
                placeholder="Enter Captcha"
                style={styles.inputBox}
                onChangeText={text => setConfirmCaptcha(text)}
              />
            </View>
          </View>

          <View style={{ marginHorizontal: 30, marginTop: 15 }}>
            <TouchableOpacity
              onPress={toggleCheckbox}
              style={styles.checkbtn}>
              <View style={[styles.checkbox, isChecked && styles.checked]}>
                {isChecked && <Image source={require('../../assets/png/check.png')} style={styles.checkmark} />}
              </View>
              <Text style={styles.label}>
                I accept {''}
                <Text style={{ color: '#1866B4' }}>Actpal Terms & Conditions</Text>
              </Text>
            </TouchableOpacity>
          </View>

          {error ? <Text style={styles.errorText}>{replacePlaceholdersWithLinks(error)}</Text> : null}
          <View style={{ marginHorizontal: 20 }}>
            <TouchableOpacity onPress={handleSignup}>
              <LinearGradient style={styles.blueBtn} colors={['#3B7DBF', '#1866B4']}>
                <Text style={{ color: '#fff', fontWeight: '500', fontSize: 18 }}>
                  Continue
                </Text>
              </LinearGradient>
            </TouchableOpacity>
            <View style={styles.orText}>
              <Text style={{ color: 'black', fontSize: responsiveFontSize(2) }}>
                Already have an account?
              </Text>
            </View>
            <TouchableOpacity
              style={styles.whiteBtn}
              onPress={() => navigation.navigate('Login')}>
              <Text
                style={{ color: '#1866B4', fontWeight: '500', fontSize: 18 }}>
                Login
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

export default Signup;

const styles = StyleSheet.create({
  backgroundImg: {
    resizeMode: 'cover',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  logo: {
    justifyContent: 'center',
    display: 'flex',
    alignItems: 'center',
    marginTop: 70,
  },
  center: {
    alignItems: 'center',
    display: 'flex',
  },
  inputBox: {
    borderWidth: 1,
    borderColor: '#CED4DA',
    borderRadius: 14,
    paddingLeft: responsiveWidth(9.5),
    height: responsiveWidth(11),
    fontSize: responsiveFontSize(2),
  },
  captcha: {
    borderWidth: 1,
    borderColor: '#CED4DA',
    borderRadius: 14,
    height: responsiveWidth(11),
    fontSize: responsiveFontSize(2),
    width: responsiveWidth(44),
    alignItems: 'center',
    justifyContent: 'center'
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
  blueBtn: {
    backgroundColor: '#1866B4',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: responsiveWidth(4),
    marginTop: responsiveWidth(8),
    padding: responsiveWidth(3)
  },
  orText: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  whiteBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#0E121B30',
    borderRadius: responsiveWidth(4),
    padding: responsiveWidth(2.5),
    marginTop: responsiveWidth(3)
  },
  checkbtn: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: responsiveWidth(5.5),
    height: responsiveWidth(5.5),
    borderRadius: responsiveWidth(1.5),
    borderWidth: 1,
    borderColor: '#1B1C1D40',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  checked: {
    backgroundColor: 'White',
  },
  checkmark: {
    width: responsiveWidth(4),
    height: responsiveWidth(4),
  },
  label: {
    fontSize: responsiveFontSize(1.8),
    fontWeight: '400',
    color: 'black',
    paddingLeft: responsiveWidth(1)
  },
  captchaLine: {
    backgroundColor: 'black',
    width: responsiveWidth(2),
    height: 1,
    top: 1,
    left: 1,
  },
  Label: {
    fontSize: responsiveFontSize(1.8),
    color: 'black',
    marginLeft: responsiveWidth(1),
    marginBottom: responsiveWidth(1.5)
  },
  icon: {
    width: responsiveWidth(5.5),
    height: responsiveWidth(5.5),
    position: 'absolute',
    top: responsiveWidth(9),
    left: responsiveWidth(2.5),
  }
});
