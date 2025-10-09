import React, { useState, useEffect } from 'react';
import { symptomAnalysis } from '../../api/ai';

interface SymptomAnalysisModalProps {
    patient: {
        id: number;
        name: string;
        age?: number;
        sex?: string;
    };
    isOpen: boolean;
    onClose: () => void;
}

interface Symptom {
    id: string;
    name: string;
    severity: 'mild' | 'moderate' | 'severe';
    duration: string;
    pattern: string;
}

interface DiagnosisResult {
    diagnosis: string;
    probability: number;
    confidence: 'low' | 'medium' | 'high';
}

interface AnalysisResult {
    analysis: string;
    provider: string;
    model: string;
    symptoms: string[];
    observations: any[];
    diagnoses?: DiagnosisResult[];
    recommendations?: string[];
}

const COMMON_SYMPTOMS = [
    '두통', '발열', '오한', '기침', '가래', '호흡곤란', '흉통', '복통', '설사', '변비',
    '메스꺼움', '구토', '어지러움', '피로감', '무력감', '체중감소', '체중증가',
    '수면장애', '불안', '우울감', '관절통', '근육통', '피부발진', '가려움증'
];

const SEVERITY_OPTIONS = [
    { value: 'mild', label: '경미', color: '#10b981' },
    { value: 'moderate', label: '보통', color: '#f59e0b' },
    { value: 'severe', label: '심각', color: '#ef4444' }
];

const DURATION_OPTIONS = [
    '1일 미만', '1-3일', '3-7일', '1-2주', '2-4주', '1개월 이상'
];

const PATTERN_OPTIONS = [
    '지속적', '간헐적', '발작적', '점진적 악화', '점진적 호전', '변화 없음'
];

