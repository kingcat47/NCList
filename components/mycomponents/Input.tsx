import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import LinkIcon from "../../assets/svg/link.svg";

export default function Input() {
    return (
        <View style={styles.container}>
            <Text style={styles.text_main}>가게 링크를 넣어주세요</Text>

            <View style={styles.inputWrapper}>
                <LinkIcon width={24} height={24} style={styles.icon} />
                <TextInput
                    style={styles.input}
                    placeholder="https://map.naver.com/example..."
                    placeholderTextColor="#aaa"
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        width: "100%",
        padding: 16,
    },
    text_main: {
        fontFamily: 'Pretendard',
        fontSize: 24,
        color: "#1C1B1F",
        fontWeight: "bold",
        marginBottom: 12,
        marginLeft: 8,
    },
    inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        backgroundColor: "#fff",
        paddingHorizontal: 12,
        height: 54,
    },
    icon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        fontSize: 18,
        color: "#000",
    },
});
