import { StyleSheet, View, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder'

const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient)

const ForwardShimmer = () => {
    const numPlaceholders = 12;

    const placeholders = Array(numPlaceholders).fill('').map((item, index) => (
        <View style={styles.userList}>
            <View style={styles.leftside}>
                <ShimmerPlaceHolder
                    style={styles.userImg}
                />
                <ShimmerPlaceHolder
                    style={{
                        fontSize: 18,
                        width: '65%',
                    }} />
            </View>
            <ShimmerPlaceHolder
                style={[
                    styles.sendBtn,
                ]} />
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

export default ForwardShimmer

const styles = StyleSheet.create({
    userList: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingVertical: 5,
    },
    leftside: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    userImg: {
        width: 50,
        height: 50,
        overflow: 'hidden',
        borderRadius: 40,
        resizeMode: 'cover',
    },
    sendBtn: {
        width: 60,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
    },
})