import { authAPI } from "@/src/api/auth";
import { Stack } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet } from "react-native";
import { useLoading, LoadingProvider } from "../LoadingContext";

function RootLayoutInner() {
    const { loading } = useLoading();
    const animatedValue = useRef(new Animated.Value(0)).current;
    const animationRef = useRef<Animated.CompositeAnimation | null>(null);

    useEffect(() => {
        console.log("[RootLayoutInner] Component mounted");
        checkTokenOnAppStart();
    }, []);

    useEffect(() => {
        console.log("[RootLayoutInner] loading changed:", loading);

        if (loading) {
            if (animationRef.current) {
                console.log("[RootLayoutInner] animation already running");
                return; // 이미 애니메이션 실행 중이면 실행하지 않음
            }
            animationRef.current = Animated.loop(
                Animated.timing(animatedValue, {
                    toValue: 1,
                    duration: 2000,
                    easing: Easing.linear,
                    useNativeDriver: false,
                })
            );
            animationRef.current.start(() => {
                console.log("[RootLayoutInner] animation loop started");
            });
        } else {
            if (animationRef.current) {
                animationRef.current.stop();
                animationRef.current = null;
                console.log("[RootLayoutInner] animation stopped");
            }
            animatedValue.setValue(0);
        }
    }, [loading]);

    // const borderColor = animatedValue.interpolate({
    //     inputRange: [0, 0.5, 1],
    //     outputRange: ["#03C75A", "#A0E6A0", "#03C75A"],
    // });

    const checkTokenOnAppStart = async () => {
        console.log("[RootLayoutInner] Checking token on app start...");
        try {
            const isLoggedIn = await authAPI.isLoggedIn();
            console.log("[RootLayoutInner] isLoggedIn:", isLoggedIn);

            if (isLoggedIn) {
                try {
                    await authAPI.verifyToken();
                    console.log("[RootLayoutInner] Token is valid.");
                } catch (error) {
                    console.log("[RootLayoutInner] Token expired, logging out.");
                    await authAPI.logout();
                }
            }
        } catch (error) {
            console.log("[RootLayoutInner] Error checking token:", error);
        }
    };

    return (
        <Animated.View style={[styles.container, {  borderWidth: loading ? 6 : 0 }]}>
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
