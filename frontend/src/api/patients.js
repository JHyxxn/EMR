
// src/api/patients.js

import { apiGet, apiPost, qs } from "./client";

/** 환자 생성 */
export function createPatient(payload) {
    // payload: { mrn, name, birthDate?, sex?, phone?, email?, address? }
    return apiPost("/patients", payload);
}

/** 환자 검색 (이름 or MRN) */
export function searchPatients(query = "") {
    return apiGet(`/patients${qs({ query })}`);
}

/** 환자 단건 조회 */
export function getPatient(id) {
    return apiGet(`/patients/${id}`);
}