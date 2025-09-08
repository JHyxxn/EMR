// src/api/ai.js
import { apiGet, apiPost, qs } from "./client";

/** 헬스체크 (AI Gateway 살아있는지 확인) */
export const health = () => apiGet("/ai/health");

/** AI 모델 상태 확인 */
export const getModelStatus = () => apiGet("/ai/models/status");

/** 임상노트 요약
 * payload 예: { text: "문진 내용", patient: { name, age?, sex? } }
 * provider: "rule" | "auto" | "openai" | "anthropic" | "google"
 */
export const clinicalNote = (payload, { provider = "auto" } = {}) => {
    return apiPost(`/ai/clinical-note${qs({ provider })}`, payload);
};

/** Lab/바이탈 요약 (룰 기반)
 * payload 예: { observations: [ { codeLoinc, value, unit } ] }
 */
export const labSummary = (payload) => {
    return apiPost("/ai/lab-summary", payload);
};

/** 증상 분석 AI (환자 증상 기반 진단 추천)
 * payload 예: { 
 *   symptoms: ["두통", "발열"], 
 *   patient: { name, age, sex }, 
 *   observations: [ { codeLoinc, value, unit } ] 
 * }
 * provider: "rule" | "auto" | "openai" | "anthropic" | "google"
 */
export const symptomAnalysis = (payload, { provider = "auto" } = {}) => {
    return apiPost(`/ai/symptom-analysis${qs({ provider })}`, payload);
};

/** 처방 가이드 (약물 상호작용 및 용량 가이드)
 * payload 예: { 
 *   medications: ["아스피린", "이부프로펜"], 
 *   patient: { name, age, weight }, 
 *   currentMedications: ["메트포르민"] 
 * }
 * provider: "rule" | "auto" | "openai" | "anthropic" | "google"
 */
export const prescriptionGuide = (payload, { provider = "auto" } = {}) => {
    return apiPost(`/ai/prescription-guide${qs({ provider })}`, payload);
};