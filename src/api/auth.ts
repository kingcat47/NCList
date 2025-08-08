import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {getApiBaseUrl} from "../../utils/api";


const API_BASE_URL = getApiBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});


api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // 토큰이 만료되었거나 유효하지 않은 경우
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('user');
      console.log('토큰이 만료되어 자동 로그아웃되었습니다.');
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  sendVerificationCode: async (phoneNumber: string) => {
    console.log('API 호출 시작 - URL:', API_BASE_URL);

    try {
      console.log('서버에 요청 전송 중...');
      const response = await api.post('/auth/send-verification', { phoneNumber });
      console.log('서버 응답 성공:', response.data);
      return response.data;
    } catch (error: any) {
      console.log('백엔드 서버 연결 실패');
      console.log('에러 상세:', error.message);
      console.log('에러 코드:', error.code);
      console.log('에러 상태:', error.response?.status);
      throw error;
    }
  },

  login: async (phoneNumber: string, verificationCode: string) => {
    console.log('로그인 API 호출 시작');

    try {
      const response = await api.post('/auth/verify-code', { phoneNumber, verificationCode });
      console.log('로그인 성공:', response.data);
      return response.data;
    } catch (error: any) {
      console.log('백엔드 서버 연결 실패');
      // console.log('로그인 에러:', error.message);


      throw error;
    }
  },


  verifyToken: async () => {
    try {
      const response = await api.get('/auth/verify-token');
      return response.data;
    } catch (error: any) {
      // console.log('토큰 검증 실패:', error.message);
      throw error;
    }
  },

  // 로그아웃
  logout: async () => {
    try {
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('user');
      console.log('로그아웃 완료');
    } catch (error) {
      console.log('로그아웃 중 오류:', error);
    }
  },

  // 현재 로그인 상태 확인
  getCurrentUser: async () => {
    try {
      const userStr = await AsyncStorage.getItem('user');
      const token = await AsyncStorage.getItem('accessToken');

      console.log('AsyncStorage에서 가져온 데이터:');
      console.log('user:', userStr);
      console.log('token:', token ? '존재함' : '없음');

      if (!userStr || !token) {
        console.log('사용자 정보 또는 토큰이 없음');
        return null;
      }

      const user = JSON.parse(userStr);
      // console.log('파싱된 사용자 정보:', user);
      return user;
    } catch (error) {
      // console.log('사용자 정보 조회 중 오류:', error);
      return null;
    }
  },

  // 토큰 존재 여부 확인
  isLoggedIn: async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      return !!token;
    } catch (error) {
      // console.log('로그인 상태 확인 중 오류:', error);
      return false;
    }
  },
};