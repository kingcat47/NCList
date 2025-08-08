import React from "react";
import { StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";
// @ts-ignore
import LinkIcon from "../../assets/svg/link.svg";

interface InputProps extends TextInputProps {
    // 혹시 모르니까
}

export default function Input(props: InputProps) {
    return (
        <View style={styles.container}>
            <View style={styles.inputWrapper}>
                <LinkIcon width={24} height={24} style={styles.icon} />
                <TextInput
                    style={styles.input}
                    placeholder="https://map.naver.com/example..."
                    placeholderTextColor="#aaa"
                    {...props}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        padding: 16,
    },
    text_main: {
        fontFamily: "Pretendard",
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
