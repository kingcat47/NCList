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
    status?: string;
    hours?: string;
    originalUrl?: string;
    currentTab?: "home" | "like";
    storeId?: string;
    onDeleted?: (deletedId: string) => void;
    onLongPress?: () => void;
}


const is24Hours = (hours?: string) => {
    if (!hours) return false;
    const trimmed = hours.replace(/\s/g, "");
    return (
        trimmed.includes("24시간") ||
        trimmed === "00:00-24:00" ||
        trimmed === "0:00-24:00"
    );
};


const parseHours = (hours: string): { open: number; close: number } | null => {
    if (!hours.includes("-")) return null; // 하이픈 없으면 실패
    const [openStr, closeStr] = hours.split("-").map((s) => s.trim());

    const toMinutes = (time: string) => {
        const [hStr, mStr] = time.split(":");
        const h = Number(hStr);
        const m = Number(mStr);
        if (isNaN(h) || isNaN(m)) return -1;
        if (h === 24 && m === 0) return 1440;
        if (h > 24 || m >= 60) return -1;
        return h * 60 + m;
    };

    const open = toMinutes(openStr);
    const close = toMinutes(closeStr);

    if (open < 0 || close < 0) return null;
    return { open, close };
};


const getStatusFromHours = (hours?: string): "영업중" | "곧마감" | "마감" => {
    if (!hours) return "마감";
    if (is24Hours(hours)) return "영업중";

    const timeRange = parseHours(hours);
    if (!timeRange) return "마감";

    const { open, close } = timeRange;
    const now = new Date();
    const nowMinutes = now.getHours() * 60 + now.getMinutes();


    const isOverMidnight = close < open;
    let isOpen = false;
    if (isOverMidnight) {
        if (nowMinutes >= open || nowMinutes < close) isOpen = true;
    } else {
        if (nowMinutes >= open && nowMinutes < close) isOpen = true;
    }

    if (!isOpen) return "마감";


    let diff = isOverMidnight
        ? (nowMinutes >= open ? 1440 - nowMinutes + close : close - nowMinutes)
        : close - nowMinutes;

    if (diff <= 60) return "곧마감";
    return "영업중";
};

export default function InfoBox({
                                    name,
                                    location,
                                    status,
                                    hours,
                                    originalUrl,
                                    currentTab = "home",
                                    storeId,
                                    onDeleted,
                                    onLongPress,
                                }: InfoBoxProps) {
    const [showPopup, setShowPopup] = useState(false);

    const displayStatus = status ?? getStatusFromHours(hours);
    const truncateTitle = (title: string, maxLength = 8) =>
        title.length > maxLength ? title.slice(0, maxLength) + "..." : title;
    const truncateLocation = (loc: string, maxLength = 6) =>
        loc.length > maxLength ? loc.slice(0, maxLength) + ".." : loc;
    const showStatusInfo = currentTab === "home";

    const getStatusColor = () => {
        switch (displayStatus) {
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
        } catch {
            // 실패 시 무시
        }
    };

    return (
        <>
            <Pressable onPress={handlePress} onLongPress={onLongPress}>
                <View style={[styles.box, currentTab === "like" && styles.boxLike]}>
                    <View style={styles.line1}>
                        <Text style={styles.text_name}>{truncateTitle(name)}</Text>
                        <View style={styles.box_map}>
                            <MapIcon width={16} height={16} style={{ marginBottom: 2 }} />
                            <Text style={styles.text_map}>{truncateLocation(location)}</Text>
                        </View>
                    </View>

                    {showStatusInfo && (
                        <View style={styles.statusRow}>
                            <ClockIcon width={18.9} height={18.9} />
                            <Text style={[styles.text_isopen, { color: getStatusColor() }]}>
                                {displayStatus}
                            </Text>
                            <Text style={styles.text_point}>·</Text>
                            <Text style={styles.text_time}>{hours}</Text>
                        </View>
                    )}
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
    boxLike: {
        paddingVertical: 15,
        paddingHorizontal: 12,
        width: 340,
        height: 80,
    },
    line1: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        marginBottom: 16,
    },
    box_map: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
        gap: 8,
    },
    statusRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
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
