import React from "react";
import { Text, View, StyleSheet, Modal } from "react-native";
import Button from "@/components/mycomponents/Button";

export default function DeletePopup({
                                        onConfirm,
                                        onCancel,
                                    }: {
    onConfirm: () => void;
    onCancel: () => void;
}) {
    return (
        <Modal
            transparent
            animationType="fade"
            visible
            onRequestClose={onCancel}
        >
            <View style={styles.modalBackground}>
                <View style={styles.popup}>
                    <Text style={styles.title}>가게를 지우시겠습니까?</Text>
                    <View style={styles.buttons}>
                        <Button
                            width={124}
                            title="Delete"
                            backgroundColor={"#DC3545"}
                            pressedColor={"#c82333"}
                            onPress={onConfirm}
                        />
                        <Button
                            width={124}
                            title="Cancel"
                            backgroundColor={"#8A8A8A"}
                            pressedColor={"#6E6E6E"}
                            onPress={onCancel}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.4)",
    },
    popup: {
        width: 300,
        padding: 20,
        backgroundColor: "#fff",
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 30,
        textAlign: "center",
    },
    buttons: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
});
