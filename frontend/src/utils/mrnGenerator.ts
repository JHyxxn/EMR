/**
 * EMR 시스템 MRN(Medical Record Number) 생성 및 관리 유틸리티
 * 
 * 주요 기능:
 * - 환자 고유 식별번호 자동 생성 (P + 4자리 숫자)
 * - MRN 형식 검증
 * - MRN 포맷팅 및 정렬
 * - 다음 MRN 번호 계산
 * 
 * MRN 형식: P0001, P0002, P0003, ... (P + 4자리 숫자)
 */

// MRN 카운터 (실제로는 데이터베이스에서 관리)
let mrnCounter = 1000; // P1000부터 시작

/**
 * 새로운 MRN 생성
 * @returns 생성된 MRN (예: P1001)
 */
export const generateMRN = (): string => {
    mrnCounter++;
    return `P${mrnCounter.toString().padStart(4, '0')}`;
};

/**
 * MRN 형식 검증
 * @param mrn 검증할 MRN
 * @returns 유효한 형식이면 true, 아니면 false
 */
export const validateMRNFormat = (mrn: string): boolean => {
    const mrnPattern = /^P\d{4}$/;
    return mrnPattern.test(mrn);
};

/**
 * MRN 포맷팅 (숫자만 입력된 경우 P + 4자리로 변환)
 * @param input 사용자 입력값
 * @returns 포맷된 MRN
 */
export const formatMRN = (input: string): string => {
    // 숫자만 추출
    const numbers = input.replace(/\D/g, '');
    
    if (numbers.length === 0) {
        return '';
    }
    
    // 4자리로 패딩하고 P 접두사 추가
    return `P${numbers.padStart(4, '0')}`;
};

/**
 * 다음 MRN 번호 계산 (현재 최대 MRN 기준)
 * @param currentMRNs 현재 존재하는 MRN 배열
 * @returns 다음 MRN 번호
 */
export const getNextMRN = (currentMRNs: string[]): string => {
    if (currentMRNs.length === 0) {
        return 'P1001';
    }
    
    // 현재 MRN들에서 숫자 부분만 추출하여 최대값 찾기
    const numbers = currentMRNs
        .map(mrn => parseInt(mrn.replace('P', '')))
        .filter(num => !isNaN(num));
    
    const maxNumber = Math.max(...numbers, 1000);
    return `P${(maxNumber + 1).toString().padStart(4, '0')}`;
};
