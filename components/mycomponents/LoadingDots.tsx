import React, { useEffect, useRef, useState } from "react";
import { View, Text, Animated, StyleSheet } from "react-native";

export default function LoadingDots() {
    const MAX_SECONDS = 10;
    const [secondsLeft, setSecondsLeft] = useState(MAX_SECONDS);
    const dotAnim1 = useRef(new Animated.Value(0)).current;
    const dotAnim2 = useRef(new Animated.Value(0)).current;
    const dotAnim3 = useRef(new Animated.Value(0)).current;

    // 카운트다운
    useEffect(() => {
        if (secondsLeft === 0) return;

        const interval = setInterval(() => {
            setSecondsLeft((sec) => (sec <= 1 ? 0 : sec - 1));
        }, 1000);
        return () => clearInterval(interval);
    }, [secondsLeft]);

    const createDotAnimation = (animatedValue: Animated.Value, delay: number) => {
        return Animated.loop(
            Animated.sequence([
                Animated.delay(delay),
                Animated.timing(animatedValue, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(animatedValue, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.delay(300),
            ])
        );
    };

    useEffect(() => {
        const anim1 = createDotAnimation(dotAnim1, 0);
        const anim2 = createDotAnimation(dotAnim2, 300);
        const anim3 = createDotAnimation(dotAnim3, 600);
        anim1.start();
        anim2.start();
        anim3.start();
        return () => {
            anim1.stop();
            anim2.stop();
            anim3.stop();
        };
    }, [dotAnim1, dotAnim2, dotAnim3]);

    const animatedStyle = (animatedValue: Animated.Value) => ({
        transform: [
            {
                translateY: animatedValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -6], // Y축으로만 움직임
                }),
            },
        ],
    });

    return (
        <View style={styles.container}>
            <Text style={styles.text}>가게정보를 불러오는 중입니다.</Text>
            <Text style={styles.text}>예상시간: {secondsLeft}초</Text>
            <View style={styles.dotsContainer}>
                <Animated.View style={[styles.dot, animatedStyle(dotAnim1)]} />
                <Animated.View style={[styles.dot, animatedStyle(dotAnim2)]} />
                <Animated.View style={[styles.dot, animatedStyle(dotAnim3)]} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 25,
        alignItems: "center",
    },
    text: {
        fontSize: 16,
        marginVertical: 4,
        color: "#333",
    },
    dotsContainer: {
        flexDirection: "row",
        justifyContent: "center",
        width: 80,
        marginTop: 10,
        gap: 12,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 6,
        backgroundColor: "#03C75A",
    },
});
