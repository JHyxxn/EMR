import React, { useState, useEffect } from 'react';
import { tokens } from '../design/tokens';
import { MedicalOpinion } from '../types/medicalOpinion';
import { revisitPatientsData, RevisitPatient } from '../data/revisitPatientsData';
import { getPatientHistory, PatientHistory } from '../data/patientHistoryData';

export const DocumentManagement: React.FC = () => {
    const [medicalOpinions, setMedicalOpinions] = useState<MedicalOpinion[]>([]);
    const [selectedOpinion, setSelectedOpinion] = useState<MedicalOpinion | null>(null);
    const [isOpinionModalOpen, setIsOpinionModalOpen] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState<RevisitPatient | null>(null);
    const [patientSearchQuery, setPatientSearchQuery] = useState('');
    const [selectedPatientHistory, setSelectedPatientHistory] = useState<PatientHistory | null>(null);
    const [selectedOpinionContent, setSelectedOpinionContent] = useState<string>('');
    const [isOpinionEditing, setIsOpinionEditing] = useState<boolean>(false);
    const [selectedVisit, setSelectedVisit] = useState<any>(null);
    const [isVisitExpanded, setIsVisitExpanded] = useState<Set<string>>(new Set());

    // 소견서 로드
    useEffect(() => {
        const savedOpinions = JSON.parse(localStorage.getItem('medicalOpinions') || '[]');
        setMedicalOpinions(savedOpinions);
    }, []);

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

    // 환자 검색
    const filteredPatients = revisitPatientsData.filter(patient =>
        patient.name.toLowerCase().includes(patientSearchQuery.toLowerCase()) ||
        patient.phone.includes(patientSearchQuery) ||
        patient.birthDate.includes(patientSearchQuery)
    ).slice(0, 8); // 8명 표시 (더 많이 보이도록)

    // 선택된 환자의 소견서 필터링
    const filteredOpinions = medicalOpinions
        .filter(opinion => selectedPatient ? opinion.patientId === selectedPatient.id : true)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // 환자 선택
    const handlePatientSelect = (patient: RevisitPatient) => {
        setSelectedPatient(patient);
        setSelectedPatientHistory(getPatientHistory(patient.id) || null);
        setSelectedOpinionContent('');
        setIsOpinionEditing(false);
    };

    // 소견서 보기 (상세 모달)
    const handleViewOpinion = (opinion: MedicalOpinion) => {
        setSelectedOpinion(opinion);
        setIsOpinionModalOpen(true);
    };

    // 소견서 인쇄
    const handlePrintOpinion = (opinion: MedicalOpinion) => {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(`
                <html>
                    <head>
                        <title>소견서 - ${opinion.patientName}</title>
                        <style>
                            body {
                                font-family: 'Malgun Gothic', sans-serif;
                                padding: 20px;
                                line-height: 1.6;
                                max-width: 800px;
                                margin: 0 auto;
                            }
                            .header {
                                text-align: center;
                                margin-bottom: 30px;
                                border-bottom: 2px solid #333;
                                padding-bottom: 20px;
                            }
                            .content {
                                white-space: pre-line;
                                font-size: 14px;
                            }
                            .footer {
                                margin-top: 30px;
                                text-align: right;
                                font-size: 12px;
                                color: #666;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="header">
                            <h1>소견서</h1>
                        </div>
                        <div class="content">${opinion.content}</div>
                        <div class="footer">
                            발급일: ${opinion.issueDate}
                        </div>
                    </body>
                </html>
            `);
            printWindow.document.close();
            printWindow.print();
        }
    };

    // 소견서 삭제
    const handleDeleteOpinion = (opinionId: string) => {
        if (confirm('소견서를 삭제하시겠습니까?')) {
            const updatedOpinions = medicalOpinions.filter(opinion => opinion.id !== opinionId);
            setMedicalOpinions(updatedOpinions);
            localStorage.setItem('medicalOpinions', JSON.stringify(updatedOpinions));
        }
    };

    // 소견서 발급 (새로운 소견서 생성)
    const handleIssueNewOpinion = () => {
        if (!selectedPatient) {
            alert('환자를 먼저 선택해주세요.');
            return;
        }
        alert(`${selectedPatient.name} 환자의 소견서를 발급합니다. (실제로는 차트 모달이 열림)`);
    };

    // 소견서 내용 로드 (우측 편집 영역)
    const handleLoadOpinionForEdit = (opinion: MedicalOpinion) => {
        setSelectedOpinionContent(opinion.content);
        setIsOpinionEditing(true);
    };

    // 방문 내역 토글 함수
    const toggleVisitExpansion = (visitDate: string) => {
        const newExpanded = new Set(isVisitExpanded);
        if (newExpanded.has(visitDate)) {
            newExpanded.delete(visitDate);
        } else {
            newExpanded.add(visitDate);
        }
        setIsVisitExpanded(newExpanded);
    };

    // 방문 내역 선택 및 소견서 생성
    const handleVisitSelect = (visit: any) => {
        setSelectedVisit(visit);
        
        // 선택된 방문에 대한 소견서 내용 자동 생성
        const today = new Date().toLocaleDateString('ko-KR');
        const patientAge = selectedPatient ? calculateAge(selectedPatient.birthDate) : '미상';
        
        const generatedOpinion = `소견서

환자명: ${selectedPatient?.name || '미상'}
생년월일: ${selectedPatient?.birthDate || '미상'}
나이: ${patientAge}세
발급일: ${today}

방문 정보:
- 방문일: ${visit.date}
- 방문유형: ${visit.visitType}
- 진단: ${visit.diagnosis}

진료 내용:
${visit.medicalRecord?.symptoms ? `주관적 증상: ${visit.medicalRecord.symptoms}` : ''}
${visit.medicalRecord?.objective ? `객관적 소견: ${visit.medicalRecord.objective}` : ''}
${visit.medicalRecord?.assessment ? `진단: ${visit.medicalRecord.assessment}` : ''}
${visit.medicalRecord?.plan ? `치료 계획: ${visit.medicalRecord.plan}` : ''}

의사: 김의사
병원명: 3-1 EMR 클리닉
연락처: 02-1234-5678`;

        setSelectedOpinionContent(generatedOpinion);
        setIsOpinionEditing(true);
    };

    // 선택된 방문에 대한 소견서 발급
    const handleIssueOpinionForVisit = () => {
        if (!selectedVisit || !selectedPatient) {
            alert('방문 내역과 환자를 선택해주세요.');
            return;
        }

        const newOpinion: MedicalOpinion = {
            id: Date.now().toString(),
            patientId: selectedPatient.id,
            patientName: selectedPatient.name,
            issueDate: new Date().toLocaleDateString('ko-KR'),
            content: selectedOpinionContent,
            status: 'issued',
            doctorName: '김의사',
            hospitalName: '3-1 EMR 클리닉',
            createdAt: new Date().toISOString()
        };

        const updatedOpinions = [...medicalOpinions, newOpinion];
        setMedicalOpinions(updatedOpinions);
        localStorage.setItem('medicalOpinions', JSON.stringify(updatedOpinions));
        
        alert(`${selectedPatient.name} 환자의 ${selectedVisit.date} 방문에 대한 소견서가 발급되었습니다.`);
        
        // 선택 초기화
        setSelectedVisit(null);
        setSelectedOpinionContent('');
        setIsOpinionEditing(false);
    };

    return (
        <div style={{ 
            display: "flex", 
            flexDirection: "column",
            gap: tokens.space.md,
            height: "calc(100vh - 120px)",
            padding: tokens.space.md
        }}>
            {/* 상단: 환자 내역 목록 */}
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
                    환자 내역
                </div>
                
                <div style={{ 
                    display: "grid",
                    gap: "8px",
                    maxHeight: "300px",
                    overflowY: "auto"
                }}>
                    {filteredPatients.map(patient => (
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
                                {patient.diagnosis}
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
                {/* 좌측: 환자 기록 */}
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
                        환자 기록
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
                                    {selectedPatientHistory && selectedPatientHistory.visits.length > 0 ? (
                                        selectedPatientHistory.visits.map((visit, index) => (
                                            <div key={index}>
                                                {/* 방문 날짜 헤더 */}
                                                <div 
                                                    onClick={() => toggleVisitExpansion(visit.date)}
                                                    style={{
                                                        padding: "8px 12px",
                                                        backgroundColor: selectedVisit?.date === visit.date ? "rgba(93, 109, 126, 0.1)" : "#f3f4f6",
                                                        borderRadius: "4px",
                                                        cursor: "pointer",
                                                        border: "1px solid #e5e7eb",
                                                        borderLeft: selectedVisit?.date === visit.date ? "3px solid #5D6D7E" : "1px solid #e5e7eb"
                                                    }}
                                                >
                                                    <div style={{ fontWeight: 500, color: "#374151" }}>
                                                        {visit.date} - {visit.visitType}
                                                    </div>
                                                    <div style={{ fontSize: "12px", color: "#6b7280" }}>
                                                        {visit.diagnosis}
                                                    </div>
                                                </div>
                                                
                                                {/* 펼쳐진 상세 내용 */}
                                                {isVisitExpanded.has(visit.date) && (
                                                    <div style={{
                                                        padding: "12px",
                                                        backgroundColor: "#fefefe",
                                                        border: "1px solid #e5e7eb",
                                                        borderTop: "none",
                                                        borderRadius: "0 0 4px 4px"
                                                    }}>
                                                        {/* 진료기록 상세 */}
                                                        <div style={{ marginBottom: "12px" }}>
                                                            <div style={{ fontWeight: 600, marginBottom: "4px", color: "#374151" }}>
                                                                진료기록:
                                                            </div>
                                                            <div style={{ fontSize: "13px", color: "#6b7280", marginBottom: "4px" }}>
                                                                - 증상: {visit.medicalRecord?.symptoms || '기록 없음'}
                                                            </div>
                                                            <div style={{ fontSize: "13px", color: "#6b7280", marginBottom: "4px" }}>
                                                                - 진단: {visit.medicalRecord?.diagnosis || '기록 없음'}
                                                            </div>
                                                            <div style={{ fontSize: "13px", color: "#6b7280", marginBottom: "4px" }}>
                                                                - 처치: {visit.medicalRecord?.treatment || '기록 없음'}
                                                            </div>
                                                        </div>
                                                        
                                                        {/* 소견서 발급 버튼 */}
                                                        <button
                                                            onClick={() => handleVisitSelect(visit)}
                                                            style={{
                                                                width: "100%",
                                                                padding: "8px 12px",
                                                                backgroundColor: selectedVisit?.date === visit.date ? "#5D6D7E" : "#3b82f6",
                                                                color: "white",
                                                                border: "none",
                                                                borderRadius: "4px",
                                                                fontSize: "12px",
                                                                fontWeight: 500,
                                                                cursor: "pointer"
                                                            }}
                                                        >
                                                            {selectedVisit?.date === visit.date ? '선택됨 - 소견서 작성 중' : '소견서 발급하기'}
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <div style={{ textAlign: 'center', color: '#6b7280', padding: '20px' }}>
                                            이전 방문 내역이 없습니다.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', color: '#6b7280', padding: '40px 20px' }}>
                            <div style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>
                                환자를 선택해주세요
                            </div>
                            <div style={{ fontSize: '14px' }}>
                                상단 목록에서 환자를 선택하면 기록을 볼 수 있습니다.
                            </div>
                        </div>
                    )}
                </div>

                {/* 우측: 소견서 작성/발급 */}
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
                        소견서 작성/발급
                    </div>
                    
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                        {/* 소견서 편집 영역 */}
                        <div style={{ marginBottom: '16px' }}>
                            <textarea
                                value={selectedOpinionContent}
                                onChange={(e) => setSelectedOpinionContent(e.target.value)}
                                readOnly={!isOpinionEditing}
                                placeholder="소견서 내용을 입력하거나 이전 소견서를 불러오세요."
                                style={{
                                    width: '100%',
                                    height: '200px',
                                    padding: '12px',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '6px',
                                    fontSize: '14px',
                                    lineHeight: '1.6',
                                    resize: 'vertical',
                                    backgroundColor: isOpinionEditing ? 'white' : '#f9fafb',
                                    fontFamily: 'inherit',
                                    boxSizing: 'border-box'
                                }}
                            />
                            <div style={{ 
                                display: 'flex', 
                                justifyContent: 'flex-end', 
                                gap: '8px', 
                                marginTop: '8px',
                                width: '100%'
                            }}>
                                <button
                                    onClick={() => setIsOpinionEditing(!isOpinionEditing)}
                                    style={{
                                        padding: '8px 16px',
                                        backgroundColor: isOpinionEditing ? '#6b7280' : '#3b82f6',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '6px',
                                        fontSize: '14px',
                                        fontWeight: 500,
                                        cursor: 'pointer',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    {isOpinionEditing ? '읽기 전용' : '편집'}
                                </button>
                                <button
                                    onClick={selectedVisit ? handleIssueOpinionForVisit : handleIssueNewOpinion}
                                    style={{
                                        padding: '8px 16px',
                                        backgroundColor: selectedVisit ? '#10b981' : '#3b82f6',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '6px',
                                        fontSize: '14px',
                                        fontWeight: 500,
                                        cursor: 'pointer',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    {selectedVisit ? `소견서 발급 (${selectedVisit.date})` : '새 소견서 발급'}
                                </button>
                            </div>
                        </div>

                        {/* 발급된 소견서 목록 */}
                        <div style={{ flex: 1, overflowY: 'auto' }}>
                            <h4 style={{ fontSize: '16px', fontWeight: 600, color: '#374151', marginBottom: '12px' }}>
                                발급된 소견서 목록 (총 {filteredOpinions.length}건)
                            </h4>
                            {filteredOpinions.length === 0 ? (
                                <div style={{ textAlign: 'center', color: '#6b7280', padding: '20px' }}>
                                    발급된 소견서가 없습니다.
                                </div>
                            ) : (
                                <div style={{ display: 'grid', gap: '8px' }}>
                                    {filteredOpinions.map((opinion) => (
                                        <div
                                            key={opinion.id}
                                            onClick={() => handleLoadOpinionForEdit(opinion)}
                                            style={{
                                                padding: '12px',
                                                border: '1px solid #e5e7eb',
                                                borderRadius: '6px',
                                                backgroundColor: '#f9fafb',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center'
                                            }}
                                        >
                                            <div>
                                                <div style={{ fontWeight: 500, fontSize: '14px', color: '#374151' }}>
                                                    소견서 - {opinion.issueDate}
                                                </div>
                                                <div style={{ fontSize: '12px', color: '#6b7280' }}>
                                                    의사: {opinion.doctorName} | 상태: {opinion.status === 'issued' ? '발급됨' : '초안'}
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', gap: '4px' }}>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handlePrintOpinion(opinion); }}
                                                    style={{
                                                        padding: '4px 8px',
                                                        backgroundColor: '#10b981',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '4px',
                                                        fontSize: '11px',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    인쇄
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleDeleteOpinion(opinion.id); }}
                                                    style={{
                                                        padding: '4px 8px',
                                                        backgroundColor: '#ef4444',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '4px',
                                                        fontSize: '11px',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    삭제
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* 소견서 상세 보기 모달 */}
            {isOpinionModalOpen && selectedOpinion && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        width: '800px',
                        maxHeight: '80vh',
                        display: 'flex',
                        flexDirection: 'column',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                    }}>
                        {/* 헤더 */}
                        <div style={{
                            padding: '20px 24px',
                            borderBottom: '1px solid #e5e7eb',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <h2 style={{
                                margin: 0,
                                fontSize: '20px',
                                fontWeight: 600,
                                color: '#374151'
                            }}>
                                소견서 상세 보기
                            </h2>
                            <button
                                onClick={() => setIsOpinionModalOpen(false)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    fontSize: '24px',
                                    cursor: 'pointer',
                                    color: '#6b7280',
                                    padding: '4px'
                                }}
                            >
                                ×
                            </button>
                        </div>

                        {/* 내용 */}
                        <div style={{
                            flex: 1,
                            padding: '24px',
                            overflowY: 'auto'
                        }}>
                            <div style={{
                                border: '1px solid #d1d5db',
                                borderRadius: '8px',
                                padding: '20px',
                                backgroundColor: '#f9fafb',
                                whiteSpace: 'pre-line',
                                fontFamily: 'Malgun Gothic, sans-serif',
                                fontSize: '14px',
                                lineHeight: '1.6'
                            }}>
                                {selectedOpinion.content}
                            </div>
                        </div>

                        {/* 푸터 */}
                        <div style={{
                            padding: '20px 24px',
                            borderTop: '1px solid #e5e7eb',
                            display: 'flex',
                            justifyContent: 'flex-end',
                            gap: '8px'
                        }}>
                            <button
                                onClick={() => handlePrintOpinion(selectedOpinion)}
                                style={{
                                    padding: '8px 16px',
                                    backgroundColor: '#10b981',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    fontSize: '14px',
                                    fontWeight: 500,
                                    cursor: 'pointer'
                                }}
                            >
                                인쇄
                            </button>
                            <button
                                onClick={() => setIsOpinionModalOpen(false)}
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
                                닫기
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};