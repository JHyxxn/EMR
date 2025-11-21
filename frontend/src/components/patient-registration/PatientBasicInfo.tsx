import React, { useEffect } from 'react';
import { generateMRN } from '../../utils/mrnGenerator';

interface PatientBasicInfoProps {
    formData: any;
    onInputChange: (field: string, value: string) => void;
    getFieldError: (fieldName: string) => string | null;
    onSaveBasicInfo: () => void;
    isSavingBasicInfo: boolean;
}

export const PatientBasicInfo: React.FC<PatientBasicInfoProps> = ({
    formData,
    onInputChange,
    getFieldError,
    onSaveBasicInfo,
    isSavingBasicInfo
}) => {
    // 컴포넌트가 마운트될 때 MRN이 비어있으면 자동으로 생성
    useEffect(() => {
        if (!formData.mrn) {
            const newMRN = generateMRN();
            onInputChange('mrn', newMRN);
        }
    }, [formData.mrn, onInputChange]);
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
                기본 정보
            </h3>
            <div style={{ display: "grid", gap: "16px" }}>
                {/* 1행: MRN, 이름, 성별 */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                    <div>
                        <label style={{ 
                            display: "block", 
                            fontSize: "14px", 
                            fontWeight: 500, 
                            marginBottom: "6px",
                            color: "#374151"
                        }}>
                            MRN (자동생성)
                        </label>
                        <input 
                            type="text" 
                            value={formData.mrn}
                            readOnly
                            disabled
                            style={{
                                width: "100%",
                                padding: "8px 12px",
                                border: "1px solid #d1d5db",
                                borderRadius: "6px",
                                fontSize: "14px",
                                boxSizing: "border-box",
                                backgroundColor: "#f3f4f6",
                                color: "#6b7280",
                                cursor: "not-allowed",
                                userSelect: "none"
                            }}
                        />
                        <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "4px" }}>
                            자동 생성된 환자 번호입니다
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
                            이름
                        </label>
                        <input 
                            type="text" 
                            placeholder="예: 이지현" 
                            value={formData.name}
                            onChange={(e) => onInputChange('name', e.target.value)}
                            style={{
                                width: "100%",
                                padding: "8px 12px",
                                border: `1px solid ${getFieldError('name') ? '#dc2626' : '#d1d5db'}`,
                                borderRadius: "6px",
                                fontSize: "14px",
                                boxSizing: "border-box"
                            }}
                        />
                        {getFieldError('name') && (
                            <div style={{ fontSize: "12px", color: "#dc2626", marginTop: "4px" }}>
                                {getFieldError('name')}
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
                            성별
                        </label>
                        <select 
                            value={formData.gender}
                            onChange={(e) => onInputChange('gender', e.target.value)}
                            style={{
                                width: "100%",
                                padding: "8px 12px",
                                border: `1px solid ${getFieldError('gender') ? '#dc2626' : '#d1d5db'}`,
                                borderRadius: "6px",
                                fontSize: "14px",
                                background: "white",
                                boxSizing: "border-box"
                            }}
                        >
                            <option value="">선택</option>
                            <option value="male">남성</option>
                            <option value="female">여성</option>
                        </select>
                        {getFieldError('gender') && (
                            <div style={{ fontSize: "12px", color: "#dc2626", marginTop: "4px" }}>
                                {getFieldError('gender')}
                            </div>
                        )}
                    </div>
                </div>
                
                {/* 2행: 생년월일, 전화번호 */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div>
                        <label style={{ 
                            display: "block", 
                            fontSize: "14px", 
                            fontWeight: 500, 
                            marginBottom: "6px",
                            color: "#374151"
                        }}>
                            생년월일
                        </label>
                        <input 
                            type="date" 
                            value={formData.birthDate || formData.dob || ''}
                            onChange={(e) => {
                                onInputChange('birthDate', e.target.value);
                                // 호환성을 위해 dob도 업데이트
                                if (formData.dob !== undefined) {
                                    onInputChange('dob', e.target.value);
                                }
                            }}
                            style={{
                                width: "100%",
                                padding: "8px 12px",
                                border: `1px solid ${getFieldError('birthDate') || getFieldError('dob') ? '#dc2626' : '#d1d5db'}`,
                                borderRadius: "6px",
                                fontSize: "14px",
                                boxSizing: "border-box"
                            }}
                        />
                        {(getFieldError('birthDate') || getFieldError('dob')) && (
                            <div style={{ fontSize: "12px", color: "#dc2626", marginTop: "4px" }}>
                                {getFieldError('birthDate') || getFieldError('dob')}
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
                            전화번호
                        </label>
                        <input 
                            type="tel" 
                            placeholder="예: 010-1234-5678" 
                            value={formData.phone}
                            onChange={(e) => onInputChange('phone', e.target.value)}
                            style={{
                                width: "100%",
                                padding: "8px 12px",
                                border: `1px solid ${getFieldError('phone') ? '#dc2626' : '#d1d5db'}`,
                                borderRadius: "6px",
                                fontSize: "14px",
                                boxSizing: "border-box"
                            }}
                        />
                        {getFieldError('phone') && (
                            <div style={{ fontSize: "12px", color: "#dc2626", marginTop: "4px" }}>
                                {getFieldError('phone')}
                            </div>
                        )}
                    </div>
                </div>
                
                {/* 3행: 보호자 이름, 보호자 전화번호 */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div>
                        <label style={{ 
                            display: "block", 
                            fontSize: "14px", 
                            fontWeight: 500, 
                            marginBottom: "6px",
                            color: "#374151"
                        }}>
                            보호자 이름
                        </label>
                        <input 
                            type="text" 
                            placeholder="예: 이철수" 
                            value={formData.guardian}
                            onChange={(e) => onInputChange('guardian', e.target.value)}
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
                    <div>
                        <label style={{ 
                            display: "block", 
                            fontSize: "14px", 
                            fontWeight: 500, 
                            marginBottom: "6px",
                            color: "#374151"
                        }}>
                            보호자 전화번호
                        </label>
                        <input 
                            type="tel" 
                            placeholder="예: 010-9876-5432" 
                            value={formData.guardianPhone}
                            onChange={(e) => onInputChange('guardianPhone', e.target.value)}
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
                
                {/* 4행: 주소 */}
                <div>
                    <label style={{ 
                        display: "block", 
                        fontSize: "14px", 
                        fontWeight: 500, 
                        marginBottom: "6px",
                        color: "#374151"
                    }}>
                        주소
                    </label>
                    <input 
                        type="text" 
                        placeholder="예: 서울시 강남구 테헤란로 123" 
                        value={formData.address}
                        onChange={(e) => onInputChange('address', e.target.value)}
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
            
            {/* 기본정보 저장 버튼 */}
            <div style={{ marginTop: "16px", textAlign: "right" }}>
                <button 
                    onClick={onSaveBasicInfo}
                    disabled={isSavingBasicInfo}
                    style={{
                        padding: "8px 16px",
                        background: "#f3f4f6",
                        color: "#374151",
                        border: "1px solid #d1d5db",
                        borderRadius: "6px",
                        fontSize: "14px",
                        fontWeight: 500,
                        cursor: isSavingBasicInfo ? "not-allowed" : "pointer",
                        opacity: isSavingBasicInfo ? 0.6 : 1
                    }}
                >
                    {isSavingBasicInfo ? "저장 중..." : "기본정보 저장"}
                </button>
            </div>
        </div>
    );
};
