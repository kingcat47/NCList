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
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { getApiBaseUrl } from "../../../utils/api";
import useFilterStore from "../../../zustand/filterStore";

interface Store {
    id: string;
    name: string;
    location: string;
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
    category: string;
    link?: string;
}

const parseHours = (hours: string): { open: number; close: number } | null => {
    if (!hours) return null;
    const separator = hours.includes("~") ? "~" : "-";
    if (!hours.includes(separator)) return null;

    const [openStr, closeStr] = hours.split(separator).map((s) => s.trim());

    const toMinutes = (time: string) => {
        const [h, m] = time.split(":").map(Number);
        if (isNaN(h) || isNaN(m)) return -1;
        return h * 60 + m;
    };

    const open = toMinutes(openStr);
    const close = toMinutes(closeStr);
    if (open < 0 || close < 0) return null;
    return { open, close };
};

const getStatus = (store: Store): "영업중" | "곧마감" | "마감" => {
    const dayMap = [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
    ] as const;

    const todayKey = dayMap[new Date().getDay()];
    const todayHours = store[todayKey];
    const timeRange = parseHours(todayHours);

    if (!timeRange) return "마감";

    const now = new Date();
    const nowMinutes = now.getHours() * 60 + now.getMinutes();

    if (nowMinutes < timeRange.open || nowMinutes > timeRange.close) {
        return "마감";
    }

    const diff = timeRange.close - nowMinutes;
    if (diff <= 60) return "곧마감";

    return "영업중";
};

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

export default function Home() {
    const [stores, setStores] = useState<Store[]>([]);
    const [loading, setLoading] = useState(true);

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
            setStores(response.data.data);
        } catch (error) {
            // console.error("가게 정보를 불러오는 데 실패했습니다.", error);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchStores();
        }, [])
    );

    const categories = [
        "전체",
        "음식",
        "카페",
        "헬스",
        "의료",
        "숙박",
        "기타",
    ];

    const onSelectCategory = (category: string) => {
        setCategoryFilter(category);
        setShowFilter(false);
    };

    const filteredStores =
        categoryFilter === "전체"
            ? stores
            : stores.filter((store) => store.category === categoryFilter);


    const statusPriority = { "영업중": 1, "곧마감": 2, "마감": 3 };
    const sortedStores = [...filteredStores].sort(
        (a, b) => statusPriority[getStatus(a)] - statusPriority[getStatus(b)]
    );

    return (
        <View style={styles.container}>
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
                            status={getStatus(store)}
                            hours={store[getTodayKey()]}
                            originalUrl={store.link}
                        />
                    ))}
                </ScrollView>
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
        paddingTop: 0,
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
