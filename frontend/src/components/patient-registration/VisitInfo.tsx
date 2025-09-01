import React from 'react';

interface VisitInfoProps {
    formData: any;
    onInputChange: (field: string, value: string) => void;
    onSaveVisitInfo: () => void;
    onAISummary: () => void;
    isSavingVisitInfo: boolean;
}

export const VisitInfo: React.FC<VisitInfoProps> = ({
    formData,
    onInputChange,
    onSaveVisitInfo,
    onAISummary,
    isSavingVisitInfo
}) => {
    return (
                <div style={{ 
            background: "white", 
            borderRadius: "8px",
            padding: "20px",
            border: "2px solid #e5e7eb",
            minHeight: "300px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            display: "flex",
            flexDirection: "column"
        }}>
            <div style={{ 
                fontSize: "18px", 
                fontWeight: 700, 
                marginBottom: "16px",
                color: "#374151"
            }}>
                방문정보
            </div>
            <div style={{ display: "grid", gap: "20px", flex: 1 }}>
                <div>
                    <label style={{ fontSize: "14px", fontWeight: 500, color: "#374151", marginBottom: "4px", display: "block" }}>
                        방문 유형
                    </label>
                    <select
                        value={formData.visitType}
                        onChange={(e) => onInputChange('visitType', e.target.value)}
                        style={{
                            width: "100%",
                            padding: "8px 12px",
                            border: "1px solid #d1d5db",
                            borderRadius: "6px",
                            fontSize: "14px",
                            background: "white",
                            boxSizing: "border-box"
                        }}
                    >
                        <option value="">선택</option>
                        <option value="초진">초진</option>
                        <option value="재진">재진</option>
                        <option value="응급">응급</option>
                    </select>
                </div>
                <div>
                    <label style={{ fontSize: "14px", fontWeight: 500, color: "#374151", marginBottom: "4px", display: "block" }}>
                        주요 증상
                    </label>
                    <textarea
                        placeholder="어디가 아파서 오셨나요? (예: 두통, 복통, 발열 등)"
                        value={formData.symptoms}
                        onChange={(e) => onInputChange('symptoms', e.target.value)}
                        style={{
                            width: "100%",
                            minHeight: "150px",
                            padding: "8px 12px",
                            border: "1px solid #d1d5db",
                            borderRadius: "6px",
                            fontSize: "14px",
                            resize: "vertical",
                            boxSizing: "border-box"
                        }}
                    />
                </div>
                <div>
                    <label style={{ fontSize: "14px", fontWeight: 500, color: "#374151", marginBottom: "4px", display: "block" }}>
                        증상 기간
                    </label>
                    <input
                        type="text"
                        placeholder="예: 3일 전부터"
                        value={formData.symptomDuration}
                        onChange={(e) => onInputChange('symptomDuration', e.target.value)}
                        style={{
                            width: "100%",
                            padding: "8px 12px",
                            border: "1px solid #d1d5db",
                            borderRadius: "6px",
                            fontSize: "14px",
                            boxSizing: "border-box"
                        }}
                    />
                </div>
            </div>
            
            {/* 방문정보 저장 버튼들 - 맨 밑에 고정 */}
            <div style={{ marginTop: "auto", paddingTop: "16px", display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                <button 
                    onClick={onSaveVisitInfo}
                    disabled={isSavingVisitInfo}
                    style={{
                        padding: "8px 16px",
                        background: "#f3f4f6",
                        color: "#374151",
                        border: "1px solid #d1d5db",
                        borderRadius: "6px",
                        fontSize: "14px",
                        fontWeight: 500,
                        cursor: isSavingVisitInfo ? "not-allowed" : "pointer",
                        opacity: isSavingVisitInfo ? 0.6 : 1
                    }}
                >
                    {isSavingVisitInfo ? "저장 중..." : "정보 저장"}
                </button>
                <button 
                    onClick={onAISummary}
                    style={{
                        padding: "8px 16px",
                        background: "#5D6D7E",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        fontSize: "14px",
                        fontWeight: 500,
                        cursor: "pointer"
                    }}
                >
                    AI 요약
                </button>
            </div>
        </div>
    );
};
