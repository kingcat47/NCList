import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
// @ts-ignore
import FillterIcon from "../../assets/svg/Categorize/fillter.svg";
// @ts-ignore
import DownIcon from "../../assets/svg/Categorize/down.svg";
import useFilterStore from "../../zustand/filterStore";

export default function FillterBox() {
    const categoryFilter = useFilterStore((state) => state.categoryFilter);
    const setShowFilter = useFilterStore((state) => state.setShowFilter);

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={() => setShowFilter(true)}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
            <FillterIcon width={20} height={20} />
            <Text style={styles.text}>{categoryFilter || "전체"}</Text>
            <DownIcon width={20} height={20} />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        backgroundColor: "#ffffff",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },
    text: {
        fontSize: 16,
        fontWeight: "500",
        color: "#6F7785",
        marginLeft: 8,
        marginRight: 6,
    },
});
