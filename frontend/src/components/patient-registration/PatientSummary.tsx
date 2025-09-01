import React from 'react';

export const PatientSummary: React.FC = () => {
    return (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
            {/* 환자 기본정보 */}
            <div style={{ 
                background: "white", 
                borderRadius: "8px",
                padding: "16px",
                border: "1px solid #e5e7eb"
            }}>
                <div style={{ 
                    fontSize: "16px", 
                    fontWeight: 600, 
                    marginBottom: "12px",
                    color: "#374151"
                }}>
                    환자 기본정보
                </div>
                <div style={{ fontSize: "14px", color: "#6b7280", lineHeight: "1.6" }}>
                    <div>• 최근 방문: 오늘 (초진)</div>
                    <div>• 활성 오더: 없음</div>
                    <div>• 알러지: 입력 필요</div>
                    <div>• 주치의: 미배정</div>
                </div>
            </div>

            {/* 최근 바이탈 */}
            <div style={{ 
                background: "white", 
                borderRadius: "8px",
                padding: "16px",
                border: "1px solid #e5e7eb"
            }}>
                <div style={{ 
                    fontSize: "16px", 
                    fontWeight: 600, 
                    marginBottom: "12px",
                    color: "#374151"
                }}>
                    최근 바이탈
                </div>
                <div style={{ fontSize: "14px", color: "#6b7280", lineHeight: "1.6" }}>
                    <div>• 체온: 측정 필요</div>
                    <div>• 혈압: 측정 필요</div>
                    <div>• 맥박: 측정 필요</div>
                    <div>• 체중: 측정 필요</div>
                </div>
            </div>
        </div>
    );
};
