import { ScrollView, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder'
import { responsiveWidth } from 'react-native-responsive-dimensions';
const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient)

const ChatShimmer = () => {

    return (
        <ScrollView>
            <View style={styles.date}>
                <ShimmerPlaceHolder style={{ width: '30%' }}>
                </ShimmerPlaceHolder>
            </View>
            <View
                style={{
                    display: 'flex',
                    paddingLeft: 10,
                    paddingRight: 0,
                    flexDirection: 'row',
                    alignSelf: 'flex-start',
                    height: '100vh',
                }}>
                <ShimmerPlaceHolder style={styles.recvImg}>
                </ShimmerPlaceHolder>
                <ShimmerPlaceHolder style={[styles.messageContainer, { height: 90, width: '60%' }]}>
                </ShimmerPlaceHolder>
            </View>
            <View
                style={{
                    display: 'flex',
                    paddingLeft: 0,
                    paddingRight: 10,
                    flexDirection: 'row',
                    alignSelf: 'flex-end',
                    height: '100vh',
                }}>
                <ShimmerPlaceHolder style={[styles.messageContainer, { height: 50, width: '60%' }]}>
                </ShimmerPlaceHolder>
                <ShimmerPlaceHolder style={styles.recvImg}>
                </ShimmerPlaceHolder>
            </View>
            <View
                style={{
                    display: 'flex',
                    paddingLeft: 10,
                    paddingRight: 0,
                    flexDirection: 'row',
                    alignSelf: 'flex-start',
                    height: '100vh',
                }}>
                <ShimmerPlaceHolder style={styles.recvImg}>
                </ShimmerPlaceHolder>
                <ShimmerPlaceHolder style={[styles.messageContainer, { height: 30, width: '30%' }]}>
                </ShimmerPlaceHolder>
            </View>
            <View
                style={{
                    display: 'flex',
                    paddingLeft: 10,
                    paddingRight: 0,
                    flexDirection: 'row',
                    alignSelf: 'flex-start',
                    height: '100vh',
                }}>
                <ShimmerPlaceHolder style={styles.recvImg}>
                </ShimmerPlaceHolder>
                <ShimmerPlaceHolder style={[styles.messageContainer, { height: 200, width: 200 }]}>
                </ShimmerPlaceHolder>
            </View>
            <View style={styles.date}>
                <ShimmerPlaceHolder style={{ width: '30%' }}>
                </ShimmerPlaceHolder>
            </View>
            <View
                style={{
                    display: 'flex',
                    paddingLeft: 0,
                    paddingRight: 10,
                    flexDirection: 'row',
                    alignSelf: 'flex-end',
                    height: '100vh',
                }}>
                <ShimmerPlaceHolder style={[styles.messageContainer, { height: 30, width: '25%' }]}>
                </ShimmerPlaceHolder>
                <ShimmerPlaceHolder style={styles.recvImg}>
                </ShimmerPlaceHolder>
            </View>
            <View
                style={{
                    display: 'flex',
                    paddingLeft: 0,
                    paddingRight: 10,
                    flexDirection: 'row',
                    alignSelf: 'flex-end',
                    height: '100vh',
                }}>
                <ShimmerPlaceHolder style={[styles.messageContainer, { height: 30, width: '45%' }]}>
                </ShimmerPlaceHolder>
                <ShimmerPlaceHolder style={styles.recvImg}>
                </ShimmerPlaceHolder>
            </View>
            <View
                style={{
                    display: 'flex',
                    paddingLeft: 0,
                    paddingRight: 10,
                    flexDirection: 'row',
                    alignSelf: 'flex-end',
                    height: '100vh',
                }}>
                <ShimmerPlaceHolder style={[styles.messageContainer, { height: 50, width: '60%' }]}>
                </ShimmerPlaceHolder>
                <ShimmerPlaceHolder style={styles.recvImg}>
                </ShimmerPlaceHolder>
            </View>
            <View
                style={{
                    display: 'flex',
                    paddingLeft: 10,
                    paddingRight: 0,
                    flexDirection: 'row',
                    alignSelf: 'flex-start',
                    height: '100vh',
                }}>
                <ShimmerPlaceHolder style={styles.recvImg}>
                </ShimmerPlaceHolder>
                <ShimmerPlaceHolder style={[styles.messageContainer, { height: 30, width: '30%' }]}>
                </ShimmerPlaceHolder>
            </View>
            <View
                style={{
                    display: 'flex',
                    paddingLeft: 10,
                    paddingRight: 0,
                    flexDirection: 'row',
                    alignSelf: 'flex-start',
                    height: '100vh',
                }}>
                <ShimmerPlaceHolder style={styles.recvImg}>
                </ShimmerPlaceHolder>
                <ShimmerPlaceHolder style={[styles.messageContainer, { height: 30, width: '40%' }]}>
                </ShimmerPlaceHolder>
            </View>
            <View
                style={{
                    display: 'flex',
                    paddingLeft: 10,
                    paddingRight: 0,
                    flexDirection: 'row',
                    alignSelf: 'flex-start',
                    height: '100vh',
                }}>
                <ShimmerPlaceHolder style={styles.recvImg}>
                </ShimmerPlaceHolder>
                <ShimmerPlaceHolder style={[styles.messageContainer, { height: 30, width: '60%' }]}>
                </ShimmerPlaceHolder>
            </View>
            <View
                style={{
                    display: 'flex',
                    paddingLeft: 10,
                    paddingRight: 0,
                    flexDirection: 'row',
                    alignSelf: 'flex-start',
                    height: '100vh',
                }}>
                <ShimmerPlaceHolder style={styles.recvImg}>
                </ShimmerPlaceHolder>
                <ShimmerPlaceHolder style={[styles.messageContainer, { height: 60, width: '60%' }]}>
                </ShimmerPlaceHolder>
            </View>


        </ScrollView>


    )
}

export default ChatShimmer

const styles = StyleSheet.create({
    date: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5,
    },
    recvImg: {
        width: responsiveWidth(6),
        height: responsiveWidth(6),
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: 'red',
        marginTop: responsiveWidth(2.2)
    },

    rcvMsg: {
        backgroundColor: '#EAEAEA',
        paddingHorizontal: 10,
        alignSelf: 'flex-end',
        paddingVertical: 6,
        minWidth: 50,
        maxWidth: 260,
    },
    messageContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: responsiveWidth(1),
        marginHorizontal: responsiveWidth(2.5),
        maxWidth: responsiveWidth(60),
        borderRadius: responsiveWidth(3.5),
        backgroundColor: '#F2F2F2',
    },
    messageTime: {
        alignSelf: 'flex-end',
        marginRight: 15,
    },

})