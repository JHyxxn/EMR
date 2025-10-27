import React, { useState, useEffect } from 'react';
import { WaitingPatient } from '../../data/waitingPatientsData';
import { getPatientHistory, addVisitRecord, updatePatientInfo, PatientHistory } from '../../data/patientHistoryData';
import { clinicalNote } from '../../api/ai';
import { updatePatient } from '../../api/patients';
import { MedicalOpinionModal } from './MedicalOpinionModal';
import { MedicalOpinion } from '../../types/medicalOpinion';


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
    freeformNotes: string;
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
    // 나이 계산 함수
    const calculateAge = (birthDate: string) => {
        if (!birthDate) return '?';
        const today = new Date();
        const birth = new Date(birthDate);
        if (isNaN(birth.getTime())) return '?';
        
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    };
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
        freeformNotes: '',
        nurseInfo: patient.nurseInfo ? {
            ...patient.nurseInfo,
            bloodPressure: patient.nurseInfo.bloodPressure || ''
        } : {
            symptoms: '',
            bloodPressure: '',
            notes: '',
            registeredBy: '',
            registeredAt: ''
        }
    });

    const [activeTab, setActiveTab] = useState<'chart' | 'prescription' | 'test'>('chart');
    const [expandedVisits, setExpandedVisits] = useState<Set<string>>(new Set());
    const [patientHistory, setPatientHistory] = useState<PatientHistory | undefined>(undefined);
    
    
    // 탭별 AI 요약 상태
    const [prescriptionSummary, setPrescriptionSummary] = useState<string | null>(null);
    const [testSummary, setTestSummary] = useState<string | null>(null);
    const [isLoadingPrescriptionSummary, setIsLoadingPrescriptionSummary] = useState(false);
    const [isLoadingTestSummary, setIsLoadingTestSummary] = useState(false);
    
    // 소견서 발급 상태
    const [medicalOpinion, setMedicalOpinion] = useState<string>('');
    const [isOpinionGenerated, setIsOpinionGenerated] = useState(false);
    const [isOpinionModalOpen, setIsOpinionModalOpen] = useState(false);


    // AI 제안 내용 생성 (기본 템플릿만)
    const generateAISuggestions = () => {
        // 의사가 직접 작성할 수 있도록 빈 상태로 시작
        const suggestions = {
            subjective: '',
            objective: '',
            assessment: '',
            plan: ''
        };

        setChartData(prev => ({
            ...prev,
            soap: suggestions
        }));
    };


    // 자유형 메모를 SOAP 형식으로 정리
    const organizeFreeformNotes = async () => {
        console.log('AI 정리 버튼 클릭됨');
        
        if (!chartData.freeformNotes.trim()) {
            alert('정리할 메모를 입력해주세요.');
            return;
        }

        try {
            const patientInfo = {
                name: patient.name,
                age: patient.birthDate ? new Date().getFullYear() - new Date(patient.birthDate).getFullYear() : null,
                sex: 'unknown'
            };

            // AI를 통해 자유형 메모를 SOAP 형식으로 정리
            const response = await clinicalNote({
                text: chartData.freeformNotes, // 자유형 메모를 text로 전달
                patient: patientInfo
            });

            if (response.summary) {
                // AI 응답을 SOAP 형식으로 파싱하여 각 필드에 자동 입력
                const soapData = parseAIToSOAP(response.summary);
                
                setChartData(prev => ({
                    ...prev,
                    soap: {
                        ...prev.soap,
                        subjective: soapData.subjective || prev.soap.subjective,
                        objective: soapData.objective || prev.soap.objective,
                        assessment: soapData.assessment || prev.soap.assessment,
                        plan: soapData.plan || prev.soap.plan,
                        summary: response.summary
                    }
                }));

                // AI 응답에서 처방/검사 추천 추출
                const lines = response.summary.split('\n');
                const prescriptionStart = lines.findIndex((line: string) => line.includes('추천 처방'));
                const testStart = lines.findIndex((line: string) => line.includes('추천 검사'));
                
                // 처방 추천 추출
                if (prescriptionStart !== -1) {
                    const prescriptionEnd = testStart !== -1 ? testStart : lines.length;
                    const prescriptionPart = lines.slice(prescriptionStart, prescriptionEnd).join('\n');
                    setPrescriptionSummary(prescriptionPart);
                }
                
                // 검사 추천 추출
                if (testStart !== -1) {
                    const testPart = lines.slice(testStart).join('\n');
                    setTestSummary(testPart);
                }

                alert('자유형 메모가 SOAP 형식으로 정리되었고, 처방/검사 추천이 생성되었습니다.');
            }
        } catch (error) {
            console.error('메모 정리 오류:', error);
            alert('메모 정리 중 오류가 발생했습니다.');
        }
    };

    // AI 응답을 SOAP 형식으로 파싱하는 함수
    const parseAIToSOAP = (aiResponse: string) => {
        const lines = aiResponse.split('\n');
        const soapData = {
            subjective: '',
            objective: '',
            assessment: '',
            plan: ''
        };

        let currentSection = '';
        
        for (const line of lines) {
            const trimmedLine = line.trim();
            
            if (trimmedLine.includes('주관적') || trimmedLine.includes('Subjective') || trimmedLine.includes('증상')) {
                currentSection = 'subjective';
            } else if (trimmedLine.includes('객관적') || trimmedLine.includes('Objective') || trimmedLine.includes('진찰')) {
                currentSection = 'objective';
            } else if (trimmedLine.includes('평가') || trimmedLine.includes('Assessment') || trimmedLine.includes('진단')) {
                currentSection = 'assessment';
            } else if (trimmedLine.includes('계획') || trimmedLine.includes('Plan') || trimmedLine.includes('치료')) {
                currentSection = 'plan';
            } else if (trimmedLine && currentSection) {
                soapData[currentSection as keyof typeof soapData] += trimmedLine + '\n';
            }
        }

        return soapData;
    };

    // 소견서 발급 함수
    const generateMedicalOpinion = () => {
        setIsOpinionModalOpen(true);
    };

    // 소견서 저장 함수
    const handleSaveOpinion = (opinion: MedicalOpinion) => {
        // 소견서를 로컬 스토리지에 저장 (실제로는 백엔드에 저장)
        const existingOpinions = JSON.parse(localStorage.getItem('medicalOpinions') || '[]');
        existingOpinions.push(opinion);
        localStorage.setItem('medicalOpinions', JSON.stringify(existingOpinions));
        
        alert('소견서가 발급되었습니다.');
        setIsOpinionModalOpen(false);
    };

    // 소견서 인쇄 함수
    const printMedicalOpinion = () => {
        if (!medicalOpinion) return;
        
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(`
                <html>
                    <head>
                        <title>소견서 - ${patient.name}</title>
                        <style>
                            body { font-family: 'Malgun Gothic', sans-serif; padding: 20px; line-height: 1.6; }
                            .header { text-align: center; margin-bottom: 30px; }
                            .content { white-space: pre-line; }
                        </style>
                    </head>
                    <body>
                        <div class="content">${medicalOpinion}</div>
                    </body>
                </html>
            `);
            printWindow.document.close();
            printWindow.print();
        }
    };

    useEffect(() => {
        if (isOpen) {
            generateAISuggestions();
            // 환자 내역 로드
            const history = getPatientHistory(patient.id);
            setPatientHistory(history);
        }
    }, [isOpen, patient]);


    // SOAP 기록이 변경될 때마다 요약 생성

    const handleSave = async () => {
        try {
            // 백엔드에 환자 정보 업데이트
            await updatePatient(patient.id, {
                name: patient.name,
                birthDate: patient.birthDate,
                phone: patient.phone
            });
            
            // 로컬 환자 정보도 업데이트
            updatePatientInfo(patient.id, patient.name, patient.birthDate, patient.phone);
        
        // 기존 환자 내역에서 오늘 방문 기록 찾기
        const existingHistory = getPatientHistory(patient.id);
        const today = new Date().toISOString().split('T')[0];
        
        // 방문 유형 결정: 이전 방문 이력이 있으면 재진, 없으면 초진
        const visitType = existingHistory && existingHistory.visits && existingHistory.visits.length > 0 ? '재진' : '초진';
        
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
                    visitType: visitType as '초진' | '재진',
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
                visitType: visitType as '초진' | '재진',
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
            // 정보 저장은 창을 닫지 않음 (임시저장 역할)
        } catch (error) {
            console.error('환자 정보 저장 실패:', error);
            alert('환자 정보 저장에 실패했습니다. 다시 시도해주세요.');
        }
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
                                <strong>생년월일:</strong> {patient.birthDate} ({patient.birthDate ? calculateAge(patient.birthDate) : '?'}세)
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

                                {/* 진료 기록 */}
                                <div style={{
                                    border: '1px solid #d1d5db',
                                    borderRadius: '8px',
                                    padding: '20px',
                                    backgroundColor: '#f8fafc',
                                    marginBottom: '20px'
                                }}>
                                    <h3 style={{
                                        margin: '0 0 12px 0',
                                        fontSize: '16px',
                                        fontWeight: 600,
                                        color: '#374151'
                                    }}>
                                        진료 기록
                                    </h3>
                                    <p style={{
                                        margin: '0 0 12px 0',
                                        fontSize: '14px',
                                        color: '#6b7280'
                                    }}>
                                        진료하면서 생각나는 내용을 자유롭게 작성하세요. AI가 SOAP 형식으로 정리해드립니다.
                                    </p>
                                    <textarea
                                        value={chartData.freeformNotes}
                                        onChange={(e) => setChartData(prev => ({
                                            ...prev,
                                            freeformNotes: e.target.value
                                        }))}
                                        style={{
                                            width: '100%',
                                            height: '72px',
                                            padding: '8px 12px',
                                            border: '1px solid #d1d5db',
                                            borderRadius: '6px',
                                            fontSize: '14px',
                                            resize: 'vertical',
                                            fontFamily: 'inherit',
                                            boxSizing: 'border-box'
                                        }}
                                        placeholder="예: 환자가 두통을 호소하고 있음. 혈압 140/90. 진통제 처방하고 내일 재방문 예약..."
                                    />
                                    <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                                        <button
                                            onClick={() => setChartData(prev => ({ ...prev, freeformNotes: '' }))}
                                            style={{
                                                padding: '8px 16px',
                                                backgroundColor: 'white',
                                                color: '#374151',
                                                border: '1px solid #d1d5db',
                                                borderRadius: '6px',
                                                fontSize: '14px',
                                                fontWeight: 500,
                                                cursor: 'pointer'
                                            }}
                                        >
                                            지우기
                                        </button>
                                        <button
                                            onClick={organizeFreeformNotes}
                                            disabled={!chartData.freeformNotes.trim()}
                                            style={{
                                                padding: '8px 16px',
                                                backgroundColor: '#374151',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '6px',
                                                fontSize: '14px',
                                                fontWeight: 500,
                                                cursor: chartData.freeformNotes.trim() ? 'pointer' : 'not-allowed',
                                                opacity: chartData.freeformNotes.trim() ? 1 : 0.6,
                                                marginRight: '8px'
                                            }}
                                        >
                                            AI 정리
                                        </button>
                                        <button
                                            onClick={generateMedicalOpinion}
                                            style={{
                                                padding: '8px 16px',
                                                backgroundColor: '#6b7280',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '6px',
                                                fontSize: '14px',
                                                fontWeight: 500,
                                                cursor: 'pointer'
                                            }}
                                        >
                                            소견서 발급
                                        </button>
                                    </div>
                                </div>


                                {/* 처방/오더 보드 */}
                                <div style={{ marginTop: '20px', marginBottom: '12px' }}>
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
                                <div style={{ marginTop: '20px', marginBottom: '12px' }}>
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
                                {/* AI 처방 요약 */}
                                {prescriptionSummary && (
                                    <div style={{
                                        backgroundColor: '#f0f9ff',
                                        border: '1px solid #0ea5e9',
                                        borderRadius: '8px',
                                        padding: '12px',
                                        marginBottom: '16px'
                                    }}>
                                        <h4 style={{
                                            margin: '0 0 12px 0',
                                            fontSize: '14px',
                                            fontWeight: 600,
                                            color: '#0c4a6e'
                                        }}>
                                            AI 진료 요약
                                        </h4>
                                        
                                        {isLoadingPrescriptionSummary ? (
                                            <div style={{ fontSize: '13px', color: '#0c4a6e' }}>
                                                AI 분석 중...
                                            </div>
                                        ) : (
                                            <div style={{ 
                                                fontSize: '13px', 
                                                color: '#374151', 
                                                lineHeight: '1.4',
                                                whiteSpace: 'pre-line'
                                            }}>
                                                {prescriptionSummary}
                                            </div>
                                        )}
                                    </div>
                                )}
                                
                                {/* 처방 목록 */}
                                <div style={{ marginBottom: '16px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                        <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#374151' }}>
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
                                <div style={{ marginTop: '20px', marginBottom: '12px' }}>
                                    <label style={{
                                        display: 'block',
                                        fontWeight: 600,
                                        marginBottom: '8px',
                                        color: '#374151',
                                        fontSize: '16px'
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
                                {/* AI 검사 요약 */}
                                {testSummary && (
                                    <div style={{
                                        backgroundColor: '#f0f9ff',
                                        border: '1px solid #0ea5e9',
                                        borderRadius: '8px',
                                        padding: '12px',
                                        marginBottom: '16px'
                                    }}>
                                        <h4 style={{
                                            margin: '0 0 12px 0',
                                            fontSize: '14px',
                                            fontWeight: 600,
                                            color: '#0c4a6e'
                                        }}>
                                            AI 진료 요약
                                        </h4>
                                        
                                        {isLoadingTestSummary ? (
                                            <div style={{ fontSize: '13px', color: '#0c4a6e' }}>
                                                AI 분석 중...
                                            </div>
                                        ) : (
                                            <div style={{ 
                                                fontSize: '13px', 
                                                color: '#374151', 
                                                lineHeight: '1.4',
                                                whiteSpace: 'pre-line'
                                            }}>
                                                {testSummary}
                                            </div>
                                        )}
                                    </div>
                                )}
                                
                                {/* 검사 목록 */}
                                <div style={{ marginBottom: '16px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                        <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#374151' }}>
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
                                <div style={{ marginTop: '20px', marginBottom: '12px' }}>
                                    <label style={{
                                        display: 'block',
                                        fontWeight: 600,
                                        marginBottom: '8px',
                                        color: '#374151',
                                        fontSize: '16px'
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
                        onClick={() => {
                            handleSave();
                            onClose();
                        }}
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

            {/* 소견서 모달 */}
            <MedicalOpinionModal 
                isOpen={isOpinionModalOpen}
                onClose={() => setIsOpinionModalOpen(false)}
                patient={patient}
                chartData={chartData}
                onSave={handleSaveOpinion}
            />
        </div>
    );
};
