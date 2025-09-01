/**
 * EMR 시스템 API 클라이언트
 * 
 * 주요 기능:
 * - 백엔드 API 서버와의 통신 관리
 * - HTTP 요청/응답 처리
 * - 인증 토큰 관리
 * - 에러 핸들링 및 재시도 로직
 * - 요청/응답 인터셉터
 * 
 * 설정:
 * - 기본 URL: http://localhost:4000
 * - 타임아웃: 10초
 * - 재시도 횟수: 3회
 */

// API 서버 기본 설정
const API_BASE_URL = 'http://localhost:4000';
const API_TIMEOUT = 10000; // 10초
const MAX_RETRIES = 3;

/**
 * HTTP 요청 헤더 생성
 * @param {Object} customHeaders 추가 헤더
 * @returns {Object} 요청 헤더 객체
 */
const createHeaders = (customHeaders = {}) => {
    const token = localStorage.getItem('token');
    const defaultHeaders = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...customHeaders
    };
    return defaultHeaders;
};

/**
 * API 응답 처리 및 에러 핸들링
 * @param {Response} response fetch 응답 객체
 * @returns {Promise} 처리된 응답 데이터
 */
const handleResponse = async (response) => {
    if (!response.ok) {
        // 인증 에러 처리
        if (response.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
            throw new Error('인증이 만료되었습니다. 다시 로그인해주세요.');
        }
        
        // 서버 에러 처리
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `서버 오류: ${response.status}`);
    }
    
    // JSON 응답 파싱
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
        return await response.json();
    }
    
    return await response.text();
};

/**
 * 재시도 로직이 포함된 HTTP 요청 함수
 * @param {string} url 요청 URL
 * @param {Object} options fetch 옵션
 * @param {number} retryCount 현재 재시도 횟수
 * @returns {Promise} 요청 결과
 */
const fetchWithRetry = async (url, options = {}, retryCount = 0) => {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);
        
        const response = await fetch(url, {
            ...options,
            signal: controller.signal,
            headers: createHeaders(options.headers)
        });
        
        clearTimeout(timeoutId);
        return await handleResponse(response);
        
    } catch (error) {
        // 네트워크 에러 또는 타임아웃 시 재시도
        if ((error.name === 'AbortError' || error.name === 'TypeError') && retryCount < MAX_RETRIES) {
            console.warn(`API 요청 실패, 재시도 중... (${retryCount + 1}/${MAX_RETRIES})`);
            await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1))); // 지수 백오프
            return fetchWithRetry(url, options, retryCount + 1);
        }
        
        throw error;
    }
};

/**
 * GET 요청
 * @param {string} endpoint API 엔드포인트
 * @param {Object} params 쿼리 파라미터
 * @returns {Promise} 응답 데이터
 */
export const apiGet = async (endpoint, params = {}) => {
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
            url.searchParams.append(key, params[key]);
        }
    });
    
    return await fetchWithRetry(url.toString(), {
        method: 'GET'
    });
};

/**
 * POST 요청
 * @param {string} endpoint API 엔드포인트
 * @param {Object} data 요청 데이터
 * @returns {Promise} 응답 데이터
 */
export const apiPost = async (endpoint, data = {}) => {
    return await fetchWithRetry(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        body: JSON.stringify(data)
    });
};

/**
 * PUT 요청
 * @param {string} endpoint API 엔드포인트
 * @param {Object} data 요청 데이터
 * @returns {Promise} 응답 데이터
 */
export const apiPut = async (endpoint, data = {}) => {
    return await fetchWithRetry(`${API_BASE_URL}${endpoint}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    });
};

/**
 * DELETE 요청
 * @param {string} endpoint API 엔드포인트
 * @returns {Promise} 응답 데이터
 */
export const apiDelete = async (endpoint) => {
    return await fetchWithRetry(`${API_BASE_URL}${endpoint}`, {
        method: 'DELETE'
    });
};

/**
 * 파일 업로드 요청
 * @param {string} endpoint API 엔드포인트
 * @param {FormData} formData 파일 데이터
 * @returns {Promise} 응답 데이터
 */
export const apiUpload = async (endpoint, formData) => {
    return await fetchWithRetry(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        body: formData,
        headers: {} // Content-Type은 브라우저가 자동으로 설정
    });
};

// API 클라이언트 기본 내보내기
export default {
    get: apiGet,
    post: apiPost,
    put: apiPut,
    delete: apiDelete,
    upload: apiUpload
};