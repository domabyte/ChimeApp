import React, { useState, useContext } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, ScrollView } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import {AuthContext} from '../../context/AuthContext';

const ForgotPassword = ({ navigation }) => {
  const [email, setEmail] = useState(null);
  const {isLoading, forgotPassword, error} = useContext(AuthContext);

  const sendSecurityCode = async () => {
       const {id, message} =  await forgotPassword(email);
       if(id){
        navigation.navigate('forgotPassOTP', {Mem_ID: id, message, email: email});
       }
  };

  return (
    <ScrollView style={Styles.mainView}>
         <Spinner visible={isLoading} />
      <View>
        <Text style={Styles.title}>Forgot Password</Text>
        <Text style={Styles.subTitle}>Enter your email address to receive a security code</Text>

        <Text style={Styles.inputLable}>Email Address</Text>
        <TextInput
          value={email}
          onChangeText={ text => setEmail(text)}
          placeholder="Enter Your Email Address"
          style={Styles.inputBox}
        />
        <TouchableOpacity onPress={sendSecurityCode} style={{ marginTop: 15 }}>
          <Text style={Styles.buttonStyle}>Send Security Code</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 15 }}>
          <Text style={Styles.buttonStyle}>Back</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ForgotPassword;

const Styles = StyleSheet.create({
    mainView: {
      flex: 1,
      backgroundColor: '#fff',
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
    inputLable: {
      fontSize: 14,
      marginBottom: 5,
    },
    inputBox: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      padding: 10,
      marginBottom: 15,
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
    },
    hide: {
      display: 'none',
    },
    show: {
      display: 'flex',
    },
  });