export const SymptomAnalysisModal: React.FC<SymptomAnalysisModalProps> = ({
    patient,
    isOpen,
    onClose
}) => {
    const [symptoms, setSymptoms] = useState<Symptom[]>([]);
    const [selectedSymptom, setSelectedSymptom] = useState('');
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [activeTab, setActiveTab] = useState<'input' | 'result'>('input');

    // 증상 추가
    const addSymptom = () => {
        if (!selectedSymptom) return;

        const newSymptom: Symptom = {
            id: Date.now().toString(),
            name: selectedSymptom,
            severity: 'moderate',
            duration: '1-3일',
            pattern: '지속적'
        };

        setSymptoms(prev => [...prev, newSymptom]);
        setSelectedSymptom('');
    };

    // 증상 제거
    const removeSymptom = (id: string) => {
        setSymptoms(prev => prev.filter(s => s.id !== id));
    };

    // 증상 업데이트
    const updateSymptom = (id: string, field: keyof Symptom, value: any) => {
        setSymptoms(prev => prev.map(s => 
            s.id === id ? { ...s, [field]: value } : s
        ));
    };

    // AI 분석 실행
    const runAnalysis = async () => {
        if (symptoms.length === 0) {
            alert('최소 하나의 증상을 입력해주세요.');
            return;
        }

        setIsAnalyzing(true);
        try {
            const symptomData = symptoms.map(s => s.name);
            const result = await symptomAnalysis({
                symptoms: symptomData,
                patient: {
                    name: patient.name,
                    age: patient.age,
                    sex: patient.sex
                },
                observations: [] // 추후 관찰치 데이터 추가 가능
            }, { provider: 'auto' });

            setAnalysisResult(result);
            setActiveTab('result');
        } catch (error) {
            console.error('증상 분석 실패:', error);
            alert('증상 분석 중 오류가 발생했습니다.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    // 모달 닫기 시 초기화
    const handleClose = () => {
        setSymptoms([]);
        setAnalysisResult(null);
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
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    borderRadius: '12px 12px 0 0'
                }}>
                    <div>
                        <h2 style={{
                            margin: 0,
                            fontSize: '20px',
                            fontWeight: 600
                        }}>
                            🤖 AI 증상 분석
                        </h2>
                        <p style={{
                            margin: '4px 0 0 0',
                            fontSize: '14px',
                            opacity: 0.9
                        }}>
                            {patient.name} ({patient.age ? `${patient.age}세` : ''} {patient.sex || ''})
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
                        증상 입력
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
                        분석 결과
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
                            {/* 증상 입력 섹션 */}
                            <div style={{
                                backgroundColor: '#f0f9ff',
                                border: '1px solid #0ea5e9',
                                borderRadius: '8px',
                                padding: '20px',
                                marginBottom: '24px'
                            }}>
                                <h3 style={{
                                    margin: '0 0 16px 0',
                                    fontSize: '16px',
                                    fontWeight: 600,
                                    color: '#0c4a6e'
                                }}>
                                    증상 입력
                                </h3>
                                
                                <div style={{
                                    display: 'flex',
                                    gap: '12px',
                                    marginBottom: '16px'
                                }}>
                                    <select
                                        value={selectedSymptom}
                                        onChange={(e) => setSelectedSymptom(e.target.value)}
                                        style={{
                                            flex: 1,
                                            padding: '10px 12px',
                                            border: '1px solid #d1d5db',
                                            borderRadius: '6px',
                                            fontSize: '14px'
                                        }}
                                    >
                                        <option value="">증상을 선택하세요</option>
                                        {COMMON_SYMPTOMS.map(symptom => (
                                            <option key={symptom} value={symptom}>
                                                {symptom}
                                            </option>
                                        ))}
                                    </select>
                                    <button
                                        onClick={addSymptom}
                                        disabled={!selectedSymptom}
                                        style={{
                                            padding: '10px 20px',
                                            background: selectedSymptom ? '#3b82f6' : '#9ca3af',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '6px',
                                            fontSize: '14px',
                                            fontWeight: 600,
                                            cursor: selectedSymptom ? 'pointer' : 'not-allowed'
                                        }}
                                    >
                                        추가
                                    </button>
                                </div>

                                <div style={{
                                    fontSize: '12px',
                                    color: '#6b7280',
                                    marginBottom: '16px'
                                }}>
                                    💡 팁: 여러 증상을 추가하여 더 정확한 분석을 받을 수 있습니다.
                                </div>
                            </div>

                            {/* 증상 목록 */}
                            <div style={{ marginBottom: '24px' }}>
                                <h3 style={{
                                    margin: '0 0 16px 0',
                                    fontSize: '16px',
                                    fontWeight: 600,
                                    color: '#374151'
                                }}>
                                    입력된 증상 ({symptoms.length}개)
                                </h3>

                                {symptoms.length === 0 ? (
                                    <div style={{
                                        textAlign: 'center',
                                        padding: '40px',
                                        color: '#9ca3af',
                                        fontSize: '14px'
                                    }}>
                                        아직 입력된 증상이 없습니다.
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        {symptoms.map((symptom) => (
                                            <div key={symptom.id} style={{
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
                                                        {symptom.name}
                                                    </h4>
                                                    <button
                                                        onClick={() => removeSymptom(symptom.id)}
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
                                                    gridTemplateColumns: '1fr 1fr 1fr',
                                                    gap: '12px'
                                                }}>
                                                    {/* 심각도 */}
                                                    <div>
                                                        <label style={{
                                                            display: 'block',
                                                            fontSize: '12px',
                                                            fontWeight: 600,
                                                            color: '#6b7280',
                                                            marginBottom: '4px'
                                                        }}>
                                                            심각도
                                                        </label>
                                                        <select
                                                            value={symptom.severity}
                                                            onChange={(e) => updateSymptom(symptom.id, 'severity', e.target.value)}
                                                            style={{
                                                                width: '100%',
                                                                padding: '8px',
                                                                border: '1px solid #d1d5db',
                                                                borderRadius: '4px',
                                                                fontSize: '12px'
                                                            }}
                                                        >
                                                            {SEVERITY_OPTIONS.map(option => (
                                                                <option key={option.value} value={option.value}>
                                                                    {option.label}
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
                                                            value={symptom.duration}
                                                            onChange={(e) => updateSymptom(symptom.id, 'duration', e.target.value)}
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

                                                    {/* 패턴 */}
                                                    <div>
                                                        <label style={{
                                                            display: 'block',
                                                            fontSize: '12px',
                                                            fontWeight: 600,
                                                            color: '#6b7280',
                                                            marginBottom: '4px'
                                                        }}>
                                                            패턴
                                                        </label>
                                                        <select
                                                            value={symptom.pattern}
                                                            onChange={(e) => updateSymptom(symptom.id, 'pattern', e.target.value)}
                                                            style={{
                                                                width: '100%',
                                                                padding: '8px',
                                                                border: '1px solid #d1d5db',
                                                                borderRadius: '4px',
                                                                fontSize: '12px'
                                                            }}
                                                        >
                                                            {PATTERN_OPTIONS.map(option => (
                                                                <option key={option} value={option}>
                                                                    {option}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* 분석 실행 버튼 */}
                            <div style={{
                                display: 'flex',
                                justifyContent: 'center',
                                marginTop: '32px'
                            }}>
                                <button
                                    onClick={runAnalysis}
                                    disabled={symptoms.length === 0 || isAnalyzing}
                                    style={{
                                        padding: '12px 32px',
                                        background: symptoms.length > 0 && !isAnalyzing ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#9ca3af',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        fontSize: '16px',
                                        fontWeight: 600,
                                        cursor: symptoms.length > 0 && !isAnalyzing ? 'pointer' : 'not-allowed',
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
                                            🤖 AI 분석 시작
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'result' && analysisResult && (
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
                                    ✅ AI 분석 완료
                                </h3>
                                <div style={{
                                    fontSize: '12px',
                                    color: '#16a34a'
                                }}>
                                    사용된 AI 모델: {analysisResult.provider} ({analysisResult.model})
                                </div>
                            </div>

                            {/* 분석 결과 */}
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
                                    📋 분석 결과
                                </h3>
                                
                                {/* 구조화된 결과 표시 */}
                                <div style={{
                                    fontSize: '14px',
                                    lineHeight: '1.6',
                                    color: '#374151'
                                }}>
                                    {analysisResult.analysis.split('\n').map((line, index) => {
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
                                        
                                        // 진단명 강조 (볼드 처리)
                                        if (line.includes('**') && line.includes(':')) {
                                            return (
                                                <div key={index} style={{
                                                    margin: '8px 0',
                                                    padding: '8px 12px',
                                                    backgroundColor: '#f0f9ff',
                                                    borderRadius: '6px',
                                                    borderLeft: '3px solid #3b82f6'
                                                }}>
                                                    <div style={{
                                                        fontWeight: 600,
                                                        color: '#1e40af',
                                                        marginBottom: '4px'
                                                    }}>
                                                        {line.replace(/\*\*/g, '')}
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

                            {/* 입력된 증상 요약 */}
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
                                    입력된 증상
                                </h4>
                                <div style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: '8px'
                                }}>
                                    {symptoms.map((symptom) => (
                                        <span key={symptom.id} style={{
                                            padding: '4px 8px',
                                            backgroundColor: '#e5e7eb',
                                            borderRadius: '4px',
                                            fontSize: '12px',
                                            color: '#374151'
                                        }}>
                                            {symptom.name}
                                        </span>
                                    ))}
                                </div>
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
