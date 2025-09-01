/**
 * EMR 시스템 좌측 사이드바 네비게이션 컴포넌트
 * 
 * 주요 기능:
 * - 시스템 로고 표시
 * - 메인 메뉴 네비게이션 (홈, 차트, 검사, 예약, 서식/문서)
 * - 현재 페이지 하이라이트 표시
 * - 메뉴 클릭 시 페이지 전환
 */
import React from 'react';

interface SidebarProps {
    currentPage: string;
    onPageChange: (page: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, onPageChange }) => {
    // 메인 메뉴 항목 정의
    const menuItems = [
        { id: 'home', label: '홈' },
        { id: 'chart', label: '차트' },
        { id: 'exam', label: '검사' },
        { id: 'appointment', label: '예약' },
        { id: 'forms', label: '서식 / 문서' }
    ];

    return (
        <aside style={{
            width: "200px",
            background: "white",
            borderRight: "1px solid #e5e7eb",
            padding: "24px 16px",
            display: "flex",
            flexDirection: "column",
            gap: "20px"
        }}>
            {/* 시스템 로고 */}
            <div style={{
                fontSize: "24px",
                fontWeight: 700,
                color: "#253E52",
                textAlign: "left",
                padding: "20px 0",
                letterSpacing: "0.5px",
                marginLeft: "4px"
            }}>
                EMR
            </div>
            
            {/* 메인 메뉴 네비게이션 */}
            <nav>
                {menuItems.map((item) => (
                    <div 
                        key={item.id} 
                        onClick={() => onPageChange(item.id)} 
                        style={{
                            padding: "14px 18px",
                            marginBottom: "10px",
                            borderRadius: "10px",
                            cursor: "pointer",
                            fontSize: "16px",
                            fontWeight: 600,
                            transition: "all 0.3s ease",
                            background: currentPage === item.id ? "#5D6D7E" : "transparent",
                            color: currentPage === item.id ? "white" : "#374151",
                            boxShadow: currentPage === item.id ? "0 2px 8px rgba(93, 109, 126, 0.2)" : "none"
                        }}
                        onMouseEnter={(e) => {
                            if (currentPage !== item.id) {
                                e.currentTarget.style.background = "#f1f5f9";
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (currentPage !== item.id) {
                                e.currentTarget.style.background = "transparent";
                            }
                        }}
                    >
                        {item.label}
                    </div>
                ))}
            </nav>
        </aside>
    );
};
