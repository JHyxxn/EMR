/**
 * 문서 관리 API 클라이언트
 */

import { apiPost, apiGet } from './client.js'

// 소견서 생성
export const generateOpinion = async (patientData, opinionData) => {
    try {
        const response = await apiPost('/api/documents/opinion', {
            patientData,
            opinionData
        })
        return response
    } catch (error) {
        console.error('소견서 생성 오류:', error)
        throw error
    }
}

// 진료 보고서 생성
export const generateMedicalReport = async (patientData, visitData) => {
    try {
        const response = await apiPost('/api/documents/medical-report', {
            patientData,
            visitData
        })
        return response
    } catch (error) {
        console.error('진료 보고서 생성 오류:', error)
        throw error
    }
}

// 처방전 생성
export const generatePrescription = async (patientData, prescriptionData) => {
    try {
        const response = await apiPost('/api/documents/prescription', {
            patientData,
            prescriptionData
        })
        return response
    } catch (error) {
        console.error('처방전 생성 오류:', error)
        throw error
    }
}

// 검사 요청서 생성
export const generateTestRequest = async (patientData, testData) => {
    try {
        const response = await apiPost('/api/documents/test-request', {
            patientData,
            testData
        })
        return response
    } catch (error) {
        console.error('검사 요청서 생성 오류:', error)
        throw error
    }
}

// 문서 목록 조회
export const getDocumentList = async () => {
    try {
        const response = await apiGet('/api/documents')
        return response
    } catch (error) {
        console.error('문서 목록 조회 오류:', error)
        throw error
    }
}
