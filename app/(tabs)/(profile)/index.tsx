import Button from "@/components/mycomponents/Button";
import CategorizeBox from "@/components/mycomponents/CategorizeBox";
import { authAPI } from "@/src/api/auth";
import { getApiBaseUrl } from "@/utils/api";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// @ts-ignore
import BedIcon from "../../../assets/svg/Categorize/bed.svg";
// @ts-ignore
import CoffeIcon from "../../../assets/svg/Categorize/coffe.svg";
// @ts-ignore
import FoodIcon from "../../../assets/svg/Categorize/food.svg";
// @ts-ignore
import HealthIcon from "../../../assets/svg/Categorize/health.svg";
// @ts-ignore
import HeartIcon from "../../../assets/svg/Categorize/heart.svg";
// @ts-ignore
import MoreIcon from "../../../assets/svg/Categorize/more.svg";

interface User {
    id: string;
    phoneNumber: string;
}

interface Store {
    id: string;
    name: string;
    location: string;
    hours: string;
    category: "음식점" | "카페" | "헬스장" | "의료" | "숙박" | "기타";
    originalUrl?: string;
}

export default function Profile() {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshKey, setRefreshKey] = useState(0);

    const [stores, setStores] = useState<Store[]>([]);

    const [categoryCounts, setCategoryCounts] = useState<Record<Store["category"], number>>({
        음식점: 0,
        카페: 0,
        헬스장: 0,
        의료: 0,
        숙박: 0,
        기타: 0,
    });

    const API_BASE_URL = getApiBaseUrl();

    const checkLoginStatus = async () => {
        try {
            const currentUser = await authAPI.getCurrentUser();
            setUser(currentUser);
        } catch (error) {
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchStores = async () => {
        try {
            const token = await AsyncStorage.getItem("accessToken");
            const response = await axios.get(`${API_BASE_URL}/api/stores`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const fetchedStores: Store[] = response.data.data || [];

            setStores(fetchedStores);

            const counts: Record<Store["category"], number> = {
                음식점: 0,
                카페: 0,
                헬스장: 0,
                의료: 0,
                숙박: 0,
                기타: 0,
            };

            fetchedStores.forEach((store) => {
                counts[store.category]++;
            });

            setCategoryCounts(counts);
        } catch (error) {
            console.error("스토어 불러오기 실패:", error);
        }
    };

    useEffect(() => {
        checkLoginStatus();
        fetchStores();
    }, [refreshKey]);

    useFocusEffect(
        useCallback(() => {
            checkLoginStatus();
            fetchStores();
        }, [])
    );

    const handleLogout = async () => {
        Alert.alert("로그아웃", "정말 로그아웃하시겠습니까?", [
            { text: "취소", style: "cancel" },
            {
                text: "로그아웃",
                style: "destructive",
                onPress: async () => {
                    try {
                        await authAPI.logout();
                        setUser(null);
                        Alert.alert("알림", "로그아웃되었습니다.");
                    } catch (error) {
                        Alert.alert("오류", "로그아웃 중 오류가 발생했습니다.");
                    }
                },
            },
        ]);
    };

    const forceRefresh = () => {
        setRefreshKey((prev) => prev + 1);
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
                <ScrollView
                    style={styles.InfoBox_List}
                    contentContainerStyle={styles.contentContainer}
                    showsVerticalScrollIndicator={false}
                >
                    <CategorizeBox title="음식점" number={categoryCounts.음식점} color="#FB923C" icon={FoodIcon} />
                    <CategorizeBox title="카페" number={categoryCounts.카페} color="#FBBF24" icon={CoffeIcon} />
                    <CategorizeBox title="헬스장" number={categoryCounts.헬스장} color="#60A5FA" icon={HealthIcon} />
                    <CategorizeBox title="의료" number={categoryCounts.의료} color="#4ADE80" icon={HeartIcon} />
                    <CategorizeBox title="숙박" number={categoryCounts.숙박} color="#A78BFA" icon={BedIcon} />
                    <CategorizeBox title="기타" number={categoryCounts.기타} color="#9CA3AF" icon={MoreIcon} />

                    <View style={styles.buttonContainer}>
                        <Button title="로그아웃" onPress={handleLogout} style={styles.logoutButton} />
                        <Button title="새로고침" onPress={forceRefresh} style={styles.refreshButton} />
                    </View>
                </ScrollView>
            ) : (
                <View style={styles.loggedOutContainer}>
                    <Text style={styles.loginPromptText}>로그인이 필요합니다</Text>
                    <Button title="로그인하러가기" onPress={() => router.push("/login")} />
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
    },
    buttonContainer: {
        width: "100%",
        gap: 10,
        marginTop: 20,
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
