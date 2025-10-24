/**
 * 처방 관리 API 클라이언트
 */

import { apiPost, apiGet } from './client.js'

// 처방전 생성
export const createPrescription = async (patientData, prescriptionData) => {
    try {
        const response = await apiPost('/api/prescriptions', {
            patientData,
            prescriptionData
        })
        return response
    } catch (error) {
        console.error('처방전 생성 오류:', error)
        throw error
    }
}

// 약물 상호작용 검사
export const checkDrugInteractions = async (medications) => {
    try {
        const response = await apiPost('/api/prescriptions/check-interactions', {
            medications
        })
        return response
    } catch (error) {
        console.error('약물 상호작용 검사 오류:', error)
        throw error
    }
}

// 처방 이력 조회
export const getPrescriptionHistory = async (patientId) => {
    try {
        const response = await apiGet(`/api/prescriptions/history/${patientId}`)
        return response
    } catch (error) {
        console.error('처방 이력 조회 오류:', error)
        throw error
    }
}

// 처방 통계 조회
export const getPrescriptionStatistics = async () => {
    try {
        const response = await apiGet('/api/prescriptions/statistics')
        return response
    } catch (error) {
        console.error('처방 통계 조회 오류:', error)
        throw error
    }
}
