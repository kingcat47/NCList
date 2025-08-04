import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
    title: string;
    number: number;
    color: string; // 아이콘 배경색
    icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
};

export default function CategorizeBox({ title, number, color, icon: Icon }: Props) {
    return (
        <View style={styles.container}>

            <View style={styles.left}>
                <View style={[styles.icon_layout, { backgroundColor: color }]}>
                    <Icon width={20} height={20} />
                </View>
                <View style={styles.texts}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.subtitle}>저장된 장소</Text>
                </View>
            </View>


            <View style={styles.right}>
                <Text style={styles.number}>{number}</Text>
                <Text style={styles.subtitle}>개</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: 340,
        height: 100,
        paddingVertical: 20,
        paddingHorizontal: 19,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 20,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    left: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon_layout: {
        width: 40,
        height: 40,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    texts: {
        justifyContent: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1C1B1F',
    },
    subtitle: {
        fontSize: 14,
        color: '#868686',
    },
    right: {
        alignItems: 'flex-end',
    },
    number: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1C1B1F',
    },
});
