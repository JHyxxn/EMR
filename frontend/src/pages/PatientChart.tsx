import React, { useState } from 'react';
import { tokens } from '../design/tokens';
import { Input } from '../components/common';
import { PatientRecord, patientRecords, Doctor, doctors } from '../data/patientData';
import { revisitPatientsData } from '../data/revisitPatientsData';
import { WaitingPatient } from '../data/waitingPatientsData';

interface PatientChartProps {
    patientId?: string;
    searchQuery: string;
    onAddToWaitingList: (patientData: any) => void;
}

export const PatientChart: React.FC<PatientChartProps> = ({ searchQuery, onAddToWaitingList }) => {
    // 나이 계산 함수
    const calculateAge = (birthDate: string) => {
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    };

    // 한글 초성 검색 함수
    const getChoseong = (str: string) => {
        const choseong = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
        return str.split('').map(char => {
            const code = char.charCodeAt(0);
            if (code >= 44032 && code <= 55203) { // 한글 유니코드 범위
                return choseong[Math.floor((code - 44032) / 588)];
            }
            return char;
        }).join('');
    };

    // 검색어 매칭 함수
    const matchesSearch = (text: string, query: string) => {
        if (!query) return true;
        const lowerText = text.toLowerCase();
        const lowerQuery = query.toLowerCase();
        
        // 정확한 문자열 포함 검색
        if (lowerText.includes(lowerQuery)) return true;
        
        // 한글 초성 검색
        const textChoseong = getChoseong(text);
        const queryChoseong = getChoseong(query);
        if (textChoseong.includes(queryChoseong)) return true;
        
        return false;
    };

    // 환자 이름 검색 함수 (초성 검색 포함)
    const matchesNameSearch = (name: string, query: string) => {
        if (!query) return true;
        return matchesSearch(name, query);
    };

    // 증상 검색 함수 (정확한 문자열만)
    const matchesConditionSearch = (condition: string, query: string) => {
        if (!query) return true;
        if (!condition) return false;
        return condition.toLowerCase().includes(query.toLowerCase());
    };

    const [selectedPatient, setSelectedPatient] = useState<PatientRecord | null>(null);
    const [activeTab, setActiveTab] = useState<string>('개요');

    // 복합 검색 함수
    const parseSearchQuery = (query: string) => {
        const parts = query.split(',').map(part => part.trim());
        const result = {
            name: '',
            birthDate: '',
            phoneSuffix: ''
        };
        
        parts.forEach(part => {
            // 생년월일 패턴 (YYMMDD 또는 YYYY-MM-DD)
            if (/^\d{6}$/.test(part) || /^\d{4}-\d{2}-\d{2}$/.test(part)) {
                result.birthDate = part;
            }
            // 전화번호 뒷자리 패턴 (4자리 숫자)
            else if (/^\d{4}$/.test(part)) {
                result.phoneSuffix = part;
            }
            // 나머지는 이름으로 처리
            else {
                result.name = part;
            }
        });
        
        return result;
    };

    // 복합 검색 매칭 함수
    const matchesComplexSearch = (patient: PatientRecord, searchQuery: string) => {
        if (!searchQuery) return true;
        
        const searchParts = parseSearchQuery(searchQuery);
        let matchCount = 0;
        let totalParts = 0;
        
        // 이름 검색
        if (searchParts.name) {
            totalParts++;
            if (matchesNameSearch(patient.name, searchParts.name)) {
                matchCount++;
            }
        }
        
        // 생년월일 검색
        if (searchParts.birthDate) {
            totalParts++;
            const patientBirth = patient.birthDate.replace(/-/g, '');
            const searchBirth = searchParts.birthDate.replace(/-/g, '');
            
            // 6자리 생년월일로 변환
            let patientBirthShort = patientBirth;
            if (patientBirth.length === 8) {
                patientBirthShort = patientBirth.substring(2); // YYYYMMDD -> YYMMDD
            }
            
            if (patientBirthShort.includes(searchBirth) || patientBirth.includes(searchBirth)) {
                matchCount++;
            }
        }
        
        // 전화번호 뒷자리 검색
        if (searchParts.phoneSuffix) {
            totalParts++;
            const phoneLast4 = patient.phone.replace(/-/g, '').slice(-4);
            if (phoneLast4 === searchParts.phoneSuffix) {
                matchCount++;
            }
        }
        
        // 기존 검색 로직 (MRN, 증상)
        const mrnMatch = matchesConditionSearch(patient.mrn, searchQuery);
        const symptomsMatch = matchesConditionSearch(patient.symptoms, searchQuery);
        
        // 복합 검색 조건: 모든 지정된 조건이 일치하거나, 기존 검색 조건이 일치하거나, 검색어가 비어있으면 true
        return (totalParts === 0 || matchCount === totalParts) || mrnMatch || symptomsMatch;
    };

    // 검색어에 따른 환자 필터링 (재진 환자 데이터 사용)
    const filteredPatientRecords = revisitPatientsData.filter(patient =>
        matchesComplexSearch(patient, searchQuery)
    );

    const handlePatientSelect = (patient: PatientRecord) => {
        setSelectedPatient(patient);
    };

    // 재진환자 등록 상태 관리
    const [todayInfo, setTodayInfo] = useState({
        symptoms: '',
        bloodPressure: '',
        notes: ''
    });

    // 이전 방문 내역 펼침/접힘 상태 관리
    const [expandedVisits, setExpandedVisits] = useState<Set<string>>(new Set());

    // 방문 내역 토글 함수
    const toggleVisitExpansion = (visitDate: string) => {
        const newExpanded = new Set(expandedVisits);
        if (newExpanded.has(visitDate)) {
            newExpanded.delete(visitDate);
        } else {
            newExpanded.add(visitDate);
        }
        setExpandedVisits(newExpanded);
    };

    // 대기 목록에 추가 함수
    const handleAddToWaitingList = () => {
        if (!selectedPatient) return;

        const currentTime = new Date().toLocaleTimeString('ko-KR', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });

        const waitingPatient: WaitingPatient = {
            id: Date.now(),
            time: currentTime,
            name: selectedPatient.name,
            birthDate: selectedPatient.birthDate,
            phone: selectedPatient.phone,
            condition: todayInfo.symptoms,
            visitType: "재진",
            alert: null,
            alertType: null,
            buttonText: "진료 시작",
            visitOrigin: "walkin" as const,
            nurseInfo: {
                symptoms: todayInfo.symptoms,
                bloodPressure: todayInfo.bloodPressure ? {
                    systolic: parseInt(todayInfo.bloodPressure.split('/')[0]),
                    diastolic: parseInt(todayInfo.bloodPressure.split('/')[1]),
                    measuredAt: new Date().toISOString()
                } : undefined,
                notes: todayInfo.notes,
                registeredBy: "간호사",
                registeredAt: new Date().toISOString()
            }
        };

        // 대기 목록에 추가
        onAddToWaitingList(waitingPatient);

        // 입력 필드 초기화
        setTodayInfo({
            symptoms: '',
            bloodPressure: '',
            notes: ''
        });
    };

    return (
        <div style={{ 
            display: "flex", 
            flexDirection: "column",
            gap: tokens.space.md,
            height: "calc(100vh - 120px)",
            padding: tokens.space.md
        }}>
            {/* 상단: 재진환자 내역 목록 (검색 결과) */}
            <div style={{ 
                background: "white", 
                borderRadius: "8px",
                padding: "16px",
                border: "1px solid #e5e7eb",
                display: "flex",
                flexDirection: "column"
            }}>
                <div style={{ 
                    fontSize: "18px", 
                    fontWeight: 700, 
                    marginBottom: "16px",
                    color: "#374151"
                }}>
                    재진환자 내역 목록
                </div>
                
                <div style={{ 
                    display: "grid",
                    gap: "8px",
                    maxHeight: "300px",
                    overflowY: "auto"
                }}>
                    {filteredPatientRecords.filter(patient => patient.visitType === '재진').map(patient => (
                        <div 
                            key={patient.id}
                            onClick={() => handlePatientSelect(patient)}
                            style={{ 
                                padding: "12px 16px",
                                border: "1px solid #e5e7eb",
                                borderRadius: "8px",
                                background: selectedPatient?.id === patient.id ? "rgba(93, 109, 126, 0.1)" : "white",
                                cursor: "pointer",
                                borderLeft: selectedPatient?.id === patient.id ? "3px solid #5D6D7E" : "1px solid #e5e7eb"
                            }}
                        >
                            <div style={{ 
                                display: "flex", 
                                justifyContent: "space-between", 
                                alignItems: "center",
                                marginBottom: "4px"
                            }}>
                                <strong style={{ color: "#374151" }}>{patient.name}</strong>
                                <span style={{ 
                                    fontSize: "12px", 
                                    color: "#6b7280",
                                    background: "#f3f4f6",
                                    padding: "2px 8px",
                                    borderRadius: "4px"
                                }}>
                                    {patient.visitType}
                                </span>
                            </div>
                            <div style={{ fontSize: "12px", color: "#6b7280" }}>
                                생년월일: {patient.birthDate} ({calculateAge(patient.birthDate)}세) | 전화번호: {patient.phone}
                            </div>
                            <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "2px" }}>
                                최근 방문일: {patient.lastVisitDate} | {patient.diagnosis}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            {/* 하단: 2분할 구조 */}
            <div style={{ 
                display: "flex", 
                gap: tokens.space.md,
                flex: 1
            }}>
                {/* 좌측: 환자 이전 기록 */}
                <div style={{ 
                    background: "white", 
                    borderRadius: "8px",
                    padding: "16px",
                    border: "1px solid #e5e7eb",
                    display: "flex",
                    flexDirection: "column",
                    flex: "5",
                    minHeight: 0
                }}>
                    <div style={{ 
                        fontSize: "18px", 
                        fontWeight: 700, 
                        marginBottom: "16px",
                        color: "#374151"
                    }}>
                        환자 이전 기록
                    </div>
                    
                    {selectedPatient ? (
                        <div style={{ flex: 1, overflowY: "auto" }}>
                            {/* 환자 기본 정보 */}
                            <div style={{
                                padding: "12px",
                                backgroundColor: "#f9fafb",
                                borderRadius: "6px",
                                border: "1px solid #e5e7eb",
                                marginBottom: "16px"
                            }}>
                                <div style={{ fontWeight: 600, marginBottom: "8px" }}>
                                    {selectedPatient.name} ({calculateAge(selectedPatient.birthDate)}세)
                                </div>
                                <div style={{ fontSize: "14px", color: "#6b7280" }}>
                                    생년월일: {selectedPatient.birthDate} ({calculateAge(selectedPatient.birthDate)}세)
                                </div>
                                <div style={{ fontSize: "14px", color: "#6b7280" }}>
                                    전화번호: {selectedPatient.phone}
                                </div>
                            </div>

                            {/* 이전 방문 내역 */}
                            <div style={{ marginBottom: "16px" }}>
                                <div style={{ 
                                    fontSize: "16px", 
                                    fontWeight: 600, 
                                    marginBottom: "12px",
                                    color: "#374151"
                                }}>
                                    이전 방문 내역
                                </div>
                                
                                {/* 방문 내역 목록 */}
                                <div style={{ display: "grid", gap: "8px" }}>
                                    {[
                                        { date: "2024-01-15", type: "재진", diagnosis: "당뇨 관리" },
                                        { date: "2024-01-10", type: "초진", diagnosis: "고혈압 진단" },
                                        { date: "2024-01-05", type: "초진", diagnosis: "일반 검진" }
                                    ].map((visit) => (
                                        <div key={visit.date}>
                                            {/* 방문 날짜 헤더 */}
                                            <div 
                                                onClick={() => toggleVisitExpansion(visit.date)}
                                                style={{
                                                    padding: "8px 12px",
                                                    backgroundColor: "#f3f4f6",
                                                    borderRadius: "4px",
                                                    cursor: "pointer",
                                                    border: "1px solid #e5e7eb"
                                                }}
                                            >
                                                <div style={{ fontWeight: 500, color: "#374151" }}>
                                                    {visit.date} - {visit.type}
                                                </div>
                                                <div style={{ fontSize: "12px", color: "#6b7280" }}>
                                                    {visit.diagnosis}
                                                </div>
                                            </div>
                                            
                                            {/* 펼쳐진 상세 내용 */}
                                            {expandedVisits.has(visit.date) && (
                                                <div style={{
                                                    padding: "12px",
                                                    backgroundColor: "#fefefe",
                                                    border: "1px solid #e5e7eb",
                                                    borderTop: "none",
                                                    borderRadius: "0 0 4px 4px"
                                                }}>
                                                    {/* 진료기록 */}
                                                    <div style={{ marginBottom: "12px" }}>
                                                        <div style={{ fontWeight: 600, marginBottom: "4px", color: "#374151" }}>
                                                            진료기록:
                                                        </div>
                                                        <div style={{ fontSize: "13px", color: "#6b7280", marginBottom: "4px" }}>
                                                            - 증상: {visit.diagnosis === "당뇨 관리" ? "혈당 상승, 다뇨" : 
                                                                   visit.diagnosis === "고혈압 진단" ? "두통, 어지럼증" : "일반 검진"}
                                                        </div>
                                                        <div style={{ fontSize: "13px", color: "#6b7280", marginBottom: "4px" }}>
                                                            - 진단: {visit.diagnosis}
                                                        </div>
                                                        <div style={{ fontSize: "13px", color: "#6b7280" }}>
                                                            - 처치: 약물 처방 및 생활 관리 지침
                                                        </div>
                                                    </div>
                                                    
                                                    {/* 처방내역 */}
                                                    <div>
                                                        <div style={{ fontWeight: 600, marginBottom: "4px", color: "#374151" }}>
                                                            처방내역:
                                                        </div>
                                                        <div style={{ fontSize: "13px", color: "#6b7280", marginBottom: "4px" }}>
                                                            - 약물: {visit.diagnosis === "당뇨 관리" ? "메트포르민 500mg" : 
                                                                   visit.diagnosis === "고혈압 진단" ? "아몰로디핀 5mg" : "비타민제"}
                                                        </div>
                                                        <div style={{ fontSize: "13px", color: "#6b7280" }}>
                                                            - 복용법: 1일 2회 식후 30분
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div style={{ 
                            textAlign: "center", 
                            color: "#6b7280",
                            padding: "40px 20px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            height: "100%"
                        }}>
                            상단에서 재진환자를 선택하세요
                        </div>
                    )}
                </div>
                
                {/* 우측: 오늘 등록 정보 입력 */}
                <div style={{ 
                    background: "white", 
                    borderRadius: "8px",
                    padding: "20px",
                    border: "1px solid #e5e7eb",
                    display: "flex",
                    flexDirection: "column",
                    flex: "5",
                    alignSelf: "flex-start"
                }}>
                    <div style={{ 
                        fontSize: "18px", 
                        fontWeight: 700, 
                        marginBottom: "16px",
                        color: "#374151"
                    }}>
                        오늘 등록 정보 입력
                    </div>
                    
                    {selectedPatient ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                            {/* 선택된 환자 정보 */}
                            <div style={{
                                padding: "12px",
                                backgroundColor: "#f9fafb",
                                borderRadius: "6px",
                                border: "1px solid #e5e7eb"
                            }}>
                                <div style={{ fontWeight: 600, marginBottom: "4px" }}>
                                    선택된 환자: {selectedPatient.name}
                                </div>
                                <div style={{ fontSize: "14px", color: "#6b7280" }}>
                                    {selectedPatient.birthDate} | {selectedPatient.phone}
                                </div>
                            </div>

                            {/* 증상 입력 */}
                            <div>
                                <label style={{
                                    display: "block",
                                    marginBottom: "8px",
                                    fontSize: "14px",
                                    fontWeight: 500,
                                    color: "#374151"
                                }}>
                                    증상
                                </label>
                                <textarea
                                    placeholder="오늘 어디가 아파서 오신건지?"
                                    value={todayInfo.symptoms}
                                    onChange={(e) => setTodayInfo(prev => ({ ...prev, symptoms: e.target.value }))}
                                    style={{
                                        width: "calc(100% - 16px)",
                                        padding: "8px",
                                        border: "1px solid #d1d5db",
                                        borderRadius: "4px",
                                        fontSize: "14px",
                                        minHeight: "60px",
                                        resize: "vertical"
                                    }}
                                />
                            </div>

                            {/* 혈압 입력 */}
                            <div>
                                <label style={{
                                    display: "block",
                                    marginBottom: "8px",
                                    fontSize: "14px",
                                    fontWeight: 500,
                                    color: "#374151"
                                }}>
                                    혈압
                                </label>
                                <input
                                    type="text"
                                    placeholder="예: 120/80"
                                    value={todayInfo.bloodPressure}
                                    onChange={(e) => setTodayInfo(prev => ({ ...prev, bloodPressure: e.target.value }))}
                                    style={{
                                        width: "calc(100% - 16px)",
                                        padding: "8px",
                                        border: "1px solid #d1d5db",
                                        borderRadius: "4px",
                                        fontSize: "14px"
                                    }}
                                />
                            </div>

                            {/* 노트 입력 */}
                            <div>
                                <label style={{
                                    display: "block",
                                    marginBottom: "8px",
                                    fontSize: "14px",
                                    fontWeight: 500,
                                    color: "#374151"
                                }}>
                                    노트
                                </label>
                                <textarea
                                    placeholder="추가 메모를 입력해주세요"
                                    value={todayInfo.notes}
                                    onChange={(e) => setTodayInfo(prev => ({ ...prev, notes: e.target.value }))}
                                    style={{
                                        width: "calc(100% - 16px)",
                                        padding: "8px",
                                        border: "1px solid #d1d5db",
                                        borderRadius: "4px",
                                        fontSize: "14px",
                                        minHeight: "60px",
                                        resize: "vertical"
                                    }}
                                />
                            </div>

                            {/* 대기 목록에 추가 버튼 */}
                            <button
                                onClick={handleAddToWaitingList}
                                disabled={!todayInfo.symptoms}
                                style={{
                                    padding: "12px 24px",
                                    background: todayInfo.symptoms ? "#3b82f6" : "#d1d5db",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "6px",
                                    fontSize: "14px",
                                    fontWeight: 500,
                                    cursor: todayInfo.symptoms ? "pointer" : "not-allowed",
                                    marginTop: "auto"
                                }}
                            >
                                대기 목록에 추가
                            </button>
                        </div>
                    ) : (
                        <div style={{ 
                            textAlign: "center", 
                            color: "#6b7280",
                            padding: "40px 20px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            height: "100%"
                        }}>
                            좌측에서 재진환자를 선택하세요
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
};
