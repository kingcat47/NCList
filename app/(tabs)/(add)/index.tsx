import { StyleSheet, View, Alert } from "react-native";
import Input from "@/components/mycomponents/Input";
import Button from "@/components/mycomponents/Button";
import React, { useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApiBaseUrl } from "../../../utils/api";
import LoadingDots from "../../../components/mycomponents/LoadingDots";
import { useLoading } from "../../../LoadingContext";

const API_BASE_URL = getApiBaseUrl();

export default function Add() {
    const [link, setLink] = useState("");
    const { loading, setLoading } = useLoading();

    const handleClear = () => {
        setLink("");
    };

    // 전체 텍스트에서 naver.me 단축 URL만 추출
    const extractShortUrl = (text: string): string | null => {
        const match = text.match(/https:\/\/naver\.me\/\S+/);
        return match ? match[0] : null;
    };

    // 단축 URL을 실제 네이버 지도 장소 URL로 변환 (리다이렉트 추적)
    const resolveRedirectUrl = async (shortUrl: string): Promise<string | null> => {
        try {
            const response = await axios.get(shortUrl, {
                maxRedirects: 5,
                timeout: 10000,
            });

            const fullUrl =
                response.request?.responseURL || response.request?.res?.responseUrl;

            if (!fullUrl) {
                console.warn("[Add] 최종 URL 추출 실패 (responseURL 없음)");
                return null;
            }


            const trimmedUrl = fullUrl.split("?")[0];


            const match = trimmedUrl.match(
                /^https:\/\/map\.naver\.com\/p\/entry\/place\/\d+$/
            );

            if (!match) {
                console.warn("[Add] 예상치 못한 URL 형식:", trimmedUrl);
            } else {
                console.log("[Add] 최종 URL:", trimmedUrl);
            }

            return trimmedUrl;
        } catch (err) {
            console.error("[Add] 리다이렉션 추출 실패:", err);
            return null;
        }
    };

    const extractTextWithoutUrl = (fullText: string): string => {

        return fullText.replace(/https?:\/\/\S+/g, "").trim();
    };

    const handleExtractStoreInfo = async () => {
        try {
            console.log("[Add] 요청 시작, loading true");
            setLoading(true);

            const token = await AsyncStorage.getItem("accessToken");
            if (!token) {
                Alert.alert("인증 필요", "로그인 후 사용해주세요.");
                setLoading(false);
                return;
            }


            if (!link.trim()) {
                Alert.alert("입력 오류", "네이버 지도 공유 텍스트를 입력해주세요.");
                setLoading(false);
                return;
            }

            const shortUrl = extractShortUrl(link);
            if (!shortUrl) {
                Alert.alert("링크 오류", "유효한 네이버 지도 단축 링크가 필요합니다.");
                setLoading(false);
                return;
            }

            const resolvedUrl = await resolveRedirectUrl(shortUrl);
            if (!resolvedUrl) {
                Alert.alert("리다이렉션 실패", "단축 URL을 실제 URL로 변환하지 못했습니다.");
                setLoading(false);
                return;
            }


            const textWithoutUrl = extractTextWithoutUrl(link);

            setLink("");


            const response = await axios.post(
                `${API_BASE_URL}/api/firecrawl/extract-store-info`,
                {
                    fullText: link,
                    textWithoutUrl,
                    resolvedUrl,            // 네이버 지도 실제 장소 URL (크롤링 대상)
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    timeout: 100000,
                }
            );

            const result = response.data;
            console.log("[Add] 서버 응답:", result);

            if (result.success) {
                const info = result.data;
                Alert.alert(
                    "가게 정보 추출 성공",
                    `이름: ${info.name ?? "없음"}\n위치: ${info.location ?? "없음"}\n상태: ${info.status ?? "미확인"}\n영업시간: ${info.hours ?? "없음"}\n카테고리: ${info.category ?? "없음"}`
                );
            } else {
                Alert.alert("오류", "가게 정보를 가져오지 못했습니다.");
            }
        } catch (error: any) {
            console.error("[Add] 에러 발생:", error);
            Alert.alert("에러", "서버와 통신 중 문제가 발생했습니다.");
        } finally {
            console.log("[Add] 요청 종료, loading false");
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Input
                value={link}
                onChangeText={setLink}
                placeholder="네이버 지도 공유 텍스트를 입력하세요"
                editable={!loading}
                multiline
                numberOfLines={4}
            />

            {loading && <LoadingDots />}

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
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#FFF",
        flex: 1,
        alignItems: "center",
        paddingTop: 20,
    },
    buttons: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        paddingHorizontal: 20,
        marginTop: 20,
    },
});
