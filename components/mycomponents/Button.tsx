import React from "react";
import {
    Text,
    Pressable,
    StyleSheet,
    ViewStyle,
    TextStyle,
    GestureResponderEvent,
} from "react-native";

type Props = {
    title: string;
    onPress?: (event: GestureResponderEvent) => void;
    width?: number | string;
    height?: number | string;
    backgroundColor?: string;
    pressedColor?: string;
    textColor?: string;
    style?: ViewStyle;
    textStyle?: TextStyle;
    disabled?: boolean;
};

export default function Button({
                                   title,
                                   onPress,
                                   width = 160,
                                   height = 40,
                                   backgroundColor = "#146EFF",
                                   pressedColor = "#0E51BF",
                                   textColor = "#FFFFFF",
                                   style,
                                   textStyle,
                                   disabled = false,
                               }: Props) {

    return (
        <Pressable
            onPress={disabled ? undefined : onPress}
            disabled={disabled}
            // @ts-ignore
            style={({ pressed }) => [
                styles.button,
                {
                    width,
                    height,
                    backgroundColor: disabled ? "#B0B0B0" : pressed ? pressedColor : backgroundColor, // disabled 시 회색톤으로 변경
                    opacity: disabled ? 0.6 : 1,
                },
                style,
            ]}
        >
            <Text
                style={[
                    styles.text,
                    { color: disabled ? "#888888" : textColor },
                    textStyle,
                ]}
            >
                {title}
            </Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 16,
        flexDirection: "row",
        paddingHorizontal: 16,
    },
    text: {
        fontFamily: "Pretendard",
        fontSize: 16,
        fontWeight: "bold",
    },
});
