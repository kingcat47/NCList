import { authAPI } from "@/src/api/auth";
import { Stack } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet } from "react-native";
import { useLoading, LoadingProvider } from "../LoadingContext"; // 경로에 맞게 조정

function RootLayoutInner() {
    const { loading } = useLoading();
    const animatedValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        checkTokenOnAppStart();
    }, []);

    useEffect(() => {
        if (loading) {
            Animated.loop(
                Animated.timing(animatedValue, {
                    toValue: 1,
                    duration: 2000,
                    easing: Easing.linear,
                    useNativeDriver: false,
                })
            ).start();
        } else {
            animatedValue.stopAnimation();
            animatedValue.setValue(0);
        }
    }, [loading]);

    const borderColor = animatedValue.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: ["#03C75A", "#A0E6A0", "#03C75A"],
    });

    const checkTokenOnAppStart = async () => {
        try {
            const isLoggedIn = await authAPI.isLoggedIn();
            if (isLoggedIn) {
                try {
                    await authAPI.verifyToken();
                    console.log("토큰이 유효합니다.");
                } catch (error) {
                    console.log("토큰 만료로 자동 로그아웃 처리");
                    await authAPI.logout();
                }
            }
        } catch (error) {
            console.log("앱 시작 시 토큰 확인 중 오류:", error);
        }
    };

    return (
        <Animated.View style={[styles.container, { borderColor, borderWidth: loading ? 6 : 0 }]}>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="login" />
            </Stack>
        </Animated.View>
    );
}

// 최상위에서 LoadingProvider로 앱 전체 감싸기
export default function RootLayout() {
    return (
        <LoadingProvider>
            <RootLayoutInner />
        </LoadingProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderRadius: 12,
    },
});
