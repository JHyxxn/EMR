/**
 * 인증 관련 API 함수들
 * 로그인, 로그아웃, 토큰 관리 등을 담당
 */

import { apiGet, apiPost } from './client';

/**
 * 사용자 로그인
 * @param {string} username 사용자명
 * @param {string} password 비밀번호
 * @returns {Promise<Object>} 로그인 결과 (토큰, 사용자 정보)
 */
export const login = async (username, password) => {
    try {
        const response = await apiPost('/api/auth/login', {
            username,
            password
        });
        
        // 토큰을 localStorage에 저장
        if (response.token) {
            localStorage.setItem('token', response.token);
        }
        
        return response;
    } catch (error) {
        console.error('로그인 실패:', error);
        throw error;
    }
};

/**
 * 사용자 로그아웃
 * localStorage에서 토큰 제거
 */
export const logout = () => {
    localStorage.removeItem('token');
    // 필요시 서버에 로그아웃 요청도 보낼 수 있음
};

/**
 * 현재 로그인된 사용자 정보 조회
 * @returns {Promise<Object>} 사용자 정보
 */
export const getCurrentUser = async () => {
    try {
        return await apiGet('/api/me');
    } catch (error) {
        console.error('사용자 정보 조회 실패:', error);
        // 토큰이 유효하지 않으면 로그아웃 처리
        if (error.message.includes('unauthorized') || error.message.includes('401')) {
            logout();
        }
        throw error;
    }
};

/**
 * 토큰 유효성 검사
 * @returns {boolean} 토큰 유효성
 */
export const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    // 테스트용 토큰인 경우 항상 true 반환
    if (token === 'temp-token') return true;
    
    try {
        // JWT 토큰 형식 검증
        const parts = token.split('.');
        if (parts.length !== 3) {
            console.warn('유효하지 않은 JWT 토큰 형식');
            return false;
        }
        
        // JWT 토큰의 만료 시간 확인
        const payload = JSON.parse(atob(parts[1]));
        const now = Date.now() / 1000;
        return payload.exp > now;
    } catch (error) {
        console.error('토큰 파싱 실패:', error);
        return false;
    }
};

/**
 * 새 사용자 등록
 * @param {Object} userData 사용자 데이터
 * @returns {Promise<Object>} 생성된 사용자 정보
 */
export const register = async (userData) => {
    try {
        return await apiPost('/api/users', userData);
    } catch (error) {
        console.error('사용자 등록 실패:', error);
        throw error;
    }
};