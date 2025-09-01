/**
 * EMR 시스템 폼 유효성 검사 유틸리티
 * 
 * 주요 기능:
 * - 환자 기본 정보 유효성 검사 (이름, 전화번호, 생년월일, MRN 등)
 * - 바이탈 사인 유효성 검사 (체온, 혈압, 맥박, 호흡수, 혈당, 체중, 키)
 * - 필수 필드 검사 및 형식 검증
 * - 에러 메시지 한글화
 */

// 필수 필드 검사 함수
export const validateRequired = (value: string, fieldName: string): string | null => {
    if (!value || value.trim() === '') {
        return `${fieldName}을(를) 입력해주세요.`;
    }
    return null;
};

// MRN 형식 검사 함수 (P + 4자리 숫자)
export const validateMRN = (mrn: string): string | null => {
    if (!mrn) return 'MRN을 입력해주세요.';
    
    const mrnPattern = /^P\d{4}$/;
    if (!mrnPattern.test(mrn)) {
        return 'MRN은 P로 시작하는 4자리 숫자여야 합니다. (예: P0001)';
    }
    return null;
};

// 전화번호 형식 검사 함수
export const validatePhone = (phone: string): string | null => {
    if (!phone) return '전화번호를 입력해주세요.';
    
    const phonePattern = /^01[0-9]-\d{3,4}-\d{4}$/;
    if (!phonePattern.test(phone)) {
        return '올바른 전화번호 형식을 입력해주세요. (예: 010-1234-5678)';
    }
    return null;
};

// 생년월일 형식 검사 함수
export const validateDateOfBirth = (dob: string): string | null => {
    if (!dob) return '생년월일을 입력해주세요.';
    
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    if (!datePattern.test(dob)) {
        return '올바른 생년월일 형식을 입력해주세요. (예: 1990-01-01)';
    }
    
    const date = new Date(dob);
    const today = new Date();
    
    if (date > today) {
        return '생년월일은 오늘 날짜보다 이전이어야 합니다.';
    }
    
    if (date.getFullYear() < 1900) {
        return '생년월일이 너무 이전입니다.';
    }
    
    return null;
};

// 개별 바이탈 사인 범위 검사 함수
export const validateVitalSignRange = (value: string, fieldName: string, min: number, max: number): string | null => {
    if (!value) return null; // 바이탈은 선택사항이므로 빈 값 허용
    
    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
        return `${fieldName}은(는) 숫자로 입력해주세요.`;
    }
    
    if (numValue < min || numValue > max) {
        return `${fieldName}은(는) ${min}~${max} 범위 내에서 입력해주세요.`;
    }
    
    return null;
};

// 환자 기본 정보 전체 유효성 검사
export const validatePatientForm = (formData: any): Record<string, string> => {
    const errors: Record<string, string> = {};
    
    // 필수 필드 검사
    const nameError = validateRequired(formData.name, '이름');
    if (nameError) errors.name = nameError;
    
    const sexError = validateRequired(formData.sex, '성별');
    if (sexError) errors.sex = sexError;
    
    const birthDateError = validateDateOfBirth(formData.birthDate);
    if (birthDateError) errors.birthDate = birthDateError;
    
    const phoneError = validatePhone(formData.phone);
    if (phoneError) errors.phone = phoneError;
    
    // 선택사항 필드 검사 (입력된 경우에만)
    if (formData.guardianPhone) {
        const guardianPhoneError = validatePhone(formData.guardianPhone);
        if (guardianPhoneError) errors.guardianPhone = guardianPhoneError;
    }
    
    return errors;
};

// 바이탈 사인 전체 폼 유효성 검사
export const validateVitalSign = (formData: any): Record<string, string> => {
    const errors: Record<string, string> = {};
    
    // 바이탈 사인 범위 검사 (입력된 경우에만)
    if (formData.temperature) {
        const tempError = validateVitalSignRange(formData.temperature, '체온', 30, 45);
        if (tempError) errors.temperature = tempError;
    }
    
    if (formData.pulse) {
        const pulseError = validateVitalSignRange(formData.pulse, '맥박', 40, 200);
        if (pulseError) errors.pulse = pulseError;
    }
    
    if (formData.respiration) {
        const respError = validateVitalSignRange(formData.respiration, '호흡수', 8, 50);
        if (respError) errors.respiration = respError;
    }
    
    if (formData.bloodSugar) {
        const sugarError = validateVitalSignRange(formData.bloodSugar, '혈당', 50, 600);
        if (sugarError) errors.bloodSugar = sugarError;
    }
    
    if (formData.weight) {
        const weightError = validateVitalSignRange(formData.weight, '체중', 10, 300);
        if (weightError) errors.weight = weightError;
    }
    
    if (formData.height) {
        const heightError = validateVitalSignRange(formData.height, '키', 50, 250);
        if (heightError) errors.height = heightError;
    }
    
    return errors;
};
