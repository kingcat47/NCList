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
                                     }: Props) {
    // @ts-ignore
    return (
        <Pressable
            onPress={onPress}
            // @ts-ignore
            style={({ pressed }) => [
                styles.button,
                {
                    width,
                    height,
                    backgroundColor: pressed ? pressedColor : backgroundColor,
                },
                style,
            ]}
        >
            <Text style={[styles.text, { color: textColor }, textStyle]}>{title}</Text>
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
        fontFamily: 'Pretendard',
        fontSize: 16,
        fontWeight: "bold",
    },
});
