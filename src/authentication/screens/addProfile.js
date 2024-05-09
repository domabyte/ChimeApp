import {useState, useContext} from 'react';
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
import {AuthContext} from '../../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddProfile = ({navigation, route}) => {
  const {
    response,
    countryName,
    stateName,
    encryptToken,
    loginToken,
    memberToken,
  } = route.params;
  const [selectedImage, setSelectedImage] = useState(null);
  const {isLoading, setUserInfo, updatePhotoInfo} = useContext(AuthContext);
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
      const source = {uri: response.assets[0]};
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
      navigation.navigate('suggestedFriends', {userInfo});
    }
  };

  const skipPhoto = () => {
    setUserInfo(userInfo);
    AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
  };

  return (
    <>
      <StatusBar barStyle={'dark-lite'} backgroundColor="#1E293C" />
      <ImageBackground
        source={require('../../assets/png/LoginBg.png')}
        style={styles.backgroundImg}>
        <Spinner visible={isLoading} />
        <View style={styles.center}>
          <Text
            style={{
              fontSize: 24,
              color: 'black',
              marginTop: 150,
              fontWeight: '500',
              textAlign: 'center',
            }}>
            Adding a photo helps people recognize you
          </Text>
          <View
            style={{alignItems: 'center', position: 'relative', marginTop: 50}}>
            <View
              style={{
                width: 160,
                height: 160,
                borderRadius: 100,
                overflow: 'hidden',
              }}>
              <TouchableOpacity onPress={pickImage}>
                {selectedImage && (
                  <Image
                    source={selectedImage?.uri}
                    style={{width: '100%', height: '100%'}}
                  />
                )}
                {!selectedImage && (
                  <Image
                    source={require('../../assets/png/defaultImage.png')}
                    style={{width: '100%', height: '100%'}}
                  />
                )}
              </TouchableOpacity>
            </View>
            <View style={styles.deleteBtnBox}>
              {selectedImage && (
                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={deleteImage}>
                  <Image
                    style={{width: 18, height: 18}}
                    source={require('../../assets/png/delete.png')}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
          <Text
            style={{
              fontSize: 20,
              fontWeight: '700',
              color: 'black',
              marginTop: 30,
            }}>
            {response?.Mem_Name + ' ' + response?.Mem_LName}
          </Text>
          <Text style={{fontSize: 16, fontWeight: '400', marginTop: 15}}>
            {response.Mem_Address}, {stateName}, {countryName} -{' '}
            {response.Mem_ZipCode}
          </Text>
          <TouchableOpacity style={styles.blueBtn} onPress={handleAddPhoto}>
            <Text style={{color: '#fff', fontWeight: '500', fontSize: 18}}>
              Add Photo
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.whiteBtn} onPress={skipPhoto}>
            <Text style={{color: '#1866B4', fontWeight: '500', fontSize: 18}}>
              Skip
            </Text>
          </TouchableOpacity>
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
  center: {
    alignItems: 'center',
    display: 'flex',
  },
  deleteBtn: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
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
    height: 45,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    marginTop: 30,
    width: '90%',
  },
  whiteBtn: {
    height: 45,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    marginTop: 16,
    marginBottom: 25,
    width: '90%',
  },
});

export default AddProfile;
