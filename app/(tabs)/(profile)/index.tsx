import Button from "@/components/mycomponents/Button";
import { authAPI } from "@/src/api/auth";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";

interface User {
  id: string;
  phoneNumber: string;
  // 필요한 다른 사용자 정보들
}

export default function Profile() {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshKey, setRefreshKey] = useState(0); // 강제 새로고침을 위한 키

    const checkLoginStatus = async () => {
        try {
            console.log('로그인 상태 확인 중...');
            const currentUser = await authAPI.getCurrentUser();
            console.log('현재 사용자:', currentUser);
            setUser(currentUser);
        } catch (error) {
            console.log('로그인 상태 확인 중 오류:', error);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        checkLoginStatus();
    }, [refreshKey]); // refreshKey가 변경될 때마다 실행

    // 화면이 포커스될 때마다 로그인 상태 확인
    useFocusEffect(
        useCallback(() => {
            console.log('프로필 화면 포커스됨');
            checkLoginStatus();
        }, [])
    );

    const handleLogout = async () => {
        Alert.alert(
            '로그아웃',
            '정말 로그아웃하시겠습니까?',
            [
                {
                    text: '취소',
                    style: 'cancel',
                },
                {
                    text: '로그아웃',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await authAPI.logout();
                            setUser(null);
                            Alert.alert('알림', '로그아웃되었습니다.');
                        } catch (error) {
                            Alert.alert('오류', '로그아웃 중 오류가 발생했습니다.');
                        }
                    },
                },
            ]
        );
    };

    // 강제 새로고침 함수
    const forceRefresh = () => {
        setRefreshKey(prev => prev + 1);
    };

    if (isLoading) {
        return (
            <View style={styles.container}>
                <Text style={styles.loadingText}>로딩 중...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {user ? (
                // 로그인된 상태
                <View style={styles.loggedInContainer}>
                    <View style={styles.userInfoContainer}>
                        <Text style={styles.welcomeText}>로그인 완료!</Text>
                        <Text style={styles.userPhoneText}>{user.phoneNumber}</Text>
                    </View>
                    
                    <View style={styles.buttonContainer}>
                        <Button 
                            title="로그아웃" 
                            onPress={handleLogout}
                            style={styles.logoutButton}
                        />
                        <Button 
                            title="새로고침" 
                            onPress={forceRefresh}
                            style={styles.refreshButton}
                        />
                    </View>
                </View>
            ) : (
                // 로그인되지 않은 상태
                <View style={styles.loggedOutContainer}>
                    <Text style={styles.loginPromptText}>로그인이 필요합니다</Text>
                    <Button 
                        title="로그인하러가기" 
                        onPress={() => {
                            router.push("/login");
                        }} 
                    />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "white",
        paddingHorizontal: 20,
    },
    loadingText: {
        fontSize: 16,
        color: "#666",
    },
    loggedInContainer: {
        width: "100%",
        alignItems: "center",
    },
    userInfoContainer: {
        alignItems: "center",
        marginBottom: 40,
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#146EFF",
        marginBottom: 10,
    },
    userPhoneText: {
        fontSize: 16,
        color: "#666",
    },
    buttonContainer: {
        width: "100%",
        gap: 10,
    },
    logoutButton: {
        backgroundColor: "#FF3B30",
    },
    refreshButton: {
        backgroundColor: "#34C759",
    },
    loggedOutContainer: {
        width: "100%",
        alignItems: "center",
    },
    loginPromptText: {
        fontSize: 18,
        color: "#666",
        marginBottom: 30,
        textAlign: "center",
    },
});