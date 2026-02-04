/**
 * 검사 결과 준비 완료 행 컴포넌트
 * resultsReadySection에서 사용
 */
import React from 'react';
import { ProgressGraph } from '../common/ProgressGraph';

interface ResultsReadyRowProps {
    reservationTime?: string;
    name: string;
    age: string | number;
    visitType: '초진' | '재진';
    summary?: string;  // AI 요약 문구
    needsTransfer?: boolean;  // 상급병원 이송 필요 여부
    totalSteps: number;  // 전체 검사 항목 수
    doneSteps: number;  // 완료된 검사 항목 수 (항상 totalSteps와 같음)
    onRevisit?: () => void;
    onDetail?: () => void;
}

export const ResultsReadyRow: React.FC<ResultsReadyRowProps> = ({
    reservationTime,
    name,
    age,
    visitType,
    summary,
    needsTransfer,
    totalSteps,
    doneSteps,
    onRevisit,
    onDetail
}) => {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px',
            background: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            gap: '16px'
        }}>
            {/* 왼쪽: 시간 / 환자명 / 요약 */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                flex: 1,
                minWidth: 0
            }}>
                {/* 시간 */}
                {reservationTime && (
                    <div style={{
                        fontSize: '16px',
                        fontWeight: 700,
                        color: '#374151'
                    }}>
                        {reservationTime}
                    </div>
                )}
                
                {/* 환자명(나이, 재진) */}
                <div style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#374151'
                }}>
                    {name} ({age}세, {visitType})
                </div>
                
                {/* 요약 텍스트 영역 */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    flexWrap: 'wrap'
                }}>
                    {/* ProgressGraph */}
                    <ProgressGraph
                        totalSteps={totalSteps}
                        doneSteps={doneSteps}
                        showText={false}
                    />
                    
                    {/* AI 요약 문구 */}
                    {summary && (
                        <span style={{
                            fontSize: '13px',
                            color: needsTransfer ? '#dc2626' : '#6b7280',
                            fontWeight: needsTransfer ? 600 : 400
                        }}>
                            {summary}
                        </span>
                    )}
                </div>
            </div>
            
            {/* 오른쪽: 버튼 2개 */}
            <div style={{
                display: 'flex',
                gap: '8px',
                alignItems: 'center',
                flexShrink: 0
            }}>
                {onRevisit && (
                    <button
                        onClick={onRevisit}
                        style={{
                            padding: "6px 12px",
                            background: "#3b82f6",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            fontSize: "12px",
                            fontWeight: 500,
                            cursor: "pointer",
                            transition: "background-color 0.2s",
                            whiteSpace: "nowrap"
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#2563eb';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = '#3b82f6';
                        }}
                    >
                        재진료
                    </button>
                )}
                {onDetail && (
                    <button
                        onClick={onDetail}
                        style={{
                            padding: "6px 12px",
                            background: "#f3f4f6",
                            color: "#374151",
                            border: "1px solid #d1d5db",
                            borderRadius: "6px",
                            fontSize: "12px",
                            fontWeight: 500,
                            cursor: "pointer",
                            whiteSpace: "nowrap"
                        }}
                    >
                        상세보기
                    </button>
                )}
            </div>
        </div>
    );
};
