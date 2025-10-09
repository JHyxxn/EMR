/**
 * 환자 관련 API 함수들
 * 백엔드 API와의 통신을 담당
 */

import { apiGet, apiPost, apiPut, apiDelete } from './client';

/**
 * 모든 환자 목록 조회
 * @param {string} query 검색 쿼리 (선택사항)
 * @returns {Promise<Array>} 환자 목록
 */
export const getPatients = async (query = '') => {
    try {
        const params = query ? { query } : {};
        return await apiGet('/api/patients', params);
    } catch (error) {
        console.error('환자 목록 조회 실패:', error);
        throw error;
    }
};

/**
 * 특정 환자 상세 정보 조회
 * @param {number} patientId 환자 ID
 * @returns {Promise<Object>} 환자 상세 정보
 */
export const getPatient = async (patientId) => {
    try {
        return await apiGet(`/api/patients/${patientId}`);
    } catch (error) {
        console.error('환자 정보 조회 실패:', error);
        throw error;
    }
};

/**
 * 새 환자 등록
 * @param {Object} patientData 환자 데이터
 * @returns {Promise<Object>} 생성된 환자 정보
 */
export const createPatient = async (patientData) => {
    try {
        return await apiPost('/api/patients', patientData);
    } catch (error) {
        console.error('환자 등록 실패:', error);
        throw error;
    }
};

/**
 * 환자 정보 수정
 * @param {number} patientId 환자 ID
 * @param {Object} patientData 수정할 환자 데이터
 * @returns {Promise<Object>} 수정된 환자 정보
 */
export const updatePatient = async (patientId, patientData) => {
    try {
        return await apiPut(`/api/patients/${patientId}`, patientData);
    } catch (error) {
        console.error('환자 정보 수정 실패:', error);
        throw error;
    }
};

/**
 * 환자 삭제
 * @param {number} patientId 환자 ID
 * @returns {Promise<void>}
 */
export const deletePatient = async (patientId) => {
    try {
        return await apiDelete(`/api/patients/${patientId}`);
    } catch (error) {
        console.error('환자 삭제 실패:', error);
        throw error;
    }
};

/**
 * 환자 검색
 * @param {string} searchQuery 검색어
 * @returns {Promise<Array>} 검색 결과
 */
export const searchPatients = async (searchQuery) => {
    try {
        return await getPatients(searchQuery);
    } catch (error) {
        console.error('환자 검색 실패:', error);
        throw error;
    }
};