/**
 * EMR 시스템 디자인 토큰 (Design Tokens)
 * 
 * 주요 기능:
 * - 일관된 디자인 시스템 구축
 * - 색상, 간격, 폰트, 반지름 등의 표준화
 * - 컴포넌트 간 일관성 유지
 * - 테마 변경 시 중앙 집중식 관리
 * 
 * 사용법:
 * import { tokens } from '../design/tokens';
 * style={{ color: tokens.colors.primary, padding: tokens.space.md }}
 */

// 색상 팔레트
export const colors = {
    // 주요 브랜드 색상
    primary: '#0ea5e9',      // 메인 브랜드 색상 (파란색)
    secondary: '#64748b',    // 보조 색상 (회색)
    
    // 상태 색상
    success: '#10b981',      // 성공/완료 (초록색)
    warning: '#f59e0b',      // 경고/주의 (주황색)
    error: '#ef4444',        // 에러/위험 (빨간색)
    info: '#3b82f6',         // 정보 (파란색)
    
    // 그레이스케일
    gray: {
        50: '#f8fafc',       // 가장 밝은 회색
        100: '#f1f5f9',
        200: '#e2e8f0',
        300: '#cbd5e1',
        400: '#94a3b8',
        500: '#64748b',
        600: '#475569',
        700: '#334155',
        800: '#1e293b',
        900: '#0f172a'       // 가장 어두운 회색
    },
    
    // 텍스트 색상
    text: {
        primary: '#1f2937',   // 주요 텍스트
        secondary: '#6b7280', // 보조 텍스트
        disabled: '#9ca3af',  // 비활성화 텍스트
        inverse: '#ffffff'    // 반전 텍스트 (어두운 배경)
    },
    
    // 배경 색상
    background: {
        primary: '#ffffff',   // 주요 배경
        secondary: '#f8fafc', // 보조 배경
        tertiary: '#f1f5f9'   // 3차 배경
    }
};

// 간격 시스템 (8px 기준)
export const space = {
    xs: 4,    // 4px
    sm: 8,    // 8px
    md: 16,   // 16px
    lg: 24,   // 24px
    xl: 32,   // 32px
    '2xl': 48, // 48px
    '3xl': 64  // 64px
};

// 폰트 크기
export const fontSize = {
    xs: '12px',    // 작은 텍스트
    sm: '14px',    // 보조 텍스트
    base: '16px',  // 기본 텍스트
    lg: '18px',    // 큰 텍스트
    xl: '20px',    // 제목
    '2xl': '24px', // 큰 제목
    '3xl': '30px'  // 헤더
};

// 폰트 굵기
export const fontWeight = {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800
};

// 테두리 반지름
export const borderRadius = {
    none: '0px',
    sm: '4px',
    base: '6px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px'
};

// 그림자
export const shadow = {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
};

// 트랜지션
export const transition = {
    fast: '150ms ease-in-out',
    base: '200ms ease-in-out',
    slow: '300ms ease-in-out'
};

// Z-인덱스 레이어
export const zIndex = {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modal: 1040,
    popover: 1050,
    tooltip: 1060
};

// 전체 디자인 토큰 객체
export const tokens = {
    colors,
    space,
    fontSize,
    fontWeight,
    borderRadius,
    shadow,
    transition,
    zIndex
};

// 기본 내보내기
export default tokens;