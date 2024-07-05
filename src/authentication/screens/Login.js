import React, { useContext, useEffect, useState } from 'react';
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
import { AuthContext } from '../../context/AuthContext';
import Spinner from 'react-native-loading-spinner-overlay';
import * as Keychain from 'react-native-keychain';
import { responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions'
import LinearGradient from 'react-native-linear-gradient';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [showPass, setShowPass] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const toggleCheckbox = () => {
    setIsChecked(!isChecked);
  };
  const { isLoading, login, error, setError } = useContext(AuthContext);

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

  const handleLogin = async () => {
    if (validateInputs(email, password)) {
      await login(email, password, isChecked);
    }
  };

  return (
    <>
      <StatusBar barStyle={'dark-lite'} backgroundColor="#1E293C" />
      <ScrollView>
        <View sytle={styles.container}>
          <Spinner visible={isLoading} />
          <View style={styles.logo}>
            <Image
              style={{ width: responsiveWidth(34), height: responsiveWidth(16), resizeMode: 'cover' }}
              source={require('../../assets/png/Actpal_logo.png')}
            />
          </View>
          <View style={[styles.center, { marginTop: responsiveWidth(3) }]}>
            <Text style={{ fontSize: responsiveFontSize(2.5), fontWeight: '400', color: 'black' }}>
              Welcome Back!
            </Text>
            <Text
              style={{
                fontSize: responsiveFontSize(2),
                marginTop: responsiveWidth(2),
                fontWeight: '400',
                color: '#525866',
              }}>
              Login to your account to continue
            </Text>
          </View>
          <View style={{ marginHorizontal: responsiveWidth(4), marginTop: responsiveWidth(12), position: 'relative' }}>
            <Text style={styles.Label}>Email Address <Text style={{ color: '#1866B4' }}>*</Text></Text>
            <Image source={require('../../assets/png/mail-line.png')} style={styles.icon} />
            <TextInput
              value={email}
              placeholder="Enter Your Email Address"
              placeholderTextColor={'#99A0AE'}
              onChangeText={text => setEmail(text)}
              style={styles.inputBox}
              required
            />
          </View>
          <View
            style={{
              marginHorizontal: responsiveWidth(4),
              marginTop: responsiveWidth(3),
              position: 'relative',
            }}>
            <Text style={styles.Label}>Password <Text style={{ color: '#1866B4' }}>*</Text></Text>
            <Image source={require('../../assets/png/lock-2-line.png')} style={styles.icon} />
            <TextInput
              value={password}
              onChangeText={text => setPassword(text)}
              placeholder="Password"
              style={styles.inputBox}
              secureTextEntry={!showPass}
              placeholderTextColor={'#99A0AE'}
            />
            <TouchableOpacity
              style={{ position: 'absolute', top: responsiveWidth(9.5), right: responsiveWidth(3) }}
              onPress={() => setShowPass(!showPass)}>
              <Image
                source={showPass ? passwordShow : passwordHide}
                style={{ width: responsiveWidth(6.5), height: responsiveWidth(6.5) }}
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginHorizontal: 20,
              marginTop: 15,
            }}>
            <TouchableOpacity
              onPress={toggleCheckbox}
              style={styles.checkbtn}>
              <View style={[styles.checkbox, isChecked && styles.checked]}>
                {isChecked && <Image source={require('../../assets/png/check.png')} style={styles.checkmark} />}
              </View>
              <Text style={styles.label}>Remember me</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('forgotPassword')}>
              <Text style={{ color: '#525866', fontSize: responsiveFontSize(1.8), textDecorationLine: 'underline' }}>
                Forgot Password ?
              </Text>
            </TouchableOpacity>
          </View>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          <View style={{ marginHorizontal: 20 }}>
            <TouchableOpacity onPress={handleLogin}>
              <LinearGradient colors={['#3B7DBF', '#1866B4']} style={styles.blueBtn}>
                <Text style={{ color: '#fff', fontWeight: '500', fontSize: responsiveFontSize(2) }}>
                  Login
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* <View style={styles.orText}>
              <View style={styles.line}></View>
              <Text>OR</Text>
              <View style={styles.line}></View>
            </View>

            <TouchableOpacity
              style={styles.whiteBtn}
              onPress={() => navigation.navigate('Register')}>
              <Image source={require('../../assets/png/googleIcon.png')} style={{width: responsiveWidth(6), height: responsiveWidth(6), marginRight: responsiveWidth(1)}} />
              <Text
                style={{ color: '#525866', fontWeight: '500', fontSize: responsiveFontSize(2) }}>
                Continue with Google
              </Text>
            </TouchableOpacity> */}

            <View style={styles.orText}>
              <Text style={{ color: 'black', fontSize: responsiveFontSize(2) }}>Don’t have an account?</Text>
            </View>
            <TouchableOpacity
              style={[styles.whiteBtn, {marginBottom: responsiveWidth(10)}]}
              onPress={() => navigation.navigate('Register')}>
              <Text
                style={{ color: '#525866', fontWeight: '500', fontSize: responsiveFontSize(2) }}>
                Create An Account
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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
    marginTop: responsiveWidth(20),
  },
  center: {
    alignItems: 'center',
    display: 'flex',
  },
  inputBox: {
    borderWidth: 1,
    borderColor: '#CED4DA',
    borderRadius: 14,
    paddingLeft: responsiveWidth(11),
    height: responsiveWidth(12),
    fontSize: responsiveFontSize(2),
  },
  checkbtn: {
    flexDirection: 'row',
    alignItems: 'center',
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
    marginTop: responsiveWidth(10),
    padding: responsiveWidth(3)
  },
  orText: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    marginTop: responsiveWidth(4),
  },
  line: {
    width: responsiveWidth(40),
    backgroundColor: '#0E121B25',
    height: 1.5,
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
  Label: {
    fontSize: responsiveFontSize(2),
    color: 'black',
    marginLeft: responsiveWidth(1),
    marginBottom: responsiveWidth(1.5)
  },
  icon: {
    width: responsiveWidth(6.5),
    height: responsiveWidth(6.5),
    position: 'absolute',
    top: responsiveWidth(10),
    left: responsiveWidth(2.5)
  }
});
