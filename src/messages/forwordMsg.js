import React, { useState } from 'react';
import { Modal, View, Text, TouchableWithoutFeedback, StyleSheet, TouchableOpacity, TextInput, Image, ScrollView } from 'react-native';

const LongPressPopup = ({ isVisible, onClose }) => {
    const handleOverlayPress = () => {
        onClose();
    };

    const [sendBtn, setSendBtn] = useState(true);
    const [undoBtn, setUndoBtn] = useState(false);

    const forwordBtn = () => {
        setSendBtn(!sendBtn);
        setUndoBtn(!undoBtn)
    };

    const data = [
        {
            userImg: require('../../assets/png/user8.png'),
            userName: 'Theresa Webb Dianne Russell Courtney Henry'
        },
        {
            userImg: require('../../assets/png/user1.png'),
            userName: 'Devon Lane'
        },
        {
            userImg: require('../../assets/png/user2.png'),
            userName: 'Dianne Russell'
        },
        {
            userImg: require('../../assets/png/user3.png'),
            userName: 'Courtney Henry'
        },
        {
            userImg: require('../../assets/png/user4.png'),
            userName: 'Brooklyn Simmons'
        },
        {
            userImg: require('../../assets/png/user5.png'),
            userName: 'Leslie Alexander'
        },
        {
            userImg: require('../../assets/png/user6.png'),
            userName: 'Esther Howard'
        },
        {
            userImg: require('../../assets/png/user6.png'),
            userName: 'Esther Howard'
        },
        {
            userImg: require('../../assets/png/user6.png'),
            userName: 'Esther Howard'
        },
        {
            userImg: require('../../assets/png/user6.png'),
            userName: 'Esther Howard'
        },
        {
            userImg: require('../../assets/png/user6.png'),
            userName: 'Esther Howard'
        },
        {
            userImg: require('../../assets/png/user6.png'),
            userName: 'Esther Howard'
        },
        {
            userImg: require('../../assets/png/user6.png'),
            userName: 'Esther Howard'
        },
        {
            userImg: require('../../assets/png/user6.png'),
            userName: 'Esther Howard'
        },
    ]

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >

            <ScrollView>
                <TouchableWithoutFeedback onPress={handleOverlayPress}>
                    <View style={styles.overlay} />
                </TouchableWithoutFeedback>
                <View style={styles.modalContainer}>
                    <View style={styles.popupHead}>
                        <TouchableOpacity onPress={onClose}>
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                        <Text style={styles.modalText}>Forward To</Text>
                        <View style={styles.selectCount}>
                            <Text style={{ fontSize: 14, fontWeight: '500', color: '#1866B4' }}>2</Text>
                        </View>
                    </View>
                    <View style={styles.searchSection}>
                        <TextInput
                            placeholder="Search Friends"
                            style={styles.searchBox}
                        />
                        <TouchableOpacity style={styles.searchbtn}>
                            <Image style={{ width: 24, height: 24, }} source={require('../../assets/png/search.png')} />
                        </TouchableOpacity>
                    </View>
                    {data.map((item, index) => (
                        <View key={index} style={styles.userList}>
                            <View style={styles.leftside}>
                                <Image style={styles.userImg} source={item.userImg} />
                                <Text numberOfLines={1} style={{ fontSize: 18, fontWeight: '500', color: 'black', width: '65%' }}>{item.userName}</Text>
                            </View>
                            {sendBtn && (
                                <TouchableOpacity onPress={forwordBtn} style={[styles.sendBtn, { backgroundColor: '#CEE7FF' }]}>
                                    <Text style={{ fontSize: 14, fontWeight: '500', color: '#1866B4' }}>Send</Text>
                                </TouchableOpacity>
                            )}
                            {undoBtn && (
                                <TouchableOpacity onPress={forwordBtn} style={[styles.sendBtn, { backgroundColor: '#1E293C' }]}>
                                    <Text style={{ fontSize: 14, fontWeight: '500', color: 'white' }}>Undo</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    ))}
                </View>
            </ScrollView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        height: 200
    },
    modalContainer: {
        backgroundColor: 'white',
        minHeight: '80%',
        overflow: 'hidden'
    },
    modalText: {
        fontSize: 18,
        color: 'black',
        fontWeight: '500'
    },
    closeButtonText: {
        fontSize: 16,
        color: '#1866B4',
    },
    popupHead: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 10
    },
    selectCount: {
        backgroundColor: '#CEE7FF',
        justifyContent: 'center',
        alignItems: 'center',
        height: 26,
        width: 26,
        borderRadius: 20
    },
    searchSection: {
        marginHorizontal: 10,
        position: 'relative',
        marginVertical: 10
    },
    searchBox: {
        backgroundColor: '#f4f4f4',
        borderRadius: 50,
        height: 45,
        paddingLeft: 20
    },
    searchbtn: {
        position: 'absolute',
        top: 10,
        right: 15
    },
    userImg: {
        width: 50,
        height: 50,
        overflow: 'hidden',
        borderRadius: 40,
        resizeMode: 'cover'
    },
    leftside: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    userList: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingVertical: 5
    },
    sendBtn: {
        width: 60,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5
    }
});

export default LongPressPopup;
