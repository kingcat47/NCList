import React, { useState, useCallback } from "react";
import {
    ScrollView,
    StyleSheet,
    View,
    ActivityIndicator,
    Text,
} from "react-native";
import InfoBox from "@/components/mycomponents/InfoBox";
import DeletePopup from "@/components/mycomponents/DeletePopup";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { getApiBaseUrl } from "@/utils/api";

interface Store {
    id: string;
    name: string;
    location: string;
    status?: "영업중" | "곧마감" | "마감"; // ✅ 옵셔널로 변경
    hours: string;
    category: string;
    originalUrl?: string;
}

export default function Like() {
    const [stores, setStores] = useState<Store[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);

    const API_BASE_URL = getApiBaseUrl();

    const fetchStores = async () => {
        try {
            setLoading(true);
            const token = await AsyncStorage.getItem("accessToken");
            const response = await axios.get(`${API_BASE_URL}/api/stores`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setStores(response.data.data);
        } catch (error) {
            // console.error("좋아요 가게를 불러오는 데 실패했습니다.", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleted = (deletedId: string) => {
        setStores((prev) => prev.filter((store) => store.id !== deletedId));
        setSelectedStoreId(null);
    };

    const handleDeleteConfirm = async () => {
        try {
            if (!selectedStoreId) return;
            const token = await AsyncStorage.getItem("accessToken");
            await axios.delete(`${API_BASE_URL}/api/stores/${selectedStoreId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            handleDeleted(selectedStoreId);
        } catch (error) {
            console.error("삭제 실패:", error);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchStores();
        }, [])
    );

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#03C75A" />
            ) : stores.length === 0 ? (
                <Text style={styles.emptyText}>좋아하는 장소가 없습니다</Text>
            ) : (
                <ScrollView
                    style={styles.InfoBox_List}
                    contentContainerStyle={styles.contentContainer}
                    showsVerticalScrollIndicator={false}
                >
                    {stores.map((store) => (
                        <InfoBox
                            key={store.id}
                            name={store.name}
                            location={store.location}
                            status={store.status ?? "영업중"} // ✅ fallback 처리
                            hours={store.hours}
                            originalUrl={store.originalUrl}
                            storeId={store.id}
                            currentTab="like"
                            onDeleted={handleDeleted}
                            onLongPress={() => setSelectedStoreId(store.id)}
                        />
                    ))}
                </ScrollView>
            )}

            {selectedStoreId && (
                <DeletePopup
                    onConfirm={handleDeleteConfirm}
                    onCancel={() => setSelectedStoreId(null)}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
        paddingHorizontal: 20,
    },
    InfoBox_List: {
        flex: 1,
        marginTop: 25,
        width: "100%",
    },
    contentContainer: {
        gap: 16,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: "500",
        color: "#868686",
        textAlign: "center",
    },
});
