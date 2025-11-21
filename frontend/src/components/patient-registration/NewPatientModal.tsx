/**
 * 신규 환자 등록 모달 컴포넌트
 * 
 * 주요 기능:
 * - 환자 기본 정보 입력 (MRN 자동 생성, 이름, 성별, 생년월일, 연락처, 주소 등)
 * - 바이탈 사인 입력 (체온, 혈압, 맥박, 호흡수, 혈당, 체중, 키)
 * - 방문 정보 입력 (방문 사유, 증상, 진료 계획)
 * - AI 요약 기능
 * - 환자 노트 작성
 * - 폼 유효성 검사 및 데이터 저장
 * 
 * 레이아웃:
 * - 상단: 환자 기본정보 + 최근 바이탈 요약
 * - 좌측: 기본 정보 + 바이탈 입력
 * - 우측: 노트 + 방문 정보
 */
import React, { useState, useEffect } from 'react';
import { Input, TextArea } from '../common';
import { validatePatientForm, validateVitalSign } from '../../utils/validation';
import { generateMRN } from '../../utils/mrnGenerator';
import { PatientSummary } from './PatientSummary';
import { PatientBasicInfo } from './PatientBasicInfo';
import { VitalInput } from './VitalInput';
import { VisitInfo } from './VisitInfo';
import { PatientNotes } from './PatientNotes';

interface NewPatientModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (patientData: any) => void;
    onAddToWaitingList: (patientData: any) => void;
}

