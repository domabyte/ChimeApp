import React, { useContext } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthContext } from '../context/AuthContext';
import SplashScreen from '../authentication/screens/SplashScreen.js';
import LoginScreen from '../authentication/screens/Login.js';
import RegisterScreen from '../authentication/screens/Signup.js';
import OtpVerification from '../authentication/screens/OTPVerification.js';
import ForgotPassword from '../authentication/screens/ForgotPassword.js';
import ForgotPassOTP from '../authentication/screens/ForgotPassOTP.js';
import ChangePassword from '../authentication/screens/ChangePassword.js';
import SuccessPassword from '../authentication/screens/SuccessPassword.js';
import AddProfile from '../authentication/screens/AddProfile.js';
import Information from '../authentication/screens/Information.js';
import FindFriends from '../Friends/screens/Find_Friends.js';
import SuggestedFriends from '../Friends/screens/SuggestedFriends.js';
import SentRequest from '../Friends/screens/Sent_Request.js';
import ReceivedRequest from '../Friends/screens/Received_Request.js';
import MyFriends from '../Friends/screens/My_Friend.js';
import MyProfile from '../myProfile/MeProfile.js';
import UserProfile from '../myProfile/UserProfile.js';
import AllMessages from '../messages/All_messages.js';
import ChatSection from '../messages/ChatSection.js';
import LongPressPopup from '../messages/ForwordMsg.js';
import AudioCall from '../Call/AudioCall.js';
import VideoCall from '../Call/VideoCall.js';

const Stack = createStackNavigator();

const linking = {
  prefixes: ['actpal://'],
  config: {
    screens: {
      audioCall: 'audioCall',
      videoCall: 'videoCall',
    },
  },
};

const AuthStack = () => (
  <Stack.Navigator initialRouteName="Login">
    <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
    <Stack.Screen name="OtpVerification" component={OtpVerification} options={{ headerShown: false }} />
    <Stack.Screen name="forgotPassword" component={ForgotPassword} options={{ headerShown: false }} />
    <Stack.Screen name="forgotPassOTP" component={ForgotPassOTP} options={{ headerShown: false }} />
    <Stack.Screen name="changePassword" component={ChangePassword} options={{ headerShown: false, gestureEnabled: false }} />
    <Stack.Screen name="successPassword" component={SuccessPassword} options={{ headerShown: false }} />
    <Stack.Screen name="addProfile" component={AddProfile} options={{ headerShown: false }} />
    <Stack.Screen name="information" component={Information} options={{ headerShown: false, gestureEnabled: false }} />
  </Stack.Navigator>
);

const AppStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="allMessages" component={AllMessages} options={{ headerShown: false }} />
    <Stack.Screen name="myFriend" component={MyFriends} options={{ headerShown: false }} />
    <Stack.Screen name="findFriends" component={FindFriends} options={{ headerShown: false }} />
    <Stack.Screen name="suggestedFriends" component={SuggestedFriends} options={{ headerShown: false }} />
    <Stack.Screen name="sentRequest" component={SentRequest} options={{ headerShown: false }} />
    <Stack.Screen name="receivedRequest" component={ReceivedRequest} options={{ headerShown: false }} />
    <Stack.Screen name="myFriends" component={MyFriends} options={{ headerShown: false }} />
    <Stack.Screen name="myProfile" component={MyProfile} options={{ headerShown: false }} />
    <Stack.Screen name="userProfile" component={UserProfile} options={{ headerShown: false }} />
    <Stack.Screen name="chatSection" component={ChatSection} options={{ headerShown: false }} />
    <Stack.Screen name="longPressPopup" component={LongPressPopup} options={{ headerShown: false }} />
    <Stack.Screen name="audioCall" component={AudioCall} options={{ headerShown: false, gestureEnabled: false }} />
    <Stack.Screen name="videoCall" component={VideoCall} options={{ headerShown: false, gestureEnabled: false }} />
  </Stack.Navigator>
);

const Navigation = () => {
  const { userInfo, splashLoading } = useContext(AuthContext);

  return (
    <NavigationContainer
      linking={linking}
      fallback={
        <View style={styles.container}>
          <ActivityIndicator animating={true} size="large" color="#0000ff" />
        </View>
      }
    >
      {splashLoading ? (
        <Stack.Navigator>
          <Stack.Screen name="SplashScreen" component={SplashScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
      ) : userInfo.memberToken ? (
        <AppStack />
      ) : (
        <AuthStack />
      )}
    </NavigationContainer>
  );
};

export default Navigation;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    height:'100%',
    width:'100%',
    backgroundColor:'#333'
  },
});
