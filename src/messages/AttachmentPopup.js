import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Image, Pressable } from 'react-native';
import { responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions';
import { BlurView } from '@react-native-community/blur';

const AttachmentPopup = ({ visible, onClose, onCameraPress, onPhotoVideoPress ,onDocumentPress}) => {
    return (
        <Modal
            transparent={true}
            visible={visible}
            animationType="slide"
            onRequestClose={onClose}>

            <Pressable style={styles.overlay} onPress={onClose}>
                <BlurView
                    style={styles.absolute}
                    blurType="dark"
                    blurAmount={1}
                    reducedTransparencyFallbackColor="black"
                />
                <View style={styles.popup}>
                    <TouchableOpacity style={styles.option} onPress={onCameraPress}>
                        <Image style={styles.icon} source={require('../assets/png/blue-camera.png')} />
                        <Text style={styles.optionText}>Camera</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.option} onPress={onPhotoVideoPress}>
                        <Image style={styles.icon} source={require('../assets/png/blue-image.png')} />
                        <Text style={styles.optionText}>Photo & Video Library</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.option, { marginBottom: 0 }]} onPress={onDocumentPress}>
                        <Image style={styles.icon} source={require('../assets/png/blue-file-add.png')} />
                        <Text style={styles.optionText}>Document</Text>
                    </TouchableOpacity>
                </View>
                <Pressable style={styles.cancelButton} onPress={onClose}>
                    <Text style={{ textAlign: 'center', color: '#525866', fontSize: responsiveFontSize(2), fontWeight: '500' }}>Cancel</Text>
                </Pressable>
            </Pressable>
        </Modal>
    )
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    absolute: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
    popup: {
        backgroundColor: 'white',
        padding: 16,
        borderRadius: responsiveWidth(5),
        marginHorizontal: responsiveWidth(4),
        marginBottom: responsiveWidth(5)
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F7FA',
        paddingHorizontal: responsiveWidth(3),
        paddingVertical: responsiveWidth(2.5),
        marginBottom: responsiveWidth(2),
        borderRadius: responsiveWidth(3)
    },
    optionText: {
        marginLeft: 10,
        fontSize: responsiveFontSize(2),
        color: '#1866B4'
    },
    cancelButton: {
        backgroundColor: 'white',
        paddingVertical: responsiveWidth(3),
        paddingHorizontal: responsiveWidth(2),
        marginHorizontal: responsiveWidth(4),
        marginBottom: responsiveWidth(6),
        borderRadius: responsiveWidth(5)

    },
    icon: {
        width: responsiveWidth(6),
        height: responsiveWidth(6)
    }
});

export default AttachmentPopup;