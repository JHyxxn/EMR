/**
 * EMR 시스템 메인 대시보드 컴포넌트
 * 
 * 주요 기능:
 * - 금일 대기 환자 목록 (시간, 환자명, 증상, 예상 시간, 경고)
 * - 금일 병원 일정 (시간대, 활동, 상태)
 * - 당일 처방/오더보드 (환자명, 처방/오더 내용, 시간, 상태)
 */
import React, { useState, useEffect, useMemo } from 'react';
import { waitingPatientsData, WaitingPatient } from '../../data/waitingPatientsData';
import { revisitPatientsData } from '../../data/revisitPatientsData';
import { PatientChartModal } from '../patient-chart/PatientChartModal';
import { NewPatientModal } from '../patient-registration/NewPatientModal';
import { RevisitPatientModal } from '../patient-registration/RevisitPatientModal';
import { getPatientHistory, getPatientHistoryByName, deletePatientHistory } from '../../data/patientHistoryData';
import { WaitingPatientsColumn } from './WaitingPatientsColumn';
import { InTestPatientsColumn } from './InTestPatientsColumn';
import { ScheduleAndAlertsColumn } from './ScheduleAndAlertsColumn';
import { UnifiedPatient } from './types';

interface DashboardProps {
    searchQuery: string;
    onNewPatient: () => void;
    onAddToWaitingList: (patientData: any) => void;
    waitingPatients: WaitingPatient[];
    setWaitingPatients: React.Dispatch<React.SetStateAction<WaitingPatient[]>>;
    prescriptions: Array<{
        id: string;
        patientName: string;
        patientId: string;
        prescriptions: Array<{
            medication: string;
            dosage: string;
            frequency: string;
            duration: string;
        }>;
        tests: Array<{
            testName: string;
            urgency: 'routine' | 'urgent';
        }>;
        nextVisit?: string;
        notes: string;
        revisitRecommendation: string;
        createdAt: string;
    }>;
    setPrescriptions: React.Dispatch<React.SetStateAction<Array<{
        id: string;
        patientName: string;
        patientId: string;
        prescriptions: Array<{
            medication: string;
            dosage: string;
            frequency: string;
            duration: string;
        }>;
        tests: Array<{
            testName: string;
            urgency: 'routine' | 'urgent';
        }>;
        nextVisit?: string;
        notes: string;
        revisitRecommendation: string;
        createdAt: string;
    }>>>;
    onTestButton: (patient: WaitingPatient) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ searchQuery, onNewPatient, onAddToWaitingList, waitingPatients, setWaitingPatients, prescriptions, setPrescriptions, onTestButton }) => {
    // 현재 시간 상태 관리
    const [currentTime, setCurrentTime] = useState(new Date());

    // 현재 시간을 1초마다 업데이트
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // 병원 운영시간 확인 (09:00 - 18:00)
    const isHospitalOpen = () => {
        const currentHour = currentTime.getHours();
        return currentHour >= 9 && currentHour < 18;
    };

    // 환자 상태 관리 (대기 중, 진료 완료)
    const [patientStatus, setPatientStatus] = useState<{[key: string]: string}>({
        '1': 'waiting',
        '2': 'waiting', 
        '3': 'waiting',
        '4': 'waiting',
        '5': 'waiting',
        '6': 'waiting'
    });

    // 처방/오더 상세보기 모달 상태
    const [selectedPrescription, setSelectedPrescription] = useState<any>(null);
    const [prescriptionModalOpen, setPrescriptionModalOpen] = useState(false);

    // 현재 시간이 환자 시간과 일치하는지 확인하는 함수
    const isPatientTimeReached = (patientTime: string) => {
        const currentTimeStr = currentTime.toLocaleTimeString('ko-KR', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false
        });
        
        // 현재 시간이 환자 시간과 정확히 일치하거나, 환자 시간이 지났을 때만 true
        // 하지만 너무 오래 지난 경우는 제외 (예: 1시간 이상 지난 경우)
        const currentMinutes = parseInt(currentTimeStr.split(':')[0]) * 60 + parseInt(currentTimeStr.split(':')[1]);
        const patientMinutes = parseInt(patientTime.split(':')[0]) * 60 + parseInt(patientTime.split(':')[1]);
        
        // 환자 시간이 지났고, 1시간(60분) 이내인 경우만 true
        return currentMinutes >= patientMinutes && (currentMinutes - patientMinutes) <= 60;
    };

    // 진료 완료 처리 함수
    const handleCompleteTreatment = (patientId: string) => {
        setPatientStatus(prev => ({
            ...prev,
            [patientId]: 'completed'
        }));
    };


    // 새로운 처방/오더 추가 함수
    const addPrescription = (patientName: string, patientId: string, prescriptions: Array<{
        medication: string;
        dosage: string;
        frequency: string;
        duration: string;
    }>, tests: Array<{
        testName: string;
        urgency: 'routine' | 'urgent';
    }>, nextVisit?: string, notes: string = "", revisitRecommendation: string = "") => {
        const newPrescription = {
            id: Date.now().toString(),
            patientName,
            patientId,
            prescriptions,
            tests,
            nextVisit,
            notes,
            revisitRecommendation,
            createdAt: new Date().toISOString()
        };
        setPrescriptions(prev => [...prev, newPrescription]);
    };

    // 새로운 대기 환자 추가 함수
    const addWaitingPatient = (patientData: {
        time: string;
        name: string;
        birthDate: string;
        phone: string;
        condition: string;
        visitType: string;
        visitOrigin: 'reservation' | 'walkin';
        alert?: string | null;
        alertType?: string | null;
    }) => {
        const newPatient = {
            id: Math.max(...waitingPatients.map(p => p.id)) + 1,
            ...patientData,
            alert: patientData.alert || null,
            alertType: patientData.alertType || null,
            buttonText: patientData.alertType === "AI 위험" ? "상세 보기" : "진료 시작"
        };
        setWaitingPatients(prev => [...prev, newPatient]);
    };

    // 대기 환자 제거 함수
    const removeWaitingPatient = (patientId: number) => {
        setWaitingPatients(prev => prev.filter(p => p.id !== patientId));
    };

    // 진료 차트 모달 상태
    const [chartModalOpen, setChartModalOpen] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState<WaitingPatient | null>(null);

    // 진료 시작 버튼 클릭 핸들러
    const handleStartTreatment = (patient: WaitingPatient) => {
        setSelectedPatient(patient);
        setChartModalOpen(true);
    };

    // 진료 차트 저장 핸들러
    const handleChartSave = (chartData: any) => {
        console.log('진료 차트 저장:', chartData);
        // 여기서 진료 완료 처리를 할 수 있습니다
        // 예: 환자를 대기 목록에서 제거하거나 상태를 변경
    };

    // 재진 환자에서 대기 환자로 추가하는 함수 (실제 진료 시나리오)
    const addPatientFromRevisit = (revisitPatient: any, visitTime: string, visitOrigin: 'reservation' | 'walkin' = 'walkin') => {
        const newPatient: WaitingPatient = {
            id: Math.max(...waitingPatients.map(p => p.id), 0) + 1,
            time: visitTime,
            name: revisitPatient.name,
            birthDate: revisitPatient.birthDate,
            phone: revisitPatient.phone,
            condition: revisitPatient.symptoms,
            visitType: "재진",
            alert: null,
            alertType: null,
            buttonText: "진료 시작",
            visitOrigin
        };
        setWaitingPatients(prev => [...prev, newPatient]);
    };


    // 모달 상태 관리
    const [showNewPatientModal, setShowNewPatientModal] = useState(false);
    const [showRevisitPatientModal, setShowRevisitPatientModal] = useState(false);

    // 나이 계산 함수
    const calculateAge = (birthDate: string) => {
        if (!birthDate || birthDate.trim() === '') {
            return '?';
        }
        
        try {
            const today = new Date();
            const birth = new Date(birthDate);
            
            // 유효한 날짜인지 확인
            if (isNaN(birth.getTime())) {
                console.warn('유효하지 않은 생년월일:', birthDate);
                return '?';
            }
            
            // 날짜가 미래인지 확인
            if (birth > today) {
                console.warn('미래 날짜:', birthDate);
                return '?';
            }
            
            let age = today.getFullYear() - birth.getFullYear();
            const monthDiff = today.getMonth() - birth.getMonth();
            
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
                age--;
            }
            
            // 나이가 음수이거나 비정상적으로 크면 "?" 반환
            if (age < 0 || age > 150) {
                console.warn('비정상적인 나이:', age, 'birthDate:', birthDate);
                return '?';
            }
            
            return age;
        } catch (error) {
            console.error('나이 계산 오류:', error, 'birthDate:', birthDate);
            return '?';
        }
    };

    // 한글 초성 검색 함수
    const getChoseong = (str: string) => {
        const choseong = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
        return str.split('').map(char => {
            const code = char.charCodeAt(0);
            if (code >= 44032 && code <= 55203) { // 한글 유니코드 범위
                return choseong[Math.floor((code - 44032) / 588)];
            }
            return char;
        }).join('');
    };

    // 검색어 매칭 함수
    const matchesSearch = (text: string, query: string) => {
        if (!query) return true;
        const lowerText = text.toLowerCase();
        const lowerQuery = query.toLowerCase();
        
        // 정확한 문자열 포함 검색
        if (lowerText.includes(lowerQuery)) return true;
        
        // 한글 초성 검색
        const textChoseong = getChoseong(text);
        const queryChoseong = getChoseong(query);
        if (textChoseong.includes(queryChoseong)) return true;
        
        return false;
    };

    // 환자 이름 검색 함수 (초성 검색 포함)
    const matchesNameSearch = (name: string, query: string) => {
        if (!query) return true;
        return matchesSearch(name, query);
    };

    // 증상 검색 함수 (정확한 문자열만)
    const matchesConditionSearch = (condition: string, query: string) => {
        if (!query) return true;
        return condition.toLowerCase().includes(query.toLowerCase());
    };





    // 복합 검색 함수
    const parseSearchQuery = (query: string) => {
        const parts = query.split(',').map(part => part.trim());
        const result = {
            name: '',
            birthDate: '',
            phoneSuffix: ''
        };
        
        parts.forEach(part => {
            // 생년월일 패턴 (YYMMDD 또는 YYYY-MM-DD)
            if (/^\d{6}$/.test(part) || /^\d{4}-\d{2}-\d{2}$/.test(part)) {
                result.birthDate = part;
            }
            // 전화번호 뒷자리 패턴 (4자리 숫자)
            else if (/^\d{4}$/.test(part)) {
                result.phoneSuffix = part;
            }
            // 나머지는 이름으로 처리
            else {
                result.name = part;
            }
        });
        
        return result;
    };

    // 복합 검색 매칭 함수
    const matchesComplexSearch = (patient: any, searchQuery: string) => {
        if (!searchQuery) return true;
        
        const searchParts = parseSearchQuery(searchQuery);
        let matchCount = 0;
        let totalParts = 0;
        
        // 이름 검색
        if (searchParts.name) {
            totalParts++;
            if (matchesNameSearch(patient.name, searchParts.name)) {
                matchCount++;
            }
        }
        
        // 생년월일 검색
        if (searchParts.birthDate) {
            totalParts++;
            const patientBirth = patient.birthDate.replace(/-/g, '');
            const searchBirth = searchParts.birthDate.replace(/-/g, '');
            
            // 6자리 생년월일로 변환
            let patientBirthShort = patientBirth;
            if (patientBirth.length === 8) {
                patientBirthShort = patientBirth.substring(2); // YYYYMMDD -> YYMMDD
            }
            
            if (patientBirthShort.includes(searchBirth) || patientBirth.includes(searchBirth)) {
                matchCount++;
            }
        }
        
        // 전화번호 뒷자리 검색 (환자 데이터에 전화번호가 있다면)
        if (searchParts.phoneSuffix && patient.phone) {
            totalParts++;
            const phoneLast4 = patient.phone.replace(/-/g, '').slice(-4);
            if (phoneLast4 === searchParts.phoneSuffix) {
                matchCount++;
            }
        }
        
        // 증상 검색 (기존 로직 유지)
        const conditionMatch = patient.condition.toLowerCase().includes(searchQuery.toLowerCase());
        
        // 복합 검색 조건: 모든 지정된 조건이 일치하거나, 증상이 일치하거나, 검색어가 비어있으면 true
        return (totalParts === 0 || matchCount === totalParts) || conditionMatch;
    };

    // 처방/오더 상세보기 핸들러
    const handlePrescriptionClick = (prescription: any) => {
        setSelectedPrescription(prescription);
        setPrescriptionModalOpen(true);
    };

    // 통합 환자 리스트 생성
    const unifiedPatients: UnifiedPatient[] = useMemo(() => {
        const patients: UnifiedPatient[] = [];

        // 현재 시간 기준 30분 이전 시간 계산
        const now = new Date(currentTime);
        const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000);
        const cutoffTime = thirtyMinutesAgo.toLocaleTimeString('ko-KR', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });

        // 시간 문자열을 분으로 변환하는 함수
        const timeToMinutes = (timeStr: string): number => {
            const [hours, minutes] = timeStr.split(':').map(Number);
            return hours * 60 + minutes;
        };

        // 1. WAITING 상태 환자 (waitingPatients에서 검사 완료가 아닌 환자)
        waitingPatients.forEach(patient => {
            // 검사 완료 환자는 제외
            if ((patient.condition || '').includes("검사 완료")) return;
            
            // 현재 시간 기준 30분 이전 환자는 제외
            if (patient.time) {
                const patientTimeMinutes = timeToMinutes(patient.time);
                const cutoffTimeMinutes = timeToMinutes(cutoffTime);
                
                // 환자 시간이 30분 이전이면 제외
                if (patientTimeMinutes < cutoffTimeMinutes) {
                    return;
                }
            }
            
            patients.push({
                id: patient.id,
                name: patient.name,
                age: calculateAge(patient.birthDate),
                visitType: patient.visitType as '초진' | '재진',
                chiefComplaint: patient.condition || '',
                status: 'WAITING',
                reservationTime: patient.time,
                patientId: patient.id.toString(),
                phone: patient.phone,
                birthDate: patient.birthDate,
                visitOrigin: patient.visitOrigin,
                alert: patient.alert,
                alertType: patient.alertType,
                buttonText: patient.buttonText
            });
        });

        // 2. IN_TEST 상태 환자 (prescriptions 중 tests가 있는 환자)
        prescriptions.forEach(prescription => {
            if (prescription.tests.length > 0) {
                // 재진환자 데이터에서 나이 찾기
                const revisitPatient = revisitPatientsData.find(rp => rp.name === prescription.patientName);
                let patientAge: string | number = '?';
                let birthDate = '';
                
                if (revisitPatient) {
                    birthDate = revisitPatient.birthDate;
                    patientAge = calculateAge(revisitPatient.birthDate);
                }
                
                // 검사 완료 여부 확인
                const allTestsCompleted = prescription.tests.every(t => t.result);
                const someTestsCompleted = prescription.tests.some(t => t.result);
                
                // AI 요약 및 상급병원 이송 필요 여부 확인
                const needsTransfer = prescription.notes?.includes("상급병원") || false;
                const aiSummary = prescription.notes || prescription.revisitRecommendation || '';
                
                patients.push({
                    id: prescription.id,
                    name: prescription.patientName,
                    age: patientAge,
                    visitType: revisitPatient?.visitType === '초진' ? '초진' : '재진',
                    chiefComplaint: prescription.notes || '검사 필요',
                    status: 'IN_TEST',
                    reservationTime: new Date(prescription.createdAt).toLocaleTimeString('ko-KR', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false,
                        timeZone: 'Asia/Seoul'
                    }),
                    patientId: prescription.patientId,
                    birthDate: birthDate,
                    phone: revisitPatient?.phone || '',
                    tests: prescription.tests,
                    aiSummary: aiSummary,
                    alert: needsTransfer ? '상급병원 이송 필요' : null,
                    alertType: needsTransfer ? 'urgent' : null,
                    prescriptionData: prescription
                });
            }
        });


        return patients;
    }, [waitingPatients, prescriptions, calculateAge, currentTime]);

    // status에 따라 필터링
    const waitingPatientsList = unifiedPatients.filter(p => p.status === 'WAITING');
    const inTestPatientsList = unifiedPatients.filter(p => p.status === 'IN_TEST');

    return (
        <div style={{ 
            display: "grid", 
            gridTemplateColumns: "1fr 1fr 1fr", 
            gap: "20px",
            alignContent: "start",
            alignItems: "start"
        }}>
            {/* 1. 진료 대기 컬럼 */}
            <WaitingPatientsColumn
                patients={waitingPatientsList}
                searchQuery={searchQuery}
                patientStatus={patientStatus}
                currentTime={currentTime}
                isHospitalOpen={isHospitalOpen}
                onStartTreatment={handleStartTreatment}
                onCompleteTreatment={handleCompleteTreatment}
                isPatientTimeReached={isPatientTimeReached}
                calculateAge={calculateAge}
            />

            {/* 2. 검사 진행 컬럼 */}
            <InTestPatientsColumn
                patients={inTestPatientsList}
                searchQuery={searchQuery}
                onTestButton={onTestButton}
                onPrescriptionClick={handlePrescriptionClick}
                onRevisit={(patient) => {
                    // 다시 진료 버튼 클릭 시 대기 목록 최상단에 추가하고 검사 진행에서 제거
                    const currentTime = new Date().toLocaleTimeString('ko-KR', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                    });

                    const newWaitingPatient: WaitingPatient = {
                        id: typeof patient.id === 'number' ? patient.id : parseInt(String(patient.id)) || Date.now(),
                        time: currentTime,
                        name: patient.name,
                        birthDate: patient.birthDate || '',
                        phone: patient.phone || '',
                        condition: patient.chiefComplaint,
                        visitType: patient.visitType,
                        alert: patient.alert,
                        alertType: patient.alertType,
                        buttonText: '진료 시작',
                        visitOrigin: patient.visitOrigin || 'walkin'
                    };

                    // 1. 대기 목록 최상단에 추가
                    setWaitingPatients(prev => [newWaitingPatient, ...prev]);
                    
                    // 2. 검사 진행 패딩에서 제거 (prescriptions에서 해당 항목 제거)
                    if (patient.prescriptionData?.id) {
                        setPrescriptions(prev => prev.filter(p => p.id !== patient.prescriptionData.id));
                    }
                    
                    alert(`${patient.name} 환자가 대기 목록 최상단에 추가되었습니다.`);
                }}
            />

            {/* 3. 금일 병원 일정 및 알림/업무 요약 컬럼 */}
            <ScheduleAndAlertsColumn />

            {/* 진료 차트 모달 */}
            {selectedPatient && (
                <PatientChartModal
                    patient={selectedPatient}
                    isOpen={chartModalOpen}
                    onClose={() => setChartModalOpen(false)}
                    onSave={handleChartSave}
                    setPrescriptions={setPrescriptions}
                />
            )}

            {/* 신규 환자 등록 모달 */}
            <NewPatientModal
                isOpen={showNewPatientModal}
                onClose={() => setShowNewPatientModal(false)}
                onSubmit={(patientData) => {
                    console.log('환자 등록:', patientData);
                    setShowNewPatientModal(false);
                }}
                onAddToWaitingList={(patientData) => {
                    const currentTime = new Date().toLocaleTimeString('ko-KR', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                    });

                    // birthDate가 없거나 빈 문자열인지 확인
                    if (!patientData.birthDate || patientData.birthDate.trim() === '') {
                        alert('생년월일을 입력해주세요.');
                        return;
                    }

                    // 고유한 환자 ID 생성 (타임스탬프 기반으로 충돌 방지)
                    // 기존 대기 환자 ID와 겹치지 않도록 충분히 큰 값 사용
                    const maxExistingId = waitingPatients.length > 0 
                        ? Math.max(...waitingPatients.map(p => p.id), 0) 
                        : 0;
                    const newPatientId = Math.max(Date.now(), maxExistingId + 100000);
                    
                    // 신규 환자는 기존 내역이 없어야 하므로, 같은 이름이나 ID의 기존 내역이 있으면 삭제
                    const existingHistoryById = getPatientHistory(newPatientId);
                    const existingHistoryByName = getPatientHistoryByName(patientData.name);
                    
                    if (existingHistoryById) {
                        // 같은 ID의 기존 내역 삭제
                        deletePatientHistory(newPatientId);
                        console.log('신규 환자 등록: 기존 내역 삭제 (ID:', newPatientId, ')');
                    }
                    
                    if (existingHistoryByName && existingHistoryByName.patientId !== newPatientId) {
                        // 같은 이름의 다른 환자 내역이 있으면 삭제하지 않음 (동명이인 가능)
                        // 하지만 신규 환자이므로 이 환자의 내역은 없어야 함
                        console.log('신규 환자 등록: 같은 이름의 기존 환자 내역 발견 (ID:', existingHistoryByName.patientId, '), 신규 환자이므로 무시');
                    }

                    const newPatient: WaitingPatient = {
                        id: newPatientId,
                        time: currentTime,
                        name: patientData.name,
                        birthDate: patientData.birthDate.trim(),
                        phone: patientData.phone || '',
                        condition: patientData.symptoms || '',
                        visitType: "초진",
                        alert: null,
                        alertType: null,
                        buttonText: "진료 시작",
                        visitOrigin: "walkin",
                        nurseInfo: patientData.nurseInfo
                    };

                    console.log('신규 환자 등록:', newPatient, '나이:', calculateAge(newPatient.birthDate));
                    setWaitingPatients(prev => [...prev, newPatient]);
                    alert('신규 환자가 대기 목록에 추가되었습니다.');
                }}
            />

            {/* 재진환자 등록 모달 */}
            <RevisitPatientModal
                isOpen={showRevisitPatientModal}
                onClose={() => setShowRevisitPatientModal(false)}
                onAddToWaitingList={(patientData) => {
                    setWaitingPatients(prev => [...prev, patientData]);
                    alert('재진환자가 대기 목록에 추가되었습니다.');
                }}
            />

            {/* 처방/오더 상세보기 모달 */}
            {prescriptionModalOpen && selectedPrescription && (
                <div 
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1000
                    }}
                    onClick={() => setPrescriptionModalOpen(false)}
                >
                    <div 
                        style={{
                            backgroundColor: 'white',
                            borderRadius: '8px',
                            width: '90%',
                            maxWidth: '600px',
                            maxHeight: '80%',
                            display: 'flex',
                            flexDirection: 'column',
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* 헤더 */}
                        <div style={{
                            padding: '16px 24px',
                            borderBottom: '1px solid #e5e7eb',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <h2 style={{
                                margin: 0,
                                fontSize: '18px',
                                fontWeight: 600,
                                color: '#374151'
                            }}>
                                {selectedPrescription.patientName} 환자 처방 및 오더
                            </h2>
                            <button
                                onClick={() => setPrescriptionModalOpen(false)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    fontSize: '20px',
                                    cursor: 'pointer',
                                    color: '#6b7280'
                                }}
                            >
                                ×
                                </button>
                        </div>

                        {/* 콘텐츠 */}
                        <div style={{
                            flex: 1,
                            padding: '24px',
                            overflowY: 'auto'
                        }}>
                            {/* 처방 정보 */}
                            {selectedPrescription.prescriptions.length > 0 && (
                                <div style={{ marginBottom: '24px' }}>
                                    <h3 style={{
                                        margin: '0 0 16px 0',
                                        fontSize: '16px',
                                        fontWeight: 600,
                                        color: '#374151'
                                    }}>
                                        처방 약물
                                    </h3>
                                    {selectedPrescription.prescriptions.map((prescription: any, index: number) => (
                                        <div key={index} style={{
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '6px',
                                            padding: '12px',
                                            marginBottom: '8px',
                                            backgroundColor: '#f9fafb'
                                        }}>
                                            <div style={{ fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
                                                {prescription.medication} {prescription.dosage}
                                            </div>
                                            <div style={{ fontSize: '13px', color: '#6b7280' }}>
                                                복용법: {prescription.frequency}
                                            </div>
                                            <div style={{ fontSize: '13px', color: '#6b7280' }}>
                                                기간: {prescription.duration}
                                            </div>
                            </div>
                        ))}
                    </div>
                            )}

                            {/* 검사 정보 */}
                            {selectedPrescription.tests.length > 0 && (
                                <div style={{ marginBottom: '24px' }}>
                                    <h3 style={{
                                        margin: '0 0 16px 0',
                                        fontSize: '16px',
                                        fontWeight: 600,
                                        color: '#374151'
                                    }}>
                                        검사 오더
                                    </h3>
                                    {selectedPrescription.tests.map((test: any, index: number) => (
                                        <div key={index} style={{
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '6px',
                                            padding: '12px',
                                            marginBottom: '8px',
                                            backgroundColor: '#f9fafb'
                                        }}>
                                            <div style={{ fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
                                                {test.testName}
                </div>
                                            <div style={{ 
                                                fontSize: '12px', 
                                                color: test.urgency === 'urgent' ? '#ef4444' : '#6b7280',
                                                fontWeight: test.urgency === 'urgent' ? 600 : 400
                                            }}>
                                                {test.urgency === 'urgent' ? '긴급' : '일반'}
            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* 재방문 권고사항 */}
                            {selectedPrescription.revisitRecommendation && (
                                <div style={{ marginBottom: '24px' }}>
                                    <h3 style={{
                                        margin: '0 0 16px 0',
                                        fontSize: '16px',
                                        fontWeight: 600,
                                        color: '#374151'
                                    }}>
                                        재방문 권고사항
                                    </h3>
                                    <div style={{
                                        padding: '12px',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '6px',
                                        backgroundColor: '#f9fafb'
                                    }}>
                                        <div style={{ fontSize: '14px', color: '#374151' }}>
                                            {selectedPrescription.revisitRecommendation}
                                        </div>
                                    </div>
                                </div>
                            )}



                            {/* 메모 */}
                            {selectedPrescription.notes && (
                                <div>
                                    <h3 style={{
                                        margin: '0 0 16px 0',
                                        fontSize: '16px',
                                        fontWeight: 600,
                                        color: '#374151'
                                    }}>
                                        메모
                                    </h3>
                                    <div style={{
                                        padding: '12px',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '6px',
                                        backgroundColor: '#f9fafb'
                                    }}>
                                        <div style={{ fontSize: '14px', color: '#374151' }}>
                                            {selectedPrescription.notes}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* 하단 버튼 */}
                        <div style={{
                            padding: '16px 24px',
                            borderTop: '1px solid #e5e7eb',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                {selectedPrescription.tests.length > 0 && (
                                    <button
                                        onClick={() => {
                                            // 처방 데이터에서 직접 환자 정보 생성 (검사 정보 포함)
                                            const patient: WaitingPatient = {
                                                id: parseInt(selectedPrescription.patientId) || 0,
                                                time: new Date().toTimeString().slice(0, 5),
                                                name: selectedPrescription.patientName,
                                                birthDate: '',
                                                age: null,
                                                phone: '',
                                                condition: selectedPrescription.notes || '검사 필요',
                                                visitType: '재진',
                                                alert: null,
                                                alertType: null,
                                                buttonText: '진료 시작',
                                                visitOrigin: 'walkin',
                                                // 검사 정보 추가
                                                prescriptionTests: selectedPrescription.tests
                                            };
                                            
                                            console.log('🔬 처방 데이터에서 생성된 환자 정보:', patient);
                                            onTestButton(patient);
                                            setPrescriptionModalOpen(false);
                                        }}
                                        style={{
                                            padding: '8px 16px',
                                            border: '1px solid #3b82f6',
                                            borderRadius: '4px',
                                            background: '#3b82f6',
                                            color: 'white',
                                            cursor: 'pointer',
                                            fontSize: '14px'
                                        }}
                                    >
                                        검사 하기
                                    </button>
                                )}
                                {selectedPrescription.revisitRecommendation && !selectedPrescription.nextVisit && (
                                    <button
                                        onClick={() => {
                                            alert('예약 대시보드로 이동합니다.');
                                            setPrescriptionModalOpen(false);
                                        }}
                                        style={{
                                            padding: '8px 16px',
                                            border: '1px solid #10b981',
                                            borderRadius: '4px',
                                            background: '#10b981',
                                            color: 'white',
                                            cursor: 'pointer',
                                            fontSize: '14px'
                                        }}
                                    >
                                        예약 하기
                                    </button>
                                )}
                            </div>
                            <button
                                onClick={() => setPrescriptionModalOpen(false)}
                                style={{
                                    padding: '8px 16px',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '4px',
                                    background: 'white',
                                    color: '#374151',
                                    cursor: 'pointer'
                                }}
                            >
                                닫기
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
