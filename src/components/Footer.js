import React, { useState, useContext } from "react"
import {AuthContext} from '../context/AuthContext';
import { Image, StyleSheet, View, Text, TouchableOpacity } from "react-native"
import { responsiveFontSize, responsiveWidth } from "react-native-responsive-dimensions"
import { useNavigation, useRoute } from "@react-navigation/core";
const default_photo = require('../assets/png/default-profile.png');


const Footer = () => {
    const [selectTab, setselectTab] = useState();
    const navigation = useNavigation();
    const route = useRoute()
    const { userInfo } =
        useContext(AuthContext);
    return (
        <>
            <View style={styles.container}>
                <View style={styles.main}>
                    <TouchableOpacity onPress={() => {setselectTab(0)}} style={styles.buttons}>
                        <Image style={[styles.icon, {tintColor: selectTab == 0 ? null : '#99A0AE'}]} source={require('../assets/png/Home.png')} />
                        <Text style={[styles.text, {color: selectTab == 0 ? '#fff' : '#99A0AE'}]}>HOME</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('myFriends')} style={styles.buttons}>
                        <Image style={[styles.icon, {tintColor: route.name == 'myFriends' ? null : '#99A0AE'}]} source={require('../assets/png/my-friend.png')} />
                        <Text style={[styles.text, {color: selectTab == 1 ? '#fff' : '#99A0AE'}]}>MY FRIENDS</Text>
                    </TouchableOpacity>
                    {/* <TouchableOpacity onPress={() => {setselectTab(1)}} style={styles.buttons}>
                        <Image style={[styles.icon, {tintColor: selectTab == 1 ? null : '#99A0AE'}]} source={require('../assets/png/community.png')} />
                        <Text style={[styles.text, {color: selectTab == 1 ? '#fff' : '#99A0AE'}]}>COMMUNITY</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setselectTab(2)} style={styles.buttons}>
                        <Image style={[styles.icon, {tintColor: selectTab == 2 ? null : '#99A0AE'}]} source={require('../assets/png/shop.png')} />
                        <Text style={[styles.text, {color: selectTab == 2 ? '#fff' : '#99A0AE'}]}>SHOP</Text>
                    </TouchableOpacity> */}
                    <TouchableOpacity onPress={() => navigation.navigate('allMessages')} style={[styles.buttons, {position: 'relative'}]}>
                        <Text style={styles.smsActive}>5</Text>
                        <Image style={[styles.icon, {tintColor: route.name == 'allMessages' ? null : '#99A0AE'}]} source={require('../assets/png/message.png')} />
                        <Text style={[styles.text, {color: selectTab == 3 ? '#fff' : '#99A0AE'}]}>MESSAGE</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('myProfile')} style={styles.buttons}>
                        <Image
                            style={[styles.icon, {borderColor: '#99A0AE', borderWidth: 2.5, borderRadius: responsiveWidth(4), }]}
                            source={
                                userInfo.memberPhoto && typeof userInfo.memberPhoto === 'string'
                                    ? { uri: userInfo.memberPhoto }
                                    : default_photo
                            }
                        />
                        <Text style={[styles.text, {color: route.name == 'myProfile' ? '#fff' : '#99A0AE'}]}>ACCOUNT</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </>
    )
}   

export default Footer;

const styles = StyleSheet.create({
    container: {
        height: responsiveWidth(19),
        backgroundColor: '#1E293C',
        paddingHorizontal: responsiveWidth(4),
        paddingTop: responsiveWidth(3),
        width: responsiveWidth(100),
    },
    main: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    buttons: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: responsiveWidth(2),
    },
    icon: {
        width: responsiveWidth(6.5),
        height: responsiveWidth(6.5),
    },
    text: {
        fontSize: responsiveFontSize(1.5),
        marginTop: responsiveWidth(1)
        
    },
    smsActive: {
        backgroundColor: '#1866B4',
        paddingHorizontal: responsiveWidth(1.5),
        paddingVertical: responsiveWidth(0.2),
        fontSize: responsiveFontSize(1.5),
        fontWeight: '400',
        color: '#fff',
        borderRadius: responsiveWidth(2),
        position: 'absolute',
        top: responsiveWidth(-1),
        right: responsiveWidth(2)
    }

})