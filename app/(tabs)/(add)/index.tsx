import { StyleSheet, View, Alert } from "react-native";
import Input from "@/components/mycomponents/Input";
import Button from "@/components/mycomponents/Button";
import React, { useState } from "react";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeletePopup from "@/components/mycomponents/DeletePopup";
import { getApiBaseUrl } from "../../../utils/api";

const API_BASE_URL = getApiBaseUrl();

export default function Add() {
    const [link, setLink] = useState('');
    const handleClear = () => {
        setLink('');
    }
    const handleExtractStoreInfo = async () => {
        try {
            const token = await AsyncStorage.getItem('accessToken');
            if (!token) {
                Alert.alert('인증 필요', '로그인 후 사용해주세요.');
                return;
            }

            const response = await axios.post(
                `${API_BASE_URL}/gpt/extract-store-info`,
                { text: link },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    timeout: 10000,
                }
            );

            const result = response.data;

            if (result.success) {
                const info = result.data;
                Alert.alert(
                    "가게 정보 추출 성공",
                    `이름: ${info.name}\n위치: ${info.location}\n상태: ${info.status}\n영업시간: ${info.hours}\n카테고리: ${info.category}`
                );
            } else {
                Alert.alert("오류", "가게 정보를 가져오지 못했습니다.");
            }
        } catch (error: any) {
            console.error("에러 발생:", error);
            Alert.alert("에러", "서버와 통신 중 문제가 발생했습니다.");
        }
    };

    return (
        <View style={styles.container}>
            <Input value={link} onChangeText={setLink} />

            <View style={styles.buttons}>
                <Button
                    title="Ok"
                    width={170}
                    height={48}
                    backgroundColor="#146EFF"
                    pressedColor="#0F5CE0"
                    textColor="#FFFFFF"
                    onPress={handleExtractStoreInfo}
                />
                <Button
                    title="Cancel"
                    width={170}
                    height={48}
                    backgroundColor="#8A8A8A"
                    pressedColor="#6E6E6E"
                    textColor="#FFFFFF"
                    onPress={() => handleClear()}
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
        paddingHorizontal: 20,
    },
});
