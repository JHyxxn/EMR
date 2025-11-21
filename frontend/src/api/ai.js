/**
 * AI Gateway API 클라이언트
 * 
 * 담당자: 김지현 (AI Gateway)
 * 
 * 주요 기능:
 * - AI Gateway 헬스체크
 * - AI 모델 상태 확인
 * - 임상노트 요약 (SOAP 분석)
 * - Lab/바이탈 요약
 * - 증상 분석 AI (진단 추천)
 * - 처방 가이드 (약물 상호작용 및 용량 가이드)
 * 
 * 기술 스택:
 * - Fetch API
 * - 백엔드 프록시를 통한 AI Gateway 접근
 * - 다중 AI 모델 지원 (OpenAI, Anthropic, Google)
 * 
 * API 엔드포인트:
 * - /api/ai/health - 헬스체크
 * - /api/ai/models/status - 모델 상태
 * - /api/ai/clinical-note - 임상노트 요약
 * - /api/ai/lab-summary - Lab 요약
 * - /api/ai/symptom-analysis - 증상 분석
 * - /api/ai/prescription-guide - 처방 가이드
 */
// src/api/ai.js
import { qs } from "./client";

// 백엔드를 통해 AI Gateway에 접근 (프록시 사용)
const API_BASE_URL = 'http://localhost:4000';

/** AI Gateway 헬스체크 */
export const health = () => {
    return fetch(`${API_BASE_URL}/api/ai/health`).then(res => res.json());
};

/** AI 모델 상태 확인 */
export const getModelStatus = () => {
    return fetch(`${API_BASE_URL}/api/ai/models/status`).then(res => res.json());
};

/** 임상노트 요약
 * payload 예: { text: "문진 내용", patient: { name, age?, sex? } }
 * provider: "rule" | "auto" | "openai" | "anthropic" | "google"
 */
export const clinicalNote = async (payload, { provider = "auto" } = {}) => {
    const response = await fetch(`${API_BASE_URL}/api/ai/clinical-note${qs({ provider })}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `AI Gateway 오류: ${response.status}`);
    }
    
    return await response.json();
};

/** Lab/바이탈 요약 (룰 기반)
 * payload 예: { observations: [ { codeLoinc, value, unit } ] }
 */
export const labSummary = async (payload) => {
    const response = await fetch(`${API_BASE_URL}/api/ai/lab-summary`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `AI Gateway 오류: ${response.status}`);
    }
    
    return await response.json();
};

/** 증상 분석 AI (환자 증상 기반 진단 추천)
 * payload 예: { 
 *   symptoms: ["두통", "발열"], 
 *   patient: { name, age, sex }, 
 *   observations: [ { codeLoinc, value, unit } ] 
 * }
 * provider: "rule" | "auto" | "openai" | "anthropic" | "google"
 */
export const symptomAnalysis = async (payload, { provider = "auto" } = {}) => {
    const response = await fetch(`${API_BASE_URL}/api/ai/symptom-analysis${qs({ provider })}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `AI Gateway 오류: ${response.status}`);
    }
    
    return await response.json();
};

/** 처방 가이드 (약물 상호작용 및 용량 가이드)
 * payload 예: { 
 *   medications: ["아스피린", "이부프로펜"], 
 *   patient: { name, age, weight }, 
 *   currentMedications: ["메트포르민"] 
 * }
 * provider: "rule" | "auto" | "openai" | "anthropic" | "google"
 */
export const prescriptionGuide = async (payload, { provider = "auto" } = {}) => {
    const response = await fetch(`${API_BASE_URL}/api/ai/prescription-guide${qs({ provider })}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `AI Gateway 오류: ${response.status}`);
    }
    
    return await response.json();
};