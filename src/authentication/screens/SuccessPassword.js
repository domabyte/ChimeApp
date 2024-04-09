import { useContext } from 'react';
import {
  Image,
  Text,
  StatusBar,
  ImageBackground,
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { AuthContext } from '../../context/AuthContext';

const SuccessPassword = ({navigation}) => {
    const {isLoading} = useContext(AuthContext);
  return (
    <>
      <StatusBar barStyle={'dark-lite'} backgroundColor="#1E293C" />
      <Spinner visible={isLoading} />
      <ImageBackground
        source={require('../../assets/png/LoginBg.png')}
        style={styles.backgroundImg}>
        <View style={styles.container}>
          <View style={styles.successImg}>
            <Image
              style={{width: 160, height: 160}}
              source={require('../../assets/png/success_icon.png')}
            />
          </View>
          <View style={styles.text}>
            <Text
              style={{
                fontSize: 24,
                textAlign: 'center',
                color: '#000',
                fontWeight: '600',
                marginTop: 20,
              }}>
              Your password has been successfully changed!
            </Text>
          </View>
          <View style={{marginHorizontal: 25}}>
            <TouchableOpacity style={styles.blueBtn}  onPress={()=>{
                navigation.navigate('Login');
              }}>
              <Text style={{color: '#fff', fontWeight: '500', fontSize: 18}}>
                LogIn
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </>
  );
};

const styles = StyleSheet.create({
  backgroundImg: {
    resizeMode: 'cover',
    height: '100%',
  },
  container: {
    flex: 1,
  },
  successImg: {
    alignItems: 'center',
    marginTop: 200,
  },
  text: {
    alignItems: 'center',
    marginHorizontal: 25,
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

export default SuccessPassword;
