/**
 * 검사 관리 페이지 컴포넌트
 */
import React, { useState, useEffect } from 'react';
import { tokens } from '../design/tokens';
import { WaitingPatient } from '../data/waitingPatientsData';

interface ExamManagementProps {
    selectedPatient: WaitingPatient | null;
    onPatientClear: () => void;
}

export const ExamManagement: React.FC<ExamManagementProps> = ({ selectedPatient, onPatientClear }) => {
    const [activeTab, setActiveTab] = useState<'orders' | 'results' | 'analysis'>('orders');

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
                        <h3 style={{ 
                            fontSize: '18px', 
                            fontWeight: 600, 
                            marginBottom: '16px',
                            color: tokens.colors.text.primary
                        }}>
                            검사 오더 관리
                        </h3>
                        <p>검사 오더를 관리할 수 있습니다.</p>
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
                        <p>검사 결과를 관리할 수 있습니다.</p>
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
                            AI 분석
                        </h3>
                        <p>AI 분석 결과를 확인할 수 있습니다.</p>
                    </div>
                )}
            </div>
        </div>
    );
};