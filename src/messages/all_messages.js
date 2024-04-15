import { View, StatusBar, StyleSheet, TextInput, Image, TouchableOpacity, Text, ScrollView } from "react-native"
import Header from "../components/Header"
import { useState } from "react"

const AllMessages = () => {
    const [isNavBtn, setIsNavBtn] = useState(0)
    return (
        <>
            <StatusBar barStyle={'dark-lite'} backgroundColor="#1E293C" />
            <Header />
            <View style={styles.container}>
                <View style={{ marginHorizontal: 16, marginVertical: 10 }}>
                    <Text style={styles.messageText}>All Messages</Text>
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
                <View  style={styles.navbtnbox}>
                    <TouchableOpacity onPress={() => setIsNavBtn(0)} style={[styles.navbtn, {backgroundColor: isNavBtn == 0 ? '#F0F0F0' : '#fff'}]}>
                        <Text>Chat</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setIsNavBtn(1)} style={[styles.navbtn, {backgroundColor: isNavBtn == 1 ? '#F0F0F0' : '#fff'}]}>
                        <Text>Group</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView>
                    <TouchableOpacity style={styles.listBox}>
                        <View style={styles.userImg}>
                            <Image style={{ width: '100%', height: '100%', }} source={require('../../assets/png/user4.png')} />
                        </View>
                        <View>
                            <Text numberOfLines={1} style={styles.userName}>Theresasdf Webb</Text>
                            <View style={styles.magtextarea}>
                                <Text numberOfLines={1} style={[styles.msgText, {width: '50%'}]}>Lorem ipsum dolor sit Lorem ipsum dolor sit</Text>
                                <View style={styles.dot}></View>
                                <Text style={styles.msgText}>20 Jun, 2024</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.listBox}>
                        <View style={styles.userImg}>
                            <Image style={{ width: '100%', height: '100%', }} source={require('../../assets/png/user4.png')} />
                        </View>
                        <View>
                            <Text style={styles.userName}>Theresa Webb</Text>
                            <View style={styles.magtextarea}>
                                <Text style={styles.msgText}>Lorem ipsum dolor sit</Text>
                                <View style={styles.dot}></View>
                                <Text style={styles.msgText}>20 Jun, 2024</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.listBox}>
                        <View style={styles.userImg}>
                            <Image style={{ width: '100%', height: '100%', }} source={require('../../assets/png/user4.png')} />
                        </View>
                        <View>
                            <Text style={styles.userName}>Theresa Webb</Text>
                            <View style={styles.magtextarea}>
                                <Text style={styles.msgText}>Lorem ipsum dolor sit</Text>
                                <View style={styles.dot}></View>
                                <Text style={styles.msgText}>20 Jun, 2024</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </ScrollView>
            </View>

        </>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    searchSection: {
        marginHorizontal: 10,
        marginBottom: 10,
        position: 'relative'
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
    messageText: {
        color: 'black',
        fontSize: 20,
        fontWeight: '700'
    },
    userName: {
        fontSize: 18,
        fontWeight: '500',
        color: 'black',
        marginBottom: 0,
        width: '70%'
    },
    msgText: {
        fontSize: 14,
        color: '#696969'
    },
    dot: {
        width: 6,
        height: 6,
        backgroundColor: '#696969',
        borderRadius: 10,
        marginHorizontal: 8
    },
    magtextarea: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    userImg: {
        width: 55,
        height: 55,
        borderRadius: 50,
        overflow: 'hidden'
    },
    listBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
        marginHorizontal: 10,
        marginVertical: 6
    },
    navbtnbox: {
        flexDirection: 'row',
        marginHorizontal: 10,
        marginBottom: 8
    },
    navbtn: {
        width: '50%',
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
    }
})

export default AllMessages