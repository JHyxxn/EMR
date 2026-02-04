/**
 * 검사 진행 중 행 컴포넌트
 * inProgressSection에서 사용
 */
import React from 'react';
import { ProgressGraph } from '../common/ProgressGraph';

interface InProgressRowProps {
    reservationTime?: string;
    name: string;
    age: string | number;
    visitType: '초진' | '재진';
    summary?: string;  // 환자명 아래 한 줄 요약 (선택적)
    currentTestName?: string;  // 현재 진행 중인 검사명
    totalSteps: number;  // 전체 검사 항목 수
    doneSteps: number;  // 완료된 검사 항목 수 (totalSteps보다 작음)
    onRevisit?: () => void;
    onDetail?: () => void;
}

export const InProgressRow: React.FC<InProgressRowProps> = ({
    reservationTime,
    name,
    age,
    visitType,
    summary,
    currentTestName,
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
            {/* 왼쪽: 시간 / 환자명 / 요약 / 상태 텍스트 */}
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
                
                {/* 요약 텍스트 (선택적) */}
                {summary && (
                    <div style={{
                        fontSize: '13px',
                        color: '#6b7280'
                    }}>
                        {summary}
                    </div>
                )}
                
                {/* 상태 텍스트: ProgressGraph + "현재 검사명 + 진행 중" */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginTop: '4px'
                }}>
                    <ProgressGraph
                        totalSteps={totalSteps}
                        doneSteps={doneSteps}
                        showText={false}  // "done/total" 텍스트 제거
                    />
                    <span style={{
                        fontSize: '12px',
                        color: '#6b7280',
                        fontWeight: 500
                    }}>
                        {currentTestName || '검사'} 진행 중
                    </span>
                </div>
            </div>
            
            {/* 오른쪽: 버튼 2개 (둘 다 secondary 스타일) */}
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
