/**
 * 검사 관리 페이지 컴포넌트
 * 
 * 담당자: 김지현 (프론트엔드)
 * 
 * 주요 기능:
 * - 검사 오더 관리
 * - 검사 결과 입력 (혈압, 심전도, 혈당 등)
 * - AI 기반 검사 결과 분석 및 시각화
 * - 정상/비정상 수치 자동 판단 및 색상 표시
 * 
 * 기술 스택:
 * - React + TypeScript
 * - 조건부 렌더링 (정상/비정상 수치 시각적 구분)
 * - AI 분석 결과 표시
 * - 탭 기반 UI (검사 오더 / 검사 결과 / AI 분석)
 */
import React, { useState, useEffect } from 'react';
import { tokens } from '../design/tokens';
import { WaitingPatient } from '../data/waitingPatientsData';
import { testAnalysis } from '../api/ai';

interface ExamManagementProps {
    selectedPatient: WaitingPatient | null;
    onPatientClear: () => void;
    prescriptions?: Array<{
        id: string;
        patientName: string;
        patientId: string;
        tests: Array<{
            testName: string;
            urgency: 'routine' | 'urgent';
        }>;
        createdAt: string;
    }>;
}

interface ExamOrder {
    id: number;
    patientName?: string;
    patientId?: number;
    category: 'lab' | 'imaging' | 'procedure';
    code?: string;
    priority?: 'routine' | 'urgent' | 'stat';
    requestedAt?: string;
}

interface ExamResult {
    id: number;
    testName: string;
    value: string;
    unit?: string;
    referenceRange?: string;
    status: 'normal' | 'abnormal' | 'critical';
    aiAnalysis?: string;
    createdAt: string;
}

