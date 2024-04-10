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

const ChangePassword = ({ navigation, route }) => {
  const {Mem_ID} = route.params;
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [strength, setStrength] = useState('');
  const [statusColor, setStatusColor] = useState('#ccc');
  const [statusWidth, setStatusWidth] = useState('0%');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {isLoading, error, setError, changePassword} = useContext(AuthContext);

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
    <>
      <StatusBar barStyle={'dark-lite'} backgroundColor="#1E293C" />
      <ImageBackground
        source={require('../../assets/png/LoginBg.png')}
        style={Styles.backgroundImg}>
          <Spinner visible={isLoading} />
        <ScrollView style={Styles.mainView}>
          <View style={Styles.logo}>
            <Image
              style={{ width: 100, height: 53, resizeMode: 'cover' }}
              source={require('../../assets/png/Actpal_logo.png')}
            />
          </View>
          <View>
            <View style={[Styles.center, { marginTop: 20 }]}>
              <Text style={{ fontSize: 22, fontWeight: '600', color: 'black' }}>
                Create A New Password
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  marginTop: 6,
                  fontWeight: '400',
                  color: 'black',
                  textAlign: 'center',
                }}>
                Use a mix of alphabetical and numeric, a mixture of upper and
                lowercase, and special characters (@!#$%&*) when creating your
                unique passphrase. (example : m#P52s@ap$V)
              </Text>
            </View>

            <View style={{ marginTop: 30, position: 'relative' }}>
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
                  style={{ width: 26, height: 26 }}
                />
              </TouchableOpacity>
            </View>

            <View style={{marginHorizontal: 12}}>
              <View style={[Styles.statusBar, { backgroundColor: statusColor, width: statusWidth }]} />
              {strength !== '' && <Text style={Styles.strength}>{strength}</Text>}
            </View>

            <View style={{ marginTop: 12, position: 'relative' }}>
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
                  style={{ width: 26, height: 26 }}
                />
              </TouchableOpacity>
            </View>
            {error ? <Text style={Styles.errorText}>{error}</Text> : null}
            <TouchableOpacity
              style={Styles.blueBtn}
              onPress={handleResetPassword}>
              <Text style={Styles.buttonStyle}>Submit</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ImageBackground>
    </>
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
    borderRadius: 50,
    paddingLeft: 25,
    paddingRight: 45,
    height: 50,
    fontSize: 16,
  },
  viewBtn: {
    position: 'absolute',
    right: 15,
    top: 10,
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
});
