import { authAPI } from "@/src/api/auth";
import { Stack } from "expo-router";
import { useEffect } from "react";

export default function RootLayout() {
    useEffect(() => {
        // 앱 시작 시 토큰 상태 확인
        checkTokenOnAppStart();
    }, []);

    const checkTokenOnAppStart = async () => {
        try {
            const isLoggedIn = await authAPI.isLoggedIn();
            if (isLoggedIn) {
                // 토큰이 있으면 서버에서 유효성 검증
                try {
                    await authAPI.verifyToken();
                    console.log('토큰이 유효합니다.');
                } catch (error) {
                    // 토큰이 만료되었거나 유효하지 않으면 자동 로그아웃
                    console.log('토큰이 만료되어 자동 로그아웃됩니다.');
                    await authAPI.logout();
                }
            }
        } catch (error) {
            console.log('앱 시작 시 토큰 확인 중 오류:', error);
        }
    };

    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="login" />
        </Stack>
    );
}