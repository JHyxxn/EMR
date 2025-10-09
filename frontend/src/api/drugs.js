/**
 * 약물 데이터베이스 API 클라이언트
 * 
 * 주요 기능:
 * - 약물 검색
 * - 약물 상호작용 검사
 * - 처방 가이드 생성
 * - 약물 데이터베이스 상태 확인
 */

import { apiGet, apiPost } from './client.js';

/**
 * 약물 검색
 * @param {string} query - 검색어
 * @returns {Promise} 검색 결과
 */
export const searchDrugs = async (query) => {
    try {
        const response = await apiGet('/drugs/search', { query });
        return response;
    } catch (error) {
        console.error('약물 검색 실패:', error);
        throw error;
    }
};

/**
 * 약물 상호작용 검사
 * @param {Array} medications - 처방할 약물 목록
 * @param {Object} patient - 환자 정보 (선택사항)
 * @returns {Promise} 상호작용 검사 결과
 */
export const checkDrugInteractions = async (medications, patient = {}) => {
    try {
        const response = await apiPost('/drugs/interactions', {
            medications,
            patient
        });
        return response;
    } catch (error) {
        console.error('약물 상호작용 검사 실패:', error);
        throw error;
    }
};

/**
 * 처방 가이드 생성
 * @param {Array} medications - 처방할 약물 목록
 * @param {Object} patient - 환자 정보
 * @returns {Promise} 처방 가이드
 */
export const generatePrescriptionGuide = async (medications, patient = {}) => {
    try {
        const response = await apiPost('/drugs/prescription-guide', {
            medications,
            patient
        });
        return response;
    } catch (error) {
        console.error('처방 가이드 생성 실패:', error);
        throw error;
    }
};

/**
 * 약물 데이터베이스 상태 확인
 * @returns {Promise} 데이터베이스 상태
 */
export const getDrugDatabaseStatus = async () => {
    try {
        const response = await apiGet('/drugs/status');
        return response;
    } catch (error) {
        console.error('약물 데이터베이스 상태 확인 실패:', error);
        throw error;
    }
};

/**
 * 약물 상호작용 심각도에 따른 색상 반환
 * @param {string} severity - 심각도 (low, medium, high, critical)
 * @returns {string} CSS 색상 클래스
 */
export const getSeverityColor = (severity) => {
    const colors = {
        low: 'text-green-600 bg-green-50',
        medium: 'text-yellow-600 bg-yellow-50',
        high: 'text-orange-600 bg-orange-50',
        critical: 'text-red-600 bg-red-50'
    };
    return colors[severity] || colors.low;
};

/**
 * 약물 상호작용 심각도에 따른 아이콘 반환
 * @param {string} severity - 심각도
 * @returns {string} 아이콘 클래스
 */
export const getSeverityIcon = (severity) => {
    const icons = {
        low: '✅',
        medium: '⚠️',
        high: '🔶',
        critical: '🚨'
    };
    return icons[severity] || icons.low;
};

/**
 * 약물 상호작용 결과를 사용자 친화적인 형태로 변환
 * @param {Object} interactionResult - 상호작용 검사 결과
 * @returns {Object} 변환된 결과
 */
export const formatInteractionResult = (interactionResult) => {
    if (!interactionResult.hasInteractions) {
        return {
            hasInteractions: false,
            message: '약물 상호작용이 발견되지 않았습니다.',
            interactions: [],
            warnings: interactionResult.warnings || []
        };
    }

    const formattedInteractions = interactionResult.interactions.map(interaction => ({
        ...interaction,
        severityColor: getSeverityColor(interaction.severity),
        severityIcon: getSeverityIcon(interaction.severity)
    }));

    return {
        hasInteractions: true,
        message: `${interactionResult.interactions.length}개의 약물 상호작용이 발견되었습니다.`,
        interactions: formattedInteractions,
        warnings: interactionResult.warnings || []
    };
};

/**
 * 처방 가이드를 사용자 친화적인 형태로 변환
 * @param {Object} guide - 처방 가이드
 * @returns {Object} 변환된 가이드
 */
export const formatPrescriptionGuide = (guide) => {
    return {
        ...guide,
        formattedInteractions: formatInteractionResult(guide.interactionCheck),
        totalMedications: guide.medications.length,
        hasWarnings: guide.warnings.length > 0,
        hasRecommendations: guide.recommendations.length > 0
    };
};

// 기본 내보내기
export default {
    searchDrugs,
    checkDrugInteractions,
    generatePrescriptionGuide,
    getDrugDatabaseStatus,
    getSeverityColor,
    getSeverityIcon,
    formatInteractionResult,
    formatPrescriptionGuide
};
