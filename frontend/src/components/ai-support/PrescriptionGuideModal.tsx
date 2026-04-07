/**
 * AI 처방 가이드 모달 컴포넌트
 * 
 * 담당자: 오수민 (AI, Frontend)
 * 
 * 주요 기능:
 * - 처방 약물 입력 및 관리
 * - 현재 복용 중인 약물 입력
 * - AI 기반 약물 상호작용 검사
 * - AI 기반 용량 가이드 생성
 * - 처방 가이드 결과 표시
 * 
 * 기술 스택:
 * - React + TypeScript
 * - AI Gateway API 연동 (prescriptionGuide)
 * - 탭 기반 UI (입력/결과)
 * - 약물 데이터베이스 연동
 * 
 * 사용 위치:
 * - PatientChartModal 내부
 * - 처방 입력 시 AI 가이드 요청
 */
import React, { useState } from 'react';
import { prescriptionGuide } from '../../api/ai';

interface PrescriptionGuideModalProps {
    patient: {
        id: number;
        name: string;
        age?: number;
        weight?: number;
    };
    isOpen: boolean;
    onClose: () => void;
}

interface Medication {
    id: string;
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
}

interface GuideResult {
    guide: string;
    provider: string;
    model: string;
    medications: string[];
    currentMedications: string[];
}

const COMMON_MEDICATIONS = [
    '아스피린', '이부프로펜', '아세트아미노펜', '메트포르민', '리시노프릴',
    '아목시실린', '세파클러', '프레드니솔론', '라니티딘', '오메프라졸',
    '아트로바스타틴', '심바스타틴', '아목시실린', '세파클러', '독시사이클린'
];

const DOSAGE_OPTIONS = [
    '50mg', '100mg', '250mg', '500mg', '1000mg', '5mg', '10mg', '20mg', '40mg'
];

const FREQUENCY_OPTIONS = [
    '1일 1회', '1일 2회', '1일 3회', '1일 4회', '필요시', '식전', '식후'
];

const DURATION_OPTIONS = [
    '3일', '7일', '10일', '14일', '1개월', '3개월', '6개월', '지속복용'
];

