import React, {useState, useContext, useEffect} from 'react';
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
  ScrollViewBase,
  Alert,
} from 'react-native';
import passwordShow from '../../assets/png/eye-open.png';
import passwordHide from '../../assets/png/eye-close.png';
import Spinner from 'react-native-loading-spinner-overlay';
import {AuthContext} from '../../context/AuthContext';
import axios from 'axios';
import config from '../../config/config';

const Signup = ({navigation}) => {
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [email, setEmail] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [captcha, setCaptcha] = useState('');
  const [encryptedCaptcha, setEncryptedCaptcha] = useState('');
  const [confirmCaptcha, setConfirmCaptcha] = useState(null);
  const [isChecked, setIsChecked] = useState(false);
  const {isLoading, register, error} = useContext(AuthContext);

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
    const {data} = await axios.get(config.captchaURL);
    setCaptcha(data.SecurityCode1 + data.SecurityCode2);
    setEncryptedCaptcha(data.SecurityCodeEncrypt);
  };

  useEffect(() => {
    fetchCaptcha();
  }, []);

  return (
    <>
      <StatusBar barStyle={'dark-lite'} backgroundColor="#1E293C" />
      <ImageBackground
        source={require('../../assets/png/LoginBg.png')}
        style={styles.backgroundImg}>
        <ScrollView>
          <Spinner visible={isLoading} />
          <View sytle={styles.container}>
            <View style={styles.logo}>
              <Image
                style={{width: 100, height: 53, resizeMode: 'cover'}}
                source={require('../../assets/png/Actpal_logo.png')}
              />
            </View>
            <View style={[styles.center, {marginTop: 22}]}>
              <Text style={{fontSize: 18, fontWeight: '400', color: 'black'}}>
                Sign up to your account to continue
              </Text>
            </View>
            <View style={{marginHorizontal: 20, marginTop: 20}}>
              <TextInput
                value={firstName}
                placeholder="First name"
                onChangeText={text => setFirstName(text)}
                style={styles.inputBox}
              />
            </View>
            <View style={{marginHorizontal: 20, marginTop: 15}}>
              <TextInput
                value={lastName}
                placeholder="Last name"
                onChangeText={text => setLastName(text)}
                style={styles.inputBox}
              />
            </View>
            <View style={{marginHorizontal: 20, marginTop: 15}}>
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
              <TextInput
                style={styles.inputBox}
                secureTextEntry={!showNewPassword}
                placeholder="New Password"
                value={newPassword}
                onChangeText={text => setNewPassword(text)}
              />
              <TouchableOpacity
                style={{position: 'absolute', top: 11, right: 15}}
                onPress={toggleNewPasswordVisibility}>
                <Image
                  source={showNewPassword ? passwordShow : passwordHide}
                  style={{width: 26, height: 26}}
                />
              </TouchableOpacity>
            </View>
            <View
              style={{
                marginHorizontal: 20,
                marginTop: 15,
                position: 'relative',
              }}>
              <TextInput
                style={styles.inputBox}
                secureTextEntry={!showConfirmPassword}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={text => setConfirmPassword(text)}
              />
              <TouchableOpacity
                style={{position: 'absolute', top: 11, right: 15}}
                onPress={toggleConfirmPasswordVisibility}>
                <Image
                  source={showConfirmPassword ? passwordShow : passwordHide}
                  style={{width: 26, height: 26}}
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
              <View style={{width: '48%'}}>
                <TextInput
                  value={confirmCaptcha}
                  placeholder="Enter Captcha"
                  style={styles.inputBox}
                  onChangeText={text => setConfirmCaptcha(text)}
                />
              </View>
            </View>
            <View style={{marginHorizontal: 30, marginTop: 15}}>
              <TouchableOpacity
                onPress={toggleCheckbox}
                style={styles.checkbtn}>
                <View style={[styles.checkbox, isChecked && styles.checked]}>
                  {isChecked && <View style={styles.checkmark}></View>}
                </View>
                <Text style={styles.label}>
                  Terms and condition should be connected to ACTPAL's
                  <Text style={{color: '#1866B4'}}>Terms & Conditions</Text>
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{marginHorizontal: 20}}>
              <TouchableOpacity
                style={styles.blueBtn}
                onPress={() => {
                  register(
                    firstName,
                    lastName,
                    email,
                    newPassword,
                    confirmPassword,
                    encryptedCaptcha,
                    confirmCaptcha,
                    isChecked,
                    (Mem_ID, message) =>
                      navigation.navigate('OtpVerification', {
                        Mem_ID,
                        message,
                      }),
                  );
                }}>
                <Text style={{color: '#fff', fontWeight: '500', fontSize: 18}}>
                  Continue
                </Text>
              </TouchableOpacity>
              <View style={styles.orText}>
                <Text style={{color: 'black'}}>
                  Already registered? Click login.
                </Text>
              </View>
              <TouchableOpacity
                style={styles.whiteBtn}
                onPress={() => navigation.navigate('Login')}>
                <Text
                  style={{color: '#1866B4', fontWeight: '500', fontSize: 18}}>
                  Login
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
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
    borderRadius: 50,
    paddingLeft: 20,
    height: 50,
    fontSize: 16,
  },
  captcha: {
    borderWidth: 1,
    borderColor: '#CED4DA',
    borderRadius: 50,
    height: 50,
    fontSize: 16,
    width: '48%',
    alignItems: 'center',
    justifyContent: 'center',
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
  orText: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  whiteBtn: {
    height: 45,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#1866B4',
    marginBottom: 25,
  },
  checkbtn: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
    marginTop: 2,
  },
  checked: {
    backgroundColor: 'White',
  },
  checkmark: {
    width: 11,
    height: 11,
    borderRadius: 20,
    backgroundColor: '#1866B4',
  },
  label: {
    fontSize: 14,
    fontWeight: '400',
    color: 'black',
  },
  captchaLine: {
    backgroundColor: 'black',
    width: 45,
    height: 1,
    top: 1,
    left: 1,
  },
});
