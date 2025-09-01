/**
 * EMR 시스템 상단 헤더 컴포넌트
 * 
 * 주요 기능:
 * - 시스템 로고 및 제목 표시
 * - 환자 검색 기능 (이름, 전화번호, 생년월일로 검색 가능)
 * - 신규 환자 등록 버튼
 * - 사용자 정보 및 로그아웃 기능
 */
import React from 'react';

interface HeaderProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    onNewPatient: () => void;
    onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ searchQuery, onSearchChange, onNewPatient, onLogout }) => {
    return (
        <header style={{
            display: "flex",
            alignItems: "center",
            padding: "16px 24px",
            background: "white",
            borderBottom: "1px solid #e2e8f0",
            height: "64px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
        }}>
            {/* 시스템 로고 및 제목 */}
            <div style={{ fontSize: 28, fontWeight: 700, color: "#253E52", minWidth: "200px", marginRight: "40px" }}>
                Dr.App · 오늘
            </div>
            
            {/* 중앙 영역: 검색바와 신규 환자 등록 버튼 */}
            <div style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: "24px",
                flex: 1,
                justifyContent: "flex-start",
                maxWidth: "1000px",
                marginRight: "16px"
            }}>
                {/* 환자 검색 입력 필드 */}
                <div style={{ flex: 1, maxWidth: "800px" }}>
                    <input 
                        type="text"
                        placeholder="환자 검색 (환자 이름, 생년월일, 전화번호 뒷자리)"
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        style={{
                            width: "100%",
                            height: "40px",
                            padding: "8px 12px",
                            border: "1px solid #d1d5db",
                            borderRadius: "6px",
                            fontSize: "14px",
                            boxSizing: "border-box"
                        }}
                    />
                </div>
                
                {/* 신규 환자 등록 버튼 */}
                <button 
                    onClick={onNewPatient}
                    style={{
                        height: 40,
                        padding: "0 16px",
                        border: "1px solid #5D6D7E",
                        borderRadius: 8,
                        background: "#5D6D7E",
                        color: "white",
                        cursor: "pointer",
                        fontSize: 14,
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        fontWeight: 500,
                        transition: "all 0.2s",
                        whiteSpace: "nowrap"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "#4A5A6B"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "#5D6D7E"}
                >
                    <span style={{ fontSize: 18 }}>+</span>
                    신규 환자
                </button>
            </div>
            
            {/* 우측 영역: 사용자 정보 및 로그아웃 */}
            <div style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: "8px",
                marginLeft: "auto"
            }}>
                <span style={{ fontSize: 14, color: "#6b7280" }}>testuser님</span>
                <button 
                    onClick={onLogout}
                    style={{
                        padding: "6px 12px",
                        background: "#f3f4f6",
                        color: "#374151",
                        border: "1px solid #d1d5db",
                        borderRadius: "6px",
                        fontSize: 12,
                        fontWeight: 500,
                        cursor: "pointer"
                    }}
                >
                    로그아웃
                </button>
            </div>
        </header>
    );
};
