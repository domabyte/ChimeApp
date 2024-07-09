import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Image, Pressable } from 'react-native';
import { responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions';

const LongpressOption = ({ setvisibleOption, onClose }) => {
    return (
        <Modal
            transparent={true}
            visible={setvisibleOption}
            animationType="slide"
            onRequestClose={onClose}>

            <Pressable style={styles.overlay} onPress={onClose}>
                <View style={styles.shadow}>
                    <View style={styles.popup}>
                        <TouchableOpacity style={styles.btn}>
                            <Image style={styles.icon} source={require('../assets/png/delete.png')} />
                            <Text style={styles.btnText}>Delete</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.btn}>
                            <Image style={styles.icon} source={require('../assets/png/edit.png')} />
                            <Text style={styles.btnText}>Edit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.btn}>
                            <Image  style={styles.icon} source={require('../assets/png/forward.png')} />
                            <Text style={styles.btnText}>Forward</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </Pressable>
        </Modal>
    )
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    popup: {
        backgroundColor: 'white',
        paddingHorizontal: responsiveWidth(5),
        paddingVertical: responsiveWidth(4),
        borderRadius: responsiveWidth(5),
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    shadow: {
        width: responsiveWidth(100),
        height: responsiveWidth(26),
        
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.36,
        shadowRadius: 8,

        elevation: 6,
        justifyContent: 'flex-end'
    },
    btn: {
        justifyContent: 'center', 
        alignItems: 'center'
    },
    icon: {
        width: responsiveWidth(10), 
        height: responsiveWidth(10)
    },
    btnText: {
        fontSize: responsiveFontSize(1.8), 
        fontWeight: '600', 
        color: '#000',
    }
});

export default LongpressOption;