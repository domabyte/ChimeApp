import React, { useState, useContext } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, ScrollView } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { AuthContext } from '../../context/AuthContext';

const ChangePassword = ({ navigation, route }) => {
    const {Mem_ID} = route.params;
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { isLoading, error, changePassword } = useContext(AuthContext);

  const handleResetPassword = async () => {
    if (newPassword === confirmPassword) {
      const response = await changePassword(Mem_ID, newPassword, confirmPassword);
      if(response){
        navigation.navigate('Login');
      }
    }
  };

  return (
    <ScrollView style={Styles.mainView}>
      <Spinner visible={isLoading} />
      <View>
        <Text style={Styles.title}>Change Password</Text>

        <Text style={Styles.inputLabel}>Enter New Password</Text>
        <TextInput
          value={newPassword}
          onChangeText={(text) => setNewPassword(text)}
          placeholder="Your Password"
          style={Styles.inputBox}
          secureTextEntry={true}
        />

        <Text style={Styles.inputLabel}>Confirm New Password</Text>
        <TextInput
          value={confirmPassword}
          onChangeText={(text) => setConfirmPassword(text)}
          placeholder="Your Password"
          style={Styles.inputBox}
          secureTextEntry={true}
        />

        <TouchableOpacity onPress={handleResetPassword} style={{ marginTop: 15 }}>
          <Text style={Styles.buttonStyle}>Reset Password</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ChangePassword;

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
  inputLabel: {
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
    width: '100%',
  },
  hide: {
    display: 'none',
  },
  show: {
    display: 'flex',
  },
});