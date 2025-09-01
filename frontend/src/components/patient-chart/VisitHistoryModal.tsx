import React from 'react';

interface VisitHistory {
    date: string;
    visitType: string;
    symptoms: string;
    diagnosis: string;
    prescription: string;
    notes: string;
    doctor: string;
}

interface VisitHistoryModalProps {
    visit: VisitHistory;
    isOpen: boolean;
    onClose: () => void;
}

export const VisitHistoryModal: React.FC<VisitHistoryModalProps> = ({
    visit,
    isOpen,
    onClose
}) => {
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
                maxWidth: '600px',
                maxHeight: '80%',
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
                        방문 내역 상세보기 - {visit.date}
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

                {/* 콘텐츠 */}
                <div style={{
                    padding: '24px',
                    overflowY: 'auto',
                    flex: 1
                }}>
                    {/* 기본 정보 */}
                    <div style={{
                        backgroundColor: '#f9fafb',
                        padding: '16px',
                        borderRadius: '6px',
                        marginBottom: '20px'
                    }}>
                        <div style={{ marginBottom: '8px' }}>
                            <strong>방문일:</strong> {visit.date}
                        </div>
                        <div style={{ marginBottom: '8px' }}>
                            <strong>방문 유형:</strong> {visit.visitType}
                        </div>
                        <div>
                            <strong>담당 의사:</strong> {visit.doctor}
                        </div>
                    </div>

                    {/* SOAP 기록 */}
                    <div style={{ marginBottom: '20px' }}>
                        <h3 style={{
                            margin: '0 0 12px 0',
                            fontSize: '16px',
                            fontWeight: 600,
                            color: '#374151'
                        }}>
                            진료 기록
                        </h3>
                        
                        <div style={{ marginBottom: '12px' }}>
                            <strong style={{ color: '#374151' }}>주요 증상:</strong>
                            <div style={{
                                padding: '8px',
                                backgroundColor: '#f9fafb',
                                borderRadius: '4px',
                                marginTop: '4px'
                            }}>
                                {visit.symptoms}
                            </div>
                        </div>

                        <div style={{ marginBottom: '12px' }}>
                            <strong style={{ color: '#374151' }}>진단:</strong>
                            <div style={{
                                padding: '8px',
                                backgroundColor: '#f9fafb',
                                borderRadius: '4px',
                                marginTop: '4px'
                            }}>
                                {visit.diagnosis}
                            </div>
                        </div>

                        <div style={{ marginBottom: '12px' }}>
                            <strong style={{ color: '#374151' }}>처방:</strong>
                            <div style={{
                                padding: '8px',
                                backgroundColor: '#f9fafb',
                                borderRadius: '4px',
                                marginTop: '4px'
                            }}>
                                {visit.prescription}
                            </div>
                        </div>

                        <div>
                            <strong style={{ color: '#374151' }}>의료진 메모:</strong>
                            <div style={{
                                padding: '8px',
                                backgroundColor: '#f9fafb',
                                borderRadius: '4px',
                                marginTop: '4px'
                            }}>
                                {visit.notes}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 하단 버튼 */}
                <div style={{
                    padding: '16px 24px',
                    borderTop: '1px solid #e5e7eb',
                    display: 'flex',
                    justifyContent: 'flex-end'
                }}>
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
