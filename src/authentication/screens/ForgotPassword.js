import React, { useState, useEffect, useContext } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  StatusBar,
  ImageBackground,
  KeyboardAvoidingView,
  Image,
  Pressable,
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { AuthContext } from '../../context/AuthContext';
import { responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions';
import LinearGradient from 'react-native-linear-gradient';

const ForgotPassword = ({ navigation }) => {
  const [email, setEmail] = useState(null);
  const { isLoading, forgotPassword, error, setError } = useContext(AuthContext);

  useEffect(() => {
    setError('');
    return () => {
      setError('');
    };
  }, []);

  const validateInputs = () => {
    let valid = true;
    switch (true) {
      case !email:
        setError('Email is required');
        valid = false;
        break;
      default:
        break;
    }
    return valid;
  };

  const sendSecurityCode = async () => {
    if (validateInputs()) {
      const response = await forgotPassword(email);
      if (response) {
        navigation.navigate('forgotPassOTP', {
          Mem_ID: response.id,
          message: response.message,
          email: response.email,
        });
      }
    }
  };

  return (
    <>
      <StatusBar barStyle={'dark-lite'} backgroundColor="#1E293C" />
      <KeyboardAvoidingView behavior='padding' style={Styles.container}>
        <ScrollView style={Styles.mainView}>

          <Spinner visible={isLoading} />
          <View style={Styles.logo}>
            <Image
              style={{ width: responsiveWidth(25), height: responsiveWidth(25), resizeMode: 'cover' }}
              source={require('../../assets/png/forgotIcon.png')}
            />
          </View>
          <View style={[Styles.center, { marginTop: responsiveWidth(3) }]}>
            <Text style={{ fontSize: responsiveFontSize(2.6), fontWeight: '600', color: 'black' }}>
              Reset Password
            </Text>
            <Text
              style={{
                fontSize: responsiveFontSize(2),
                marginTop: 6,
                fontWeight: '400',
                color: '#525866',
              }}>
              Enter vour email to reset vour password
            </Text>
          </View>
          <View style={{ marginHorizontal: responsiveWidth(4), marginTop: responsiveWidth(5), position: 'relative' }}>
            <Text style={Styles.Label}>Email Address <Text style={{ color: '#1866B4' }}>*</Text></Text>
            <Image source={require('../../assets/png/mail-line.png')} style={Styles.icon} />
            <TextInput
              value={email}
              onChangeText={text => setEmail(text)}
              placeholder="Enter Your Email Address"
              style={Styles.inputBox}
              placeholderTextColor={'#99A0AE'}
            />
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: responsiveWidth(1.5) }}><Image source={require('../../assets/png/i-icon.png')} style={{ width: responsiveWidth(5), height: responsiveWidth(5), marginRight: responsiveWidth(1) }} /><Text style={{ fontSize: responsiveFontSize(1.5), color: '#000' }}>Enter the email with which you've registered.</Text></View>
            {error && <Text style={Styles.errorMsg}>{error}</Text>}

            <TouchableOpacity onPress={sendSecurityCode}>
              <LinearGradient colors={['#3B7DBF', '#1866B4']} style={Styles.blueBtn}>
                <Text style={Styles.buttonStyle}>Reset Password</Text>
              </LinearGradient>
            </TouchableOpacity>

            <View style={{alignItems: 'center', marginTop: responsiveWidth(5)}}>
              <Text style={{fontSize: responsiveFontSize(1.9), fontWeight: '500'}}>Don’t have access anymore?</Text>
              <Pressable style={{marginTop: responsiveWidth(1)}}>
                <Text style={{fontSize: responsiveFontSize(2), color: 'black', textDecorationLine: 'underline'}}>Try another method</Text>
              </Pressable>
            </View>

             
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

export default ForgotPassword;

const Styles = StyleSheet.create({
  backgroundImg: {
    resizeMode: 'cover',
    // height: '100%',
    flex: 1,
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
    marginTop: responsiveWidth(30),
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
  mainView: {
    flex: 1,
    paddingHorizontal: responsiveWidth(2),
    backgroundColor: 'white'
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
  inputBox: {
    borderWidth: 1,
    borderColor: '#CED4DA',
    borderRadius: 14,
    paddingLeft: responsiveWidth(11),
    height: responsiveWidth(12),
    fontSize: responsiveFontSize(2),
    color: '#000'
  },
  errorMsg: {
    color: 'red',
    marginBottom: 15,
  },
  buttonStyle: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 18,
  },
  hide: {
    display: 'none',
  },
  show: {
    display: 'flex',
  },
  blueBtn: {
    backgroundColor: '#1866B4',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: responsiveWidth(4),
    marginTop: responsiveWidth(5),
    padding: responsiveWidth(3)
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
