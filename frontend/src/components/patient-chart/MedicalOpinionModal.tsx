/**
 * 소견서 발급 모달 컴포넌트
 * 
 * 담당자: 오수민 (AI Gateway) / 김지현 (프론트엔드)
 * 
 * 주요 기능:
 * - 소견서 자동 생성 (차트 데이터 기반)
 * - 소견서 내용 편집
 * - 소견서 인쇄
 * - 소견서 발급 및 저장
 * 
 * 기술 스택:
 * - React + TypeScript
 * - 템플릿 기반 문서 생성
 * - 인쇄 기능 (window.print)
 * 
 * 사용 위치:
 * - PatientChartModal 내부
 * - 상급병원 권고 시 소견서 발급
 */
import React, { useState } from 'react';

interface MedicalOpinionModalProps {
    isOpen: boolean;
    onClose: () => void;
    patient: {
        id: number;
        name: string;
        birthDate: string;
    };
    chartData: {
        soap: {
            subjective: string;
            objective: string;
            assessment: string;
            plan: string;
        };
        prescriptions: Array<{
            medication: string;
            dosage: string;
            frequency: string;
            duration: string;
        }>;
        tests: Array<{
            testName: string;
        }>;
    };
    onSave: (opinion: MedicalOpinion) => void;
}

interface MedicalOpinion {
    id: string;
    patientId: number;
    patientName: string;
    issueDate: string;
    content: string;
    status: 'draft' | 'issued' | 'printed';
    doctorName: string;
    hospitalName: string;
    createdAt: string;
}

export const MedicalOpinionModal: React.FC<MedicalOpinionModalProps> = ({
    isOpen,
    onClose,
    patient,
    chartData,
    onSave
}) => {
    // 소견서 내용 생성 함수
    const generateOpinionContent = React.useCallback(() => {
        if (!patient || !chartData) return '';
        
        const today = new Date().toLocaleDateString('ko-KR');
        const patientAge = patient.birthDate ? new Date().getFullYear() - new Date(patient.birthDate).getFullYear() : '미상';
        
        return `소견서

환자명: ${patient.name || '미상'}
생년월일: ${patient.birthDate || '미상'}
나이: ${patientAge}세
발급일: ${today}

진료 내용:
${chartData.soap?.subjective ? `주관적 증상: ${chartData.soap.subjective}` : ''}
${chartData.soap?.objective ? `객관적 소견: ${chartData.soap.objective}` : ''}
${chartData.soap?.assessment ? `진단: ${chartData.soap.assessment}` : ''}
${chartData.soap?.plan ? `치료 계획: ${chartData.soap.plan}` : ''}

${chartData.prescriptions && chartData.prescriptions.length > 0 ? `처방 내용:
${chartData.prescriptions.map(p => `- ${p.medication || ''} ${p.dosage || ''} ${p.frequency || ''} ${p.duration || ''}`).join('\n')}` : ''}

${chartData.tests && chartData.tests.length > 0 ? `검사 내용:
${chartData.tests.map(t => `- ${t.testName || ''}`).join('\n')}` : ''}

의사: 김의사
병원명: 3-1 EMR 클리닉
연락처: 02-1234-5678`;
    }, [patient, chartData]);
    
    const [opinionContent, setOpinionContent] = useState<string>('');
    const [isEditing, setIsEditing] = useState<boolean>(false);

    // 초기 소견서 내용 설정 - 모달이 열릴 때마다 실행
    // 모든 hooks는 조건부 return 전에 호출되어야 함
    React.useEffect(() => {
        if (isOpen && patient && chartData) {
            try {
                const generated = generateOpinionContent();
                if (generated) {
                    setOpinionContent(generated);
                    setIsEditing(false);
                } else {
                    setOpinionContent('소견서 내용을 생성할 수 없습니다.');
                }
            } catch (error) {
                console.error('소견서 생성 오류:', error);
                setOpinionContent('소견서 생성 중 오류가 발생했습니다.');
            }
        } else if (isOpen) {
            // 모달이 열렸지만 데이터가 없으면 빈 내용
            setOpinionContent('');
        }
    }, [isOpen, patient, chartData, generateOpinionContent]);

    // 모달이 열리지 않았으면 렌더링하지 않음
    if (!isOpen) {
        return null;
    }
    
    // patient나 chartData가 없으면 에러 메시지 표시
    if (!patient || !chartData) {
        return (
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
                    padding: '24px',
                    maxWidth: '500px'
                }}>
                    <p>환자 정보 또는 차트 데이터를 불러올 수 없습니다.</p>
                    <button onClick={onClose}>닫기</button>
                </div>
            </div>
        );
    }

    // 소견서 저장
    const handleSave = () => {
        const newOpinion: MedicalOpinion = {
            id: Date.now().toString(),
            patientId: patient.id,
            patientName: patient.name,
            issueDate: new Date().toISOString().split('T')[0],
            content: opinionContent,
            status: 'issued',
            doctorName: '김의사',
            hospitalName: '3-1 EMR 클리닉',
            createdAt: new Date().toISOString()
        };
        
        onSave(newOpinion);
        onClose();
    };

    // 소견서 인쇄
    const handlePrint = () => {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(`
                <html>
                    <head>
                        <title>소견서 - ${patient.name}</title>
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
                        <div class="content">${opinionContent}</div>
                        <div class="footer">
                            발급일: ${new Date().toLocaleDateString('ko-KR')}
                        </div>
                    </body>
                </html>
            `);
            printWindow.document.close();
            printWindow.print();
        }
    };

    return (
        <div 
            onClick={(e) => {
                // 배경 클릭 시 모달 닫기 방지 (내부 클릭만 처리)
                if (e.target === e.currentTarget) {
                    onClose();
                }
            }}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10000
            }}
        >
            <div 
                onClick={(e) => e.stopPropagation()}
                style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    width: '800px',
                    maxHeight: '80vh',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                    zIndex: 10001
                }}
            >
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
                        소견서 발급
                    </h2>
                    <button
                        onClick={onClose}
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
                        minHeight: '400px'
                    }}>
                        {opinionContent ? (
                            <textarea
                                value={opinionContent}
                                onChange={(e) => setOpinionContent(e.target.value)}
                                style={{
                                    width: '100%',
                                    height: '400px',
                                    border: 'none',
                                    background: 'transparent',
                                    resize: 'none',
                                    fontFamily: 'Malgun Gothic, sans-serif',
                                    fontSize: '14px',
                                    lineHeight: '1.6',
                                    outline: 'none',
                                    color: '#374151'
                                }}
                                readOnly={!isEditing}
                            />
                        ) : (
                            <div style={{
                                width: '100%',
                                height: '400px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#6b7280',
                                fontSize: '14px'
                            }}>
                                소견서 내용을 생성 중...
                            </div>
                        )}
                    </div>
                </div>

                {/* 푸터 */}
                <div style={{
                    padding: '20px 24px',
                    borderTop: '1px solid #e5e7eb',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: isEditing ? '#6b7280' : '#3b82f6',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                fontSize: '14px',
                                fontWeight: 500,
                                cursor: 'pointer'
                            }}
                        >
                            {isEditing ? '읽기 전용' : '편집'}
                        </button>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                            onClick={handlePrint}
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
                            onClick={handleSave}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: '#3b82f6',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                fontSize: '14px',
                                fontWeight: 500,
                                cursor: 'pointer'
                            }}
                        >
                            발급
                        </button>
                        <button
                            onClick={onClose}
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
        </div>
    );
};
