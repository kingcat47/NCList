import { Text, View, StyleSheet } from "react-native";
// @ts-ignore
import MapIcon from "../../assets/svg/map.svg";
// @ts-ignore
import ClockIcon from "../../assets/svg/clock.svg";

export default function InfoBox() {
    return (
        <View style={styles.box}>
            <View style={styles.line1}>
                <Text style={styles.text_name}>서브웨이</Text>
                <View style={styles.box_map}>
                    <MapIcon width={16} height={16} style={{marginBottom:2}} />
                    <Text style={styles.text_map}>용산구 효창동</Text>
                </View>
            </View>

            <View style={styles.box_map}>
                <ClockIcon width={18.9} height={18.9} />
                <Text style={styles.text_isopen}>영업중</Text>
                <Text style={styles.text_point}>·</Text>
                <Text style={styles.text_time}>11:00 - 22:00</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    box: {
        width: 340,
        paddingVertical: 30,
        paddingHorizontal: 19,
        flexDirection: 'column',
        alignItems: 'flex-start',
        borderRadius: 20,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    box_map: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        gap: 8, // 아이콘과 텍스트 사이의 간격
    },
    line1: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 16,
    },
    line2: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 16,
    },
    text_name: {
        fontFamily: 'Pretendard',
        fontSize: 24,
        fontWeight: '600',
        lineHeight: 32, // fontSize보다 크게!
        color: '#1C1B1F',
        width: 83,
        flexShrink: 0, // 오타 수정

    },
    text_map: {
        fontSize: 16,
        color: '#868686',
        marginBottom: 4,
        fontWeight: '500',
    },
    text_isopen: {
        color: '#03C75A',
        fontFamily: 'Pretendard-Medium',
        fontSize: 14,
        fontWeight: '700',
        lineHeight: 20,

    },
    text_point: {
        color: '#868686',
        fontFamily: 'Pretendard-Medium',
        fontSize:20,
        fontWeight: '700',
    },
    text_time: {
        color: '#868686',
        fontFamily: 'Pretendard',
        fontSize: 16.562,
        fontWeight: '700',
        lineHeight: 23.66,
    },
});