
// src/api/auth.js

import { apiGet, apiPost, setToken } from "./client";

/** 로그인 → 토큰 저장 */
export async function login({ username, password }) {
    const data = await apiPost("/auth/login", { username, password });
    // 공통 토큰 저장 (client.js의 setToken 사용)
    setToken(data.token);
    return data; // { token, user: {...} }
}

/** 내 정보 조회 (Authorization 자동 첨부됨) */
export function me() {
    return apiGet("/me");
}

/** 로그아웃 (로컬 토큰 제거) */
export function logout() {
    setToken(null);
}