export const NewPatientModal: React.FC<NewPatientModalProps> = ({ isOpen, onClose, onSubmit, onAddToWaitingList }) => {
    // 폼 데이터 상태 관리
    const [formData, setFormData] = useState({
        // 기본 정보
        mrn: '',
        name: '',
        sex: '',
        birthDate: '',
        phone: '',
        guardianName: '',
        guardianPhone: '',
        address: '',
        
        // 바이탈 사인
        temperature: '',
        bloodPressure: '',
        pulse: '',
        respiration: '',
        bloodSugar: '',
        weight: '',
        height: '',
        
        // 방문 정보
        visitReason: '',
        symptoms: '',
        treatmentPlan: '',
        
        // 노트
        notes: ''
    });

    // 에러 상태 관리
    const [errors, setErrors] = useState<Record<string, string>>({});
    
    // 저장 중 상태 관리
    const [isSavingBasicInfo, setIsSavingBasicInfo] = useState(false);
    const [isSavingVitals, setIsSavingVitals] = useState(false);
    const [isSavingVisitInfo, setIsSavingVisitInfo] = useState(false);

    // 모달이 열릴 때 MRN 자동 생성
    useEffect(() => {
        if (isOpen && !formData.mrn) {
            const newMRN = generateMRN();
            setFormData(prev => ({ ...prev, mrn: newMRN }));
        }
    }, [isOpen, formData.mrn]);

    // 입력 필드 변경 핸들러
    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        
        // 에러가 있으면 해당 필드 에러 제거
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    // 필드별 에러 가져오기
    const getFieldError = (field: string) => errors[field] || '';

    // 기본 정보 저장 핸들러
    const handleSaveBasicInfo = async () => {
        const validationErrors = validatePatientForm(formData);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setIsSavingBasicInfo(true);
        try {
            // 실제로는 API 호출
            await new Promise(resolve => setTimeout(resolve, 1000));
            console.log('기본 정보 저장:', formData);
            alert('기본 정보가 저장되었습니다.');
        } catch (error) {
            console.error('기본 정보 저장 실패:', error);
            alert('기본 정보 저장에 실패했습니다.');
        } finally {
            setIsSavingBasicInfo(false);
        }
    };

    // 바이탈 저장 핸들러
    const handleSaveVitals = async () => {
        const validationErrors = validateVitalSign(formData);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setIsSavingVitals(true);
        try {
            // 실제로는 API 호출
            await new Promise(resolve => setTimeout(resolve, 1000));
            console.log('바이탈 저장:', formData);
            alert('바이탈이 저장되었습니다.');
        } catch (error) {
            console.error('바이탈 저장 실패:', error);
            alert('바이탈 저장에 실패했습니다.');
        } finally {
            setIsSavingVitals(false);
        }
    };

    // 방문 정보 저장 핸들러
    const handleSaveVisitInfo = async () => {
        setIsSavingVisitInfo(true);
        try {
            // 실제로는 API 호출
            await new Promise(resolve => setTimeout(resolve, 1000));
            console.log('방문 정보 저장:', formData);
            alert('방문 정보가 저장되었습니다.');
        } catch (error) {
            console.error('방문 정보 저장 실패:', error);
            alert('방문 정보 저장에 실패했습니다.');
        } finally {
            setIsSavingVisitInfo(false);
        }
    };

    // AI 요약 핸들러
    const handleAISummary = async () => {
        try {
            // 실제로는 AI API 호출
            await new Promise(resolve => setTimeout(resolve, 2000));
            const aiSummary = `AI가 생성한 환자 요약:\n- 주요 증상: ${formData.symptoms}\n- 진료 계획: ${formData.treatmentPlan}\n- 주의사항: 정기적인 모니터링 필요`;
            setFormData(prev => ({ ...prev, notes: aiSummary }));
            alert('AI 요약이 생성되었습니다.');
        } catch (error) {
            console.error('AI 요약 생성 실패:', error);
            alert('AI 요약 생성에 실패했습니다.');
        }
    };

    // 환자 등록 완료 핸들러
    const handleSubmit = () => {
        onSubmit(formData);
    };

    // 대기 목록에 추가 핸들러
    const handleAddToWaitingList = () => {
        // birthDate가 없으면 dob를 사용 (호환성)
        const birthDate = formData.birthDate || formData.dob || '';
        
        if (!birthDate || birthDate.trim() === '') {
            alert('생년월일을 입력해주세요.');
            return;
        }
        
        // 간호사 정보를 포함한 환자 데이터 생성
        const patientWithNurseInfo = {
            name: formData.name,
            birthDate: birthDate.trim(),
            phone: formData.phone || '',
            symptoms: formData.symptoms || '',
            nurseInfo: {
                symptoms: formData.symptoms || '',
                bloodPressure: formData.bloodPressure ? {
                    systolic: parseInt(formData.bloodPressure.split('/')[0]),
                    diastolic: parseInt(formData.bloodPressure.split('/')[1]),
                    measuredAt: new Date().toISOString()
                } : undefined,
                notes: formData.notes || '',
                registeredBy: "간호사",
                registeredAt: new Date().toISOString()
            }
        };
        
        console.log('신규 환자 등록 데이터:', patientWithNurseInfo);
        onAddToWaitingList(patientWithNurseInfo);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000
        }}>
            <div style={{
                background: "white",
                borderRadius: "12px",
                padding: "24px",
                maxWidth: "1400px",
                width: "90%",
                maxHeight: "90vh",
                overflow: "auto",
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
            }}>
                {/* 모달 헤더 */}
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "24px",
                    borderBottom: "1px solid #e5e7eb",
                    paddingBottom: "16px"
                }}>
                    <h2 style={{
                        fontSize: "24px",
                        fontWeight: 700,
                        color: "#1f2937",
                        margin: 0
                    }}>
                        신규 환자 등록
                    </h2>
                    <button
                        onClick={onClose}
                        style={{
                            background: "none",
                            border: "none",
                            fontSize: "24px",
                            cursor: "pointer",
                            color: "#6b7280",
                            padding: "4px"
                        }}
                    >
                        ×
                    </button>
                </div>

                {/* 환자 기본정보 + 최근 바이탈 요약 섹션 */}
                <PatientSummary />

                {/* 메인 콘텐츠: 좌측(기본정보+바이탈) + 우측(노트+방문정보) */}
                <div style={{ 
                    display: "grid", 
                    gridTemplateColumns: "1fr 1fr", 
                    gap: "20px"
                }}>
                    {/* 좌측 컬럼: 기본 정보 + 바이탈 입력 */}
                    <div style={{ display: "grid", gap: "20px" }}>
                        <PatientBasicInfo 
                            formData={formData}
                            onInputChange={handleInputChange}
                            getFieldError={getFieldError}
                            onSaveBasicInfo={handleSaveBasicInfo}
                            isSavingBasicInfo={isSavingBasicInfo}
                        />
                        <VitalInput 
                            formData={formData}
                            onInputChange={handleInputChange}
                            getFieldError={getFieldError}
                            onSaveVitals={handleSaveVitals}
                            isSavingVitals={isSavingVitals}
                        />
                    </div>

                    {/* 우측 컬럼: 노트 + 방문 정보 */}
                    <div style={{ display: "grid", gap: "5px" }}>
                        <PatientNotes 
                            formData={formData}
                            onInputChange={handleInputChange}
                        />
                        <VisitInfo 
                            formData={formData}
                            onInputChange={handleInputChange}
                            onSaveVisitInfo={handleSaveVisitInfo}
                            onAISummary={handleAISummary}
                            isSavingVisitInfo={isSavingVisitInfo}
                        />
                    </div>
                </div>

                {/* 모달 푸터: 취소 및 완료 버튼 */}
                <div style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "12px",
                    marginTop: "24px",
                    borderTop: "1px solid #e5e7eb",
                    paddingTop: "16px"
                }}>
                    <button
                        onClick={onClose}
                        style={{
                            padding: "10px 20px",
                            background: "#f3f4f6",
                            color: "#374151",
                            border: "1px solid #d1d5db",
                            borderRadius: "8px",
                            fontSize: "14px",
                            fontWeight: 500,
                            cursor: "pointer"
                        }}
                    >
                        취소
                    </button>
                    <button
                        onClick={handleAddToWaitingList}
                        style={{
                            padding: "10px 20px",
                            background: "#3b82f6",
                            color: "white",
                            border: "1px solid #3b82f6",
                            borderRadius: "8px",
                            fontSize: "14px",
                            fontWeight: 500,
                            cursor: "pointer"
                        }}
                    >
                        대기 목록에 추가
                    </button>
                </div>
            </div>
        </div>
    );
};