export const ExamManagement: React.FC<ExamManagementProps> = ({ selectedPatient, onPatientClear, prescriptions = [] }) => {
    const [activeTab, setActiveTab] = useState<'orders' | 'results' | 'analysis'>('orders');
    
    // 검사 오더 관련 상태
    const [examOrders, setExamOrders] = useState<ExamOrder[]>([]);
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [editingOrder, setEditingOrder] = useState<ExamOrder | null>(null);
    const [orderFilter, setOrderFilter] = useState<{
        patient?: string;
        category?: string;
        date?: string;
    }>({});

    // 검사 결과 관련 상태
    const [examResults, setExamResults] = useState<ExamResult[]>([]);
    const [resultForm, setResultForm] = useState({
        systolicBP: '',
        diastolicBP: '',
        ecg: '',
        bloodSugar: '',
        otherResults: ''
    });
    const [isAnalyzing, setIsAnalyzing] = useState<number | null>(null);

    // prescriptions에서 검사 오더 자동 생성
    useEffect(() => {
        const newOrders: ExamOrder[] = [];
        prescriptions.forEach(prescription => {
            if (prescription.tests && prescription.tests.length > 0) {
                prescription.tests.forEach(test => {
                    // 이미 존재하는 오더인지 확인 (중복 방지)
                    const existingOrder = examOrders.find(order => 
                        order.patientName === prescription.patientName &&
                        order.code === test.testName &&
                        new Date(order.requestedAt || '').toDateString() === new Date(prescription.createdAt).toDateString()
                    );
                    
                    if (!existingOrder) {
                        // 검사명에 따라 카테고리 자동 분류
                        let category: 'lab' | 'imaging' | 'procedure' = 'lab';
                        if (test.testName.includes('CT') || test.testName.includes('X-ray') || test.testName.includes('MRI') || test.testName.includes('초음파')) {
                            category = 'imaging';
                        } else if (test.testName.includes('내시경') || test.testName.includes('처치')) {
                            category = 'procedure';
                        }

                        newOrders.push({
                            id: Date.now() + Math.random(), // 고유 ID 생성
                            patientName: prescription.patientName,
                            patientId: parseInt(prescription.patientId) || undefined,
                            category,
                            code: test.testName,
                            priority: test.urgency === 'urgent' ? 'urgent' : 'routine',
                            requestedAt: prescription.createdAt
                        });
                    }
                });
            }
        });

        if (newOrders.length > 0) {
            setExamOrders(prev => {
                // 중복 제거를 위해 기존 오더와 병합
                const merged = [...prev];
                newOrders.forEach(newOrder => {
                    const exists = merged.some(existing => 
                        existing.patientName === newOrder.patientName &&
                        existing.code === newOrder.code &&
                        existing.requestedAt === newOrder.requestedAt
                    );
                    if (!exists) {
                        merged.push(newOrder);
                    }
                });
                return merged;
            });
        }
    }, [prescriptions]);

    // 검사 오더 생성/수정 핸들러
    const handleEditOrder = (order: ExamOrder) => {
        setEditingOrder(order);
        setShowOrderModal(true);
    };

    const handleDeleteOrder = (id: number) => {
        if (window.confirm('검사 오더를 삭제하시겠습니까?')) {
            setExamOrders(prev => prev.filter(order => order.id !== id));
        }
    };

    const handleSaveOrder = (orderData: Omit<ExamOrder, 'id'>) => {
        if (editingOrder) {
            // 수정
            setExamOrders(prev => prev.map(order => order.id === editingOrder.id ? { ...orderData, id: editingOrder.id } : order));
        } else {
            // 생성
            const newOrder: ExamOrder = {
                ...orderData,
                id: Date.now()
            };
            setExamOrders(prev => [...prev, newOrder]);
        }
        setShowOrderModal(false);
        setEditingOrder(null);
    };

    return (
        <div style={{ padding: '24px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ marginBottom: '24px' }}>
                    <h1 style={{ 
                        fontSize: '28px', 
                        fontWeight: 700, 
                        color: tokens.colors.text.primary,
                        marginBottom: '8px'
                    }}>
                        검사 관리
                    </h1>
                    <p style={{ 
                        fontSize: '16px', 
                        color: tokens.colors.text.secondary 
                    }}>
                        검사 오더, 결과 입력 및 AI 분석을 관리합니다.
                    </p>
                </div>

                {selectedPatient && (
                    <div style={{
                        backgroundColor: '#f0f9ff',
                        border: '1px solid #3b82f6',
                        borderRadius: '8px',
                        padding: '16px',
                        marginBottom: '24px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <div>
                            <h3 style={{ 
                                margin: 0, 
                                fontSize: '16px', 
                                color: '#1e40af',
                                fontWeight: 600
                            }}>
                                검사 오더 작성 중: {selectedPatient.name} 환자
                            </h3>
                        </div>
                        <button
                            onClick={onPatientClear}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: 'white',
                                color: '#374151',
                                border: '1px solid #d1d5db',
                                borderRadius: '6px',
                                fontSize: '14px',
                                cursor: 'pointer'
                            }}
                        >
                            선택 해제
                        </button>
                    </div>
                )}

                <div style={{ 
                    display: 'flex', 
                    borderBottom: '1px solid #e5e7eb',
                    marginBottom: '24px'
                }}>
                    {[
                        { key: 'orders', label: '검사 오더' },
                        { key: 'results', label: '검사 결과' },
                        { key: 'analysis', label: 'AI 분석' }
                    ].map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key as any)}
                            style={{
                                padding: '12px 24px',
                                border: 'none',
                                backgroundColor: 'transparent',
                                color: activeTab === tab.key ? tokens.colors.primary : tokens.colors.text.secondary,
                                borderBottom: activeTab === tab.key ? `2px solid ${tokens.colors.primary}` : '2px solid transparent',
                                cursor: 'pointer',
                                fontSize: '16px',
                                fontWeight: 500
                            }}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {activeTab === 'orders' && (
                    <div style={{ 
                        backgroundColor: 'white', 
                        padding: '24px', 
                        borderRadius: '8px',
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                    }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '24px'
                        }}>
                            <h3 style={{ 
                                fontSize: '18px', 
                                fontWeight: 600, 
                                margin: 0,
                                color: tokens.colors.text.primary
                            }}>
                                검사 오더 관리
                            </h3>
                            <button
                                onClick={() => setShowOrderModal(true)}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: tokens.colors.primary,
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    fontSize: '14px',
                                    fontWeight: 500,
                                    cursor: 'pointer',
                                    transition: 'background-color 0.2s'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0284c7'}
                                onMouseOut={(e) => e.currentTarget.style.backgroundColor = tokens.colors.primary}
                            >
                                + 신규 검사 오더
                            </button>
                        </div>

                        {/* 필터 섹션 */}
                        <div style={{
                            display: 'flex',
                            gap: '12px',
                            marginBottom: '20px',
                            padding: '16px',
                            backgroundColor: tokens.colors.background.secondary,
                            borderRadius: '6px'
                        }}>
                            <select
                                value={orderFilter.patient || ''}
                                onChange={(e) => setOrderFilter({ ...orderFilter, patient: e.target.value })}
                                style={{
                                    padding: '8px 12px',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '6px',
                                    fontSize: '14px',
                                    minWidth: '150px'
                                }}
                            >
                                <option value="">전체 환자</option>
                                {/* 환자 목록은 나중에 API에서 가져올 예정 */}
                            </select>
                            <select
                                value={orderFilter.category || ''}
                                onChange={(e) => setOrderFilter({ ...orderFilter, category: e.target.value })}
                                style={{
                                    padding: '8px 12px',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '6px',
                                    fontSize: '14px',
                                    minWidth: '150px'
                                }}
                            >
                                <option value="">전체 검사 유형</option>
                                <option value="lab">혈액검사</option>
                                <option value="imaging">영상검사</option>
                                <option value="procedure">처치</option>
                            </select>
                            <input
                                type="date"
                                value={orderFilter.date || ''}
                                onChange={(e) => setOrderFilter({ ...orderFilter, date: e.target.value })}
                                style={{
                                    padding: '8px 12px',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '6px',
                                    fontSize: '14px'
                                }}
                            />
                        </div>

                        {/* 검사 오더 목록 */}
                        <div style={{
                            border: '1px solid #e5e7eb',
                            borderRadius: '6px',
                            overflow: 'hidden'
                        }}>
                            <table style={{
                                width: '100%',
                                borderCollapse: 'collapse'
                            }}>
                                <thead>
                                    <tr style={{
                                        backgroundColor: tokens.colors.background.secondary,
                                        borderBottom: '2px solid #e5e7eb'
                                    }}>
                                        <th style={{
                                            padding: '12px 16px',
                                            textAlign: 'left',
                                            fontSize: '14px',
                                            fontWeight: 600,
                                            color: tokens.colors.text.primary
                                        }}>환자명</th>
                                        <th style={{
                                            padding: '12px 16px',
                                            textAlign: 'left',
                                            fontSize: '14px',
                                            fontWeight: 600,
                                            color: tokens.colors.text.primary
                                        }}>검사 유형</th>
                                        <th style={{
                                            padding: '12px 16px',
                                            textAlign: 'left',
                                            fontSize: '14px',
                                            fontWeight: 600,
                                            color: tokens.colors.text.primary
                                        }}>검사 코드</th>
                                        <th style={{
                                            padding: '12px 16px',
                                            textAlign: 'left',
                                            fontSize: '14px',
                                            fontWeight: 600,
                                            color: tokens.colors.text.primary
                                        }}>우선순위</th>
                                        <th style={{
                                            padding: '12px 16px',
                                            textAlign: 'left',
                                            fontSize: '14px',
                                            fontWeight: 600,
                                            color: tokens.colors.text.primary
                                        }}>요청일시</th>
                                        <th style={{
                                            padding: '12px 16px',
                                            textAlign: 'center',
                                            fontSize: '14px',
                                            fontWeight: 600,
                                            color: tokens.colors.text.primary
                                        }}>작업</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {examOrders.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} style={{
                                                padding: '40px',
                                                textAlign: 'center',
                                                color: tokens.colors.text.secondary
                                            }}>
                                                검사 오더가 없습니다. 신규 검사 오더를 생성해주세요.
                                            </td>
                                        </tr>
                                    ) : (
                                        examOrders.map((order) => (
                                            <tr key={order.id} style={{
                                                borderBottom: '1px solid #e5e7eb',
                                                transition: 'background-color 0.2s'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = tokens.colors.background.secondary}
                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                                            >
                                                <td style={{ padding: '12px 16px', fontSize: '14px' }}>
                                                    {order.patientName || '환자 선택 필요'}
                                                </td>
                                                <td style={{ padding: '12px 16px', fontSize: '14px' }}>
                                                    <span style={{
                                                        padding: '4px 8px',
                                                        borderRadius: '4px',
                                                        fontSize: '12px',
                                                        fontWeight: 500,
                                                        backgroundColor: order.category === 'lab' ? '#dbeafe' : 
                                                                        order.category === 'imaging' ? '#fef3c7' : '#fce7f3',
                                                        color: order.category === 'lab' ? '#1e40af' : 
                                                               order.category === 'imaging' ? '#92400e' : '#831843'
                                                    }}>
                                                        {order.category === 'lab' ? '혈액검사' : 
                                                         order.category === 'imaging' ? '영상검사' : '처치'}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '12px 16px', fontSize: '14px', color: tokens.colors.text.secondary }}>
                                                    {order.code || '-'}
                                                </td>
                                                <td style={{ padding: '12px 16px', fontSize: '14px' }}>
                                                    <span style={{
                                                        padding: '4px 8px',
                                                        borderRadius: '4px',
                                                        fontSize: '12px',
                                                        fontWeight: 500,
                                                        backgroundColor: order.priority === 'urgent' ? '#fee2e2' : 
                                                                        order.priority === 'stat' ? '#fecaca' : '#f0f9ff',
                                                        color: order.priority === 'urgent' ? '#dc2626' : 
                                                               order.priority === 'stat' ? '#991b1b' : '#0369a1'
                                                    }}>
                                                        {order.priority === 'urgent' ? '긴급' : 
                                                         order.priority === 'stat' ? '즉시' : '일반'}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '12px 16px', fontSize: '14px', color: tokens.colors.text.secondary }}>
                                                    {order.requestedAt ? new Date(order.requestedAt).toLocaleString('ko-KR') : '-'}
                                                </td>
                                                <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                                                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                                        <button
                                                            onClick={() => handleEditOrder(order)}
                                                            style={{
                                                                padding: '6px 12px',
                                                                backgroundColor: 'white',
                                                                color: tokens.colors.primary,
                                                                border: `1px solid ${tokens.colors.primary}`,
                                                                borderRadius: '4px',
                                                                fontSize: '12px',
                                                                cursor: 'pointer'
                                                            }}
                                                        >
                                                            수정
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteOrder(order.id)}
                                                            style={{
                                                                padding: '6px 12px',
                                                                backgroundColor: 'white',
                                                                color: tokens.colors.error,
                                                                border: `1px solid ${tokens.colors.error}`,
                                                                borderRadius: '4px',
                                                                fontSize: '12px',
                                                                cursor: 'pointer'
                                                            }}
                                                        >
                                                            삭제
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'results' && (
                    <div style={{ 
                        backgroundColor: 'white', 
                        padding: '24px', 
                        borderRadius: '8px',
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                    }}>
                        <h3 style={{ 
                            fontSize: '18px', 
                            fontWeight: 600, 
                            marginBottom: '16px',
                            color: tokens.colors.text.primary
                        }}>
                            검사 결과 관리
                        </h3>
                        
                        {selectedPatient ? (
                            <div>
                                {/* 검사 결과 입력 폼 */}
                                <div style={{ marginBottom: '24px' }}>
                                    <h4 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px', color: tokens.colors.text.primary }}>
                                        {selectedPatient.name} 환자 검사 결과 입력
                                    </h4>
                                    
                                    <div style={{ display: 'grid', gap: '16px' }}>
                                        {/* 혈압 */}
                                        <div>
                                            <label style={{ display: 'block', fontWeight: 500, marginBottom: '4px', color: tokens.colors.text.secondary }}>
                                                혈압 (mmHg)
                                            </label>
                                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                                <input 
                                                    type="number" 
                                                    placeholder="수축기" 
                                                    value={resultForm.systolicBP}
                                                    onChange={(e) => setResultForm({ ...resultForm, systolicBP: e.target.value })}
                                                    style={{
                                                        padding: '8px 12px',
                                                        border: '1px solid #d1d5db',
                                                        borderRadius: '4px',
                                                        width: '100px'
                                                    }}
                                                />
                                                <span>/</span>
                                                <input 
                                                    type="number" 
                                                    placeholder="이완기" 
                                                    value={resultForm.diastolicBP}
                                                    onChange={(e) => setResultForm({ ...resultForm, diastolicBP: e.target.value })}
                                                    style={{
                                                        padding: '8px 12px',
                                                        border: '1px solid #d1d5db',
                                                        borderRadius: '4px',
                                                        width: '100px'
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        
                                        {/* 심전도 */}
                                        <div>
                                            <label style={{ display: 'block', fontWeight: 500, marginBottom: '4px', color: tokens.colors.text.secondary }}>
                                                심전도
                                            </label>
                                            <select 
                                                value={resultForm.ecg}
                                                onChange={(e) => setResultForm({ ...resultForm, ecg: e.target.value })}
                                                style={{
                                                    padding: '8px 12px',
                                                    border: '1px solid #d1d5db',
                                                    borderRadius: '4px',
                                                    width: '200px'
                                                }}
                                            >
                                                <option value="">선택하세요</option>
                                                <option value="정상">정상</option>
                                                <option value="비정상">비정상</option>
                                                <option value="부정맥">부정맥</option>
                                            </select>
                                        </div>
                                        
                                        {/* 혈당 */}
                                        <div>
                                            <label style={{ display: 'block', fontWeight: 500, marginBottom: '4px', color: tokens.colors.text.secondary }}>
                                                혈당 (mg/dL)
                                            </label>
                                            <input 
                                                type="number" 
                                                placeholder="혈당 수치" 
                                                value={resultForm.bloodSugar}
                                                onChange={(e) => setResultForm({ ...resultForm, bloodSugar: e.target.value })}
                                                style={{
                                                    padding: '8px 12px',
                                                    border: '1px solid #d1d5db',
                                                    borderRadius: '4px',
                                                    width: '200px'
                                                }}
                                            />
                                        </div>
                                        
                                        {/* 기타 검사 */}
                                        <div>
                                            <label style={{ display: 'block', fontWeight: 500, marginBottom: '4px', color: tokens.colors.text.secondary }}>
                                                기타 검사 결과
                                            </label>
                                            <textarea 
                                                placeholder="추가 검사 결과를 입력하세요"
                                                style={{
                                                    padding: '8px 12px',
                                                    border: '1px solid #d1d5db',
                                                    borderRadius: '4px',
                                                    width: '100%',
                                                    minHeight: '80px',
                                                    resize: 'vertical'
                                                }}
                                            />
                                        </div>
                                        
                                        <button 
                                            onClick={async () => {
                                                if (!selectedPatient) return;
                                                
                                                // 검사 결과 생성
                                                const results: ExamResult[] = [];
                                                
                                                if (resultForm.systolicBP && resultForm.diastolicBP) {
                                                    const value = `${resultForm.systolicBP}/${resultForm.diastolicBP}`;
                                                    const status = parseInt(resultForm.systolicBP) > 140 || parseInt(resultForm.diastolicBP) > 90 ? 'abnormal' : 'normal';
                                                    
                                                    // AI 분석 호출
                                                    setIsAnalyzing(results.length);
                                                    try {
                                                        const aiResult = await testAnalysis({
                                                            testResult: {
                                                                testName: '혈압',
                                                                value,
                                                                unit: 'mmHg',
                                                                status: status === 'abnormal' ? 'abnormal' : 'normal',
                                                                referenceRange: '120/80 mmHg 이하'
                                                            },
                                                            patient: {
                                                                name: selectedPatient.name,
                                                                age: selectedPatient.age,
                                                                sex: selectedPatient.sex
                                                            }
                                                        });
                                                        
                                                        results.push({
                                                            id: Date.now(),
                                                            testName: '혈압',
                                                            value,
                                                            unit: 'mmHg',
                                                            referenceRange: '120/80 mmHg 이하',
                                                            status,
                                                            aiAnalysis: aiResult.analysis,
                                                            createdAt: new Date().toISOString()
                                                        });
                                                    } catch (error) {
                                                        console.error('AI 분석 실패:', error);
                                                        results.push({
                                                            id: Date.now(),
                                                            testName: '혈압',
                                                            value,
                                                            unit: 'mmHg',
                                                            referenceRange: '120/80 mmHg 이하',
                                                            status,
                                                            createdAt: new Date().toISOString()
                                                        });
                                                    }
                                                    setIsAnalyzing(null);
                                                }
                                                
                                                if (resultForm.ecg) {
                                                    const status = resultForm.ecg === '정상' ? 'normal' : 'abnormal';
                                                    setIsAnalyzing(results.length);
                                                    try {
                                                        const aiResult = await testAnalysis({
                                                            testResult: {
                                                                testName: '심전도',
                                                                value: resultForm.ecg,
                                                                status,
                                                                referenceRange: '정상'
                                                            },
                                                            patient: {
                                                                name: selectedPatient.name,
                                                                age: selectedPatient.age,
                                                                sex: selectedPatient.sex
                                                            }
                                                        });
                                                        
                                                        results.push({
                                                            id: Date.now() + 1,
                                                            testName: '심전도',
                                                            value: resultForm.ecg,
                                                            status,
                                                            referenceRange: '정상',
                                                            aiAnalysis: aiResult.analysis,
                                                            createdAt: new Date().toISOString()
                                                        });
                                                    } catch (error) {
                                                        console.error('AI 분석 실패:', error);
                                                        results.push({
                                                            id: Date.now() + 1,
                                                            testName: '심전도',
                                                            value: resultForm.ecg,
                                                            status,
                                                            referenceRange: '정상',
                                                            createdAt: new Date().toISOString()
                                                        });
                                                    }
                                                    setIsAnalyzing(null);
                                                }
                                                
                                                if (resultForm.bloodSugar) {
                                                    const valueNum = parseInt(resultForm.bloodSugar);
                                                    const status = valueNum < 70 || valueNum > 100 ? 'abnormal' : 'normal';
                                                    setIsAnalyzing(results.length);
                                                    try {
                                                        const aiResult = await testAnalysis({
                                                            testResult: {
                                                                testName: '혈당',
                                                                value: resultForm.bloodSugar,
                                                                unit: 'mg/dL',
                                                                status,
                                                                referenceRange: '70-100 mg/dL'
                                                            },
                                                            patient: {
                                                                name: selectedPatient.name,
                                                                age: selectedPatient.age,
                                                                sex: selectedPatient.sex
                                                            }
                                                        });
                                                        
                                                        results.push({
                                                            id: Date.now() + 2,
                                                            testName: '혈당',
                                                            value: resultForm.bloodSugar,
                                                            unit: 'mg/dL',
                                                            referenceRange: '70-100 mg/dL',
                                                            status,
                                                            aiAnalysis: aiResult.analysis,
                                                            createdAt: new Date().toISOString()
                                                        });
                                                    } catch (error) {
                                                        console.error('AI 분석 실패:', error);
                                                        results.push({
                                                            id: Date.now() + 2,
                                                            testName: '혈당',
                                                            value: resultForm.bloodSugar,
                                                            unit: 'mg/dL',
                                                            referenceRange: '70-100 mg/dL',
                                                            status,
                                                            createdAt: new Date().toISOString()
                                                        });
                                                    }
                                                    setIsAnalyzing(null);
                                                }
                                                
                                                if (results.length > 0) {
                                                    setExamResults(prev => [...prev, ...results]);
                                                    setResultForm({
                                                        systolicBP: '',
                                                        diastolicBP: '',
                                                        ecg: '',
                                                        bloodSugar: '',
                                                        otherResults: ''
                                                    });
                                                    alert('검사 결과가 저장되었습니다.');
                                                } else {
                                                    alert('검사 결과를 입력해주세요.');
                                                }
                                            }}
                                            style={{
                                                padding: '10px 20px',
                                                backgroundColor: tokens.colors.primary,
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '6px',
                                                fontSize: '14px',
                                                fontWeight: 500,
                                                cursor: 'pointer',
                                                width: 'fit-content'
                                            }}
                                        >
                                            {isAnalyzing !== null ? 'AI 분석 중...' : '검사 결과 저장'}
                                        </button>
                                    </div>
                                </div>
                                
                                {/* 검사 결과 목록 */}
                                <div>
                                    <h4 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px', color: tokens.colors.text.primary }}>
                                        검사 결과 목록
                                    </h4>
                                    <div style={{ 
                                        border: '1px solid #e5e7eb', 
                                        borderRadius: '6px',
                                        overflow: 'hidden'
                                    }}>
                                        {examResults.length === 0 ? (
                                            <div style={{ 
                                                backgroundColor: '#f9fafb', 
                                                padding: '12px 16px',
                                                borderBottom: '1px solid #e5e7eb',
                                                fontSize: '14px',
                                                fontWeight: 500,
                                                color: tokens.colors.text.secondary
                                            }}>
                                                아직 검사 결과가 없습니다.
                                            </div>
                                        ) : (
                                            <div>
                                                {examResults.map((result) => (
                                                    <div key={result.id} style={{
                                                        padding: '16px',
                                                        borderBottom: '1px solid #e5e7eb',
                                                        backgroundColor: result.status === 'critical' ? '#fef2f2' : 
                                                                        result.status === 'abnormal' ? '#fef3c7' : '#f0fdf4'
                                                    }}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                                            <div>
                                                                <h5 style={{ 
                                                                    fontSize: '16px', 
                                                                    fontWeight: 600, 
                                                                    margin: 0,
                                                                    color: tokens.colors.text.primary
                                                                }}>
                                                                    {result.testName}
                                                                </h5>
                                                                <p style={{ 
                                                                    fontSize: '14px', 
                                                                    color: tokens.colors.text.secondary,
                                                                    margin: '4px 0 0 0'
                                                                }}>
                                                                    결과: {result.value} {result.unit || ''}
                                                                    {result.referenceRange && ` (정상범위: ${result.referenceRange})`}
                                                                </p>
                                                            </div>
                                                            <span style={{
                                                                padding: '4px 12px',
                                                                borderRadius: '4px',
                                                                fontSize: '12px',
                                                                fontWeight: 500,
                                                                backgroundColor: result.status === 'critical' ? '#fee2e2' : 
                                                                                result.status === 'abnormal' ? '#fef3c7' : '#dcfce7',
                                                                color: result.status === 'critical' ? '#dc2626' : 
                                                                       result.status === 'abnormal' ? '#92400e' : '#166534'
                                                            }}>
                                                                {result.status === 'critical' ? '위험' : 
                                                                 result.status === 'abnormal' ? '비정상' : '정상'}
                                                            </span>
                                                        </div>
                                                        
                                                        {/* AI 분석 코멘트 */}
                                                        {result.aiAnalysis && (
                                                            <div style={{
                                                                marginTop: '12px',
                                                                padding: '12px',
                                                                backgroundColor: 'white',
                                                                borderRadius: '6px',
                                                                border: '1px solid #e5e7eb'
                                                            }}>
                                                                <div style={{
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    marginBottom: '8px',
                                                                    gap: '8px'
                                                                }}>
                                                                    <span style={{
                                                                        fontSize: '12px',
                                                                        fontWeight: 600,
                                                                        color: tokens.colors.primary
                                                                    }}>
                                                                        🤖 AI 분석
                                                                    </span>
                                                                </div>
                                                                <p style={{
                                                                    fontSize: '14px',
                                                                    color: tokens.colors.text.primary,
                                                                    margin: 0,
                                                                    lineHeight: '1.6',
                                                                    whiteSpace: 'pre-wrap'
                                                                }}>
                                                                    {result.aiAnalysis}
                                                                </p>
                                                            </div>
                                                        )}
                                                        
                                                        <p style={{
                                                            fontSize: '12px',
                                                            color: tokens.colors.text.secondary,
                                                            margin: '8px 0 0 0'
                                                        }}>
                                                            {new Date(result.createdAt).toLocaleString('ko-KR')}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <p style={{ color: tokens.colors.text.secondary }}>
                                환자를 선택하면 검사 결과를 관리할 수 있습니다.
                            </p>
                        )}
                    </div>
                )}

                {activeTab === 'analysis' && (
                    <div style={{ 
                        backgroundColor: 'white', 
                        padding: '24px', 
                        borderRadius: '8px',
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                    }}>
                        <h3 style={{ 
                            fontSize: '18px', 
                            fontWeight: 600, 
                            marginBottom: '16px',
                            color: tokens.colors.text.primary
                        }}>
                            AI 검사 분석 결과
                        </h3>
                        
                        {selectedPatient ? (
                            <div>
                                {/* AI 분석 요약 */}
                                <div style={{ 
                                    backgroundColor: '#f0f9ff',
                                    border: '1px solid #3b82f6',
                                    borderRadius: '8px',
                                    padding: '20px',
                                    marginBottom: '20px'
                                }}>
                                    <h4 style={{ 
                                        fontSize: '16px', 
                                        fontWeight: 600, 
                                        marginBottom: '12px',
                                        color: '#1e40af'
                                    }}>
                                        AI 검사 분석 요약
                                    </h4>
                                    <div style={{ 
                                        fontSize: '14px',
                                        lineHeight: '1.6',
                                        color: '#374151'
                                    }}>
                                        <p><strong>환자:</strong> {selectedPatient.name}</p>
                                        <p><strong>분석 일시:</strong> {new Date().toLocaleString('ko-KR')}</p>
                                        <p><strong>분석 결과:</strong> 전체적으로 정상 범위 내의 검사 결과를 보입니다.</p>
                                    </div>
                                </div>
                                
                                {/* 검사 항목별 분석 */}
                                <div style={{ marginBottom: '20px' }}>
                                    <h4 style={{ 
                                        fontSize: '16px', 
                                        fontWeight: 600, 
                                        marginBottom: '12px',
                                        color: tokens.colors.text.primary
                                    }}>
                                        검사 항목별 분석
                                    </h4>
                                    
                                    <div style={{ display: 'grid', gap: '12px' }}>
                                        {/* 혈압 분석 */}
                                        <div style={{ 
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '6px',
                                            padding: '16px',
                                            backgroundColor: '#f9fafb'
                                        }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                                <span style={{ fontWeight: 600, color: tokens.colors.text.primary }}>혈압</span>
                                                <span style={{ 
                                                    padding: '4px 8px',
                                                    borderRadius: '4px',
                                                    fontSize: '12px',
                                                    fontWeight: 500,
                                                    backgroundColor: '#dcfce7',
                                                    color: '#166534'
                                                }}>
                                                    정상
                                                </span>
                                            </div>
                                            <p style={{ fontSize: '14px', color: tokens.colors.text.secondary, margin: 0 }}>
                                                수축기/이완기 혈압이 정상 범위(<span style={{ color: '#166534', fontWeight: 600 }}>120/80 mmHg 이하</span>)에 있습니다.
                                            </p>
                                        </div>
                                        
                                        {/* 심전도 분석 */}
                                        <div style={{ 
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '6px',
                                            padding: '16px',
                                            backgroundColor: '#f9fafb'
                                        }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                                <span style={{ fontWeight: 600, color: tokens.colors.text.primary }}>심전도</span>
                                                <span style={{ 
                                                    padding: '4px 8px',
                                                    borderRadius: '4px',
                                                    fontSize: '12px',
                                                    fontWeight: 500,
                                                    backgroundColor: '#dcfce7',
                                                    color: '#166534'
                                                }}>
                                                    정상
                                                </span>
                                            </div>
                                            <p style={{ fontSize: '14px', color: tokens.colors.text.secondary, margin: 0 }}>
                                                정상적인 심박 리듬을 보이며 특별한 이상 소견은 없습니다.
                                            </p>
                                        </div>
                                        
                                        {/* 혈당 분석 */}
                                        <div style={{ 
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '6px',
                                            padding: '16px',
                                            backgroundColor: '#f9fafb'
                                        }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                                <span style={{ fontWeight: 600, color: tokens.colors.text.primary }}>혈당</span>
                                                <span style={{ 
                                                    padding: '4px 8px',
                                                    borderRadius: '4px',
                                                    fontSize: '12px',
                                                    fontWeight: 500,
                                                    backgroundColor: '#dcfce7',
                                                    color: '#166534'
                                                }}>
                                                    정상
                                                </span>
                                            </div>
                                            <p style={{ fontSize: '14px', color: tokens.colors.text.secondary, margin: 0 }}>
                                                공복 혈당이 정상 범위(<span style={{ color: '#166534', fontWeight: 600 }}>70-100 mg/dL</span>)에 있습니다.
                                            </p>
                                        </div>
                                        
                                        {/* 이상 수치 예시 - 콜레스테롤 */}
                                        <div style={{ 
                                            border: '1px solid #fecaca',
                                            borderRadius: '6px',
                                            padding: '16px',
                                            backgroundColor: '#fef2f2'
                                        }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                                <span style={{ fontWeight: 600, color: tokens.colors.text.primary }}>총 콜레스테롤</span>
                                                <span style={{ 
                                                    padding: '4px 8px',
                                                    borderRadius: '4px',
                                                    fontSize: '12px',
                                                    fontWeight: 500,
                                                    backgroundColor: '#fecaca',
                                                    color: '#dc2626'
                                                }}>
                                                    비정상
                                                </span>
                                            </div>
                                            <p style={{ fontSize: '14px', color: tokens.colors.text.secondary, margin: 0 }}>
                                                총 콜레스테롤이 <span style={{ color: '#dc2626', fontWeight: 700 }}>280 mg/dL</span>로 정상 범위(<span style={{ color: '#166534', fontWeight: 600 }}>200 mg/dL 이하</span>)를 초과했습니다.
                                            </p>
                                        </div>
                                        
                                        {/* 이상 수치 예시 - 간기능 */}
                                        <div style={{ 
                                            border: '1px solid #fecaca',
                                            borderRadius: '6px',
                                            padding: '16px',
                                            backgroundColor: '#fef2f2'
                                        }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                                <span style={{ fontWeight: 600, color: tokens.colors.text.primary }}>ALT (간기능)</span>
                                                <span style={{ 
                                                    padding: '4px 8px',
                                                    borderRadius: '4px',
                                                    fontSize: '12px',
                                                    fontWeight: 500,
                                                    backgroundColor: '#fecaca',
                                                    color: '#dc2626'
                                                }}>
                                                    비정상
                                                </span>
                                            </div>
                                            <p style={{ fontSize: '14px', color: tokens.colors.text.secondary, margin: 0 }}>
                                                ALT 수치가 <span style={{ color: '#dc2626', fontWeight: 700 }}>85 U/L</span>로 정상 범위(<span style={{ color: '#166534', fontWeight: 600 }}>40 U/L 이하</span>)를 초과했습니다.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* 권장사항 */}
                                <div>
                                    <h4 style={{ 
                                        fontSize: '16px', 
                                        fontWeight: 600, 
                                        marginBottom: '12px',
                                        color: tokens.colors.text.primary
                                    }}>
                                        AI 권장사항
                                    </h4>
                                    <div style={{ 
                                        backgroundColor: '#fef3c7',
                                        border: '1px solid #f59e0b',
                                        borderRadius: '6px',
                                        padding: '16px'
                                    }}>
                                        <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px', lineHeight: '1.6', color: '#92400e' }}>
                                            <li>규칙적인 운동과 균형 잡힌 식단을 유지하세요.</li>
                                            <li>충분한 수면과 스트레스 관리를 권장합니다.</li>
                                            <li>정기적인 건강 검진을 받으시기 바랍니다.</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <p style={{ color: tokens.colors.text.secondary }}>
                                환자를 선택하면 AI 검사 분석 결과를 확인할 수 있습니다.
                            </p>
                        )}
                    </div>
                )}
            </div>

            {/* 검사 오더 생성/수정 모달 */}
            {showOrderModal && (
                <ExamOrderModal
                    isOpen={showOrderModal}
                    onClose={() => {
                        setShowOrderModal(false);
                        setEditingOrder(null);
                    }}
                    onSubmit={handleSaveOrder}
                    editingOrder={editingOrder}
                    selectedPatient={selectedPatient}
                />
            )}
        </div>
    );
};

// 검사 오더 생성/수정 모달 컴포넌트
interface ExamOrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (orderData: Omit<ExamOrder, 'id'>) => void;
    editingOrder: ExamOrder | null;
    selectedPatient: WaitingPatient | null;
}

const ExamOrderModal: React.FC<ExamOrderModalProps> = ({ isOpen, onClose, onSubmit, editingOrder, selectedPatient }) => {
    const [formData, setFormData] = useState({
        patientName: editingOrder?.patientName || selectedPatient?.name || '',
        patientId: editingOrder?.patientId || undefined,
        category: editingOrder?.category || 'lab' as 'lab' | 'imaging' | 'procedure',
        code: editingOrder?.code || '',
        priority: editingOrder?.priority || 'routine' as 'routine' | 'urgent' | 'stat'
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            ...formData,
            requestedAt: new Date().toISOString()
        });
    };

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
        }}>
            <div style={{
                background: 'white',
                borderRadius: '12px',
                padding: '24px',
                width: '500px',
                maxWidth: '90vw',
                maxHeight: '90vh',
                overflow: 'auto',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '24px',
                    borderBottom: '1px solid #e5e7eb',
                    paddingBottom: '16px'
                }}>
                    <h3 style={{
                        fontSize: '20px',
                        fontWeight: 600,
                        margin: 0,
                        color: tokens.colors.text.primary
                    }}>
                        {editingOrder ? '검사 오더 수정' : '신규 검사 오더'}
                    </h3>
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

                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {/* 환자 선택 */}
                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: '14px',
                                fontWeight: 500,
                                marginBottom: '8px',
                                color: tokens.colors.text.primary
                            }}>
                                환자 *
                            </label>
                            <input
                                type="text"
                                value={formData.patientName}
                                onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                                placeholder="환자명을 입력하세요"
                                required
                                style={{
                                    width: '100%',
                                    padding: '10px 12px',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '6px',
                                    fontSize: '14px'
                                }}
                            />
                        </div>

                        {/* 검사 유형 */}
                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: '14px',
                                fontWeight: 500,
                                marginBottom: '8px',
                                color: tokens.colors.text.primary
                            }}>
                                검사 유형 *
                            </label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                                required
                                style={{
                                    width: '100%',
                                    padding: '10px 12px',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '6px',
                                    fontSize: '14px'
                                }}
                            >
                                <option value="lab">혈액검사</option>
                                <option value="imaging">영상검사</option>
                                <option value="procedure">처치</option>
                            </select>
                        </div>

                        {/* 검사 코드 */}
                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: '14px',
                                fontWeight: 500,
                                marginBottom: '8px',
                                color: tokens.colors.text.primary
                            }}>
                                검사 코드
                            </label>
                            <input
                                type="text"
                                value={formData.code}
                                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                placeholder="예: CBC, CT, X-ray 등"
                                style={{
                                    width: '100%',
                                    padding: '10px 12px',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '6px',
                                    fontSize: '14px'
                                }}
                            />
                        </div>

                        {/* 우선순위 */}
                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: '14px',
                                fontWeight: 500,
                                marginBottom: '8px',
                                color: tokens.colors.text.primary
                            }}>
                                우선순위 *
                            </label>
                            <select
                                value={formData.priority}
                                onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                                required
                                style={{
                                    width: '100%',
                                    padding: '10px 12px',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '6px',
                                    fontSize: '14px'
                                }}
                            >
                                <option value="routine">일반</option>
                                <option value="urgent">긴급</option>
                                <option value="stat">즉시</option>
                            </select>
                        </div>
                    </div>

                    <div style={{
                        display: 'flex',
                        gap: '12px',
                        justifyContent: 'flex-end',
                        marginTop: '24px',
                        paddingTop: '24px',
                        borderTop: '1px solid #e5e7eb'
                    }}>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: 'white',
                                color: tokens.colors.text.primary,
                                border: '1px solid #d1d5db',
                                borderRadius: '6px',
                                fontSize: '14px',
                                fontWeight: 500,
                                cursor: 'pointer'
                            }}
                        >
                            취소
                        </button>
                        <button
                            type="submit"
                            style={{
                                padding: '10px 20px',
                                backgroundColor: tokens.colors.primary,
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                fontSize: '14px',
                                fontWeight: 500,
                                cursor: 'pointer'
                            }}
                        >
                            {editingOrder ? '수정' : '생성'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};