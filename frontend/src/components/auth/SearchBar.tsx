/**
 * 환자 검색바 컴포넌트
 * 
 * 담당자: 오수민 (프론트엔드)
 * 
 * 주요 기능:
 * - 실시간 환자 검색 (이름, MRN, 생년월일, 전화번호)
 * - 검색 결과 드롭다운 표시
 * - 환자 선택 시 콜백 함수 호출
 * 
 * 기술 스택:
 * - React + TypeScript
 * - 실시간 검색 (onChange 이벤트)
 * - API 연동 (Patients.searchPatients)
 * - 로딩 상태 표시
 * 
 * 사용 위치:
 * - Header 컴포넌트 내부
 * - 대시보드 상단 검색바
 */
import React, { useState } from 'react';
import { Patients } from '../../api';

interface SearchBarProps {
    onPatientSelect?: (patient: any) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onPatientSelect }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = async (query: string) => {
        setSearchQuery(query);
        if (query.trim().length === 0) {
            setSearchResults([]);
            return;
        }

        try {
            setIsSearching(true);
            const results = await Patients.searchPatients(query);
            setSearchResults(results);
        } catch (error) {
            console.error('환자 검색 실패:', error);
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    };

    const handlePatientSelect = (selectedPatient: any) => {
        setSearchQuery(selectedPatient.name);
        setSearchResults([]);
        onPatientSelect?.(selectedPatient);
    };

    return (
        <div className="search-container" style={{ 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            flex: 1,
            position: "relative"
        }}>
            <input 
                type="text" 
                placeholder="환자 검색 (이름, 생년월일, 전화번호)" 
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                style={{
                    height: 40,
                    border: "1px solid #cbd5e1",
                    borderRadius: 8,
                    padding: "0 16px",
                    outline: "none",
                    fontSize: 14,
                    width: "100%",
                    transition: "border-color 0.2s"
                }}
                onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
                onBlur={(e) => e.target.style.borderColor = "#cbd5e1"}
            />
            {isSearching && (
                <div style={{
                    position: "absolute",
                    right: "12px",
                    color: "#6b7280",
                    fontSize: "12px"
                }}>
                    검색 중...
                </div>
            )}
            {searchResults.length > 0 && (
                <div style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    background: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    zIndex: 1000,
                    maxHeight: "200px",
                    overflow: "auto"
                }}>
                    {searchResults.map((patient: any) => (
                        <div key={patient.id} style={{
                            padding: "8px 16px",
                            cursor: "pointer",
                            borderBottom: "1px solid #f3f4f6",
                            fontSize: "14px"
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = "#f9fafb"}
                        onMouseLeave={(e) => e.currentTarget.style.background = "white"}
                        onClick={() => handlePatientSelect(patient)}>
                            <div style={{ fontWeight: 500, color: "#374151" }}>
                                {patient.name} ({patient.mrn})
                            </div>
                            <div style={{ fontSize: "12px", color: "#6b7280" }}>
                                {patient.birthDate ? new Date(patient.birthDate).toLocaleDateString('ko-KR') : ''} {patient.sex || ''}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
