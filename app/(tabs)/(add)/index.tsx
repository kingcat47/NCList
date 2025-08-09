import { StyleSheet, View, Alert } from "react-native";
import Input from "@/components/mycomponents/Input";
import Button from "@/components/mycomponents/Button";
import React, { useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApiBaseUrl } from "../../../utils/api";
import LoadingDots from "../../../components/mycomponents/LoadingDots";
import { useLoading } from "../../../LoadingContext";
import OhuYeah from "@/components/mycomponents/OhuYeah";

const API_BASE_URL = getApiBaseUrl();

export default function Add() {
    const [link, setLink] = useState("");
    const [store_name, setStore_name] = useState("");
    const { loading, setLoading } = useLoading();

    const handleClear = () => {
        setLink("");
        setStore_name("");
    };

    // 네이버 지도 단축 URL만 추출
    const extractShortUrl = (text: string): string | null => {
        const match = text.match(/https:\/\/naver\.me\/\S+/);
        return match ? match[0] : null;
    };

    const handleExtractStoreInfo = async () => {
        try {
            console.log("[Add] 요청 시작, loading true");
            setLoading(true);

            const token = await AsyncStorage.getItem("accessToken");
            if (!token) {
                Alert.alert("인증 필요", "로그인 후 사용해주세요.");
                return;
            }

            if (!link.trim()) {
                Alert.alert("입력 오류", "네이버 지도 공유 텍스트를 입력해주세요.");
                return;
            }

            if (!store_name.trim()) {
                Alert.alert("입력 오류", "가게 이름을 입력해주세요.");
                return;
            }

            const shortUrl = extractShortUrl(link);
            if (!shortUrl) {
                Alert.alert("링크 오류", "유효한 네이버 지도 단축 링크가 필요합니다.");
                return;
            }

            const text_store_name = store_name.trim();

            console.log("[Add] 추출된 단축 URL:", shortUrl);
            const { data: naverPlaceData } = await axios.get(
                "https://navermap-scrap.thnos.app/place",
                { params: { place_url: shortUrl } }
            );
            console.log("[Add] ㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁ:", naverPlaceData);
            
            const { data: info } = await axios.post(
                `${API_BASE_URL}/gpt/analyze`,
                {
                    text_store_name: text_store_name,
                    yuchan_lets_go: naverPlaceData,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    timeout: 100000,
                }
            );

            console.log("[Add] 서버 응답:", info);

            const hoursText =
                Array.isArray(info.business_hours) && info.business_hours.length > 0
                    ? info.business_hours
                        .map((b: any) => `${b.day} ${b.start}~${b.end}`)
                        .join(", ")
                    : (info.monday
                        ? `월 ${info.monday}, 화 ${info.tuesday}, 수 ${info.wednesday}, 목 ${info.thursday}, 금 ${info.friday}, 토 ${info.saturday}, 일 ${info.sunday}`
                        : info.hours ?? "없음");

            // Alert.alert(
            //     "가게가 추가되었습니다."+
            //     `\n이름: ${info.name ?? "없음"}` +
            //     `위치: ${info.address ?? info.location ?? "없음"}\n` +
            //     `카테고리: ${info.category ?? "없음"}`
            // );


            // 입력 필드 초기화
            setLink("");
            setStore_name("");
        } catch (error: any) {
            // //console.error("[Add] 에러 발생:", error?.response?.data || error);
            Alert.alert("에러", "지원하지 않는 형식의 가게입니다.");
        } finally {
            console.log("[Add] 요청 종료, loading false");
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <OhuYeah
                value={store_name}
                onChangeText={setStore_name}
                editable={!loading}
                multiline
                numberOfLines={4}
            />
            <Input
                value={link}
                onChangeText={setLink}
                editable={!loading}
                multiline
                numberOfLines={4}
            />

            <View style={styles.buttons}>
                <Button
                    title="Ok"
                    width={170}
                    height={48}
                    backgroundColor="#146EFF"
                    pressedColor="#0F5CE0"
                    textColor="#FFFFFF"
                    onPress={handleExtractStoreInfo}
                    disabled={loading}
                />
                <Button
                    title="Cancel"
                    width={170}
                    height={48}
                    backgroundColor="#8A8A8A"
                    pressedColor="#6E6E6E"
                    textColor="#FFFFFF"
                    onPress={handleClear}
                    disabled={loading}
                />
            </View>

            {loading && (
                <View style={styles.loadingContainer}>
                    <LoadingDots />
                </View>
            )}
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
    },
    loadingContainer: {
        marginTop: 20,
        alignSelf: "center",
    },
});
