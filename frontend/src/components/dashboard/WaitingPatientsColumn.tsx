/**
 * 진료 대기 환자 컬럼 컴포넌트
 */
import React from 'react';
import { WaitingPatient } from '../../data/waitingPatientsData';
import { PatientCard } from './PatientCard';
import { UnifiedPatient } from './types';

interface WaitingPatientsColumnProps {
    patients: UnifiedPatient[];
    searchQuery: string;
    patientStatus: { [key: string]: string };
    currentTime: Date;
    isHospitalOpen: boolean;
    onStartTreatment: (patient: WaitingPatient) => void;
    onCompleteTreatment: (patientId: string) => void;
    isPatientTimeReached: (patientTime: string) => boolean;
    calculateAge: (birthDate: string) => string | number;
}

export const WaitingPatientsColumn: React.FC<WaitingPatientsColumnProps> = ({
    patients,
    searchQuery,
    patientStatus,
    currentTime,
    isHospitalOpen,
    onStartTreatment,
    onCompleteTreatment,
    isPatientTimeReached,
    calculateAge
}) => {
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

    // 복합 검색 쿼리 파싱
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
    const matchesComplexSearch = (patient: UnifiedPatient, searchQuery: string) => {
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
        if (searchParts.birthDate && patient.birthDate) {
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
        
        // 전화번호 뒷자리 검색 (환자 데이터에 전화번호가 있다면)
        if (searchParts.phoneSuffix && patient.phone) {
            totalParts++;
            const phoneLast4 = patient.phone.replace(/-/g, '').slice(-4);
            if (phoneLast4 === searchParts.phoneSuffix) {
                matchCount++;
            }
        }
        
        // 증상 검색 (기존 로직 유지)
        const conditionMatch = patient.chiefComplaint.toLowerCase().includes(searchQuery.toLowerCase());
        
        // 복합 검색 조건: 모든 지정된 조건이 일치하거나, 증상이 일치하거나, 검색어가 비어있으면 true
        return (totalParts === 0 || matchCount === totalParts) || conditionMatch;
    };

    // 환자 필터링 및 정렬
    const filteredPatients = patients.filter(patient => {
        // 복합 검색 필터링
        if (searchQuery) {
            return matchesComplexSearch(patient, searchQuery);
        }
        
        return true;
    }).sort((a, b) => {
        // 진료 완료된 환자는 맨 아래로
        const aId = String(a.id);
        const bId = String(b.id);
        if ((patientStatus[aId] || 'waiting') === 'completed' && (patientStatus[bId] || 'waiting') !== 'completed') return 1;
        if ((patientStatus[aId] || 'waiting') !== 'completed' && (patientStatus[bId] || 'waiting') === 'completed') return -1;
        
        // 시간 순서대로 정렬
        if (a.reservationTime && b.reservationTime) {
            return a.reservationTime.localeCompare(b.reservationTime);
        }
        return 0;
    });

    return (
        <div style={{ 
            background: "white", 
            borderRadius: "8px",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            height: "calc(100vh - 200px)",
            maxHeight: "800px"
        }}>
            <div style={{ 
                fontSize: "18px", 
                fontWeight: 700, 
                marginBottom: "16px",
                color: "#374151"
            }}>
                진료 대기
            </div>

            {!isHospitalOpen() ? (
                <div style={{
                    textAlign: "center",
                    padding: "40px 20px",
                    color: "#6b7280",
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                    <div style={{
                        fontSize: "18px",
                        fontWeight: 600,
                        color: "#6b7280",
                        marginBottom: "8px"
                    }}>
                        운영시간이 아닙니다
                    </div>
                    <div style={{
                        fontSize: "14px",
                        color: "#9ca3af"
                    }}>
                        운영시간: 09:00 - 18:00
                    </div>
                </div>
            ) : filteredPatients.length === 0 ? (
                <div style={{
                    textAlign: "center",
                    padding: "40px 20px",
                    color: "#6b7280",
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                    <div style={{
                        fontSize: "14px",
                        color: "#9ca3af"
                    }}>
                        대기 중인 환자가 없습니다
                    </div>
                </div>
            ) : (
                <div style={{ 
                    display: "grid",
                    gap: "12px",
                    overflowY: "auto",
                    flex: 1,
                    minHeight: 0
                }}>
                    {filteredPatients.map((patient, index) => {
                        const patientIdStr = String(patient.id);
                        const isCompleted = (patientStatus[patientIdStr] || 'waiting') === 'completed';
                        const cardBackground = isCompleted 
                            ? "#f8f9fa"
                            : patient.visitOrigin === "reservation" 
                                ? "#f0f8ff"
                                : undefined;

                        return (
                            <PatientCard
                                key={`${patient.id}-${index}`}
                                patientId={patient.patientId || patient.id}
                                name={patient.name}
                                age={patient.age}
                                visitType={patient.visitType}
                                chiefComplaint={patient.chiefComplaint}
                                status="WAITING"
                                reservationTime={patient.reservationTime}
                                layout="row"
                                style={{
                                    background: cardBackground,
                                    opacity: isCompleted ? 0.7 : 1,
                                    justifyContent: 'space-between'
                                }}
                            >
                                {isCompleted ? (
                                    <button style={{
                                        padding: "6px 12px",
                                        background: "#10b981",
                                        color: "white",
                                        border: "1px solid #d1d5db",
                                        borderRadius: "6px",
                                        fontSize: "12px",
                                        fontWeight: 500,
                                        cursor: "default"
                                    }}>
                                        완료
                                    </button>
                                ) : (
                                    <div style={{ display: "flex", gap: "8px" }}>
                                        <button 
                                            onClick={() => {
                                                // UnifiedPatient를 WaitingPatient 형식으로 변환
                                                const waitingPatient: WaitingPatient = {
                                                    id: typeof patient.id === 'number' ? patient.id : parseInt(String(patient.id)) || 0,
                                                    time: patient.reservationTime || '',
                                                    name: patient.name,
                                                    birthDate: patient.birthDate || '',
                                                    phone: patient.phone || '',
                                                    condition: patient.chiefComplaint,
                                                    visitType: patient.visitType,
                                                    alert: patient.alert,
                                                    alertType: patient.alertType,
                                                    buttonText: patient.buttonText || '진료 시작',
                                                    visitOrigin: patient.visitOrigin || 'walkin'
                                                };
                                                onStartTreatment(waitingPatient);
                                            }}
                                            style={{
                                                padding: "6px 12px",
                                                background: "#f3f4f6",
                                                color: "#374151",
                                                border: "1px solid #d1d5db",
                                                borderRadius: "6px",
                                                fontSize: "12px",
                                                fontWeight: 500,
                                                cursor: "pointer"
                                            }}
                                        >
                                            {patient.buttonText || "진료 시작"}
                                        </button>
                                        {patient.reservationTime && isPatientTimeReached(patient.reservationTime) && (
                                            <button 
                                                onClick={() => onCompleteTreatment(patientIdStr)}
                                                style={{
                                                    padding: "6px 12px",
                                                    background: "#3b82f6",
                                                    color: "white",
                                                    border: "1px solid #d1d5db",
                                                    borderRadius: "6px",
                                                    fontSize: "12px",
                                                    fontWeight: 500,
                                                    cursor: "pointer"
                                                }}
                                            >
                                                진료 완료
                                            </button>
                                        )}
                                    </div>
                                )}
                            </PatientCard>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
