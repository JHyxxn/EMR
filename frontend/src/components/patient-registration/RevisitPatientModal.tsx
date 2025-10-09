import React, { useState } from 'react';
import { Input, TextArea } from '../common';
import { revisitPatientsData } from '../../data/revisitPatientsData';

interface RevisitPatientModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddToWaitingList: (patientData: any) => void;
}

export const RevisitPatientModal: React.FC<RevisitPatientModalProps> = ({ 
    isOpen, 
    onClose, 
    onAddToWaitingList 
}) => {
    // 검색 상태
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPatient, setSelectedPatient] = useState<any>(null);
    
    // 간호사 정보 상태
    const [nurseInfo, setNurseInfo] = useState({
        symptoms: '',
        bloodPressureSystolic: '',
        bloodPressureDiastolic: '',
        notes: ''
    });

    // 환자 검색 결과
    const filteredPatients = revisitPatientsData.filter(patient => {
        if (!searchQuery) return false;
        
        const query = searchQuery.toLowerCase();
        return (
            patient.name.toLowerCase().includes(query) ||
            patient.birthDate.replace(/-/g, '').includes(query) ||
            patient.phone.replace(/-/g, '').includes(query)
        );
    }).slice(0, 5); // 최대 5개만 표시

    // 환자 선택 핸들러
    const handlePatientSelect = (patient: any) => {
        setSelectedPatient(patient);
        setSearchQuery(`${patient.name} (${patient.birthDate})`);
    };

    // 대기 목록에 추가 핸들러
    const handleAddToWaitingList = () => {
        if (!selectedPatient) return;

        const currentTime = new Date().toLocaleTimeString('ko-KR', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });

        const waitingPatient = {
            id: Date.now(), // 임시 ID
            time: currentTime,
            name: selectedPatient.name,
            birthDate: selectedPatient.birthDate,
            phone: selectedPatient.phone,
            condition: nurseInfo.symptoms,
            visitType: "재진",
            alert: null,
            alertType: null,
            buttonText: "진료 시작",
            visitOrigin: "walkin",
            nurseInfo: {
                symptoms: nurseInfo.symptoms,
                bloodPressure: nurseInfo.bloodPressureSystolic && nurseInfo.bloodPressureDiastolic ? {
                    systolic: parseInt(nurseInfo.bloodPressureSystolic),
                    diastolic: parseInt(nurseInfo.bloodPressureDiastolic),
                    measuredAt: new Date().toISOString()
                } : undefined,
                notes: nurseInfo.notes,
                registeredBy: "간호사",
                registeredAt: new Date().toISOString()
            }
        };

        onAddToWaitingList(waitingPatient);
        onClose();
        
        // 상태 초기화
        setSearchQuery('');
        setSelectedPatient(null);
        setNurseInfo({
            symptoms: '',
            bloodPressureSystolic: '',
            bloodPressureDiastolic: '',
            notes: ''
        });
    };

    if (!isOpen) return null;

    return (
        <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000
        }}>
            <div style={{
                background: "white",
                borderRadius: "12px",
                padding: "24px",
                maxWidth: "600px",
                width: "90%",
                maxHeight: "90vh",
                overflow: "auto",
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
            }}>
                {/* 모달 헤더 */}
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "24px",
                    borderBottom: "1px solid #e5e7eb",
                    paddingBottom: "16px"
                }}>
                    <h2 style={{
                        fontSize: "24px",
                        fontWeight: 700,
                        color: "#1f2937",
                        margin: 0
                    }}>
                        재진환자 등록
                    </h2>
                    <button
                        onClick={onClose}
                        style={{
                            background: "none",
                            border: "none",
                            fontSize: "24px",
                            cursor: "pointer",
                            color: "#6b7280",
                            padding: "4px"
                        }}
                    >
                        ×
                    </button>
                </div>

                {/* 환자 검색 섹션 */}
                <div style={{ marginBottom: "24px" }}>
                    <h3 style={{
                        fontSize: "18px",
                        fontWeight: 600,
                        marginBottom: "12px",
                        color: "#374151"
                    }}>
                        환자 검색
                    </h3>
                    <Input
                        placeholder="환자 이름, 생년월일, 전화번호로 검색"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    
                    {/* 검색 결과 */}
                    {searchQuery && filteredPatients.length > 0 && (
                        <div style={{
                            marginTop: "8px",
                            border: "1px solid #e5e7eb",
                            borderRadius: "8px",
                            maxHeight: "200px",
                            overflow: "auto"
                        }}>
                            {filteredPatients.map((patient, index) => (
                                <div
                                    key={`${patient.id}-${index}`}
                                    onClick={() => handlePatientSelect(patient)}
                                    style={{
                                        padding: "12px",
                                        borderBottom: index < filteredPatients.length - 1 ? "1px solid #f3f4f6" : "none",
                                        cursor: "pointer",
                                        backgroundColor: selectedPatient?.id === patient.id ? "#f3f4f6" : "white",
                                        borderRadius: index === 0 ? "8px 8px 0 0" : index === filteredPatients.length - 1 ? "0 0 8px 8px" : "0"
                                    }}
                                >
                                    <div style={{ fontWeight: 600, color: "#374151" }}>
                                        {patient.name}
                                    </div>
                                    <div style={{ fontSize: "14px", color: "#6b7280" }}>
                                        {patient.birthDate} | {patient.phone}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* 선택된 환자 정보 */}
                {selectedPatient && (
                    <div style={{
                        marginBottom: "24px",
                        padding: "16px",
                        backgroundColor: "#f9fafb",
                        borderRadius: "8px",
                        border: "1px solid #e5e7eb"
                    }}>
                        <h4 style={{
                            fontSize: "16px",
                            fontWeight: 600,
                            marginBottom: "8px",
                            color: "#374151"
                        }}>
                            선택된 환자
                        </h4>
                        <div style={{ fontSize: "14px", color: "#374151" }}>
                            <div><strong>이름:</strong> {selectedPatient.name}</div>
                            <div><strong>생년월일:</strong> {selectedPatient.birthDate}</div>
                            <div><strong>전화번호:</strong> {selectedPatient.phone}</div>
                        </div>
                    </div>
                )}

                {/* 간호사 정보 입력 */}
                {selectedPatient && (
                    <div style={{ marginBottom: "24px" }}>
                        <h3 style={{
                            fontSize: "18px",
                            fontWeight: 600,
                            marginBottom: "12px",
                            color: "#374151"
                        }}>
                            간호사 정보
                        </h3>
                        
                        {/* 증상 정보 */}
                        <div style={{ marginBottom: "16px" }}>
                            <label style={{
                                display: "block",
                                marginBottom: "4px",
                                fontSize: "14px",
                                fontWeight: 500,
                                color: "#374151"
                            }}>
                                오늘 어디가 아파서 오신건지?
                            </label>
                            <TextArea
                                placeholder="증상을 자세히 입력해주세요"
                                value={nurseInfo.symptoms}
                                onChange={(e) => setNurseInfo(prev => ({ ...prev, symptoms: e.target.value }))}
                                rows={3}
                            />
                        </div>

                        {/* 혈압 측정 */}
                        <div style={{ marginBottom: "16px" }}>
                            <label style={{
                                display: "block",
                                marginBottom: "4px",
                                fontSize: "14px",
                                fontWeight: 500,
                                color: "#374151"
                            }}>
                                혈압 측정
                            </label>
                            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                                <Input
                                    placeholder="수축기"
                                    value={nurseInfo.bloodPressureSystolic}
                                    onChange={(e) => setNurseInfo(prev => ({ ...prev, bloodPressureSystolic: e.target.value }))}
                                    style={{ width: "80px" }}
                                />
                                <span style={{ color: "#6b7280" }}>/</span>
                                <Input
                                    placeholder="이완기"
                                    value={nurseInfo.bloodPressureDiastolic}
                                    onChange={(e) => setNurseInfo(prev => ({ ...prev, bloodPressureDiastolic: e.target.value }))}
                                    style={{ width: "80px" }}
                                />
                                <span style={{ fontSize: "14px", color: "#6b7280" }}>mmHg</span>
                            </div>
                        </div>

                        {/* 간호사 노트 */}
                        <div style={{ marginBottom: "16px" }}>
                            <label style={{
                                display: "block",
                                marginBottom: "4px",
                                fontSize: "14px",
                                fontWeight: 500,
                                color: "#374151"
                            }}>
                                간호사 노트
                            </label>
                            <TextArea
                                placeholder="추가 메모를 입력해주세요"
                                value={nurseInfo.notes}
                                onChange={(e) => setNurseInfo(prev => ({ ...prev, notes: e.target.value }))}
                                rows={2}
                            />
                        </div>
                    </div>
                )}

                {/* 모달 푸터 */}
                <div style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "12px",
                    borderTop: "1px solid #e5e7eb",
                    paddingTop: "16px"
                }}>
                    <button
                        onClick={onClose}
                        style={{
                            padding: "10px 20px",
                            background: "#f3f4f6",
                            color: "#374151",
                            border: "1px solid #d1d5db",
                            borderRadius: "8px",
                            fontSize: "14px",
                            fontWeight: 500,
                            cursor: "pointer"
                        }}
                    >
                        취소
                    </button>
                    <button
                        onClick={handleAddToWaitingList}
                        disabled={!selectedPatient || !nurseInfo.symptoms}
                        style={{
                            padding: "10px 20px",
                            background: selectedPatient && nurseInfo.symptoms ? "#3b82f6" : "#d1d5db",
                            color: "white",
                            border: "1px solid #3b82f6",
                            borderRadius: "8px",
                            fontSize: "14px",
                            fontWeight: 500,
                            cursor: selectedPatient && nurseInfo.symptoms ? "pointer" : "not-allowed"
                        }}
                    >
                        대기 목록에 추가
                    </button>
                </div>
            </div>
        </div>
    );
};
