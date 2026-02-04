/**
 * Segment Progress Graph 컴포넌트
 * 검사 진행률을 segment(칸) 형태로 표시
 */
import React from 'react';

interface ProgressGraphProps {
    totalSteps: number;  // 전체 검사 항목 수
    doneSteps: number;   // 완료된 검사 항목 수
    showText?: boolean;  // "done/total" 텍스트 표시 여부 (기본값: false)
}

export const ProgressGraph: React.FC<ProgressGraphProps> = ({
    totalSteps,
    doneSteps,
    showText = false
}) => {
    if (totalSteps === 0) {
        return null;
    }

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
        }}>
            {/* Segment 그래프 */}
            <div style={{
                display: 'flex',
                gap: '4px',
                alignItems: 'center'
            }}>
                {Array.from({ length: totalSteps }, (_, index) => {
                    const isFilled = index < doneSteps;
                    return (
                        <div
                            key={index}
                            style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '2px',
                                backgroundColor: isFilled ? '#5D6D7E' : '#e5e7eb',
                                border: isFilled ? 'none' : '1px solid #d1d5db',
                                transition: 'background-color 0.2s'
                            }}
                        />
                    );
                })}
            </div>
            
            {/* "done/total" 텍스트 */}
            {showText && (
                <span style={{
                    fontSize: '12px',
                    color: '#6b7280',
                    fontWeight: 500
                }}>
                    {doneSteps}/{totalSteps}
                </span>
            )}
        </div>
    );
};
