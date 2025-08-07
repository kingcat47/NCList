import React, { useEffect, useState } from "react";
import { View, Pressable, Image, StyleSheet, Text } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";

export type SelectedImage = {
    uri: string;
    fileName?: string;
    type?: string;
};

type ImageInputBoxProps = {
    onImageSelected: (image: SelectedImage | null) => void;
    ensurePermission: () => Promise<boolean>;
    selectedImage: SelectedImage | null;
};

export default function ImageInputBox({
                                  onImageSelected,
                                  ensurePermission,
                                  selectedImage,
                              }: ImageInputBoxProps): React.ReactElement {
    const [previewUri, setPreviewUri] = useState<string | null>(null);
    const [uploaded, setUploaded] = useState(false);

    useEffect(() => {
        if (!selectedImage) {
            setPreviewUri(null);
            setUploaded(false);
        } else {
            setPreviewUri(selectedImage.uri);
            setUploaded(true);
        }
    }, [selectedImage]);

    const handlePickImage = async () => {
        const granted = await ensurePermission();

        if (!granted) {
            alert("사진 접근 권한이 필요합니다.");
            return;
        }

        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 0.7,
            });

            if (!result.canceled && result.assets.length > 0) {
                const asset = result.assets[0];

                const image: SelectedImage = {
                    uri: asset.uri,
                    fileName: asset.fileName ?? "image.jpg",
                    type: asset.mimeType ?? "image/jpeg",
                };

                setPreviewUri(image.uri);
                setUploaded(true);
                onImageSelected(image);
            } else {
                onImageSelected(null);
            }
        } catch (error) {
            console.error("launchImageLibrary 예외:", error);
        }
    };

    return (
        <View style={styles.wrapper}>
            <Pressable onPress={handlePickImage} style={styles.imageBox}>
                {previewUri ? (
                    <Image source={{ uri: previewUri }} style={styles.image} />
                ) : (
                    <View style={styles.placeholder}>
                        <MaterialIcons name="cloud-upload" size={28} color="#000" />
                        <Text style={styles.uploadText}>업로드</Text>
                        <Text style={styles.descText}>
                            {uploaded ? "사진이 업로드되었습니다" : "설명입니다"}
                        </Text>
                    </View>
                )}
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        marginTop: 16,
        width: "100%",
        paddingHorizontal: 16,
    },
    imageBox: {
        height: 200,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 12,
        borderWidth: 2,
        borderStyle: "dashed",
        borderColor: "#ccc",
    },
    image: {
        width: "100%",
        height: "100%",
        borderRadius: 10,
        resizeMode: "cover",
    },
    placeholder: {
        alignItems: "center",
    },
    uploadText: {
        fontSize: 16,
        fontWeight: "bold",
        marginTop: 8,
    },
    descText: {
        marginTop: 4,
        fontSize: 13,
        color: "#888",
    },
});
