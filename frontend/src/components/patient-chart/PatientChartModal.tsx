import React, { useState, useEffect } from 'react';
import { WaitingPatient } from '../../data/waitingPatientsData';
import { RevisitPatient } from '../../data/revisitPatientsData';
import { getPatientHistory, addVisitRecord, updatePatientInfo, PatientHistory } from '../../data/patientHistoryData';


interface PatientChartModalProps {
    patient: WaitingPatient;
    isOpen: boolean;
    onClose: () => void;
    onSave: (chartData: any) => void;
    setPrescriptions: React.Dispatch<React.SetStateAction<Array<{
        id: string;
        patientName: string;
        patientId: string;
        prescriptions: Array<{
            medication: string;
            dosage: string;
            frequency: string;
            duration: string;
        }>;
        tests: Array<{
            testName: string;
            urgency: 'routine' | 'urgent';
        }>;
        nextVisit?: string;
        notes: string;
        revisitRecommendation: string;
        createdAt: string;
    }>>>;
}

interface SOAPRecord {
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
}

interface ChartData {
    patientId: number;
    visitDate: string;
    soap: SOAPRecord;
    prescriptions: Array<{
        medication: string;
        dosage: string;
        frequency: string;
        duration: string;
    }>;
    tests: Array<{
        testName: string;
        urgency: 'routine' | 'urgent';
    }>;
    nextVisit: string;
    notes: string;
    testNotes: string;
    revisitRecommendation: string;
    nurseInfo?: {
        symptoms: string;
        bloodPressure: string | {
            systolic: number;
            diastolic: number;
            measuredAt: string;
        };
        notes: string;
    };
}

