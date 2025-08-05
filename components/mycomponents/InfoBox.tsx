import React, { useState } from "react";
import { Text, View, StyleSheet, Pressable, Linking } from "react-native";
// @ts-ignore
import MapIcon from "../../assets/svg/map.svg";
// @ts-ignore
import ClockIcon from "../../assets/svg/clock.svg";
import DeletePopup from "./DeletePopup";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApiBaseUrl } from "@/utils/api";

interface InfoBoxProps {
    name: string;
    location: string;
    status?: string; // ✅ 옵셔널로 변경
    hours: string;
    originalUrl?: string;
    currentTab?: "home" | "like";
    storeId?: string;
    onDeleted?: (deletedId: string) => void;
    onLongPress?: () => void;
}

export default function InfoBox({
                                    name,
                                    location,
                                    status = "영업중", // ✅ 기본값 지정
                                    hours,
                                    originalUrl,
                                    currentTab = "home",
                                    storeId,
                                    onDeleted,
                                }: InfoBoxProps) {
    const [showPopup, setShowPopup] = useState(false);

    const getStatusColor = () => {
        switch (status) {
            case "영업중":
                return "#03C75A";
            case "곧마감":
                return "#FFC107";
            case "마감":
                return "#DC3545";
            default:
                return "#868686";
        }
    };

    const handlePress = () => {
        if (currentTab === "home" && originalUrl) {
            Linking.openURL(originalUrl);
        } else if (currentTab === "like") {
            setShowPopup(true);
        }
    };

    const API_BASE_URL = getApiBaseUrl();

    const handleDelete = async () => {
        try {
            const token = await AsyncStorage.getItem("accessToken");
            await axios.delete(`${API_BASE_URL}/api/stores/${storeId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setShowPopup(false);
            onDeleted?.(storeId!);
        } catch (error) {
            console.error("가게 삭제 실패:", error);
        }
    };

    return (
        <>
            <Pressable onPress={handlePress}>
                <View style={styles.box}>
                    <View style={styles.line1}>
                        <Text style={styles.text_name}>{name}</Text>
                        <View style={styles.box_map}>
                            <MapIcon width={16} height={16} style={{ marginBottom: 2 }} />
                            <Text style={styles.text_map}>{location}</Text>
                        </View>
                    </View>
                    <View style={styles.box_map}>
                        <ClockIcon width={18.9} height={18.9} />
                        <Text style={[styles.text_isopen, { color: getStatusColor() }]}>
                            {status}
                        </Text>
                        <Text style={styles.text_point}>·</Text>
                        <Text style={styles.text_time}>{hours}</Text>
                    </View>
                </View>
            </Pressable>
            {showPopup && (
                <DeletePopup
                    onConfirm={handleDelete}
                    onCancel={() => setShowPopup(false)}
                />
            )}
        </>
    );
}

const styles = StyleSheet.create({
    box: {
        width: 340,
        paddingVertical: 30,
        paddingHorizontal: 19,
        flexDirection: "column",
        alignItems: "flex-start",
        borderRadius: 20,
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        marginTop: 5,
        marginLeft: 1,
    },
    box_map: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
        gap: 8,
    },
    line1: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        marginBottom: 16,
    },
    text_name: {
        fontSize: 24,
        fontWeight: "600",
        color: "#1C1B1F",
    },
    text_map: {
        fontSize: 16,
        color: "#868686",
        marginBottom: 4,
        fontWeight: "500",
    },
    text_isopen: {
        fontSize: 14,
        fontWeight: "700",
    },
    text_point: {
        color: "#868686",
        fontSize: 20,
        fontWeight: "700",
    },
    text_time: {
        color: "#868686",
        fontSize: 16.5,
        fontWeight: "700",
    },
});
