// src/api/ai.js
import { qs } from "./client";

// AI Gateway 기본 URL
const AI_GATEWAY_URL = 'http://localhost:5001';

/** AI Gateway 헬스체크 */
export const health = () => {
    return fetch(`${AI_GATEWAY_URL}/health`).then(res => res.json());
};

/** AI 모델 상태 확인 */
export const getModelStatus = () => {
    return fetch(`${AI_GATEWAY_URL}/models/status`).then(res => res.json());
};

/** 임상노트 요약
 * payload 예: { text: "문진 내용", patient: { name, age?, sex? } }
 * provider: "rule" | "auto" | "openai" | "anthropic" | "google"
 */
export const clinicalNote = async (payload, { provider = "auto" } = {}) => {
    const response = await fetch(`${AI_GATEWAY_URL}/insight/clinical-note${qs({ provider })}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
        throw new Error(`AI Gateway 오류: ${response.status}`);
    }
    
    return await response.json();
};

/** Lab/바이탈 요약 (룰 기반)
 * payload 예: { observations: [ { codeLoinc, value, unit } ] }
 */
export const labSummary = async (payload) => {
    const response = await fetch(`${AI_GATEWAY_URL}/insight/lab-summary`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
        throw new Error(`AI Gateway 오류: ${response.status}`);
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
    const response = await fetch(`${AI_GATEWAY_URL}/insight/symptom-analysis${qs({ provider })}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
        throw new Error(`AI Gateway 오류: ${response.status}`);
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
    const response = await fetch(`${AI_GATEWAY_URL}/insight/prescription-guide${qs({ provider })}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
        throw new Error(`AI Gateway 오류: ${response.status}`);
    }
    
    return await response.json();
};