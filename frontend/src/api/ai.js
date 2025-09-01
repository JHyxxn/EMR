// src/api/ai.js
import { apiGet, apiPost, qs } from "./client";

/** 헬스체크 (AI Gateway 살아있는지 확인) */
export const health = () => apiGet("/ai/health");

/** 임상노트 요약
 * payload 예: { text: "문진 내용", patient: { name, age?, sex? } }
 * provider: "rule" | "llm"
 */
export const clinicalNote = (payload, { provider = "rule" } = {}) => {
    return apiPost(`/ai/clinical-note${qs({ provider })}`, payload);
};

/** Lab/바이탈 요약 (룰 기반)
 * payload 예: { observations: [ { codeLoinc, value, unit } ] }
 */
export const labSummary = (payload) => {
    return apiPost("/ai/lab-summary", payload);
};