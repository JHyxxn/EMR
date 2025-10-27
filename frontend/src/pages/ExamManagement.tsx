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
                                            <select style={{
                                                padding: '8px 12px',
                                                border: '1px solid #d1d5db',
                                                borderRadius: '4px',
                                                width: '200px'
                                            }}>
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
                                        
                                        <button style={{
                                            padding: '10px 20px',
                                            backgroundColor: tokens.colors.primary,
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '6px',
                                            fontSize: '14px',
                                            fontWeight: 500,
                                            cursor: 'pointer',
                                            width: 'fit-content'
                                        }}>
                                            검사 결과 저장
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
        </div>
    );
};