/**
 * API 클라이언트 배럴 export (README 7단계: API 연동)
 *
 * 담당자: 오수민 (AI, Frontend)
 *
 * - Auth, Patients, Obs, AI, Documents, Tests, Prescriptions 네임스페이스 재노출
 * - 개별 모듈은 `client.js` 기반 HTTP 래퍼 사용
 */
export * as Auth from "./auth";
export * as Patients from "./patients";
export * as Obs from "./observations";
export * as AI from "./ai";
export * as Documents from "./documents";
export * as Tests from "./tests";
export * as Prescriptions from "./prescriptions";