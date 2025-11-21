/**
 * 알림 섹션 컴포넌트
 * 
 * 담당자: 이희창 (프론트엔드)
 * 
 * 주요 기능:
 * - 검사 완료 환자 알림 표시
 * - 환자 알림 클릭 시 대기 목록에 추가
 * - 상급병원 전원 필요 환자 알림
 * - 알림 제거 기능
 * 
 * 기술 스택:
 * - React + TypeScript
 * - 상태 관리 (useState)
 * - 환자 데이터 연동
 * 
 * 사용 위치:
 * - Dashboard 우측 패널
 * - 검사 완료 후 알림 표시
 */
import React, { useState } from 'react';
import { WaitingPatient } from '../../data/waitingPatientsData';
import { addVisitRecord, updatePatientInfo, getPatientHistory } from '../../data/patientHistoryData';

interface AlertsSectionProps {
    waitingPatients: WaitingPatient[];
    setWaitingPatients: React.Dispatch<React.SetStateAction<WaitingPatient[]>>;
}

export const AlertsSection: React.FC<AlertsSectionProps> = ({ waitingPatients, setWaitingPatients }) => {
    // 표시할 환자 알림 상태 관리
    const [visibleAlerts, setVisibleAlerts] = useState([
        { id: 1, name: "김지현", completedTime: "15:00", isVisible: true },
        { id: 2, name: "이지현", completedTime: "15:30", isVisible: true, needsTransfer: true },
        { id: 3, name: "박민수", completedTime: "16:00", isVisible: true }
    ]);

    // 환자 알림 클릭 핸들러
    const handlePatientAlertClick = (patientName: string, completedTime: string, alertId: number) => {
        // 이미 대기 목록에 있는 환자인지 확인
        const existingPatient = waitingPatients.find(patient => 
            patient.name === patientName && (patient.condition || '').includes("검사 완료")
        );

        if (existingPatient) {
            alert(`${patientName} 환자는 이미 대기 목록에 있습니다.`);
            return;
        }

        const currentTime = new Date().toLocaleTimeString('ko-KR', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });

        // 환자 ID 생성
        const patientId = Date.now();
        
        // 검사 종류에 따른 이전 방문 진단 및 증상 설정
        const getPreviousVisitInfo = (name: string) => {
            if (name === "이지현") {
                return {
                    diagnosis: "두통, 어지럼증",
                    symptoms: "두통과 어지럼증을 호소하여 CT 검사 및 혈액검사 오더",
                    testOrder: "CT 검사, 혈액검사"
                };
            } else if (name === "김지현") {
                return {
                    diagnosis: "피로감, 발열",
                    symptoms: "피로감과 발열 증상으로 혈액검사 오더",
                    testOrder: "혈액검사"
                };
            } else if (name === "박민수") {
                return {
                    diagnosis: "가슴 통증",
                    symptoms: "가슴 통증 호소로 X-ray 검사 오더",
                    testOrder: "X-ray 검사"
                };
            }
            return {
                diagnosis: "검사 필요",
                symptoms: "검사 오더",
                testOrder: "검사"
            };
        };
        
        const previousVisitInfo = getPreviousVisitInfo(patientName);
        
        // 이전 방문 내역 생성 (검사 오더한 날)
        const previousVisitDate = new Date();
        previousVisitDate.setDate(previousVisitDate.getDate() - 2); // 2일 전
        const previousDateStr = previousVisitDate.toISOString().split('T')[0];
        
        // 이전 방문 내역 추가 (검사 오더한 날) - 환자가 없으면 자동 생성됨
        addVisitRecord(patientId, {
            date: previousDateStr,
            visitType: "재진",
            diagnosis: previousVisitInfo.diagnosis,
            medicalRecord: {
                symptoms: previousVisitInfo.symptoms,
                diagnosis: previousVisitInfo.diagnosis,
                treatment: `${previousVisitInfo.testOrder} 오더 후 재방문 예정`
            },
            prescription: {
                medications: [],
                instructions: "검사 결과 확인 후 재방문"
            },
            staffMemo: `${previousVisitInfo.symptoms}. 검사 결과 확인 후 재진료 예정.`
        });
        
        // 환자 정보 업데이트 (addVisitRecord로 생성된 환자 정보 업데이트)
        updatePatientInfo(patientId, patientName, "1980-01-01", "010-0000-0000");
        
        // 새로운 대기 환자 객체 생성
        const newWaitingPatient: WaitingPatient = {
            id: patientId,
            time: currentTime,
            name: patientName,
            birthDate: "1980-01-01", // 기본값, 실제로는 환자 데이터에서 가져와야 함
            phone: "010-0000-0000", // 기본값, 실제로는 환자 데이터에서 가져와야 함
            condition: "검사 완료 - 재진료 필요",
            visitType: "재진",
            alert: patientName === "이지현" ? "상급병원 이송 필요" : null,
            alertType: patientName === "이지현" ? "AI 위험" : null,
            buttonText: "결과 보기",
            visitOrigin: "walkin",
            nurseInfo: {
                symptoms: "검사 완료 후 재진료 필요",
                notes: "",
                registeredBy: "AI 시스템",
                registeredAt: new Date().toISOString()
            },
            // 검사 완료 환자에게 검사 결과 추가
            prescriptionTests: patientName === "이지현" ? [
                {
                    testName: "CT 검사",
                    urgency: "urgent",
                    result: "뇌출혈 의심 소견"
                },
                {
                    testName: "혈액검사",
                    urgency: "urgent",
                    result: "WBC: 12,500/μL (정상: 4,000-10,000)"
                }
            ] : patientName === "김지현" ? [
                {
                    testName: "혈액검사",
                    urgency: "routine",
                    result: "WBC: 7,200/μL (정상 범위)"
                }
            ] : patientName === "박민수" ? [
                {
                    testName: "X-ray 검사",
                    urgency: "routine",
                    result: "정상 소견"
                }
            ] : undefined
        };

        // 대기 목록 최상단에 추가
        setWaitingPatients(prev => [newWaitingPatient, ...prev]);

        // 해당 알림을 숨김
        setVisibleAlerts(prev => prev.map(alert => 
            alert.id === alertId ? { ...alert, isVisible: false } : alert
        ));

        console.log(`${patientName} 환자가 대기 목록 최상단에 추가되었습니다.`);
        alert(`${patientName} 환자가 대기 목록 최상단에 추가되었습니다.`);
    };

    // 요약 항목 클릭 핸들러
    const handleSummaryClick = (type: string) => {
        console.log(`${type} 상세 목록을 확인합니다.`);
        alert(`${type} 상세 목록이 모달로 표시됩니다.`);
    };

    return (
        <div style={{ 
            background: "white", 
            borderRadius: "8px",
            padding: "16px",
            border: "1px solid #e5e7eb"
        }}>
            <div style={{ 
                fontSize: "16px", 
                fontWeight: 700, 
                marginBottom: "16px",
                color: "#374151",
                textAlign: "center"
            }}>
                미완료/최근알림
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {/* 검사 완료 환자 알림들 */}
                {visibleAlerts.filter(alert => alert.isVisible).map(alert => (
                    <div key={alert.id}>
                        <div 
                            onClick={() => handlePatientAlertClick(alert.name, alert.completedTime, alert.id)}
                            style={{ 
                                padding: "12px",
                                background: "#f9fafb",
                                border: "1px solid #e5e7eb",
                                borderRadius: "6px",
                                borderLeft: "4px solid #5D6D7E",
                                cursor: "pointer",
                                transition: "all 0.2s ease"
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = "#f3f4f6";
                                e.currentTarget.style.borderColor = "#d1d5db";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = "#f9fafb";
                                e.currentTarget.style.borderColor = "#e5e7eb";
                            }}
                        >
                            <div style={{ fontSize: "14px", color: "#374151", fontWeight: 500 }}>
                                {alert.name} 환자 (검사 완료)
                            </div>
                            {alert.needsTransfer && (
                                <div style={{ 
                                    fontSize: "12px", 
                                    color: "#dc2626", 
                                    fontWeight: 600,
                                    marginTop: "4px"
                                }}>
                                    상급병원 이송 필요
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {/* 요약 항목들 */}
                <div 
                    onClick={() => handleSummaryClick("미완료 노트")}
                    style={{ 
                        padding: "12px",
                        background: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "6px",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#f9fafb";
                        e.currentTarget.style.borderColor = "#d1d5db";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = "white";
                        e.currentTarget.style.borderColor = "#e5e7eb";
                    }}
                >
                    <div style={{ fontSize: "14px", color: "#374151" }}>
                        미완료 노트 - 2건
                    </div>
                    <div style={{ 
                        fontSize: "12px", 
                        color: "#6b7280",
                        background: "#f3f4f6",
                        padding: "4px 8px",
                        borderRadius: "4px"
                    }}>
                        보기
                    </div>
                </div>

                <div 
                    onClick={() => handleSummaryClick("검사 결과 대기")}
                    style={{ 
                        padding: "12px",
                        background: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "6px",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#f9fafb";
                        e.currentTarget.style.borderColor = "#d1d5db";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = "white";
                        e.currentTarget.style.borderColor = "#e5e7eb";
                    }}
                >
                    <div style={{ fontSize: "14px", color: "#374151" }}>
                        검사 결과 대기 - 1건
                    </div>
                    <div style={{ 
                        fontSize: "12px", 
                        color: "#6b7280",
                        background: "#f3f4f6",
                        padding: "4px 8px",
                        borderRadius: "4px"
                    }}>
                        보기
                    </div>
                </div>
            </div>
        </div>
    );
};
