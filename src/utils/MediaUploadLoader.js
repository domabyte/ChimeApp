import React from 'react';
import { View, Text, Image, StyleSheet, SafeAreaView } from 'react-native';

const MediaUploadLoader = () => {
  return (
    <View style={styles.chatMediauploadingLoader}>
      <View style={styles.proccesor}>
        <View style={styles.loadingImg}>
          <Image
            source={require('../assets/png/mediaLoader.png')}
            style={styles.image}
          />
        </View>
        <Text style={styles.text}>Media Uploading...</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  chatMediauploadingLoader: {
    alignItems: 'flex-end',
    marginTop: 10,
    width: '50%',
    marginLeft: 'auto',
    marginRight: 10,
  },
  proccesor: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  loadingImg: {
    marginBottom: 10,
  },
  image: {
    width: 50,
    height: 50,
  },
  text: {
    textAlign: 'center',
    color: 'black',
    marginLeft: 10,
    fontSize: 16,
  },
});

export default MediaUploadLoader;