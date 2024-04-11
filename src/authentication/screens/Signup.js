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
} from 'react-native';
import passwordShow from '../../assets/png/eye-open.png';
import passwordHide from '../../assets/png/eye-close.png';
import Spinner from 'react-native-loading-spinner-overlay';
import {AuthContext} from '../../context/AuthContext';
import axios from 'axios';
import config from '../../config/config';

const Signup = ({navigation}) => {
  const [user, setUser] = useState({
    firstName: null,
    lastName: null,
    email: null,
    newPassword: null,
    confirmPassword: null,
    showNewPassword: false,
    showConfirmPassword: false,
    captcha: null,
    encryptedCaptcha: null,
    confirmCaptcha: null,
    isChecked: false,
  });
  const {isLoading, register, error, setError} = useContext(AuthContext);

  const togglePasswordVisibility = (field) => {
    setUser({...user, [field]: !user[field]});
  };

  const fetchCaptcha = async () => {
    const {data} = await axios.get(config.captchaURL);
    setUser({
      ...user,
      captcha: data.SecurityCode1 + data.SecurityCode2,
      encryptedCaptcha: data.SecurityCodeEncrypt,
    });
  };

  useEffect(() => {
    setError('');
    fetchCaptcha();
    return () => {
      setError('');
    };
  }, []);

  const validateInputs = () => {
    let valid = true;
    const {firstName, lastName, email, newPassword, confirmPassword, confirmCaptcha, isChecked} = user;
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

  const handleSignup = () => {
    if (validateInputs()) {
      if (user.isChecked) {
        const {firstName, lastName, email, newPassword, confirmPassword, encryptedCaptcha, confirmCaptcha, isChecked} = user;
        register(
          firstName,
          lastName,
          email,
          newPassword,
          confirmPassword,
          encryptedCaptcha,
          confirmCaptcha,
          isChecked,
          resend=false,
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

  return (
    <>
      <StatusBar barStyle={'dark-lite'} backgroundColor="#1E293C" />
      <ImageBackground
        source={require('../../assets/png/LoginBg.png')}
        style={styles.backgroundImg}>
        <ScrollView>
          <Spinner visible={isLoading} />
          <View style={styles.container}>
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
                value={user.firstName}
                placeholder="First name"
                onChangeText={text => setUser({...user, firstName: text})}
                style={styles.inputBox}
              />
            </View>
            <View style={{marginHorizontal: 20, marginTop: 15}}>
              <TextInput
                value={user.lastName}
                placeholder="Last name"
                onChangeText={text => setUser({...user, lastName: text})}
                style={styles.inputBox}
              />
            </View>
            <View style={{marginHorizontal: 20, marginTop: 15}}>
              <TextInput
                value={user.email}
                placeholder="Email"
                onChangeText={text => setUser({...user, email: text})}
                style={styles.inputBox}
              />
            </View>
            <View style={{marginHorizontal: 20, marginTop: 15}}>
              <TextInput
                value={user.newPassword}
                placeholder="New Password"
                onChangeText={text => setUser({...user, newPassword: text})}
                style={styles.inputBox}
                secureTextEntry={!user.showNewPassword}
              />
              <TouchableOpacity
                style={{position: 'absolute', top: 11, right: 15}}
                onPress={() => togglePasswordVisibility('showNewPassword')}>
                <Image
                  source={user.showNewPassword ? passwordShow : passwordHide}
                  style={{width: 26, height: 26}}
                />
              </TouchableOpacity>
            </View>
            <View style={{marginHorizontal: 20, marginTop: 15}}>
              <TextInput
                value={user.confirmPassword}
                placeholder="Confirm Password"
                onChangeText={text => setUser({...user, confirmPassword: text})}
                style={styles.inputBox}
                secureTextEntry={!user.showConfirmPassword}
              />
              <TouchableOpacity
                style={{position: 'absolute', top: 11, right: 15}}
                onPress={() => togglePasswordVisibility('showConfirmPassword')}>
                <Image
                  source={user.showConfirmPassword ? passwordShow : passwordHide}
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
                  {user.captcha}
                </Text>
              </View>
              <View style={{width: '48%'}}>
                <TextInput
                  value={user.confirmCaptcha}
                  placeholder="Enter Captcha"
                  style={styles.inputBox}
                  onChangeText={text => setUser({...user, confirmCaptcha: text})}
                />
              </View>
            </View>
            <View style={{marginHorizontal: 30, marginTop: 15}}>
              <TouchableOpacity
                onPress={() => setUser({...user, isChecked: !user.isChecked})}
                style={styles.checkbtn}>
                <View style={[styles.checkbox, user.isChecked && styles.checked]}>
                  {user.isChecked && <View style={styles.checkmark}></View>}
                </View>
                <Text style={styles.label}>
                  Terms and condition should be connected to ACTPAL's
                  <Text style={{color: '#1866B4'}}>Terms & Conditions</Text>
                </Text>
              </TouchableOpacity>
            </View>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            <View style={{marginHorizontal: 20}}>
              <TouchableOpacity style={styles.blueBtn} onPress={handleSignup}>
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
  errorText: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
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
  blueBtn: {
    backgroundColor: '#1866B4',
    height: 45,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    marginTop: 20,
  },
  whiteBtn: {
    marginTop: 10,
    height: 45,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#1866B4',
    marginBottom: 25,
  },
  orText: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
});