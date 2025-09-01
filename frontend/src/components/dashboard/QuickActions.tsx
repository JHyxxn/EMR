import React from 'react';
import { Card, SectionTitle, Button } from '../common';
import { tokens } from '../../design/tokens';

interface QuickActionsProps {
    onNewPatient: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ onNewPatient }) => {
    return (
        <div style={{ display: "grid", gap: tokens.space.md }}>
            {/* 빠른 액션 */}
            <div style={{ 
                background: "white", 
                borderRadius: tokens.borderRadius.md,
                padding: tokens.space.md,
                border: "1px solid #e5e7eb"
            }}>
                            <div style={{ 
                fontSize: "16px", 
                fontWeight: 700, 
                marginBottom: tokens.space.md,
                color: "#374151",
                textAlign: "center"
            }}>
                    빠른 액션
                </div>
                <div style={{ display: "grid", gap: tokens.space.sm }}>
                    <button 
                        onClick={onNewPatient}
                        style={{
                            background: "#f3f4f6",
                            color: "#374151",
                            border: "1px solid #d1d5db",
                            borderRadius: "8px",
                            padding: "8px 12px",
                            cursor: "pointer",
                            fontSize: tokens.fontSize.sm,
                            fontWeight: 500,
                            textAlign: "left",
                            width: "100%"
                        }}
                    >
                        신규 환자 등록
                    </button>
                    <button 
                        style={{
                            background: "#f3f4f6",
                            color: "#374151",
                            border: "1px solid #d1d5db",
                            borderRadius: "8px",
                            padding: "8px 12px",
                            cursor: "pointer",
                            fontSize: tokens.fontSize.sm,
                            fontWeight: 500,
                            textAlign: "left",
                            width: "100%"
                        }}
                    >
                        검사 결과 확인
                    </button>
                    <button 
                        style={{
                            background: "#f3f4f6",
                            color: "#374151",
                            border: "1px solid #d1d5db",
                            borderRadius: "8px",
                            padding: "8px 12px",
                            cursor: "pointer",
                            fontSize: tokens.fontSize.sm,
                            fontWeight: 500,
                            textAlign: "left",
                            width: "100%"
                        }}
                    >
                        노트 작성
                    </button>
                    <button 
                        style={{
                            background: "#f3f4f6",
                            color: "#374151",
                            border: "1px solid #d1d5db",
                            borderRadius: "8px",
                            padding: "8px 12px",
                            cursor: "pointer",
                            fontSize: tokens.fontSize.sm,
                            fontWeight: 500,
                            textAlign: "left",
                            width: "100%"
                        }}
                    >
                        예약 관리
                    </button>
                </div>
            </div>


        </div>
    );
};

