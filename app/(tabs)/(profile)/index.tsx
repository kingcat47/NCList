import Button from "@/components/mycomponents/Button";
import CategorizeBox from "@/components/mycomponents/CategorizeBox";
import { authAPI } from "@/src/api/auth";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
// @ts-ignore
import BedIcon from "../../../assets/svg/Categorize/bed.svg";
// @ts-ignore
import CoffeIcon from "../../../assets/svg/Categorize/coffe.svg"; // 음식 아이콘
// @ts-ignore
import FoodIcon from "../../../assets/svg/Categorize/food.svg"; // 음식 아이콘
// @ts-ignore
import HealthIcon from "../../../assets/svg/Categorize/health.svg"; // 음식 아이콘
// @ts-ignore
import HeartIcon from "../../../assets/svg/Categorize/heart.svg";
// @ts-ignore
import MoreIcon from "../../../assets/svg/Categorize/more.svg";
import DeletePopup from "@/components/mycomponents/DeletePopup";

interface User {
  id: string;
  phoneNumber: string;
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
    }, [refreshKey]);

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
                <View style={styles.container}>
                    <ScrollView
                        style={styles.InfoBox_List}
                        contentContainerStyle={styles.contentContainer}
                        showsVerticalScrollIndicator={false}
                    >
                        <CategorizeBox
                            title="음식점"
                            number={24}
                            color="#FB923C"
                            icon={FoodIcon}
                        />
                        <CategorizeBox
                            title="카페"
                            number={12}
                            color="#FBBF24"
                            icon={CoffeIcon}
                        />
                        <CategorizeBox
                            title="헬스장"
                            number={8}
                            color="#60A5FA"
                            icon={HealthIcon}
                        />
                        <CategorizeBox
                            title="의료"
                            number={5}
                            color="#4ADE80"
                            icon={HeartIcon}
                        />
                        <CategorizeBox
                            title="숙박"
                            number={15}
                            color="#A78BFA"
                            icon={BedIcon}
                        />
                        <CategorizeBox
                            title="기타"
                            number={31}
                            color="#9CA3AF"
                            icon={MoreIcon}
                        />
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
                    </ScrollView>

                </View>
            ) : (
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
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
    },
    InfoBox_List: {
        flex: 1,
        marginTop: 20,
        width: "100%",
        paddingHorizontal: 20,
    },
    contentContainer: {
        gap: 16,
    }
});