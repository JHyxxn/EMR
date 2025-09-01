import React from 'react';

interface VitalInputProps {
    formData: any;
    onInputChange: (field: string, value: string) => void;
    getFieldError: (fieldName: string) => string | null;
    onSaveVitals: () => void;
    isSavingVitals: boolean;
}

export const VitalInput: React.FC<VitalInputProps> = ({
    formData,
    onInputChange,
    getFieldError,
    onSaveVitals,
    isSavingVitals
}) => {
    return (
        <div style={{ 
            background: "white", 
            borderRadius: "8px",
            padding: "20px",
            border: "1px solid #e5e7eb"
        }}>
            <h3 style={{ 
                fontSize: "18px", 
                fontWeight: 600, 
                marginBottom: "16px",
                color: "#374151"
            }}>
                바이탈 입력
            </h3>
            <div style={{ display: "grid", gap: "16px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div>
                        <label style={{ 
                            display: "block", 
                            fontSize: "14px", 
                            fontWeight: 500, 
                            marginBottom: "6px",
                            color: "#374151"
                        }}>
                            체온
                        </label>
                        <input 
                            type="number" 
                            placeholder="예: 36.5" 
                            value={formData.temperature}
                            onChange={(e) => onInputChange('temperature', e.target.value)}
                            style={{
                                width: "100%",
                                padding: "8px 12px",
                                border: `1px solid ${getFieldError('temperature') ? '#dc2626' : '#d1d5db'}`,
                                borderRadius: "6px",
                                fontSize: "14px",
                                boxSizing: "border-box"
                            }}
                        />
                        {getFieldError('temperature') && (
                            <div style={{ fontSize: "12px", color: "#dc2626", marginTop: "4px" }}>
                                {getFieldError('temperature')}
                            </div>
                        )}
                    </div>
                    <div>
                        <label style={{ 
                            display: "block", 
                            fontSize: "14px", 
                            fontWeight: 500, 
                            marginBottom: "6px",
                            color: "#374151"
                        }}>
                            혈압
                        </label>
                        <input 
                            type="text" 
                            placeholder="예: 120/80" 
                            value={formData.bloodPressure}
                            onChange={(e) => onInputChange('bloodPressure', e.target.value)}
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
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div>
                        <label style={{ 
                            display: "block", 
                            fontSize: "14px", 
                            fontWeight: 500, 
                            marginBottom: "6px",
                            color: "#374151"
                        }}>
                            맥박
                        </label>
                        <input 
                            type="number" 
                            placeholder="예: 72" 
                            value={formData.pulse}
                            onChange={(e) => onInputChange('pulse', e.target.value)}
                            style={{
                                width: "100%",
                                padding: "8px 12px",
                                border: `1px solid ${getFieldError('pulse') ? '#dc2626' : '#d1d5db'}`,
                                borderRadius: "6px",
                                fontSize: "14px",
                                boxSizing: "border-box"
                            }}
                        />
                        {getFieldError('pulse') && (
                            <div style={{ fontSize: "12px", color: "#dc2626", marginTop: "4px" }}>
                                {getFieldError('pulse')}
                            </div>
                        )}
                    </div>
                    <div>
                        <label style={{ 
                            display: "block", 
                            fontSize: "14px", 
                            fontWeight: 500, 
                            marginBottom: "6px",
                            color: "#374151"
                        }}>
                            키
                        </label>
                        <input 
                            type="number" 
                            placeholder="예: 170" 
                            value={formData.height}
                            onChange={(e) => onInputChange('height', e.target.value)}
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
                <div>
                    <label style={{ 
                        display: "block", 
                        fontSize: "14px", 
                        fontWeight: 500, 
                        marginBottom: "6px",
                        color: "#374151"
                    }}>
                        체중
                    </label>
                    <input 
                        type="number" 
                        placeholder="예: 65" 
                        value={formData.weight}
                        onChange={(e) => onInputChange('weight', e.target.value)}
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
            
            {/* 바이탈 저장 버튼 */}
            <div style={{ marginTop: "16px", textAlign: "right" }}>
                <button 
                    onClick={onSaveVitals}
                    disabled={isSavingVitals}
                    style={{
                        padding: "8px 16px",
                        background: "#f3f4f6",
                        color: "#374151",
                        border: "1px solid #d1d5db",
                        borderRadius: "6px",
                        fontSize: "14px",
                        fontWeight: 500,
                        cursor: isSavingVitals ? "not-allowed" : "pointer",
                        opacity: isSavingVitals ? 0.6 : 1
                    }}
                >
                    {isSavingVitals ? "저장 중..." : "바이탈 저장"}
                </button>
            </div>
        </div>
    );
};
