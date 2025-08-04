

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApiBaseUrl } from '@/utils/api';
export interface StoreInfo {
    name: string;
    location: string;
    status: string;
    hours: string;
    category: string;
}



const API_BASE_URL = getApiBaseUrl();

export const extractStoreInfo = async (text: string): Promise<StoreInfo[]> => {
    const token = await AsyncStorage.getItem('accessToken');
    if (!token) throw new Error('인증 토큰이 없습니다. 로그인 필요');

    const response = await axios.post(
        `${API_BASE_URL}/gpt/extract`,
        { text },
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );

    if (response.data.success && response.data.data) {
        return response.data.data;
    }

    throw new Error('가게 정보 추출 실패');
};
