/**
 * 검사 관리 API 클라이언트
 */

import { apiPost, apiGet } from './client.js'

// 검사 요청 생성
export const createTestRequest = async (patientData, testData) => {
    try {
        const response = await apiPost('/api/tests/request', {
            patientData,
            testData
        })
        return response
    } catch (error) {
        console.error('검사 요청 생성 오류:', error)
        throw error
    }
}

// 검사 일정 생성
export const scheduleTest = async (testRequest, availableSlots) => {
    try {
        const response = await apiPost('/api/tests/schedule', {
            testRequest,
            availableSlots
        })
        return response
    } catch (error) {
        console.error('검사 일정 생성 오류:', error)
        throw error
    }
}

// 검사 결과 입력
export const inputTestResults = async (testRequestId, results) => {
    try {
        const response = await apiPost('/api/tests/results', {
            testRequestId,
            results
        })
        return response
    } catch (error) {
        console.error('검사 결과 입력 오류:', error)
        throw error
    }
}

// 검사 통계 조회
export const getTestStatistics = async () => {
    try {
        const response = await apiGet('/api/tests/statistics')
        return response
    } catch (error) {
        console.error('검사 통계 조회 오류:', error)
        throw error
    }
}