export const PatientChartModal: React.FC<PatientChartModalProps> = ({
    patient,
    isOpen,
    onClose,
    onSave,
    setPrescriptions
}) => {
    const [chartData, setChartData] = useState<ChartData>({
        patientId: patient.id,
        visitDate: new Date().toISOString().split('T')[0],
        soap: {
            subjective: '',
            objective: '',
            assessment: '',
            plan: ''
        },
        prescriptions: [],
        tests: [],
        nextVisit: '',
        notes: '',
        testNotes: '',
        revisitRecommendation: '',
        nurseInfo: patient.nurseInfo || {
            symptoms: '',
            bloodPressure: '',
            notes: ''
        }
    });

    const [activeTab, setActiveTab] = useState<'chart' | 'prescription' | 'test'>('chart');
    const [expandedVisits, setExpandedVisits] = useState<Set<string>>(new Set());
    const [patientHistory, setPatientHistory] = useState<PatientHistory | undefined>(undefined);

    // AI 제안 내용 생성
    const generateAISuggestions = () => {
        const suggestions = {
            subjective: `${patient.condition} 관련 증상 문진, 약물 복용 순응도 확인`,
            objective: `혈압 측정, 맥박 측정, 체온 측정, 전반적 상태 관찰`,
            assessment: `${patient.condition} 상태 평가, 합병증 위험도 판정`,
            plan: `${patient.condition} 치료 계획, 생활습관 개선 교육, 다음 방문 일정`
        };

        setChartData(prev => ({
            ...prev,
            soap: suggestions
        }));
    };

    useEffect(() => {
        if (isOpen) {
            generateAISuggestions();
            // 환자 내역 로드
            const history = getPatientHistory(patient.id);
            setPatientHistory(history);
        }
    }, [isOpen, patient]);

    const handleSave = () => {
        // 환자 정보 업데이트
        updatePatientInfo(patient.id, patient.name, patient.birthDate, patient.phone);
        
        // 기존 환자 내역에서 오늘 방문 기록 찾기
        const existingHistory = getPatientHistory(patient.id);
        const today = new Date().toISOString().split('T')[0];
        
        if (existingHistory) {
            // 오늘 방문 기록이 있는지 확인
            const todayVisitIndex = existingHistory.visits.findIndex(visit => visit.date === today);
            
            if (todayVisitIndex !== -1) {
                // 기존 오늘 방문 기록 업데이트
                existingHistory.visits[todayVisitIndex] = {
                    ...existingHistory.visits[todayVisitIndex],
                    medicalRecord: {
                        symptoms: chartData.soap.subjective,
                        diagnosis: chartData.soap.assessment,
                        treatment: chartData.soap.plan
                    },
                    prescription: {
                        medications: chartData.prescriptions.map(p => ({
                            name: p.medication,
                            dosage: p.dosage,
                            frequency: p.frequency
                        })),
                        instructions: chartData.revisitRecommendation || "의사의 지시에 따라 복용"
                    },
                    staffMemo: chartData.notes || "진료 완료"
                };
            } else {
                // 새로운 오늘 방문 기록 추가
                const todayVisitRecord = {
                    visitType: patient.visitType as '초진' | '재진',
                    diagnosis: patient.condition,
                    medicalRecord: {
                        symptoms: chartData.soap.subjective,
                        diagnosis: chartData.soap.assessment,
                        treatment: chartData.soap.plan
                    },
                    prescription: {
                        medications: chartData.prescriptions.map(p => ({
                            name: p.medication,
                            dosage: p.dosage,
                            frequency: p.frequency
                        })),
                        instructions: chartData.revisitRecommendation || "의사의 지시에 따라 복용"
                    },
                    staffMemo: chartData.notes || "진료 완료",
                    nurseInfo: chartData.nurseInfo
                };
                
                addVisitRecord(patient.id, todayVisitRecord);
            }
        } else {
            // 환자 내역이 없는 경우 새로 생성
            const todayVisitRecord = {
                visitType: patient.visitType as '초진' | '재진',
                diagnosis: patient.condition,
                medicalRecord: {
                    symptoms: chartData.soap.subjective,
                    diagnosis: chartData.soap.assessment,
                    treatment: chartData.soap.plan
                },
                prescription: {
                    medications: chartData.prescriptions.map(p => ({
                        name: p.medication,
                        dosage: p.dosage,
                        frequency: p.frequency
                    })),
                    instructions: chartData.revisitRecommendation || "의사의 지시에 따라 복용"
                },
                staffMemo: chartData.notes || "진료 완료",
                nurseInfo: chartData.nurseInfo
            };
            
            addVisitRecord(patient.id, todayVisitRecord);
        }
        
        // 환자 내역 상태 업데이트
        const updatedHistory = getPatientHistory(patient.id);
        setPatientHistory(updatedHistory);
        
        // 처방/오더 데이터를 홈 대시보드에 저장
        if (chartData.prescriptions.length > 0 || chartData.tests.length > 0 || chartData.revisitRecommendation) {
            const newPrescription = {
                id: Date.now().toString(),
                patientName: patient.name,
                patientId: patient.id.toString(),
                prescriptions: chartData.prescriptions,
                tests: chartData.tests,
                nextVisit: chartData.nextVisit,
                notes: chartData.notes,
                revisitRecommendation: chartData.revisitRecommendation,
                createdAt: new Date().toISOString()
            };
            setPrescriptions(prev => [...prev, newPrescription]);
        }
        
        onSave(chartData);
        onClose();
    };

    const handleTemporarySave = () => {
        // 임시 저장 로직
        console.log('임시 저장:', chartData);
    };

    const toggleVisitExpansion = (visitDate: string) => {
        const newExpanded = new Set(expandedVisits);
        if (newExpanded.has(visitDate)) {
            newExpanded.delete(visitDate);
        } else {
            newExpanded.add(visitDate);
        }
        setExpandedVisits(newExpanded);
    };

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
        }}>
            <div style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                width: '90%',
                maxWidth: '1200px',
                height: '80%',
                maxHeight: '800px',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
            }}>
                {/* 헤더 */}
                <div style={{
                    padding: '16px 24px',
                    borderBottom: '1px solid #e5e7eb',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <h2 style={{
                        margin: 0,
                        fontSize: '18px',
                        fontWeight: 600,
                        color: '#374151'
                    }}>
                        {patient.name} (MRN{patient.id.toString().padStart(6, '0')}) - 진료 차트
                    </h2>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '20px',
                            cursor: 'pointer',
                            color: '#6b7280'
                        }}
                    >
                        ×
                    </button>
                </div>

                {/* 메인 콘텐츠 */}
                <div style={{
                    flex: 1,
                    display: 'flex',
                    overflow: 'hidden'
                }}>
                    {/* 왼쪽 - 이전 방문 내역 */}
                    <div style={{
                        width: '40%',
                        borderRight: '1px solid #e5e7eb',
                        padding: '20px',
                        overflowY: 'auto'
                    }}>
                        <h3 style={{
                            margin: '0 0 16px 0',
                            fontSize: '16px',
                            fontWeight: 600,
                            color: '#374151'
                        }}>
                            이전 방문 내역
                        </h3>
                        
                        {/* 환자 기본 정보 */}
                        <div style={{
                            backgroundColor: '#f9fafb',
                            padding: '12px',
                            borderRadius: '6px',
                            marginBottom: '16px'
                        }}>
                            <div style={{ marginBottom: '8px' }}>
                                <strong>생년월일:</strong> {patient.birthDate} ({new Date().getFullYear() - new Date(patient.birthDate).getFullYear()}세)
                            </div>
                            <div style={{ marginBottom: '8px' }}>
                                <strong>전화번호:</strong> {patient.phone}
                            </div>
                            <div>
                                <strong>방문 유형:</strong> {patient.visitType}
                            </div>
                        </div>

                        {/* 이전 방문 목록 */}
                        <div>
                            {patientHistory ? (
                                patientHistory.visits.map((visit) => (
                                    <div key={visit.date}>
                                        {/* 방문 날짜 헤더 */}
                                        <div 
                                            onClick={() => toggleVisitExpansion(visit.date)}
                                            style={{
                                                padding: '12px',
                                                border: '1px solid #e5e7eb',
                                                borderRadius: '6px',
                                                marginBottom: '0px',
                                                backgroundColor: '#f9fafb',
                                                cursor: 'pointer',
                                                transition: 'background-color 0.2s'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                                        >
                                            <div style={{ fontWeight: 600, marginBottom: '4px' }}>
                                                {visit.date} - {visit.visitType}
                                            </div>
                                            <div style={{ fontSize: '14px', color: '#6b7280' }}>
                                                {visit.diagnosis}
                                            </div>
                                        </div>
                                        
                                        {/* 펼쳐진 상세 내용 */}
                                        {expandedVisits.has(visit.date) && (
                                            <div style={{
                                                padding: '12px',
                                                backgroundColor: '#fefefe',
                                                border: '1px solid #e5e7eb',
                                                borderTop: 'none',
                                                borderRadius: '0 0 6px 6px',
                                                marginBottom: '8px'
                                            }}>
                                                <div style={{ marginBottom: '12px' }}>
                                                    <div style={{ fontWeight: 600, marginBottom: '4px', color: '#374151' }}>
                                                        진료기록:
                                                    </div>
                                                    <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>
                                                        - 증상: {visit.medicalRecord.symptoms}
                                                    </div>
                                                    <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>
                                                        - 진단: {visit.medicalRecord.diagnosis}
                                                    </div>
                                                    <div style={{ fontSize: '13px', color: '#6b7280' }}>
                                                        - 처치: {visit.medicalRecord.treatment}
                                                    </div>
                                                </div>
                                                
                                                <div>
                                                    <div style={{ fontWeight: 600, marginBottom: '4px', color: '#374151' }}>
                                                        처방내역:
                                                    </div>
                                                    {visit.prescription.medications.length > 0 ? (
                                                        visit.prescription.medications.map((med, index) => (
                                                            <div key={index} style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>
                                                                - 약물: {med.name} {med.dosage} {med.frequency}
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>
                                                            - 약물: 없음
                                                        </div>
                                                    )}
                                                    <div style={{ fontSize: '13px', color: '#6b7280' }}>
                                                        - 복용법: {visit.prescription.instructions}
                                                    </div>
                                                </div>
                                                
                                                <div style={{ marginTop: '12px' }}>
                                                    <div style={{ fontWeight: 600, marginBottom: '4px', color: '#374151' }}>
                                                        의료진 메모:
                                                    </div>
                                                    <div style={{ fontSize: '13px', color: '#6b7280' }}>
                                                        {visit.staffMemo}
                                                    </div>
                                                </div>
                                                
                                                {/* 간호사 정보가 있는 경우 표시 */}
                                                {visit.nurseInfo && (
                                                    <div style={{ marginTop: '12px' }}>
                                                        <div style={{ fontWeight: 600, marginBottom: '4px', color: '#374151' }}>
                                                            간호사 등록 정보:
                                                        </div>
                                                        {visit.nurseInfo.symptoms && (
                                                            <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '2px' }}>
                                                                - 증상: {visit.nurseInfo.symptoms}
                                                            </div>
                                                        )}
                                                        {visit.nurseInfo.bloodPressure && (
                                                            <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '2px' }}>
                                                                - 혈압: {
                                                                    typeof visit.nurseInfo.bloodPressure === 'string' 
                                                                        ? visit.nurseInfo.bloodPressure 
                                                                        : `${visit.nurseInfo.bloodPressure.systolic}/${visit.nurseInfo.bloodPressure.diastolic}`
                                                                }
                                                            </div>
                                                        )}
                                                        {visit.nurseInfo.notes && (
                                                            <div style={{ fontSize: '13px', color: '#6b7280' }}>
                                                                - 노트: {visit.nurseInfo.notes}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div style={{
                                    padding: '12px',
                                    textAlign: 'center',
                                    color: '#6b7280',
                                    fontSize: '14px'
                                }}>
                                    이전 방문 내역이 없습니다.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 오른쪽 - 오늘 진료 기록 */}
                    <div style={{
                        width: '55%',
                        padding: '16px',
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        {/* 탭 */}
                        <div style={{
                            display: 'flex',
                            borderBottom: '1px solid #e5e7eb',
                            marginBottom: '16px'
                        }}>
                            <button
                                onClick={() => setActiveTab('chart')}
                                style={{
                                    padding: '8px 16px',
                                    border: 'none',
                                    background: activeTab === 'chart' ? '#3b82f6' : 'transparent',
                                    color: activeTab === 'chart' ? 'white' : '#6b7280',
                                    cursor: 'pointer',
                                    borderBottom: activeTab === 'chart' ? '2px solid #3b82f6' : 'none'
                                }}
                            >
                                진료 기록
                            </button>
                            <button
                                onClick={() => setActiveTab('prescription')}
                                style={{
                                    padding: '8px 16px',
                                    border: 'none',
                                    background: activeTab === 'prescription' ? '#3b82f6' : 'transparent',
                                    color: activeTab === 'prescription' ? 'white' : '#6b7280',
                                    cursor: 'pointer',
                                    borderBottom: activeTab === 'prescription' ? '2px solid #3b82f6' : 'none'
                                }}
                            >
                                처방
                            </button>
                            <button
                                onClick={() => setActiveTab('test')}
                                style={{
                                    padding: '8px 16px',
                                    border: 'none',
                                    background: activeTab === 'test' ? '#3b82f6' : 'transparent',
                                    color: activeTab === 'test' ? 'white' : '#6b7280',
                                    cursor: 'pointer',
                                    borderBottom: activeTab === 'test' ? '2px solid #3b82f6' : 'none'
                                }}
                            >
                                검사
                            </button>
                        </div>

                        {/* 탭 콘텐츠 */}
                        {activeTab === 'chart' && (
                            <div style={{ flex: 1, overflowY: 'auto' }}>
                                {/* 간호사 등록 정보 */}
                                {chartData.nurseInfo && (chartData.nurseInfo.symptoms || chartData.nurseInfo.bloodPressure || chartData.nurseInfo.notes) && (
                                    <div style={{
                                        backgroundColor: '#f0f9ff',
                                        border: '1px solid #0ea5e9',
                                        borderRadius: '8px',
                                        padding: '16px',
                                        marginBottom: '20px'
                                    }}>
                                        <h4 style={{
                                            margin: '0 0 12px 0',
                                            fontSize: '14px',
                                            fontWeight: 600,
                                            color: '#0c4a6e'
                                        }}>
                                            간호사 등록 정보
                                        </h4>
                                        
                                        {chartData.nurseInfo.symptoms && (
                                            <div style={{ marginBottom: '8px' }}>
                                                <span style={{ fontWeight: 600, color: '#0c4a6e', fontSize: '13px' }}>증상: </span>
                                                <span style={{ fontSize: '13px', color: '#374151' }}>{chartData.nurseInfo.symptoms}</span>
                                            </div>
                                        )}
                                        
                                        {chartData.nurseInfo.bloodPressure && (
                                            <div style={{ marginBottom: '8px' }}>
                                                <span style={{ fontWeight: 600, color: '#0c4a6e', fontSize: '13px' }}>혈압: </span>
                                                <span style={{ fontSize: '13px', color: '#374151' }}>
                                                    {typeof chartData.nurseInfo.bloodPressure === 'string' 
                                                        ? chartData.nurseInfo.bloodPressure 
                                                        : `${chartData.nurseInfo.bloodPressure.systolic}/${chartData.nurseInfo.bloodPressure.diastolic}`
                                                    }
                                                </span>
                                            </div>
                                        )}
                                        
                                        {chartData.nurseInfo.notes && (
                                            <div>
                                                <span style={{ fontWeight: 600, color: '#0c4a6e', fontSize: '13px' }}>노트: </span>
                                                <span style={{ fontSize: '13px', color: '#374151' }}>{chartData.nurseInfo.notes}</span>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <h3 style={{
                                    margin: '0 0 16px 0',
                                    fontSize: '16px',
                                    fontWeight: 600,
                                    color: '#374151'
                                }}>
                                    SOAP 진료 기록
                                </h3>

                                {/* S - Subjective */}
                                <div style={{ marginBottom: '12px' }}>
                                    <label style={{
                                        display: 'block',
                                        fontWeight: 600,
                                        marginBottom: '6px',
                                        color: '#374151'
                                    }}>
                                        S (Subjective) - 주관적 증상
                                    </label>
                                    <textarea
                                        value={chartData.soap.subjective}
                                        onChange={(e) => setChartData(prev => ({
                                            ...prev,
                                            soap: { ...prev.soap, subjective: e.target.value }
                                        }))}
                                        style={{
                                            width: '100%',
                                            minHeight: '80px',
                                            height: '80px',
                                            padding: '20px',
                                            border: '1px solid #d1d5db',
                                            borderRadius: '4px',
                                            resize: 'none',
                                            boxSizing: 'border-box'
                                        }}
                                        placeholder="환자의 주관적 증상을 입력하세요..."
                                    />
                                </div>

                                {/* O - Objective */}
                                <div style={{ marginBottom: '12px' }}>
                                    <label style={{
                                        display: 'block',
                                        fontWeight: 600,
                                        marginBottom: '6px',
                                        color: '#374151'
                                    }}>
                                        O (Objective) - 객관적 소견
                                    </label>
                                    <textarea
                                        value={chartData.soap.objective}
                                        onChange={(e) => setChartData(prev => ({
                                            ...prev,
                                            soap: { ...prev.soap, objective: e.target.value }
                                        }))}
                                        style={{
                                            width: '100%',
                                            minHeight: '80px',
                                            height: '80px',
                                            padding: '20px',
                                            border: '1px solid #d1d5db',
                                            borderRadius: '4px',
                                            resize: 'none',
                                            boxSizing: 'border-box'
                                        }}
                                        placeholder="의사의 진찰 소견을 입력하세요..."
                                    />
                                </div>

                                {/* A - Assessment */}
                                <div style={{ marginBottom: '12px' }}>
                                    <label style={{
                                        display: 'block',
                                        fontWeight: 600,
                                        marginBottom: '6px',
                                        color: '#374151'
                                    }}>
                                        A (Assessment) - 평가
                                    </label>
                                    <textarea
                                        value={chartData.soap.assessment}
                                        onChange={(e) => setChartData(prev => ({
                                            ...prev,
                                            soap: { ...prev.soap, assessment: e.target.value }
                                        }))}
                                        style={{
                                            width: '100%',
                                            minHeight: '80px',
                                            height: '80px',
                                            padding: '20px',
                                            border: '1px solid #d1d5db',
                                            borderRadius: '4px',
                                            resize: 'none',
                                            boxSizing: 'border-box'
                                        }}
                                        placeholder="진단 및 평가를 입력하세요..."
                                    />
                                </div>

                                {/* P - Plan */}
                                <div style={{ marginBottom: '12px' }}>
                                    <label style={{
                                        display: 'block',
                                        fontWeight: 600,
                                        marginBottom: '6px',
                                        color: '#374151'
                                    }}>
                                        P (Plan) - 계획
                                    </label>
                                    <textarea
                                        value={chartData.soap.plan}
                                        onChange={(e) => setChartData(prev => ({
                                            ...prev,
                                            soap: { ...prev.soap, plan: e.target.value }
                                        }))}
                                        style={{
                                            width: '100%',
                                            minHeight: '80px',
                                            height: '80px',
                                            padding: '20px',
                                            border: '1px solid #d1d5db',
                                            borderRadius: '4px',
                                            resize: 'none',
                                            boxSizing: 'border-box'
                                        }}
                                        placeholder="치료 계획을 입력하세요..."
                                    />
                                </div>

                                {/* 처방/오더 보드 */}
                                <div style={{ marginBottom: '12px' }}>
                                    <label style={{
                                        display: 'block',
                                        fontWeight: 600,
                                        marginBottom: '8px',
                                        color: '#374151'
                                    }}>
                                        처방/오더 보드
                                    </label>
                                    <div style={{
                                        padding: '12px',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '4px',
                                        backgroundColor: '#f9fafb',
                                        minHeight: '60px'
                                    }}>
                                        <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
                                            처방 및 검사 오더는 아래 탭에서 입력하세요.
                                        </div>
                                        <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                                            저장 시 홈 대시보드의 "당일 처방/오더보드"에 표시됩니다.
                                        </div>
                                    </div>
                                </div>

                                {/* 메모 */}
                                <div style={{ marginBottom: '12px' }}>
                                    <label style={{
                                        display: 'block',
                                        fontWeight: 600,
                                        marginBottom: '8px',
                                        color: '#374151'
                                    }}>
                                        추가 메모
                                    </label>
                                    <textarea
                                        value={chartData.notes}
                                        onChange={(e) => setChartData(prev => ({
                                            ...prev,
                                            notes: e.target.value
                                        }))}
                                        style={{
                                            width: '100%',
                                            minHeight: '60px',
                                            height: '60px',
                                            padding: '16px',
                                            border: '1px solid #d1d5db',
                                            borderRadius: '4px',
                                            resize: 'none',
                                            boxSizing: 'border-box'
                                        }}
                                        placeholder="추가 메모를 입력하세요..."
                                    />
                                </div>
                            </div>
                        )}

                        {activeTab === 'prescription' && (
                            <div style={{ flex: 1, overflowY: 'auto' }}>
                                <h3 style={{
                                    margin: '0 0 16px 0',
                                    fontSize: '16px',
                                    fontWeight: 600,
                                    color: '#374151'
                                }}>
                                    처방
                                </h3>
                                
                                {/* 처방 목록 */}
                                <div style={{ marginBottom: '16px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                        <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#374151' }}>
                                            처방 약물
                                        </h4>
                                        <button
                                            onClick={() => setChartData(prev => ({
                                                ...prev,
                                                prescriptions: [...prev.prescriptions, {
                                                    medication: '',
                                                    dosage: '',
                                                    frequency: '',
                                                    duration: ''
                                                }]
                                            }))}
                                            style={{
                                                padding: '6px 12px',
                                                background: '#3b82f6',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '4px',
                                                fontSize: '12px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            + 약물 추가
                                        </button>
                                    </div>
                                    
                                    {chartData.prescriptions.map((prescription, index) => (
                                        <div key={index} style={{
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '6px',
                                            padding: '8px',
                                            marginBottom: '16px',
                                            backgroundColor: '#f9fafb',
                                            width: '100%',
                                            boxSizing: 'border-box'
                                        }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                                <span style={{ fontSize: '14px', fontWeight: 600, color: '#374151' }}>
                                                    약물 {index + 1}
                                                </span>
                                                <button
                                                    onClick={() => setChartData(prev => ({
                                                        ...prev,
                                                        prescriptions: prev.prescriptions.filter((_, i) => i !== index)
                                                    }))}
                                                    style={{
                                                        background: 'none',
                                                        border: 'none',
                                                        color: '#ef4444',
                                                        cursor: 'pointer',
                                                        fontSize: '14px'
                                                    }}
                                                >
                                                    ×
                                                </button>
                                            </div>
                                            
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
                                                <div>
                                                    <label style={{ fontSize: '12px', color: '#6b7280', display: 'block', marginBottom: '4px' }}>
                                                        약물명
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={prescription.medication}
                                                        onChange={(e) => {
                                                            const newPrescriptions = [...chartData.prescriptions];
                                                            newPrescriptions[index].medication = e.target.value;
                                                            setChartData(prev => ({
                                                                ...prev,
                                                                prescriptions: newPrescriptions
                                                            }));
                                                        }}
                                                        style={{
                                                            width: '100%',
                                                            padding: '6px',
                                                            border: '1px solid #d1d5db',
                                                            borderRadius: '4px',
                                                            fontSize: '12px',
                                                            boxSizing: 'border-box'
                                                        }}
                                                        placeholder="예: Metformin"
                                                    />
                                                </div>
                                                <div>
                                                    <label style={{ fontSize: '12px', color: '#6b7280', display: 'block', marginBottom: '4px' }}>
                                                        용량
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={prescription.dosage}
                                                        onChange={(e) => {
                                                            const newPrescriptions = [...chartData.prescriptions];
                                                            newPrescriptions[index].dosage = e.target.value;
                                                            setChartData(prev => ({
                                                                ...prev,
                                                                prescriptions: newPrescriptions
                                                            }));
                                                        }}
                                                        style={{
                                                            width: '100%',
                                                            padding: '6px',
                                                            border: '1px solid #d1d5db',
                                                            borderRadius: '4px',
                                                            fontSize: '12px',
                                                            boxSizing: 'border-box'
                                                        }}
                                                        placeholder="예: 500mg"
                                                    />
                                                </div>
                                                <div>
                                                    <label style={{ fontSize: '12px', color: '#6b7280', display: 'block', marginBottom: '4px' }}>
                                                        복용법
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={prescription.frequency}
                                                        onChange={(e) => {
                                                            const newPrescriptions = [...chartData.prescriptions];
                                                            newPrescriptions[index].frequency = e.target.value;
                                                            setChartData(prev => ({
                                                                ...prev,
                                                                prescriptions: newPrescriptions
                                                            }));
                                                        }}
                                                        style={{
                                                            width: '100%',
                                                            padding: '6px',
                                                            border: '1px solid #d1d5db',
                                                            borderRadius: '4px',
                                                            fontSize: '12px',
                                                            boxSizing: 'border-box'
                                                        }}
                                                        placeholder="예: 1T bid"
                                                    />
                                                </div>
                                                <div>
                                                    <label style={{ fontSize: '12px', color: '#6b7280', display: 'block', marginBottom: '4px' }}>
                                                        기간
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={prescription.duration}
                                                        onChange={(e) => {
                                                            const newPrescriptions = [...chartData.prescriptions];
                                                            newPrescriptions[index].duration = e.target.value;
                                                            setChartData(prev => ({
                                                                ...prev,
                                                                prescriptions: newPrescriptions
                                                            }));
                                                        }}
                                                        style={{
                                                            width: '100%',
                                                            padding: '6px',
                                                            border: '1px solid #d1d5db',
                                                            borderRadius: '4px',
                                                            fontSize: '12px',
                                                            boxSizing: 'border-box'
                                                        }}
                                                        placeholder="예: 30일"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                
                                {/* 재방문 권고사항 */}
                                <div style={{ marginBottom: '12px' }}>
                                    <label style={{
                                        display: 'block',
                                        fontWeight: 600,
                                        marginBottom: '8px',
                                        color: '#374151'
                                    }}>
                                        재방문 권고사항
                                    </label>
                                    <textarea
                                        value={chartData.revisitRecommendation}
                                        onChange={(e) => setChartData(prev => ({
                                            ...prev,
                                            revisitRecommendation: e.target.value
                                        }))}
                                        style={{
                                            width: '100%',
                                            minHeight: '60px',
                                            height: '60px',
                                            padding: '16px',
                                            border: '1px solid #d1d5db',
                                            borderRadius: '4px',
                                            resize: 'none',
                                            boxSizing: 'border-box'
                                        }}
                                        placeholder="예: 3개월 뒤 재방문 권고, 혈당 관리 상태 확인 필요..."
                                    />
                                </div>
                                

                            </div>
                        )}

                        {activeTab === 'test' && (
                            <div style={{ flex: 1, overflowY: 'auto' }}>
                                <h3 style={{
                                    margin: '0 0 16px 0',
                                    fontSize: '16px',
                                    fontWeight: 600,
                                    color: '#374151'
                                }}>
                                    검사 오더
                                </h3>
                                
                                {/* 검사 목록 */}
                                <div style={{ marginBottom: '16px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                        <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#374151' }}>
                                            검사 항목
                                        </h4>
                                        <button
                                            onClick={() => setChartData(prev => ({
                                                ...prev,
                                                tests: [...prev.tests, {
                                                    testName: '',
                                                    urgency: 'routine'
                                                }]
                                            }))}
                                            style={{
                                                padding: '6px 12px',
                                                background: '#3b82f6',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '4px',
                                                fontSize: '12px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            + 검사 추가
                                        </button>
                                    </div>
                                    
                                    {chartData.tests.map((test, index) => (
                                        <div key={index} style={{
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '6px',
                                            padding: '8px',
                                            marginBottom: '16px',
                                            backgroundColor: '#f9fafb',
                                            width: '100%',
                                            boxSizing: 'border-box'
                                        }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                                <span style={{ fontSize: '14px', fontWeight: 600, color: '#374151' }}>
                                                    검사 {index + 1}
                                                </span>
                                                <button
                                                    onClick={() => setChartData(prev => ({
                                                        ...prev,
                                                        tests: prev.tests.filter((_, i) => i !== index)
                                                    }))}
                                                    style={{
                                                        background: 'none',
                                                        border: 'none',
                                                        color: '#ef4444',
                                                        cursor: 'pointer',
                                                        fontSize: '14px'
                                                    }}
                                                >
                                                    ×
                                                </button>
                                            </div>
                                            
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
                                                <div>
                                                    <label style={{ fontSize: '12px', color: '#6b7280', display: 'block', marginBottom: '4px' }}>
                                                        검사명
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={test.testName}
                                                        onChange={(e) => {
                                                            const newTests = [...chartData.tests];
                                                            newTests[index].testName = e.target.value;
                                                            setChartData(prev => ({
                                                                ...prev,
                                                                tests: newTests
                                                            }));
                                                        }}
                                                        style={{
                                                            width: '100%',
                                                            padding: '6px',
                                                            border: '1px solid #d1d5db',
                                                            borderRadius: '4px',
                                                            fontSize: '12px',
                                                            boxSizing: 'border-box'
                                                        }}
                                                        placeholder="예: 혈액검사"
                                                    />
                                                </div>
                                                <div>
                                                    <label style={{ fontSize: '12px', color: '#6b7280', display: 'block', marginBottom: '4px' }}>
                                                        긴급도
                                                    </label>
                                                    <select
                                                        value={test.urgency}
                                                        onChange={(e) => {
                                                            const newTests = [...chartData.tests];
                                                            newTests[index].urgency = e.target.value as 'routine' | 'urgent';
                                                            setChartData(prev => ({
                                                                ...prev,
                                                                tests: newTests
                                                            }));
                                                        }}
                                                        style={{
                                                            width: '100%',
                                                            padding: '6px',
                                                            border: '1px solid #d1d5db',
                                                            borderRadius: '4px',
                                                            fontSize: '12px',
                                                            boxSizing: 'border-box'
                                                        }}
                                                    >
                                                        <option value="routine">일반</option>
                                                        <option value="urgent">긴급</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                
                                {/* 검사 관련 메모 */}
                                <div style={{ marginBottom: '12px' }}>
                                    <label style={{
                                        display: 'block',
                                        fontWeight: 600,
                                        marginBottom: '8px',
                                        color: '#374151'
                                    }}>
                                        검사 관련 메모
                                    </label>
                                    <textarea
                                        value={chartData.testNotes}
                                        onChange={(e) => setChartData(prev => ({
                                            ...prev,
                                            testNotes: e.target.value
                                        }))}
                                        style={{
                                            width: '100%',
                                            minHeight: '60px',
                                            height: '60px',
                                            padding: '16px',
                                            border: '1px solid #d1d5db',
                                            borderRadius: '4px',
                                            resize: 'none',
                                            boxSizing: 'border-box'
                                        }}
                                        placeholder="검사 관련 특별 지시사항이나 메모를 입력하세요..."
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* 하단 버튼 */}
                <div style={{
                    padding: '16px 24px',
                    borderTop: '1px solid #e5e7eb',
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: '8px'
                }}>
                    <button
                        onClick={handleTemporarySave}
                        style={{
                            padding: '8px 16px',
                            border: '1px solid #d1d5db',
                            borderRadius: '4px',
                            background: 'white',
                            color: '#374151',
                            cursor: 'pointer'
                        }}
                    >
                        임시저장
                    </button>
                    <button
                        onClick={handleSave}
                        style={{
                            padding: '8px 16px',
                            border: '1px solid #3b82f6',
                            borderRadius: '4px',
                            background: '#3b82f6',
                            color: 'white',
                            cursor: 'pointer'
                        }}
                    >
                        저장
                    </button>
                    <button
                        onClick={onClose}
                        style={{
                            padding: '8px 16px',
                            border: '1px solid #d1d5db',
                            borderRadius: '4px',
                            background: 'white',
                            color: '#374151',
                            cursor: 'pointer'
                        }}
                    >
                        닫기
                    </button>
                </div>
            </div>


        </div>
    );
};
