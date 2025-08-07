import React from "react";
import { StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";
// @ts-ignore
import LinkIcon from "../../assets/svg/link.svg";

interface InputProps extends TextInputProps {
    // 혹시 모르니까
}

export default function InputStoreName(props: InputProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.text_main}>저장될 이름을 적어주세요</Text>

            <View style={styles.inputWrapper}>
                <TextInput
                    style={styles.input}
                    placeholderTextColor="#aaa"
                    {...props}
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
