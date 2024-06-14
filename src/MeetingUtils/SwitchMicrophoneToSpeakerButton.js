import React from "react";
import { TouchableOpacity, Image, StyleSheet } from "react-native";

export const SwitchMicrophoneToSpeakerButton = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Image
        style={styles.meetingButton}
        source={require("../assets/png/speaker.png")}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  meetingButton: {
    resizeMode: 'contain',
    width: 50,
    height: 50
  },
});