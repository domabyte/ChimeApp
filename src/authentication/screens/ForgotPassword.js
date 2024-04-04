import React, {useState, useContext} from 'react';
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

const ForgotPassword = ({navigation}) => {
  const [email, setEmail] = useState(null);
  const {isLoading, forgotPassword, error} = useContext(AuthContext);

  const sendSecurityCode = async () => {
    const {id, message} = await forgotPassword(email);
    if (id) {
      navigation.navigate('forgotPassOTP', {Mem_ID: id, message, email: email});
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
          <View style={[Styles.center, {marginTop: 20}]}>
            <Text style={{fontSize: 22, fontWeight: '600', color: 'black'}}>
              Forgot Password
            </Text>
            <Text
              style={{
                fontSize: 16,
                marginTop: 6,
                fontWeight: '400',
                color: 'black',
              }}>
              Enter your email address to receive a security code
            </Text>
          </View>
          <View>
            <TextInput
              value={email}
              onChangeText={text => setEmail(text)}
              placeholder="Enter Your Email Address"
              style={Styles.inputBox}
            />

            <TouchableOpacity style={Styles.blueBtn} onPress={sendSecurityCode}>
              <Text style={Styles.buttonStyle}>Send Security Code</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                Styles.blueBtn,
                {
                  backgroundColor: 'transparent',
                  marginTop: 20,
                  marginBottom: 40,
                },
              ]}
              onPress={() => navigation.goBack()}>
              <Text style={[Styles.buttonStyle, {color: '#1866B4'}]}>Back</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ImageBackground>
    </>
  );
};

export default ForgotPassword;

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
  subTitle: {
    fontSize: 16,
    marginBottom: 20,
  },
  inputBox: {
    borderWidth: 1,
    borderColor: '#CED4DA',
    borderRadius: 50,
    paddingLeft: 20,
    height: 50,
    fontSize: 16,
    marginTop: 50,
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
    height: 45,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    marginTop: 20,
  },
});
