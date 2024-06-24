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
import { responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions';
import LinearGradient from 'react-native-linear-gradient';

const SuccessPassword = ({ navigation }) => {
  const { isLoading } = useContext(AuthContext);
  return (
    <>
      <StatusBar barStyle={'dark-lite'} backgroundColor="#1E293C" />
      <Spinner visible={isLoading} />
      <View style={styles.container}>
        <View style={styles.successImg}>
          <Image
            style={{ width: responsiveWidth(30), height: responsiveWidth(30) }}
            source={require('../../assets/png/success_icon.png')}
          />
        </View>
        <View style={styles.text}>
          <Text
            style={{
              fontSize: responsiveFontSize(2.5),
              textAlign: 'center',
              color: '#000',
              fontWeight: '600',
              marginTop: 20,
            }}>
            Your password has been successfully changed!
          </Text>
        </View>
        <View style={{ marginHorizontal: 25 }}>
          <TouchableOpacity onPress={() => {
            navigation.navigate('Login');
          }}>
            <LinearGradient style={styles.blueBtn} colors={['#3B7DBF', '#1866B4']} >
              <Text style={{ color: '#fff', fontWeight: '500', fontSize: 18 }}>
                LogIn
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
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
    backgroundColor: 'white'
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
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: responsiveWidth(4),
    marginTop: responsiveWidth(10),
    padding: responsiveWidth(3),
    width: responsiveWidth(90)
  },
});

export default SuccessPassword;
