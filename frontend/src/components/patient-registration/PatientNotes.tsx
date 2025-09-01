import React from 'react';

interface PatientNotesProps {
    formData: any;
    onInputChange: (field: string, value: string) => void;
}

export const PatientNotes: React.FC<PatientNotesProps> = ({
    formData,
    onInputChange
}) => {
    return (
        <div style={{ 
            background: "white", 
            borderRadius: "8px",
            padding: "20px",
            border: "2px solid #e5e7eb",
            height: "fit-content",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
        }}>
            <div style={{ 
                fontSize: "18px", 
                fontWeight: 700, 
                marginBottom: "16px",
                color: "#374151"
            }}>
                노트
            </div>
            <div>
                <textarea
                    placeholder="AI 요약된 내용이 여기에 표시됩니다..."
                    value={formData.observations}
                    onChange={(e) => onInputChange('observations', e.target.value)}
                    style={{
                        width: "100%",
                        minHeight: "120px",
                        padding: "8px 12px",
                        border: "1px solid #d1d5db",
                        borderRadius: "6px",
                        fontSize: "14px",
                        resize: "vertical",
                        boxSizing: "border-box"
                    }}
                />
            </div>
        </div>
    );
};
