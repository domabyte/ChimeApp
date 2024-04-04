import React ,{lazy, useContext} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import FriendScreen from '../screens/Friends.js';
import SplashScreen from '../authentication/screens/SplashScreen.js';
import LoginScreen from '../authentication/screens/Login.js';
import RegisterScreen from '../authentication/screens/Signup.js';
import OtpVerification from '../authentication/screens/OTPVerification.js';
import ForgotPassword from '../authentication/screens/ForgotPassword.js';
import ForgotPassOTP from '../authentication/screens/ForgotPassOTP.js';
import ChangePassword from '../authentication/screens/ChangePassword.js';
import { AuthContext } from '../context/AuthContext.js';
const Stack = createNativeStackNavigator();

const Navigation = () => {
  const {userInfo, splashLoading} = useContext(AuthContext);
  return (
    <NavigationContainer>
      <Stack.Navigator>
      {splashLoading ? (
          <Stack.Screen
            name="Splash Screen"
            component={SplashScreen}
            options={{headerShown: false}}
          />
          ) : userInfo.memberToken ? (
          <Stack.Screen name="Friends" component={FriendScreen} />
          ) : (
            <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="OtpVerification"
              component={OtpVerification}
              options={{headerShown: false}}
            />
            <Stack.Screen 
              name='forgotPassword'
              component={ForgotPassword}
              options={{headerShown: false}}
            />
            <Stack.Screen 
              name='forgotPassOTP'
              component={ForgotPassOTP}
              options={{headerShown: false}}
            />
            <Stack.Screen 
              name='changePassword'
              component={ChangePassword}
              options={{headerShown: false}}
            />
            </>
          )} 
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;