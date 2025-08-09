import React, { useState, useCallback } from "react";
import {
    ScrollView,
    StyleSheet,
    View,
    ActivityIndicator,
    Text,
    TouchableOpacity,
    Modal,
} from "react-native";
import InfoBox from "@/components/mycomponents/InfoBox";
import DeletePopup from "@/components/mycomponents/DeletePopup";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { getApiBaseUrl } from "@/utils/api";
import useFilterStore from "../../../zustand/filterStore";

interface Store {
    id: string;
    name: string;
    location: string;
    status?: "영업중" | "곧마감" | "마감";
    hours: string;
    category: string;
    originalUrl?: string;
}

const getTodayKey = () => {
    const dayMap = [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
    ] as const;
    return dayMap[new Date().getDay()];
};

const toMinutes = (time: string) => {
    const [h, m] = (time ?? "").split(":").map(Number);
    if (isNaN(h) || isNaN(m)) return -1;
    return h * 60 + m;
};

const getStatus = (hours?: string): "영업중" | "곧마감" | "마감" => {
    if (!hours || typeof hours !== "string") return "마감";

    const separator = hours.includes("~") ? "~" : "-";
    if (!hours.includes(separator)) return "마감";

    const [openStr, closeStr] = hours.split(separator).map((s) => s.trim());
    const open = toMinutes(openStr);
    const close = toMinutes(closeStr);
    if (open < 0 || close < 0) return "마감";

    const now = new Date();
    const nowMinutes = now.getHours() * 60 + now.getMinutes();

    if (nowMinutes < open || nowMinutes > close) return "마감";

    const diff = close - nowMinutes;
    if (diff <= 60) return "곧마감";
    return "영업중";
};

export default function Like() {
    const [stores, setStores] = useState<Store[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);

    const showFilter = useFilterStore((state) => state.showFilter);
    const setShowFilter = useFilterStore((state) => state.setShowFilter);
    const categoryFilter = useFilterStore((state) => state.categoryFilter);
    const setCategoryFilter = useFilterStore((state) => state.setCategoryFilter);

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

            const todayKey = getTodayKey();
            const mappedStores: Store[] = response.data.data.map((s: any) => {
                const todayHours = typeof s[todayKey] === "string" ? s[todayKey] : "";
                return {
                    id: s.id,
                    name: s.name,
                    location: s.location,
                    hours: todayHours,
                    category: s.category,
                    originalUrl: s.link ?? s.url,
                };
            });

            setStores(mappedStores);
        } catch {
            // console.error("좋아요 가게를 불러오는 데 실패했습니다.", error);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchStores();
        }, [])
    );

    const categories = ["전체", "음식", "카페", "헬스", "의료", "숙박", "기타"];

    const onSelectCategory = (category: string) => {
        setCategoryFilter(category);
        setShowFilter(false);
    };

    const filteredStores =
        categoryFilter === "전체"
            ? stores
            : stores.filter((store) => store.category === categoryFilter);


    const statusPriority: Record<"영업중" | "곧마감" | "마감", number> = {
        영업중: 1,
        곧마감: 2,
        마감: 3,
    };

    const sortedStores = [...filteredStores].sort(
        (a, b) =>
            statusPriority[getStatus(a.hours)] - statusPriority[getStatus(b.hours)]
    );

    return (
        <View style={styles.container}>
            {/* 필터 메뉴 */}
            <Modal
                transparent
                visible={showFilter}
                animationType="fade"
                onRequestClose={() => setShowFilter(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setShowFilter(false)}
                >
                    <View style={styles.menu}>
                        {categories.map((cat) => (
                            <TouchableOpacity
                                key={cat}
                                onPress={() => onSelectCategory(cat)}
                                style={styles.menuItem}
                                activeOpacity={0.7}
                            >
                                <Text
                                    style={[
                                        styles.menuText,
                                        categoryFilter === cat && {
                                            fontWeight: "bold",
                                            color: "#03C75A",
                                        },
                                    ]}
                                >
                                    {cat}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </TouchableOpacity>
            </Modal>

            {/* 메인 목록 */}
            {loading ? (
                <ActivityIndicator size="large" color="#03C75A" />
            ) : sortedStores.length === 0 ? (
                <Text style={styles.emptyText}>
                    선택한 카테고리에 해당하는 가게가 없습니다.
                </Text>
            ) : (
                <ScrollView
                    style={styles.InfoBox_List}
                    contentContainerStyle={styles.contentContainer}
                    showsVerticalScrollIndicator={false}
                >
                    {sortedStores.map((store) => (
                        <InfoBox
                            key={store.id}
                            name={store.name}
                            location={store.location}
                            status={store.status ?? getStatus(store.hours)}
                            hours={store.hours}
                            originalUrl={store.originalUrl}
                            storeId={store.id}
                            currentTab="like"
                            onDeleted={(deletedId: string) =>
                                setStores((prev) => prev.filter((s) => s.id !== deletedId))
                            }
                            onLongPress={() => setSelectedStoreId(store.id)}
                        />
                    ))}
                </ScrollView>
            )}

            {/* 삭제 팝업 */}
            {selectedStoreId && (
                <DeletePopup
                    onConfirm={async () => {
                        try {
                            const token = await AsyncStorage.getItem("accessToken");
                            await axios.delete(
                                `${API_BASE_URL}/api/stores/${selectedStoreId}`,
                                {
                                    headers: { Authorization: `Bearer ${token}` },
                                }
                            );
                            setStores((prev) =>
                                prev.filter((s) => s.id !== selectedStoreId)
                            );
                            setSelectedStoreId(null);
                        } catch (e) {
                            // console.error("삭제 실패", e);
                        }
                    }}
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
        backgroundColor: "#fff",
        paddingHorizontal: 20,
        justifyContent: "center",
    },
    InfoBox_List: {
        flex: 1,
        marginTop: 25,
        width: "100%",
    },
    contentContainer: {
        gap: 16,
        paddingBottom: 20,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: "500",
        color: "#868686",
        textAlign: "center",
        marginTop: 20,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.1)",
        justifyContent: "flex-start",
        alignItems: "flex-end",
    },
    menu: {
        width: 140,
        backgroundColor: "#fff",
        borderRadius: 6,
        marginTop: 50,
        marginRight: 10,
        paddingVertical: 8,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    menuItem: {
        paddingVertical: 10,
        paddingHorizontal: 16,
    },
    menuText: {
        fontSize: 16,
        color: "#333",
    },
});
