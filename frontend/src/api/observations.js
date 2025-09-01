
// src/api/observations.js

import { apiGet, apiPost } from "./client";

/** 관찰치(바이탈/랩 등) 생성 */
export function createObservation(payload) {
    // payload: { patientId, encounterId?, category, codeLoinc, value, unit?, effectiveAt? }
    return apiPost("/observations", payload);
}

/** 최근 관찰치 목록 (환자별) */
export function getLatestObservations(patientId) {
    return apiGet(`/observations/latest/${patientId}`);
}

/** 24시간 알림 요약 (환자별) */
export function getAlerts(patientId) {
    return apiGet(`/alerts/patient/${patientId}`);
}