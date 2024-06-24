import { useState, useContext } from 'react';
import {
  ImageBackground,
  StatusBar,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Button,
} from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import Spinner from 'react-native-loading-spinner-overlay';
import { AuthContext } from '../../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions';
import LinearGradient from 'react-native-linear-gradient';

const AddProfile = ({ navigation, route }) => {
  const {
    response,
    countryName,
    stateName,
    encryptToken,
    loginToken,
    memberToken,
  } = route.params;
  const [selectedImage, setSelectedImage] = useState(null);
  const { isLoading, setUserInfo, updatePhotoInfo } = useContext(AuthContext);
  const value = {
    name: response.Mem_Name + ' ' + response.Mem_LName,
    id: response.Mem_ID,
    friendid: response.FriendId,
    memberToken: memberToken,
    LoginToken: loginToken,
    encryptToken: encryptToken,
  };

  let userInfo = value;

  const pickImage = async () => {
    const options = {
      title: 'Select Image',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    await ImagePicker.launchImageLibrary(options, response => {
      handleImageResponse(response);
    });
  };

  const handleImageResponse = response => {
    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.error) {
      console.log('ImagePicker Error: ', response.error);
    } else {
      const source = { uri: response.assets[0] };
      setSelectedImage(source);
    }
  };

  const deleteImage = () => {
    setSelectedImage(null);
  };

  const handleAddPhoto = async () => {
    const response = await updatePhotoInfo(selectedImage, userInfo);
    if (response) {
      setUserInfo(userInfo);
      navigation.navigate('suggestedFriends', { userInfo });
    }
  };

  const skipPhoto = () => {
    setUserInfo(userInfo);
    AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle={'dark-lite'} backgroundColor="#1E293C" />
      <Spinner visible={isLoading} />
      <View style={[styles.center, { marginTop: responsiveWidth(30) }]}>
        <Text style={{ color: '#1866B4', fontWeight: '500', fontSize: responsiveFontSize(1.8) }}>Step 2 of 2</Text>
        <Text style={{ color: 'black', fontSize: responsiveFontSize(2.5), marginTop: responsiveWidth(1), fontWeight: '500' }}>Profile Photo</Text>
        <Text
          style={{
            fontSize: responsiveFontSize(2),
            width: responsiveWidth(75),
            textAlign: 'center',
            color: '#525866',
            fontWeight: '400',
            marginTop: responsiveWidth(1)
          }}>
          Adding a photo helps people recognize you
        </Text>
        <View
          style={{ alignItems: 'center', position: 'relative', marginTop: 50 }}>
          <View
            style={{
              width: responsiveWidth(28),
              height: responsiveWidth(28),
              borderRadius: 100,
              overflow: 'hidden',
            }}>
            <TouchableOpacity onPress={pickImage}>
              {selectedImage && (
                <Image
                  source={selectedImage?.uri}
                  style={{ width: '100%', height: '100%' }}
                />
              )}
              {!selectedImage && (
                <Image
                  source={require('../../assets/png/defaultImage.png')}
                  style={{ width: '100%', height: '100%' }}
                />
              )}
            </TouchableOpacity>
          </View>
          {/* <View style={styles.deleteBtnBox}>
            {selectedImage && (
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={deleteImage}>
                <Image
                  style={{ width: 18, height: 18 }}
                  source={require('../../assets/png/delete.png')}
                />
              </TouchableOpacity>
            )}
          </View> */}
        </View>
        <Text
          style={{
            fontSize: responsiveFontSize(2.5),
            fontWeight: '700',
            color: 'black',
            marginTop: responsiveWidth(4),
          }}>
          {response?.Mem_Name + ' ' + response?.Mem_LName}
        </Text>
        <Text style={{ fontSize: 16, fontWeight: '400', marginTop: responsiveWidth(2), width: responsiveWidth(70), textAlign: 'center' }}>
          {response.Mem_Address}, {stateName}, {countryName} -{' '}
          {response.Mem_ZipCode}
        </Text>

        <View style={{flexDirection: 'row', gap: 10}}>
        {selectedImage && (
          <TouchableOpacity onPress={deleteImage} style={{ borderColor: '#FB3748', borderWidth: 1, borderRadius: responsiveWidth(2.5), paddingHorizontal: responsiveWidth(4), paddingVertical: responsiveWidth(1.5), marginTop: responsiveWidth(4) }}>
            <Text style={{ fontSize: responsiveFontSize(1.6), color: '#FB3748' }}>Remove</Text>
          </TouchableOpacity>
        )}
          
          <TouchableOpacity style={{ borderColor: '#0E121B30', borderWidth: 1, borderRadius: responsiveWidth(2.5), paddingHorizontal: responsiveWidth(4), paddingVertical: responsiveWidth(1.5), marginTop: responsiveWidth(4) }} onPress={pickImage}>
            {selectedImage ? (
              <Text style={{ fontSize: responsiveFontSize(1.6) }}>Change</Text>
            ) : (
              <Text style={{ fontSize: responsiveFontSize(1.6) }}>Add Photo</Text>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.whiteBtn} onPress={skipPhoto}>
          <Text style={{ color: '#525866', fontWeight: '500', fontSize: responsiveFontSize(2) }}>
            I’ll do later
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleAddPhoto}>
          <LinearGradient colors={['#3B7DBF', '#1866B4']} style={styles.blueBtn}>
            <Text style={{ color: '#fff', fontWeight: '500', fontSize: 18 }}>
              Add Photo
            </Text>
          </LinearGradient>
        </TouchableOpacity>

      </View>
    </View>
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
  center: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center'
  },
  deleteBtn: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 50,
  },
  deleteBtnBox: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  blueBtn: {
    backgroundColor: '#1866B4',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: responsiveWidth(4),
    marginTop: responsiveWidth(5),
    padding: responsiveWidth(3),
    width: responsiveWidth(90)
  },
  whiteBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#0E121B30',
    borderRadius: responsiveWidth(4),
    padding: responsiveWidth(2.5),
    marginTop: responsiveWidth(8),
    width: responsiveWidth(90)
  },
});

export default AddProfile;
