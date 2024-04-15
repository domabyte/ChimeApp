import { useState } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    ImageBackground,
    StatusBar,
    ScrollView,
    TextInput,
    Dimensions,
    Modal,
    TouchableWithoutFeedback,
    Touchable
} from "react-native"
import LongPressPopup from "./forwordMsg";


const ChatSection = () => {
    const { width } = Dimensions.get('window');

    const [height, setHeight] = useState(40);
    const maxHeight = 100;
    const [isPopupVisible, setPopupVisible] = useState(false);
    const [imgPopupVisible, setimgPopupVisible] = useState(false);

    const handleContentSizeChange = (event) => {
        const newHeight = event.nativeEvent.contentSize.height;
        setHeight(newHeight > maxHeight ? maxHeight : newHeight);
    };

    const [inputValue, setInputValue] = useState('');
    const [showButtons, setShowButtons] = useState(true);

    const handleInputChange = (text) => {
        setInputValue(text);
        setShowButtons(text.length === 0);
    };

    const handleLongPress = () => {
        setPopupVisible(true);
    };

    const handleClosePopup = () => {
        setPopupVisible(false);
    };

    const imghandleLongPress = () => {
        setimgPopupVisible(true);
    };

    const imghandleClosePopup = () => {
        setimgPopupVisible(false);
    };

    const handleOverlayPress = () => {
        handleClosePopup();
    };

    const [isPopupForward, setPopupForward] = useState(false);

    const handleLongPress1 = () => {
        setPopupForward(true);
    };

    const handleClosePopup2 = () => {
        setPopupForward(false);
    };

    const handlePress = () => {
        handleLongPress1();
        handleOverlayPress();
    };


    return (
        <View style={styles.container}>
            <StatusBar barStyle={'dark-lite'} backgroundColor="#1E293C" />
            <View style={styles.chatHead}>
                <View style={styles.chatTop}>
                    <TouchableOpacity >
                        <Image style={{ width: 25, height: 25 }} source={require('../../assets/png/leftArrow2.png')} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.userImag}>
                        <Image style={{ width: '100%', height: '100%', resizeMode: 'cover' }} source={require('../../assets/png/user8.png')} />
                    </TouchableOpacity>
                    <View>
                        <Text numberOfLines={1} style={{ fontSize: 16, fontWeight: '600', color: 'black', width: 190 }}>Theresa Webb</Text>
                        <Text style={{ alignItems: 'center', color: 'black' }}>Online <View style={styles.liveBtn}></View></Text>
                    </View>
                </View>
                <View style={styles.callSection}>
                    <TouchableOpacity>
                        <Image style={{ width: 22, height: 22 }} source={require('../../assets/png/videoCall.png')} />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Image style={{ width: 22, height: 22 }} source={require('../../assets/png/call.png')} />
                    </TouchableOpacity>
                </View>
            </View>
            <ScrollView style={{ flex: 1 }}>
                <View style={styles.recvMsgBox}>
                    <View style={styles.recvImg}>
                        <Image style={{ width: '100%', height: '100%', resizeMode: 'cover' }} source={require('../../assets/png/user8.png')} />
                    </View>
                    <TouchableWithoutFeedback onLongPress={handleLongPress}>
                        <Text style={styles.recvMsg}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor</Text>
                    </TouchableWithoutFeedback>
                </View>
                <View style={styles.sendMsgBox}>
                    <TouchableWithoutFeedback onLongPress={handleLongPress}>
                        <Text style={styles.sendMsg}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor</Text>
                    </TouchableWithoutFeedback>
                    <View style={styles.recvImg}>
                        <Image style={{ width: '100%', height: '100%', resizeMode: 'cover' }} source={require('../../assets/png/user8.png')} />
                    </View>
                </View>
                <View style={styles.sendMsgBox}>
                    <TouchableWithoutFeedback onLongPress={handleLongPress}>
                        <Text style={styles.sendMsg}>Lorem ipsum dolor</Text>
                    </TouchableWithoutFeedback>
                    <View style={styles.recvImg}>
                        <Image style={{ width: '100%', height: '100%', resizeMode: 'cover' }} source={require('../../assets/png/user8.png')} />
                    </View>
                </View>
                <View style={styles.sendMsgBox}>
                    <TouchableWithoutFeedback onLongPress={imghandleLongPress}>
                        <Image style={styles.img} source={require('../../assets/png/Rectangle1.png')} />
                    </TouchableWithoutFeedback>
                    <View style={styles.recvImg}>
                        <Image style={{ width: '100%', height: '100%', resizeMode: 'cover' }} source={require('../../assets/png/user8.png')} />
                    </View>
                </View>
                <View style={styles.recvMsgBox}>
                    <View style={styles.recvImg}>
                        <Image style={{ width: '100%', height: '100%', resizeMode: 'cover' }} source={require('../../assets/png/user8.png')} />
                    </View>
                    <TouchableWithoutFeedback onLongPress={imghandleLongPress}>
                        <Image style={styles.img} source={require('../../assets/png/Rectangle1.png')} />
                    </TouchableWithoutFeedback>
                </View>
                <View style={styles.sendMsgBox}>
                    <TouchableWithoutFeedback onLongPress={handleLongPress}>
                        <Text style={styles.sendMsg}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor</Text>
                    </TouchableWithoutFeedback>
                    <View style={styles.recvImg}>
                        <Image style={{ width: '100%', height: '100%', resizeMode: 'cover' }} source={require('../../assets/png/user8.png')} />
                    </View>
                </View>
            </ScrollView>
            <View style={[styles.sendBox, { width: width }]}>
                {showButtons &&
                    <View style={styles.leftAreaBtn}>
                        <TouchableOpacity style={styles.leftBtn}>
                            <Image style={{ width: 25, height: 25 }} source={require('../../assets/png/AddDocument.png')} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.leftBtn}>
                            <Image style={{ width: 25, height: 25 }} source={require('../../assets/png/AddImage.png')} />
                        </TouchableOpacity>
                    </View>
                }

                <View style={{ position: 'relative', width: showButtons ? '65%' : '86.4%' }}>
                    <TextInput
                        multiline
                        value={inputValue}
                        onChangeText={handleInputChange}
                        onContentSizeChange={handleContentSizeChange}
                        style={[styles.messageBox, { height: Math.min(height, maxHeight) }]}
                        placeholder="Type message..."
                        placeholderTextColor="#888"
                    />
                    <TouchableOpacity style={styles.emojiBtn}>
                        <Image style={{ width: 26, height: 26 }} source={require('../../assets/png/emojiBtn.png')} />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.sendBtn}>
                    <Image style={{ width: 24, height: 24 }} source={require('../../assets/png/SendBtn.png')} />
                </TouchableOpacity>
            </View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={isPopupVisible}
                onRequestClose={handleClosePopup}
            >
                <TouchableWithoutFeedback onPress={handleOverlayPress}>
                    <View style={styles.overlay} />
                </TouchableWithoutFeedback>
                <View style={styles.modalContainer}>
                    <TouchableOpacity style={styles.popupBtn}>
                        <Image style={{ width: 40, height: 40 }} source={require('../../assets/png/delete.png')} />
                        <Text style={{ color: 'black' }}>Delete</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.popupBtn}>
                        <Image style={{ width: 40, height: 40 }} source={require('../../assets/png/edit.png')} />
                        <Text style={{ color: 'black' }}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.popupBtn} onPress={handlePress}>
                        <Image style={{ width: 40, height: 40 }} source={require('../../assets/png/forward.png')} />
                        <Text style={{ color: 'black' }}>Forward</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
            <Modal
                animationType="slide"
                transparent={true}
                visible={imgPopupVisible}
                onRequestClose={handleClosePopup}
            >
                <TouchableWithoutFeedback onPress={imghandleClosePopup}>
                    <View style={styles.overlay} />
                </TouchableWithoutFeedback>
                <View style={styles.modalContainer}>
                    <TouchableOpacity style={styles.popupBtn}>
                        <Image style={{ width: 40, height: 40 }} source={require('../../assets/png/delete.png')} />
                        <Text style={{ color: 'black' }}>Delete</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.popupBtn}>
                        <Image style={{ width: 40, height: 40 }} source={require('../../assets/png/Download.png')} />
                        <Text style={{ color: 'black' }}>Download</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.popupBtn} onPress={handlePress}>
                        <Image style={{ width: 40, height: 40 }} source={require('../../assets/png/forward.png')} />
                        <Text style={{ color: 'black' }}>Forward</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
            <LongPressPopup isVisible={isPopupForward} onClose={handleClosePopup2} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    userImag: {
        width: 40,
        height: 40,
        borderRadius: 50,
        overflow: 'hidden'
    },
    chatTop: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    liveBtn: {
        height: 10,
        width: 10,
        backgroundColor: '#80FF00',
        borderRadius: 50
    },
    callSection: {
        flexDirection: 'row',
        gap: 12
    },
    chatHead: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 15,
        paddingVertical: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        elevation: 5,
    },
    sendBox: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingVertical: 10,
        alignItems: 'flex-end'
    },
    leftAreaBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8
    },
    messageBox: {
        backgroundColor: '#F6F6F6',
        borderRadius: 20,
        paddingLeft: 20,
        paddingRight: 38,
    },
    sendBtn: {
        backgroundColor: '#1866B4',
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
    },
    emojiBtn: {
        position: 'absolute',
        right: 8,
        bottom: 8
    },
    scrollView: {
        flex: 1,
    },
    recvMsg: {
        backgroundColor: '#EAEAEA',
        borderRadius: 16,
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 6,
        color: 'black',
        width: 300
    },
    sendMsg: {
        backgroundColor: '#1866B4',
        borderRadius: 16,
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 6,
        color: 'white',
        minWidth: 50,
        maxWidth: 260
    },
    recvImg: {
        width: 24,
        height: 24,
        borderRadius: 20,
        overflow: 'hidden'
    },
    recvMsgBox: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'flex-end',
        marginHorizontal: 10,
        marginVertical: 10,
    },
    sendMsgBox: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'flex-end',
        marginHorizontal: 10,
        marginVertical: 10,
        justifyContent: 'flex-end'
    },
    img: {
        width: 200,
        height: 200,
        resizeMode: 'cover',
        borderRadius: 16,
    },
    leftBtn: {
        height: 40,
        width: 30,
        justifyContent: 'center',
        alignItems: 'center'
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
    },
    modalContainer: {
        backgroundColor: 'white',
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 20,
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    modalText: {
        fontSize: 18,
        marginBottom: 10,
    },
    closeButton: {
        marginTop: 10,
        alignSelf: 'flex-end',
    },
    closeButtonText: {
        fontSize: 16,
        color: 'blue',
    },
    popupBtn: {
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default ChatSection