export const PrescriptionGuideModal: React.FC<PrescriptionGuideModalProps> = ({
    patient,
    isOpen,
    onClose
}) => {
    const [medications, setMedications] = useState<Medication[]>([]);
    const [currentMedications, setCurrentMedications] = useState<string[]>([]);
    const [selectedMedication, setSelectedMedication] = useState('');
    const [guideResult, setGuideResult] = useState<GuideResult | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [activeTab, setActiveTab] = useState<'input' | 'result'>('input');

    // 처방 약물 추가
    const addMedication = () => {
        if (!selectedMedication) return;

        const newMedication: Medication = {
            id: Date.now().toString(),
            name: selectedMedication,
            dosage: '500mg',
            frequency: '1일 2회',
            duration: '7일'
        };

        setMedications(prev => [...prev, newMedication]);
        setSelectedMedication('');
    };

    // 처방 약물 제거
    const removeMedication = (id: string) => {
        setMedications(prev => prev.filter(m => m.id !== id));
    };

    // 처방 약물 업데이트
    const updateMedication = (id: string, field: keyof Medication, value: string) => {
        setMedications(prev => prev.map(m => 
            m.id === id ? { ...m, [field]: value } : m
        ));
    };

    // 현재 복용 약물 추가
    const addCurrentMedication = () => {
        const input = document.getElementById('current-medication-input') as HTMLInputElement;
        if (input && input.value.trim()) {
            setCurrentMedications(prev => [...prev, input.value.trim()]);
            input.value = '';
        }
    };

    // 현재 복용 약물 제거
    const removeCurrentMedication = (index: number) => {
        setCurrentMedications(prev => prev.filter((_, i) => i !== index));
    };

    // AI 가이드 실행
    const runGuide = async () => {
        if (medications.length === 0) {
            alert('최소 하나의 처방 약물을 입력해주세요.');
            return;
        }

        setIsAnalyzing(true);
        try {
            const medicationNames = medications.map(m => m.name);
            const result = await prescriptionGuide({
                medications: medicationNames,
                patient: {
                    name: patient.name,
                    age: patient.age,
                    weight: patient.weight
                },
                currentMedications: currentMedications
            }, { provider: 'auto' });

            setGuideResult(result);
            setActiveTab('result');
        } catch (error) {
            console.error('처방 가이드 실패:', error);
            alert('처방 가이드 생성 중 오류가 발생했습니다.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    // 모달 닫기 시 초기화
    const handleClose = () => {
        setMedications([]);
        setCurrentMedications([]);
        setGuideResult(null);
        setActiveTab('input');
        onClose();
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
                borderRadius: '12px',
                width: '90%',
                maxWidth: '1000px',
                height: '80%',
                maxHeight: '700px',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)'
            }}>
                {/* 헤더 */}
                <div style={{
                    padding: '20px 24px',
                    borderBottom: '1px solid #e5e7eb',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    color: 'white',
                    borderRadius: '12px 12px 0 0'
                }}>
                    <div>
                        <h2 style={{
                            margin: 0,
                            fontSize: '20px',
                            fontWeight: 600
                        }}>
                            💊 AI 처방 가이드
                        </h2>
                        <p style={{
                            margin: '4px 0 0 0',
                            fontSize: '14px',
                            opacity: 0.9
                        }}>
                            {patient.name} ({patient.age ? `${patient.age}세` : ''} {patient.weight ? `${patient.weight}kg` : ''})
                        </p>
                    </div>
                    <button
                        onClick={handleClose}
                        style={{
                            background: 'rgba(255, 255, 255, 0.2)',
                            border: 'none',
                            borderRadius: '50%',
                            width: '32px',
                            height: '32px',
                            fontSize: '18px',
                            cursor: 'pointer',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        ×
                    </button>
                </div>

                {/* 탭 네비게이션 */}
                <div style={{
                    display: 'flex',
                    borderBottom: '1px solid #e5e7eb',
                    backgroundColor: '#f9fafb'
                }}>
                    <button
                        onClick={() => setActiveTab('input')}
                        style={{
                            padding: '12px 24px',
                            border: 'none',
                            background: activeTab === 'input' ? 'white' : 'transparent',
                            color: activeTab === 'input' ? '#3b82f6' : '#6b7280',
                            cursor: 'pointer',
                            borderBottom: activeTab === 'input' ? '2px solid #3b82f6' : 'none',
                            fontWeight: activeTab === 'input' ? 600 : 400
                        }}
                    >
                        처방 입력
                    </button>
                    <button
                        onClick={() => setActiveTab('result')}
                        style={{
                            padding: '12px 24px',
                            border: 'none',
                            background: activeTab === 'result' ? 'white' : 'transparent',
                            color: activeTab === 'result' ? '#3b82f6' : '#6b7280',
                            cursor: 'pointer',
                            borderBottom: activeTab === 'result' ? '2px solid #3b82f6' : 'none',
                            fontWeight: activeTab === 'result' ? 600 : 400
                        }}
                    >
                        가이드 결과
                    </button>
                </div>

                {/* 메인 콘텐츠 */}
                <div style={{
                    flex: 1,
                    padding: '24px',
                    overflowY: 'auto'
                }}>
                    {activeTab === 'input' && (
                        <div>
                            {/* 처방 약물 입력 섹션 */}
                            <div style={{
                                backgroundColor: '#fef3c7',
                                border: '1px solid #f59e0b',
                                borderRadius: '8px',
                                padding: '20px',
                                marginBottom: '24px'
                            }}>
                                <h3 style={{
                                    margin: '0 0 16px 0',
                                    fontSize: '16px',
                                    fontWeight: 600,
                                    color: '#92400e'
                                }}>
                                    처방 약물 입력
                                </h3>
                                
                                <div style={{
                                    display: 'flex',
                                    gap: '12px',
                                    marginBottom: '16px'
                                }}>
                                    <select
                                        value={selectedMedication}
                                        onChange={(e) => setSelectedMedication(e.target.value)}
                                        style={{
                                            flex: 1,
                                            padding: '10px 12px',
                                            border: '1px solid #d1d5db',
                                            borderRadius: '6px',
                                            fontSize: '14px'
                                        }}
                                    >
                                        <option value="">약물을 선택하세요</option>
                                        {COMMON_MEDICATIONS.map(medication => (
                                            <option key={medication} value={medication}>
                                                {medication}
                                            </option>
                                        ))}
                                    </select>
                                    <button
                                        onClick={addMedication}
                                        disabled={!selectedMedication}
                                        style={{
                                            padding: '10px 20px',
                                            background: selectedMedication ? '#f59e0b' : '#9ca3af',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '6px',
                                            fontSize: '14px',
                                            fontWeight: 600,
                                            cursor: selectedMedication ? 'pointer' : 'not-allowed'
                                        }}
                                    >
                                        추가
                                    </button>
                                </div>

                                <div style={{
                                    fontSize: '12px',
                                    color: '#92400e'
                                }}>
                                    💡 팁: 처방할 약물들을 추가하여 상호작용과 용량 가이드를 받을 수 있습니다.
                                </div>
                            </div>

                            {/* 처방 약물 목록 */}
                            <div style={{ marginBottom: '24px' }}>
                                <h3 style={{
                                    margin: '0 0 16px 0',
                                    fontSize: '16px',
                                    fontWeight: 600,
                                    color: '#374151'
                                }}>
                                    처방 약물 ({medications.length}개)
                                </h3>

                                {medications.length === 0 ? (
                                    <div style={{
                                        textAlign: 'center',
                                        padding: '40px',
                                        color: '#9ca3af',
                                        fontSize: '14px'
                                    }}>
                                        아직 처방 약물이 없습니다.
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        {medications.map((medication) => (
                                            <div key={medication.id} style={{
                                                border: '1px solid #e5e7eb',
                                                borderRadius: '8px',
                                                padding: '16px',
                                                backgroundColor: '#f9fafb'
                                            }}>
                                                <div style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    marginBottom: '12px'
                                                }}>
                                                    <h4 style={{
                                                        margin: 0,
                                                        fontSize: '16px',
                                                        fontWeight: 600,
                                                        color: '#374151'
                                                    }}>
                                                        {medication.name}
                                                    </h4>
                                                    <button
                                                        onClick={() => removeMedication(medication.id)}
                                                        style={{
                                                            background: 'none',
                                                            border: 'none',
                                                            color: '#ef4444',
                                                            cursor: 'pointer',
                                                            fontSize: '18px',
                                                            padding: '4px'
                                                        }}
                                                    >
                                                        ×
                                                    </button>
                                                </div>

                                                <div style={{
                                                    display: 'grid',
                                                    gridTemplateColumns: '1fr 1fr 1fr 1fr',
                                                    gap: '12px'
                                                }}>
                                                    {/* 용량 */}
                                                    <div>
                                                        <label style={{
                                                            display: 'block',
                                                            fontSize: '12px',
                                                            fontWeight: 600,
                                                            color: '#6b7280',
                                                            marginBottom: '4px'
                                                        }}>
                                                            용량
                                                        </label>
                                                        <select
                                                            value={medication.dosage}
                                                            onChange={(e) => updateMedication(medication.id, 'dosage', e.target.value)}
                                                            style={{
                                                                width: '100%',
                                                                padding: '8px',
                                                                border: '1px solid #d1d5db',
                                                                borderRadius: '4px',
                                                                fontSize: '12px'
                                                            }}
                                                        >
                                                            {DOSAGE_OPTIONS.map(option => (
                                                                <option key={option} value={option}>
                                                                    {option}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>

                                                    {/* 복용법 */}
                                                    <div>
                                                        <label style={{
                                                            display: 'block',
                                                            fontSize: '12px',
                                                            fontWeight: 600,
                                                            color: '#6b7280',
                                                            marginBottom: '4px'
                                                        }}>
                                                            복용법
                                                        </label>
                                                        <select
                                                            value={medication.frequency}
                                                            onChange={(e) => updateMedication(medication.id, 'frequency', e.target.value)}
                                                            style={{
                                                                width: '100%',
                                                                padding: '8px',
                                                                border: '1px solid #d1d5db',
                                                                borderRadius: '4px',
                                                                fontSize: '12px'
                                                            }}
                                                        >
                                                            {FREQUENCY_OPTIONS.map(option => (
                                                                <option key={option} value={option}>
                                                                    {option}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>

                                                    {/* 기간 */}
                                                    <div>
                                                        <label style={{
                                                            display: 'block',
                                                            fontSize: '12px',
                                                            fontWeight: 600,
                                                            color: '#6b7280',
                                                            marginBottom: '4px'
                                                        }}>
                                                            기간
                                                        </label>
                                                        <select
                                                            value={medication.duration}
                                                            onChange={(e) => updateMedication(medication.id, 'duration', e.target.value)}
                                                            style={{
                                                                width: '100%',
                                                                padding: '8px',
                                                                border: '1px solid #d1d5db',
                                                                borderRadius: '4px',
                                                                fontSize: '12px'
                                                            }}
                                                        >
                                                            {DURATION_OPTIONS.map(option => (
                                                                <option key={option} value={option}>
                                                                    {option}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>

                                                    {/* 미리보기 */}
                                                    <div>
                                                        <label style={{
                                                            display: 'block',
                                                            fontSize: '12px',
                                                            fontWeight: 600,
                                                            color: '#6b7280',
                                                            marginBottom: '4px'
                                                        }}>
                                                            미리보기
                                                        </label>
                                                        <div style={{
                                                            padding: '8px',
                                                            backgroundColor: '#e5e7eb',
                                                            borderRadius: '4px',
                                                            fontSize: '12px',
                                                            color: '#374151'
                                                        }}>
                                                            {medication.name} {medication.dosage} {medication.frequency} {medication.duration}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* 현재 복용 약물 섹션 */}
                            <div style={{
                                backgroundColor: '#f3f4f6',
                                border: '1px solid #d1d5db',
                                borderRadius: '8px',
                                padding: '20px',
                                marginBottom: '24px'
                            }}>
                                <h3 style={{
                                    margin: '0 0 16px 0',
                                    fontSize: '16px',
                                    fontWeight: 600,
                                    color: '#374151'
                                }}>
                                    현재 복용 중인 약물
                                </h3>
                                
                                <div style={{
                                    display: 'flex',
                                    gap: '12px',
                                    marginBottom: '16px'
                                }}>
                                    <input
                                        id="current-medication-input"
                                        type="text"
                                        placeholder="현재 복용 중인 약물명을 입력하세요"
                                        style={{
                                            flex: 1,
                                            padding: '10px 12px',
                                            border: '1px solid #d1d5db',
                                            borderRadius: '6px',
                                            fontSize: '14px'
                                        }}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                addCurrentMedication();
                                            }
                                        }}
                                    />
                                    <button
                                        onClick={addCurrentMedication}
                                        style={{
                                            padding: '10px 20px',
                                            background: '#6b7280',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '6px',
                                            fontSize: '14px',
                                            fontWeight: 600,
                                            cursor: 'pointer'
                                        }}
                                    >
                                        추가
                                    </button>
                                </div>

                                {currentMedications.length > 0 && (
                                    <div style={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        gap: '8px'
                                    }}>
                                        {currentMedications.map((med, index) => (
                                            <span key={index} style={{
                                                padding: '6px 12px',
                                                backgroundColor: '#e5e7eb',
                                                borderRadius: '16px',
                                                fontSize: '12px',
                                                color: '#374151',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px'
                                            }}>
                                                {med}
                                                <button
                                                    onClick={() => removeCurrentMedication(index)}
                                                    style={{
                                                        background: 'none',
                                                        border: 'none',
                                                        color: '#ef4444',
                                                        cursor: 'pointer',
                                                        fontSize: '14px',
                                                        padding: '0'
                                                    }}
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* 가이드 실행 버튼 */}
                            <div style={{
                                display: 'flex',
                                justifyContent: 'center',
                                marginTop: '32px'
                            }}>
                                <button
                                    onClick={runGuide}
                                    disabled={medications.length === 0 || isAnalyzing}
                                    style={{
                                        padding: '12px 32px',
                                        background: medications.length > 0 && !isAnalyzing ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' : '#9ca3af',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        fontSize: '16px',
                                        fontWeight: 600,
                                        cursor: medications.length > 0 && !isAnalyzing ? 'pointer' : 'not-allowed',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px'
                                    }}
                                >
                                    {isAnalyzing ? (
                                        <>
                                            <div style={{
                                                width: '16px',
                                                height: '16px',
                                                border: '2px solid #ffffff',
                                                borderTop: '2px solid transparent',
                                                borderRadius: '50%',
                                                animation: 'spin 1s linear infinite'
                                            }} />
                                            분석 중...
                                        </>
                                    ) : (
                                        <>
                                            💊 AI 가이드 생성
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'result' && guideResult && (
                        <div>
                            <div style={{
                                backgroundColor: '#f0fdf4',
                                border: '1px solid #22c55e',
                                borderRadius: '8px',
                                padding: '20px',
                                marginBottom: '24px'
                            }}>
                                <h3 style={{
                                    margin: '0 0 12px 0',
                                    fontSize: '16px',
                                    fontWeight: 600,
                                    color: '#15803d'
                                }}>
                                    ✅ AI 가이드 완료
                                </h3>
                                <div style={{
                                    fontSize: '12px',
                                    color: '#16a34a'
                                }}>
                                    사용된 AI 모델: {guideResult.provider} ({guideResult.model})
                                </div>
                            </div>

                            {/* 가이드 결과 */}
                            <div style={{
                                backgroundColor: 'white',
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px',
                                padding: '20px',
                                marginBottom: '20px'
                            }}>
                                <h3 style={{
                                    margin: '0 0 16px 0',
                                    fontSize: '16px',
                                    fontWeight: 600,
                                    color: '#374151'
                                }}>
                                    📋 처방 가이드
                                </h3>
                                
                                {/* 구조화된 결과 표시 */}
                                <div style={{
                                    fontSize: '14px',
                                    lineHeight: '1.6',
                                    color: '#374151'
                                }}>
                                    {guideResult.guide.split('\n').map((line, index) => {
                                        // 섹션 헤더 스타일링
                                        if (line.startsWith('## ')) {
                                            return (
                                                <h4 key={index} style={{
                                                    margin: '16px 0 8px 0',
                                                    fontSize: '15px',
                                                    fontWeight: 600,
                                                    color: '#1f2937',
                                                    borderBottom: '1px solid #e5e7eb',
                                                    paddingBottom: '4px'
                                                }}>
                                                    {line.replace('## ', '')}
                                                </h4>
                                            );
                                        }
                                        
                                        // 위험도 표시
                                        if (line.includes('위험도') && (line.includes('높음') || line.includes('보통') || line.includes('낮음'))) {
                                            const isHigh = line.includes('높음');
                                            const isMedium = line.includes('보통');
                                            return (
                                                <div key={index} style={{
                                                    margin: '8px 0',
                                                    padding: '8px 12px',
                                                    backgroundColor: isHigh ? '#fef2f2' : isMedium ? '#fffbeb' : '#f0fdf4',
                                                    borderRadius: '6px',
                                                    borderLeft: `3px solid ${isHigh ? '#ef4444' : isMedium ? '#f59e0b' : '#22c55e'}`
                                                }}>
                                                    <div style={{
                                                        fontWeight: 600,
                                                        color: isHigh ? '#dc2626' : isMedium ? '#d97706' : '#16a34a'
                                                    }}>
                                                        {line}
                                                    </div>
                                                </div>
                                            );
                                        }
                                        
                                        // 일반 텍스트
                                        if (line.trim()) {
                                            return (
                                                <div key={index} style={{
                                                    margin: '4px 0',
                                                    paddingLeft: line.startsWith('-') ? '16px' : '0'
                                                }}>
                                                    {line}
                                                </div>
                                            );
                                        }
                                        
                                        return <br key={index} />;
                                    })}
                                </div>
                            </div>

                            {/* 처방 약물 요약 */}
                            <div style={{
                                backgroundColor: '#f9fafb',
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px',
                                padding: '16px'
                            }}>
                                <h4 style={{
                                    margin: '0 0 12px 0',
                                    fontSize: '14px',
                                    fontWeight: 600,
                                    color: '#374151'
                                }}>
                                    처방 약물
                                </h4>
                                <div style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: '8px',
                                    marginBottom: '12px'
                                }}>
                                    {medications.map((medication) => (
                                        <span key={medication.id} style={{
                                            padding: '4px 8px',
                                            backgroundColor: '#dbeafe',
                                            borderRadius: '4px',
                                            fontSize: '12px',
                                            color: '#1e40af'
                                        }}>
                                            {medication.name} {medication.dosage}
                                        </span>
                                    ))}
                                </div>

                                {currentMedications.length > 0 && (
                                    <>
                                        <h4 style={{
                                            margin: '12px 0 8px 0',
                                            fontSize: '14px',
                                            fontWeight: 600,
                                            color: '#374151'
                                        }}>
                                            현재 복용 약물
                                        </h4>
                                        <div style={{
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            gap: '8px'
                                        }}>
                                            {currentMedications.map((med, index) => (
                                                <span key={index} style={{
                                                    padding: '4px 8px',
                                                    backgroundColor: '#e5e7eb',
                                                    borderRadius: '4px',
                                                    fontSize: '12px',
                                                    color: '#374151'
                                                }}>
                                                    {med}
                                                </span>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
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
                        onClick={handleClose}
                        style={{
                            padding: '8px 16px',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            background: 'white',
                            color: '#374151',
                            cursor: 'pointer',
                            fontSize: '14px'
                        }}
                    >
                        닫기
                    </button>
                </div>
            </div>

            <style>
                {`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}
            </style>
        </div>
    );
};
