/**
 * 관찰 데이터 관련 API 함수들
 * 바이탈 사인, 검사 결과, 진료 기록 등을 관리
 */

import { apiGet, apiPost, apiPut, apiDelete } from './client';

/**
 * 특정 환자의 최신 관찰 데이터 조회
 * @param {number} patientId 환자 ID
 * @returns {Promise<Array>} 관찰 데이터 목록
 */
export const getLatestObservations = async (patientId) => {
    try {
        return await apiGet(`/api/observations/latest/${patientId}`);
    } catch (error) {
        console.error('관찰 데이터 조회 실패:', error);
        throw error;
    }
};

/**
 * 새로운 관찰 데이터 생성
 * @param {Object} observationData 관찰 데이터
 * @returns {Promise<Object>} 생성된 관찰 데이터
 */
export const createObservation = async (observationData) => {
    try {
        return await apiPost('/api/observations', observationData);
    } catch (error) {
        console.error('관찰 데이터 생성 실패:', error);
        throw error;
    }
};

/**
 * 바이탈 사인 저장
 * @param {number} patientId 환자 ID
 * @param {Object} vitalData 바이탈 데이터
 * @returns {Promise<Object>} 저장된 바이탈 데이터
 */
export const saveVitalSigns = async (patientId, vitalData) => {
    try {
        const observations = [];
        
        // 혈압 저장
        if (vitalData.bloodPressure) {
            observations.push({
                patientId,
                category: 'vital',
                codeLoinc: '85354-9', // 혈압 코드
                value: vitalData.bloodPressure,
                unit: 'mmHg',
                effectiveAt: new Date().toISOString()
            });
        }
        
        // 체온 저장
        if (vitalData.temperature) {
            observations.push({
                patientId,
                category: 'vital',
                codeLoinc: '8310-5', // 체온 코드
                value: vitalData.temperature,
                unit: '°C',
                effectiveAt: new Date().toISOString()
            });
        }
        
        // 심박수 저장
        if (vitalData.heartRate) {
            observations.push({
                patientId,
                category: 'vital',
                codeLoinc: '8867-4', // 심박수 코드
                value: vitalData.heartRate,
                unit: 'bpm',
                effectiveAt: new Date().toISOString()
            });
        }
        
        // 호흡수 저장
        if (vitalData.respiratoryRate) {
            observations.push({
                patientId,
                category: 'vital',
                codeLoinc: '9279-1', // 호흡수 코드
                value: vitalData.respiratoryRate,
                unit: 'breaths/min',
                effectiveAt: new Date().toISOString()
            });
        }
        
        // 모든 관찰 데이터를 순차적으로 저장
        const results = [];
        for (const observation of observations) {
            const result = await createObservation(observation);
            results.push(result);
        }
        
        return results;
    } catch (error) {
        console.error('바이탈 사인 저장 실패:', error);
        throw error;
    }
};

/**
 * 검사 결과 저장
 * @param {number} patientId 환자 ID
 * @param {Object} testData 검사 데이터
 * @returns {Promise<Object>} 저장된 검사 데이터
 */
export const saveTestResult = async (patientId, testData) => {
    try {
        return await createObservation({
            patientId,
            category: 'lab',
            codeLoinc: testData.codeLoinc || 'TEST-001',
            value: testData.value,
            unit: testData.unit || null,
            effectiveAt: new Date().toISOString()
        });
    } catch (error) {
        console.error('검사 결과 저장 실패:', error);
        throw error;
    }
};

/**
 * 환자 알림 데이터 조회
 * @param {number} patientId 환자 ID
 * @returns {Promise<Array>} 알림 데이터 목록
 */
export const getPatientAlerts = async (patientId) => {
    try {
        return await apiGet(`/api/alerts/patient/${patientId}`);
    } catch (error) {
        console.error('환자 알림 조회 실패:', error);
        throw error;
    }
};