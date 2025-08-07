import React, { useState } from "react";
import { StyleSheet, View, Alert, Platform } from "react-native";
import Button from "@/components/mycomponents/Button";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApiBaseUrl } from "../../../utils/api";
import ImageInputBox, { SelectedImage } from "@/components/mycomponents/ImageInputBox";
import InputStoreName from "@/components/mycomponents/InputStoreName";
import * as MediaLibrary from "expo-media-library";

const API_BASE_URL = getApiBaseUrl();

export default function Add() {
    const [storeText, setStoreText] = useState("");
    const [selectedImage, setSelectedImage] = useState<SelectedImage | null>(null);

    const ensurePermission = async (): Promise<boolean> => {
        if (Platform.OS === "android" || Platform.OS === "ios") {
            const { status } = await MediaLibrary.requestPermissionsAsync();
            return status === "granted";
        }
        return true;
    };

    const handleClear = () => {
        setStoreText("");
        setSelectedImage(null);
    };

    const handleImageSelected = (image: SelectedImage | null) => {
        setSelectedImage(image?.uri ? image : null);
    };

    const handleUploadToS3 = async () => {
        if (!storeText.trim()) {
            Alert.alert("입력 오류", "가게 이름 또는 설명을 입력해주세요.");
            return;
        }

        if (!selectedImage?.uri) {
            Alert.alert("입력 오류", "이미지를 추가해주세요.");
            return;
        }

        try {
            const token = await AsyncStorage.getItem("accessToken");
            if (!token) {
                Alert.alert("인증 필요", "로그인 후 사용해주세요.");
                return;
            }

            const formData = new FormData();
            formData.append("name", storeText);
            formData.append("image", {
                uri: selectedImage.uri,
                name: selectedImage.fileName ?? "uploaded_image.jpg",
                type: selectedImage.type ?? "image/jpeg",
            } as any);

            const response = await axios.post(
                `${API_BASE_URL}/api/s3/uploading-image`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data?.success) {
                Alert.alert("성공", "사진이 업로드되었습니다.");
                handleClear();
            } else {
                Alert.alert("업로드 실패", "이미지를 업로드하지 못했습니다.");
            }
        } catch (err) {
            console.error("[S3 Upload Error]", err);
            Alert.alert("에러", "이미지 업로드 중 오류가 발생했습니다.");
        }
    };

    return (
        <View style={styles.container}>
            <InputStoreName
                value={storeText}
                onChangeText={setStoreText}
                placeholder="예: 서브웨이, 행복약국, 민준이네집"
                editable={true}
                multiline
                numberOfLines={4}
            />

            <ImageInputBox
                onImageSelected={handleImageSelected}
                ensurePermission={ensurePermission}
                selectedImage={selectedImage}
            />

            <View style={styles.buttons}>
                <Button
                    title="업로드"
                    width={170}
                    height={48}
                    backgroundColor="#146EFF"
                    pressedColor="#0F5CE0"
                    textColor="#FFFFFF"
                    onPress={handleUploadToS3}
                />
                <Button
                    title="초기화"
                    width={170}
                    height={48}
                    backgroundColor="#8A8A8A"
                    pressedColor="#6E6E6E"
                    textColor="#FFFFFF"
                    onPress={handleClear}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#FFF",
        flex: 1,
        alignItems: "center",
    },
    buttons: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        paddingHorizontal: 16,
        marginTop: 20,
    },
});
