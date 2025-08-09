import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { authAPI } from '../src/api/auth';

export default function LoginScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendCode = async () => {

    setIsLoading(true);
    try {
      console.log('API 호출 시작:', phoneNumber);
      const result = await authAPI.sendVerificationCode(phoneNumber);
      console.log('API 응답 받음:', result);
      setIsCodeSent(true);
      Alert.alert('성공', '인증 코드가 전송되었습니다.\n서버 콘솔에서 코드를 확인하세요.');
    } catch (error: any) {
      //console.error('API 에러:', error);
      let errorMessage = '인증 코드 전송에 실패했습니다.';
      
      if (error.response) {
        errorMessage = `서버 오류: ${error.response.data?.message || error.response.status}`;
      } else if (error.request) {
        errorMessage = '서버에 연결할 수 없습니다.\n백엔드 서버가 실행 중인지 확인해주세요.';
      }
      
      Alert.alert('오류', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!verificationCode.trim()) {
      Alert.alert('알림', '인증 코드를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await authAPI.login(phoneNumber, verificationCode);
      await AsyncStorage.setItem('accessToken', result.accessToken);
      await AsyncStorage.setItem('user', JSON.stringify(result.user));
      
      Alert.alert('성공', '로그인이 완료되었습니다!', [
        {
          text: '확인',
          onPress: () => {
            setTimeout(() => {
              router.push('/(tabs)/(profile)' as any);
            }, 100);
          },
        },
      ]);
    } catch (error) {
      Alert.alert('오류', '로그인에 실패했습니다.\n인증 코드를 다시 확인해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToHome = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <TouchableOpacity onPress={handleBackToHome} style={styles.backButton}>
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>로그인</Text>
            <View style={styles.placeholder} />
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.title}>전화번호로 로그인</Text>
            <Text style={styles.subtitle}>
              서비스 이용을 위해 전화번호를 입력해주세요
            </Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>전화번호</Text>
              <TextInput
                style={styles.input}
                placeholder="01012345678"
                placeholderTextColor="#8A8A8A"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                maxLength={13}
                editable={!isCodeSent}
              />
            </View>

            {!isCodeSent ? (
              <TouchableOpacity 
                style={[
                  styles.loginButton,
                  phoneNumber.length >= 10 && styles.loginButtonActive
                ]}
                onPress={handleSendCode}
                disabled={phoneNumber.length < 10 || isLoading}
              >
                <Text style={[
                  styles.loginButtonText,
                  phoneNumber.length >= 10 && styles.loginButtonTextActive
                ]}>
                  {isLoading ? '전송 중...' : '인증 코드 전송'}
                </Text>
              </TouchableOpacity>
            ) : (
              <>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>인증 코드</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="6자리 코드 입력"
                    placeholderTextColor="#8A8A8A"
                    value={verificationCode}
                    onChangeText={setVerificationCode}
                    keyboardType="number-pad"
                    maxLength={6}
                  />
                </View>

                <TouchableOpacity 
                  style={[
                    styles.loginButton,
                    verificationCode.length === 6 && styles.loginButtonActive
                  ]}
                  onPress={handleLogin}
                  disabled={verificationCode.length !== 6 || isLoading}
                >
                  <Text style={[
                    styles.loginButtonText,
                    verificationCode.length === 6 && styles.loginButtonTextActive
                  ]}>
                    {isLoading ? '로그인 중...' : '로그인'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.resendButton}
                  onPress={() => {
                    setIsCodeSent(false);
                    setVerificationCode('');
                  }}
                >
                  <Text style={styles.resendButtonText}>다시 전송</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    backgroundColor: '#fff',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  backButtonText: {
    fontSize: 24,
    color: '#1C1B1F',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1B1F',
    textAlign: 'center',
  },
    placeholder: {
    width: 40,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: 10,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1C1B1F',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6F7785',
    marginBottom: 30,
    textAlign: 'center',
    lineHeight: 22,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1B1F',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#1C1B1F',
    backgroundColor: '#FFFFFF',
  },
  loginButton: {
    backgroundColor: '#F0F0F0',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop:10,
  },
  loginButtonActive: {
    backgroundColor: '#146EFF',
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8A8A8A',
  },
  loginButtonTextActive: {
    color: '#FFFFFF',
  },
  resendButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  resendButtonText: {
    fontSize: 14,
    color: '#146EFF',
    textDecorationLine: 'underline',
  },
}); 