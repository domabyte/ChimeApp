import React, {useState, useRef, useContext} from 'react';

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
import {AuthContext} from '../../context/AuthContext';
import passwordShow from '../../assets/png/eye-open.png';
import passwordHide from '../../assets/png/eye-close.png';

const ChangePassword = ({navigation, route}) => {
  const {Mem_ID} = route.params;
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const {isLoading, error, changePassword} = useContext(AuthContext);

  const handleResetPassword = async () => {
    if (newPassword === confirmPassword) {
      const response = await changePassword(
        Mem_ID,
        newPassword,
        confirmPassword,
      );
      if (response) {
        navigation.navigate('Login');
      }
    }
  };
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const [password, setPassword] = useState('');
  const [strength, setStrength] = useState(0);
  const passwordInputRef = useRef(null);

  const calculateStrength = password => {
    const minLength = 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+[\]{};:'"\\|,.<>/?]+/.test(password);

    let strength = 0;
    if (password.length >= minLength) strength++;
    if (hasUppercase) strength++;
    if (hasLowercase) strength++;
    if (hasDigit) strength++;
    if (hasSpecialChar) strength++;

    return strength;
  };

  const handlePasswordChange = value => {
    setPassword(value);
    const passwordStrength = calculateStrength(value);
    setStrength(passwordStrength);
  };

  const getPasswordColor = strength => {
    switch (strength) {
      case 0:
        return 'red';
      case 1:
        return 'orange';
      case 2:
        return 'green';
      default:
        return 'black';
    }
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
          <View>
            <View style={[Styles.center, {marginTop: 20}]}>
              <Text style={{fontSize: 22, fontWeight: '600', color: 'black'}}>
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

            <View style={{marginTop: 30, position: 'relative'}}>
              <TextInput
                ref={passwordInputRef}
                value={password}
                onChangeText={setNewPassword}
                placeholder="New Password"
                style={Styles.inputBox}
                secureTextEntry={!showNewPassword}
                key="passwordInput"
              />
              <TouchableOpacity
                style={Styles.viewBtn}
                onPress={toggleNewPasswordVisibility}>
                <Image
                  source={showNewPassword ? passwordShow : passwordHide}
                  style={{width: 26, height: 26}}
                />
              </TouchableOpacity>
            </View>

            <View
              style={[
                Styles.progressBar,
                {
                  width: `${(strength + 1) * 10}%`,
                  backgroundColor: getPasswordColor(strength),
                },
              ]}
            />

            <View style={{marginTop: 20, position: 'relative'}}>
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
                  style={{width: 26, height: 26}}
                />
              </TouchableOpacity>
            </View>
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
  progressBar: {
    width: '80%',
    height: 10,
    marginTop: 10,
  },
});
