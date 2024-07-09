import { StyleSheet, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { responsiveWidth } from 'react-native-responsive-dimensions';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder'

const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient)

const MessageShimmer = () => {
    const numPlaceholders = 12;

    const placeholders = Array(numPlaceholders).fill('').map((item, index) => (
        <View style={styles.listBox} key={index}>
            <ShimmerPlaceHolder style={styles.userImg}>
            </ShimmerPlaceHolder>
            <View>
                <View style={{ flexDirection: 'row' }}>
                    <ShimmerPlaceHolder style={styles.userName}>
                    </ShimmerPlaceHolder>
                </View>
                <View style={styles.magtextarea}>
                        <ShimmerPlaceHolder style={[styles.msgText, { width: '40%', marginTop: responsiveWidth(2), height: 10 }]}>
                        </ShimmerPlaceHolder>
                    </View>
            </View>
        </View>
    ));
    return (
        <>
            <View>
                {placeholders}
            </View>
        </>


    )
}

export default MessageShimmer

const styles = StyleSheet.create({
    userImg: { width: responsiveWidth(12), height: responsiveWidth(12), borderRadius: responsiveWidth(6), overflow: 'hidden' },
    listBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
        borderBottomColor: '#ddd',
        borderBottomWidth: 1,
        paddingHorizontal: responsiveWidth(4),
        paddingVertical: responsiveWidth(2),
        backgroundColor: 'white',
    },
    userName: {
        marginBottom: 0,
        width: '70%',
    },
    magtextarea: { flexDirection: 'row', alignItems: 'center' },
})