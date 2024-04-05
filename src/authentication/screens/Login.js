import React, {useContext, useEffect, useState} from 'react';
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
import {AuthContext} from '../../context/AuthContext';
import Spinner from 'react-native-loading-spinner-overlay';
import * as Keychain from 'react-native-keychain';

const Login = ({navigation}) => {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [showPass, setShowPass] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const toggleCheckbox = () => {
    setIsChecked(!isChecked);
  };
  const {isLoading, login, error, setError} = useContext(AuthContext);

  useEffect(() => {
    setError('');
    const checkCredentials = async () => {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        setEmail(credentials.username);
        setPassword(credentials.password);
        setIsChecked(true);
      }
    };
    checkCredentials();
    return () => {
      setError('');
    };
  }, []);

  const validateInputs = (email, password) => {
    let valid = true;
    switch (true) {
      case !email:
        setError('Email is required');
        valid = false;
        break;
      case !password:
        setError('Password is required');
        valid = false;
        break;
      default:
        break;
    }
    return valid;
  };

  const handleLogin = () => {
    if (validateInputs(email, password)) {
      login(email, password, isChecked);
    }
  };

  return (
    <>
      <StatusBar barStyle={'dark-lite'} backgroundColor="#1E293C" />
      <ImageBackground
        source={require('../../assets/png/LoginBg.png')}
        style={styles.backgroundImg}>
        <ScrollView>
          <View sytle={styles.container}>
            <Spinner visible={isLoading} />
            <View style={styles.logo}>
              <Image
                style={{width: 100, height: 53, resizeMode: 'cover'}}
                source={require('../../assets/png/Actpal_logo.png')}
              />
            </View>
            <View style={[styles.center, {marginTop: 28}]}>
              <Text style={{fontSize: 22, fontWeight: '400', color: 'black'}}>
                Welcome Back!
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  marginTop: 6,
                  fontWeight: '400',
                  color: 'black',
                }}>
                Login to your account to continue
              </Text>
            </View>
            <View style={{marginHorizontal: 20, marginTop: 60}}>
              <TextInput
                value={email}
                placeholder="Enter Your Email Address"
                onChangeText={text => setEmail(text)}
                style={styles.inputBox}
                required
              />
            </View>
            <View
              style={{
                marginHorizontal: 20,
                marginTop: 20,
                position: 'relative',
              }}>
              <TextInput
                value={password}
                onChangeText={text => setPassword(text)}
                placeholder="Password"
                style={styles.inputBox}
                secureTextEntry={!showPass}
              />
              <TouchableOpacity
                style={{position: 'absolute', top: 11, right: 15}}
                onPress={() => setShowPass(!showPass)}>
                <Image
                  source={showPass ? passwordShow : passwordHide}
                  style={{width: 26, height: 26}}
                />
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginHorizontal: 35,
                marginTop: 10,
              }}>
              <TouchableOpacity
                onPress={toggleCheckbox}
                style={styles.checkbtn}>
                <View style={[styles.checkbox, isChecked && styles.checked]}>
                  {isChecked && <View style={styles.checkmark}></View>}
                </View>
                <Text style={styles.label}>Remember me</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate('forgotPassword')}>
                <Text style={{color: '#1866B4', fontSize: 16}}>
                  Forgot Password ?
                </Text>
              </TouchableOpacity>
            </View>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            <View style={{marginHorizontal: 20}}>
              <TouchableOpacity style={styles.blueBtn} onPress={handleLogin}>
                <Text style={{color: '#fff', fontWeight: '500', fontSize: 18}}>
                  Sign In
                </Text>
              </TouchableOpacity>
              <View style={styles.orText}>
                <Text style={{color: 'black'}}>Don’t have an account?</Text>
              </View>
              <TouchableOpacity
                style={styles.whiteBtn}
                onPress={() => navigation.navigate('Register')}>
                <Text
                  style={{color: '#1866B4', fontWeight: '500', fontSize: 18}}>
                  Create An Account
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </>
  );
};

export default Login;

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
    marginTop: 125,
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
  checkbtn: {
    flexDirection: 'row',
    alignItems: 'center',
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
    fontSize: 16,
    fontWeight: '400',
    color: 'black',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
  blueBtn: {
    backgroundColor: '#1866B4',
    height: 45,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    marginTop: 50,
  },
  orText: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  line: {
    width: 100,
    backgroundColor: '#CCCCCC',
    height: 0.5,
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
});
