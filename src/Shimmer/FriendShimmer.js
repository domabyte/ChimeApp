import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { responsiveWidth } from 'react-native-responsive-dimensions';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder'

const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient)

const FriendShimmer = () => {
    const numPlaceholders = 12;

    const placeholders = Array(numPlaceholders).fill('').map((item, index) => (
        <View style={styles.friendList}>
            <View style={styles.userImage}>
                <ShimmerPlaceHolder
                    style={{ width: 70, height: 70 }}
                />
            </View>
            <View>
                <ShimmerPlaceHolder style={{ width: responsiveWidth(45), height: responsiveWidth(3.5) }} />
                <ShimmerPlaceHolder style={{ width: responsiveWidth(15), height: responsiveWidth(2), marginVertical: responsiveWidth(1) }} />
                <View style={styles.mutualBox}>
                    <View style={{ flexDirection: 'row' }}>
                        <ShimmerPlaceHolder
                            style={styles.mutualImg2nd}
                        />
                        <ShimmerPlaceHolder
                            style={styles.mutualImg2nd}
                        />
                        <ShimmerPlaceHolder
                            style={styles.mutualImg2nd}
                        />
                    </View>
                    <ShimmerPlaceHolder style={{ width: responsiveWidth(32), height: responsiveWidth(2.5), marginVertical: responsiveWidth(1) }} />
                </View>
                <View style={styles.buttonArea}>
                    <ShimmerPlaceHolder style={styles.blueBtn} />
                    <ShimmerPlaceHolder style={styles.blueBtn} />
                </View>
            </View>
        </View>
    ));
    return (
        <ScrollView>
            <View>
                {placeholders}
            </View>
        </ScrollView>
    )
}

export default FriendShimmer

const styles = StyleSheet.create({
    friendList: {
        flexDirection: 'row',
        gap: 15,
        marginBottom: 10,
        paddingHorizontal: 10,
        marginVertical: 6,
    },
    userImage: {
        width: 70,
        height: 70,
        borderRadius: 100,
        overflow: 'hidden',
    },
    mutualBox: {
        flexDirection: 'row',
        gap: 5,
        marginTop: 0,
    },
    mutualImg2nd: {
        width: 20,
        height: 20,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: 'white',
        marginLeft: -5,
    },
    buttonArea: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 5,
    },
    blueBtn: {
        backgroundColor: '#1866B4',
        height: 34,
        width: '40%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 6,
    },
})