import React, { useState, useContext } from 'react';

import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  StatusBar,
  ImageBackground,
  Image,
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { AuthContext } from '../../context/AuthContext';
import passwordShow from '../../assets/png/eye-open.png';
import passwordHide from '../../assets/png/eye-close.png'
import { responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions';
import LinearGradient from 'react-native-linear-gradient';

const ChangePassword = ({ navigation, route }) => {
  const { Mem_ID } = route.params;
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [strength, setStrength] = useState('');
  const [statusColor, setStatusColor] = useState('#ccc');
  const [statusWidth, setStatusWidth] = useState('0%');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { isLoading, error, setError, changePassword } = useContext(AuthContext);

  const handleResetPassword = async () => {
    if (password === confirmPassword) {
      const response = await changePassword(
        Mem_ID,
        password,
        confirmPassword,
      )
      if (response) {
        navigation.navigate('successPassword');
      }
    } else {
      setError("Password does not match");
    }
  };

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const calculateStrength = (password) => {
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const mediumRegex = /^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d]{8,}$/;

    if (strongRegex.test(password)) {
      setStrength('Very Good');
      setStatusColor('#4CAF50');
      setStatusWidth('100%');
    } else if (mediumRegex.test(password)) {
      setStrength('Good');
      setStatusColor('#8BC34A');
      setStatusWidth('75%');
    } else if (password.length >= 8) {
      setStrength('Fair');
      setStatusColor('#FFEB3B');
      setStatusWidth('50%');
    } else if (password.length > 0) {
      setStrength('Weak');
      setStatusColor('#F44336');
      setStatusWidth('25%');
    } else {
      setStrength('');
      setStatusColor('#ccc');
      setStatusWidth('0%');
    }
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
    calculateStrength(text);
  };

  return (
    <View style={Styles.container}>
      <StatusBar barStyle={'dark-lite'} backgroundColor="#1E293C" />
      <ScrollView style={Styles.mainView}>
        <Spinner visible={isLoading} />
        <View style={Styles.logo}>
          <Image
            style={{ width: responsiveWidth(25), height: responsiveWidth(25), resizeMode: 'cover' }}
            source={require('../../assets/png/forgotIcon.png')}
          />
        </View>
        <View>
          <View style={[Styles.center, { marginTop: 20 }]}>
            <Text style={{ fontSize: 22, fontWeight: '600', color: 'black' }}>
              Enter New Password
            </Text>
            <Text
              style={{
                fontSize: responsiveFontSize(2),
                marginTop: 6,
                fontWeight: '400',
                color: '#525866',
                textAlign: 'center',
              }}>
              Enter your new password for account
            </Text>
          </View>

          <View style={{ marginTop: 30, position: 'relative' }}>
            <Text style={Styles.Label}>New Password <Text style={{ color: '#1866B4' }}>*</Text></Text>
            <Image source={require('../../assets/png/lock-2-line.png')} style={Styles.icon} />
            <TextInput
              style={Styles.inputBox}
              placeholder="Enter your password"
              onChangeText={handlePasswordChange}
              value={password}
              secureTextEntry={!showNewPassword}
            />
            <TouchableOpacity
              style={Styles.viewBtn}
              onPress={toggleNewPasswordVisibility}>
              <Image
                source={showNewPassword ? passwordShow : passwordHide}
                style={{ width: responsiveWidth(6), height: responsiveWidth(6) }}
              />
            </TouchableOpacity>
          </View>

          <View style={{ marginHorizontal: 12 }}>
            <View style={[Styles.statusBar, { backgroundColor: statusColor, width: statusWidth }]} />
            {strength !== '' && <Text style={Styles.strength}>{strength}</Text>}
          </View>

          <View style={{ marginTop: 12, position: 'relative' }}>
            <Text style={Styles.Label}>Confirm New Password <Text style={{ color: '#1866B4' }}>*</Text></Text>
            <Image source={require('../../assets/png/lock-2-line.png')} style={Styles.icon} />
            <TextInput
              secureTextEntry={!showConfirmPassword}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              style={Styles.inputBox}
            />
            <TouchableOpacity
              style={Styles.viewBtn}
              onPress={toggleConfirmPasswordVisibility}>
              <Image
                source={showConfirmPassword ? passwordShow : passwordHide}
                style={{ width: responsiveWidth(6), height: responsiveWidth(6) }}
              />
            </TouchableOpacity>
          </View>
          {error ? <Text style={Styles.errorText}>{error}</Text> : null}
          <TouchableOpacity
            disabled={strength !== 'Very Good'}
            onPress={handleResetPassword}>
            <LinearGradient style={Styles.blueBtn} colors={['#3B7DBF', '#1866B4']} >
              <Text style={Styles.buttonStyle}>Reset Password</Text>
            </LinearGradient>
          </TouchableOpacity>
          {/* <View style={Styles.orText}>
              <Text style={{ color: 'black' }}>
                Already registered? Click login.
              </Text>
            </View>
            <TouchableOpacity
              style={Styles.whiteBtn}
              onPress={() => navigation.navigate('Login')}>
              <Text
                style={{ color: '#1866B4', fontWeight: '500', fontSize: 18 }}>
                Login
              </Text>
            </TouchableOpacity> */}
        </View>
      </ScrollView>
    </View>
  );
};

export default ChangePassword;

const Styles = StyleSheet.create({
  backgroundImg: {
    resizeMode: 'cover',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: 'White'
  },
  center: {
    alignItems: 'center',
    display: 'flex',
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
  logo: {
    justifyContent: 'center',
    display: 'flex',
    alignItems: 'center',
    marginTop: responsiveWidth(25),
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
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
  inputBox: {
    borderWidth: 1,
    borderColor: '#CED4DA',
    borderRadius: 14,
    paddingHorizontal: responsiveWidth(11),
    height: responsiveWidth(12),
    fontSize: responsiveFontSize(2),

  },
  viewBtn: {
    position: 'absolute',
    right: responsiveWidth(4.5),
    top: responsiveWidth(10),
  },
  blueBtn: {
    backgroundColor: '#1866B4',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: responsiveWidth(4),
    marginTop: responsiveWidth(5),
    padding: responsiveWidth(3),
  },
  buttonStyle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },
  statusBar: {
    height: 8,
    borderRadius: 5,
    marginTop: 5,
  },
  strength: {
    color: '#333',
    fontWeight: 'bold',
    textAlign: 'right',
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
    top: responsiveWidth(9.5),
    left: responsiveWidth(2.5)
  }
});
