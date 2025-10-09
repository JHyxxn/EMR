/**
 * EMR 시스템 메인 대시보드 컴포넌트
 * 
 * 주요 기능:
 * - 금일 대기 환자 목록 (시간, 환자명, 증상, 예상 시간, 경고)
 * - 금일 병원 일정 (시간대, 활동, 상태)
 * - 당일 처방/오더보드 (환자명, 처방/오더 내용, 시간, 상태)
 */
import React, { useState, useEffect } from 'react';
import { tokens } from '../../design/tokens';
import { waitingPatientsData, WaitingPatient } from '../../data/waitingPatientsData';
import { PatientChartModal } from '../patient-chart/PatientChartModal';
import { NewPatientModal } from '../patient-registration/NewPatientModal';
import { RevisitPatientModal } from '../patient-registration/RevisitPatientModal';

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

    // 새로운 병원 일정 추가 함수
    const addHospitalSchedule = (timeRange: string, activity: string, status: string = "예정") => {
        const newSchedule = {
            id: Math.max(...hospitalSchedule.map(s => s.id)) + 1,
            timeRange,
            activity,
            status
        };
        setHospitalSchedule(prev => [...prev, newSchedule]);
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

    // AI 위험도 감지 환자 추가 함수
    const addAIRiskPatient = (patientData: {
        time: string;
        name: string;
        birthDate: string;
        phone: string;
        condition: string;
        visitOrigin: 'reservation' | 'walkin';
    }) => {
        const newPatient: WaitingPatient = {
            id: Math.max(...waitingPatients.map(p => p.id), 0) + 1,
            ...patientData,
            visitType: "재진",
            alert: "AI 위험도 감지 - 재진료 필요",
            alertType: "AI 위험",
            buttonText: "상세 보기"
        };
        setWaitingPatients(prev => [newPatient, ...prev]); // 상단에 추가
    };

    // 검사 결과 AI 분석 함수 (시뮬레이션)
    const analyzeTestResult = (testResult: any) => {
        // AI가 검사 결과를 분석하여 위험도 판단
        if (testResult.riskLevel === 'high') {
            addAIRiskPatient({
                time: new Date().toLocaleTimeString('ko-KR', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                }),
                name: testResult.patientName,
                birthDate: testResult.birthDate,
                phone: testResult.phone,
                condition: testResult.condition,
                visitOrigin: 'walkin'
            });

            // 긴급 알림에 추가
            setNotifications(prev => ({
                ...prev,
                urgent: [...prev.urgent, {
                    type: 'AI_RETREATMENT',
                    patientName: testResult.patientName,
                    message: `AI 재진료 필요 (${testResult.testType} 결과 이상)`,
                    time: new Date().toLocaleTimeString('ko-KR', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                    })
                }],
                completedTests: prev.completedTests + 1
            }));
        }
    };

    // 검사 완료 시뮬레이션 함수 (테스트용)
    const simulateTestCompletion = () => {
        const testResult = {
            patientName: "홍길동",
            birthDate: "1980-02-29",
            phone: "010-5678-9012",
            condition: "고혈압",
            riskLevel: 'high',
            testType: '혈액검사',
            result: '혈당 수치 이상'
        };
        
        analyzeTestResult(testResult);
        alert('검사 완료: 홍길동 환자 재진료 필요');
    };

    // 알림 상태 관리
    const [notifications, setNotifications] = useState({
        urgent: [] as any[],
        incompleteNotes: 2,
        waitingTestResults: 1,
        completedTests: 0
    });

    // 모달 상태 관리
    const [showNewPatientModal, setShowNewPatientModal] = useState(false);
    const [showRevisitPatientModal, setShowRevisitPatientModal] = useState(false);

    // 나이 계산 함수
    const calculateAge = (birthDate: string) => {
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
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

    // 금일 대기 환자 상태 관리 (동적 관리 - 예약:방문 = 4:6 비율)
    // const [waitingPatients, setWaitingPatients] = useState<WaitingPatient[]>([
    //     // 예약 환자들 (40%)
    //     {
    //         id: 1,
    //         time: "09:00",
    //         name: "김영수",
    //         birthDate: "1985-03-15",
    //         phone: "010-1234-5678",
    //         condition: "고혈압",
    //         visitType: "재진",
    //         alert: null,
    //         alertType: null,
    //         buttonText: "진료 시작",
    //         visitOrigin: "reservation"
    //     },
    //     {
    //         id: 2,
    //         time: "10:00",
    //         name: "정민수",
    //         birthDate: "1987-09-14",
    //         phone: "010-6789-0123",
    //         condition: "감기 증상",
    //         visitType: "재진",
    //         alert: null,
    //         alertType: null,
    //         buttonText: "진료 시작",
    //         visitOrigin: "reservation"
    //     },
    //     {
    //         id: 3,
    //         time: "11:00",
    //         name: "박영희",
    //         birthDate: "1989-04-25",
    //         phone: "010-9012-3456",
    //         condition: "피로감",
    //         visitType: "재진",
    //         alert: null,
    //         alertType: null,
    //         buttonText: "진료 시작",
    //         visitOrigin: "reservation"
    //     },
    //     {
    //         id: 4,
    //         time: "12:00",
    //         name: "정수영",
    //         birthDate: "1984-07-05",
    //         phone: "010-3456-7891",
    //         condition: "어지럼증",
    //         visitType: "초진",
    //         alert: null,
    //         alertType: null,
    //         buttonText: "진료 시작",
    //         visitOrigin: "reservation"
    //     },
    //     {
    //         id: 5,
    //         time: "13:00",
    //         name: "김철수", // 동명이인 1
    //         birthDate: "1985-03-15",
    //         phone: "010-1234-5678",
    //         condition: "고혈압",
    //         visitType: "재진",
    //         alert: null,
    //         alertType: null,
    //         buttonText: "진료 시작",
    //         visitOrigin: "reservation"
    //     },
    //     {
    //         id: 6,
    //         time: "14:00",
    //         name: "김철수", // 동명이인 3 (다른 생년월일)
    //         birthDate: "1990-08-20",
    //         phone: "010-5678-1234",
    //         condition: "감기",
    //         visitType: "초진",
    //         alert: null,
    //         alertType: null,
    //         buttonText: "진료 시작",
    //         visitOrigin: "reservation"
    //     },
    //     {
    //         id: 7,
    //         time: "15:00",
    //         name: "이영희", // 동명이인 5 (같은 생년월일)
    //         birthDate: "1990-07-22",
    //         phone: "010-2345-8888", // 다른 전화번호
    //         condition: "복통",
    //         visitType: "초진",
    //         alert: null,
    //         alertType: null,
    //         buttonText: "진료 시작",
    //         visitOrigin: "reservation"
    //     },
    //     {
    //         id: 8,
    //         time: "16:00",
    //         name: "박현준",
    //         birthDate: "1986-05-08",
    //         phone: "010-9012-3458",
    //         condition: "가슴 답답함",
    //         visitType: "재진",
    //         alert: null,
    //         alertType: null,
    //         buttonText: "진료 시작",
    //         visitOrigin: "reservation"
    //     },
    //     {
    //         id: 9,
    //         time: "17:00",
    //         name: "정승우",
    //         birthDate: "1987-06-12",
    //         phone: "010-3456-7893",
    //         condition: "소화불량",
    //         visitType: "재진",
    //         alert: null,
    //         alertType: null,
    //         buttonText: "진료 시작",
    //         visitOrigin: "reservation"
    //     },
    //     {
    //         id: 10,
    //         time: "18:00",
    //         name: "이지현",
    //         birthDate: "1985-10-21",
    //         phone: "010-7890-1237",
    //         condition: "복부 통증",
    //         visitType: "초진",
    //         alert: null,
    //         alertType: null,
    //         buttonText: "진료 시작",
    //         visitOrigin: "reservation"
    //     },
    //     // 방문 환자들 (60%)
    //     {
    //         id: 11,
    //         time: "09:30",
    //         name: "박준호",
    //         birthDate: "1978-11-08",
    //         phone: "010-3456-7890",
    //         condition: "복통",
    //         visitType: "초진",
    //         alert: null,
    //         alertType: null,
    //         buttonText: "진료 시작",
    //         visitOrigin: "walkin"
    //     },
    //     {
    //         id: 12,
    //         time: "10:30",
    //         name: "이철수",
    //         birthDate: "1983-06-18",
    //         phone: "010-8901-2345",
    //         condition: "위염",
    //         visitType: "재진",
    //         alert: "고혈압 경고",
    //         alertType: "주의",
    //         buttonText: "진료 시작",
    //         visitOrigin: "walkin"
    //     },
    //     {
    //         id: 13,
    //         time: "11:30",
    //         name: "김민지",
    //         birthDate: "1993-01-30",
    //         phone: "010-1234-5679",
    //         condition: "불면증",
    //         visitType: "재진",
    //         alert: null,
    //         alertType: null,
    //         buttonText: "진료 시작",
    //         visitOrigin: "walkin"
    //     },
    //     {
    //         id: 14,
    //         time: "12:30",
    //         name: "최서연",
    //         birthDate: "1988-11-28",
    //         phone: "010-5678-9013",
    //         condition: "요통",
    //         visitType: "재진",
    //         alert: null,
    //         alertType: null,
    //         buttonText: "진료 시작",
    //         visitOrigin: "walkin"
    //     },
    //     {
    //         id: 15,
    //         time: "13:30",
    //         name: "김철수", // 동명이인 2 (같은 생년월일)
    //         birthDate: "1985-03-15",
    //         phone: "010-1234-9999", // 다른 전화번호
    //         condition: "당뇨",
    //         visitType: "재진",
    //         alert: null,
    //         alertType: null,
    //         buttonText: "진료 시작",
    //         visitOrigin: "walkin"
    //     },
    //     {
    //         id: 16,
    //         time: "14:30",
    //         name: "이영희", // 동명이인 4
    //         birthDate: "1990-07-22",
    //         phone: "010-2345-6789",
    //         condition: "두통",
    //         visitType: "재진",
    //         alert: null,
    //         alertType: null,
    //         buttonText: "진료 시작",
    //         visitOrigin: "walkin"
    //     },
    //     {
    //         id: 17,
    //         time: "15:30",
    //         name: "최동현",
    //         birthDate: "1991-08-07",
    //         phone: "010-0123-4567",
    //         condition: "관절통",
    //         visitType: "초진",
    //         alert: null,
    //         alertType: null,
    //         buttonText: "진료 시작",
    //         visitOrigin: "walkin"
    //     },
    //     {
    //         id: 18,
    //         time: "16:30",
    //         name: "김도현",
    //         birthDate: "1984-01-23",
    //         phone: "010-1234-5671",
    //         condition: "손 떨림",
    //         visitType: "초진",
    //         alert: null,
    //         alertType: null,
    //         buttonText: "진료 시작",
    //         visitOrigin: "walkin"
    //     },
    //     {
    //         id: 19,
    //         time: "17:30",
    //         name: "최영수",
    //         birthDate: "1989-12-16",
    //         phone: "010-5678-9015",
    //         condition: "관절 강직",
    //         visitType: "재진",
    //         alert: null,
    //         alertType: null,
    //         buttonText: "진료 시작",
    //         visitOrigin: "walkin"
    //     },
    //     {
    //         id: 20,
    //         time: "18:30",
    //         name: "최준영",
    //         birthDate: "1992-09-18",
    //         phone: "010-0123-4560",
    //         condition: "손목 부종",
    //         visitType: "초진",
    //         alert: null,
    //         alertType: null,
    //         buttonText: "진료 시작",
    //         visitOrigin: "walkin"
    //     }
    // ]);

    // 금일 병원 일정 상태 관리 (기본 일정만)
    const [hospitalSchedule, setHospitalSchedule] = useState([
        { 
            id: 1, 
            timeRange: "09:00-18:30", 
            activity: "외래 진료", 
            status: "진행 중" 
        }
    ]);



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

        // 검색어에 따른 환자 필터링 (시간 필터링 제거)
    const filteredWaitingPatients = waitingPatients
        .filter(patient => {
            return matchesComplexSearch(patient, searchQuery);
        })
        .sort((a, b) => {
            // 진료 완료된 환자는 맨 아래로 (최우선)
            if ((patientStatus[a.id] || 'waiting') === 'completed' && (patientStatus[b.id] || 'waiting') !== 'completed') return 1;
            if ((patientStatus[a.id] || 'waiting') !== 'completed' && (patientStatus[b.id] || 'waiting') === 'completed') return -1;

            // 검사 완료 환자 우선 (완료되지 않은 환자들 중에서)
            if ((a.condition || '').includes("검사 완료") && !(b.condition || '').includes("검사 완료")) return -1;
            if (!(a.condition || '').includes("검사 완료") && (b.condition || '').includes("검사 완료")) return 1;

            // 일반 환자는 시간 순서대로 정렬
            return a.time.localeCompare(b.time);
        });

    return (
        <div style={{ 
            display: "grid", 
            gridTemplateColumns: "1fr 1fr", 
            gap: "20px"
        }}>
            {/* 왼쪽: 금일 대기 환자 */}
            <div style={{ 
                background: "white", 
                borderRadius: "8px",
                padding: "20px",
                border: "1px solid #e5e7eb",
                display: "flex",
                flexDirection: "column"
            }}>
                <div style={{ 
                    fontSize: "18px", 
                    fontWeight: 700, 
                    marginBottom: "16px",
                    color: "#374151",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                }}>
                    <span>금일 대기 환자</span>
                    <span style={{
                        fontSize: "14px",
                        color: "#6b7280",
                        fontWeight: 500
                    }}>
                        현재 시간 {currentTime.toLocaleTimeString('ko-KR', {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false
                        })}
                    </span>
                </div>
                
                <div style={{ 
                    display: "grid",
                    gap: "12px"
                }}>
                    {filteredWaitingPatients.map((patient, index) => (
                        <div key={`${patient.id}-${index}`} style={{
                            padding: "16px",
                            background: (patientStatus[patient.id] || 'waiting') === 'completed' 
                                ? "#f8f9fa" // 완료된 환자는 회색 배경
                                : patient.visitOrigin === "reservation" 
                                    ? "#f0f8ff" // 예약 환자는 파란색 배경
                                    : "white", // 방문 환자는 흰색 배경
                            borderRadius: "8px",
                            border: "1px solid #e5e7eb",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            opacity: (patientStatus[patient.id] || 'waiting') === 'completed' ? 0.7 : 1 // 완료된 환자는 투명도 적용
                        }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ 
                                    fontSize: "16px", 
                                    fontWeight: 600, 
                                    color: "#374151",
                                    marginBottom: "4px"
                                }}>
                                    <span style={{ 
                                        color: "#374151",
                                        fontWeight: 700,
                                        fontSize: "18px"
                                    }}>
                                        {patient.time}
                                    </span>
                                    <span style={{ marginLeft: "12px" }}>
                                        {patient.name} ({patient.age || '?'}세, {patient.visitType}) - {(patient.condition || '').includes("검사 완료") ? "검사 완료" : (patient.condition || '')}
                                    </span>
                                </div>
                                {patient.alert && (patient.condition || '').includes("검사 완료") && (
                                    <div style={{ 
                                        fontSize: "14px", 
                                        color: "#B51515",
                                        fontWeight: 500
                                    }}>
                                        {patient.alert}
                                    </div>
                                )}
                            </div>
                            {(patientStatus[patient.id] || 'waiting') === 'completed' ? (
                            <button style={{
                                padding: "6px 12px",
                                    background: "#10b981", // 완료는 초록색 배경
                                    color: "white",
                                border: "1px solid #d1d5db",
                                borderRadius: "6px",
                                fontSize: "12px",
                                fontWeight: 500,
                                    cursor: "default"
                            }}>
                                    완료
                            </button>
                            ) : (
                                <div style={{ display: "flex", gap: "8px" }}>
                                                            <button 
                            onClick={() => handleStartTreatment(patient)}
                            style={{
                                padding: "6px 12px",
                                background: (patient.condition || '').includes("검사 완료") ? "#5D6D7E" : "#f3f4f6", // 검사 완료 환자는 신규환자 버튼 색상
                                color: (patient.condition || '').includes("검사 완료") ? "white" : "#374151", // 검사 완료 환자는 흰색 텍스트
                                border: "1px solid #d1d5db",
                                borderRadius: "6px",
                                fontSize: "12px",
                                fontWeight: 500,
                                cursor: "pointer"
                            }}
                        >
                            {(patient.condition || '').includes("검사 완료") ? "결과 보기" : (patient.buttonText || "진료 시작")}
                        </button>
                                    {isPatientTimeReached(patient.time) && (
                                        <button 
                                            onClick={() => handleCompleteTreatment(patient.id.toString())}
                                            style={{
                                                padding: "6px 12px",
                                                background: "#3b82f6", // 파란색 배경
                                                color: "white",
                                                border: "1px solid #d1d5db",
                                                borderRadius: "6px",
                                                fontSize: "12px",
                                                fontWeight: 500,
                                                cursor: "pointer"
                                            }}
                                        >
                                            진료 완료
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* 오른쪽: 병원 일정 + 처방/오더보드 */}
            <div style={{ 
                display: "flex", 
                flexDirection: "column",
                gap: "20px",
                minHeight: "fit-content"
            }}>
                {/* 금일 병원 일정 */}
                <div style={{ 
                    background: "white", 
                    borderRadius: "8px",
                    padding: "20px",
                    border: "1px solid #e5e7eb",
                    display: "flex",
                    flexDirection: "column",
                    minHeight: hospitalSchedule.length === 0 ? "120px" : "fit-content"
                }}>
                    <div style={{ 
                        fontSize: "18px", 
                        fontWeight: 700, 
                        marginBottom: "16px",
                        color: "#374151"
                    }}>
                        금일 병원 일정
                    </div>
                    
                    {hospitalSchedule.length === 0 ? (
                        <div style={{ 
                            color: "#6b7280", 
                            fontSize: "14px",
                            textAlign: "center",
                            padding: "20px 0"
                        }}>
                            오늘 일정이 없습니다.
                        </div>
                    ) : (
                    <div style={{ 
                        display: "grid",
                        gap: "12px"
                    }}>
                        {hospitalSchedule.map((schedule) => (
                            <div key={schedule.id} style={{
                                padding: "16px",
                                background: "white",
                                borderRadius: "8px",
                                border: "1px solid #e5e7eb",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center"
                            }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ 
                                        fontSize: "14px", 
                                        fontWeight: 500, 
                                        color: "#374151",
                                        marginBottom: "4px"
                                    }}>
                                        {schedule.timeRange} - {schedule.activity}
                                    </div>
                                </div>
                                <div style={{ 
                                    fontSize: "12px", 
                                    color: schedule.status === "진행 중" ? "#374151" : "#6b7280",
                                    background: schedule.status === "진행 중" ? "#f3f4f6" : "transparent",
                                    padding: schedule.status === "진행 중" ? "4px 8px" : "0",
                                    borderRadius: schedule.status === "진행 중" ? "12px" : "0",
                                    fontWeight: 500
                                }}>
                                    {schedule.status}
                                </div>
                            </div>
                        ))}
                    </div>
                    )}
                </div>

                {/* 당일 처방/오더보드 */}
                <div style={{ 
                    background: "white", 
                    borderRadius: "8px",
                    padding: "20px",
                    border: "1px solid #e5e7eb",
                    display: "flex",
                    flexDirection: "column",
                    minHeight: prescriptions.length === 0 ? "120px" : "fit-content"
                }}>
                    <div style={{ 
                        fontSize: "18px", 
                        fontWeight: 700, 
                        marginBottom: "16px",
                        color: "#374151"
                    }}>
                        당일 처방/오더보드
                    </div>
                    
                    {prescriptions.length === 0 ? (
                        <div style={{ 
                            color: "#6b7280", 
                            fontSize: "14px",
                            textAlign: "center",
                            padding: "20px 0"
                        }}>
                            아직 처방/오더가 없습니다.
                        </div>
                    ) : (
                    <div style={{ 
                        display: "grid",
                        gap: "12px"
                    }}>
                        {prescriptions
                            .reduce((acc, prescription) => {
                                const existingIndex = acc.findIndex(p => p.patientName === prescription.patientName);
                                if (existingIndex >= 0) {
                                    // 같은 환자가 있으면 더 최근 것을 유지
                                    if (new Date(prescription.createdAt) > new Date(acc[existingIndex].createdAt)) {
                                        acc[existingIndex] = prescription;
                                    }
                                } else {
                                    acc.push(prescription);
                                }
                                return acc;
                            }, [] as typeof prescriptions)
                            .map((prescription) => (
                            <div key={prescription.id} style={{
                                padding: "16px",
                                background: "white",
                                borderRadius: "8px",
                                border: "1px solid #e5e7eb",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center"
                            }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ 
                                        fontSize: "14px", 
                                        fontWeight: 500, 
                                        color: "#374151",
                                        marginBottom: "4px"
                                    }}>
                                            {prescription.patientName} 처방 및 오더
                                    </div>
                                    <div style={{ 
                                        fontSize: "12px", 
                                        color: "#6b7280"
                                    }}>
                                            {new Date(prescription.createdAt).toLocaleTimeString('ko-KR', {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                hour12: false
                                            })}
                                    </div>
                                </div>
                                    <button 
                                        onClick={() => {
                                            setSelectedPrescription(prescription);
                                            setPrescriptionModalOpen(true);
                                        }}
                                        style={{
                                    padding: "6px 12px",
                                    background: "#f3f4f6",
                                    color: "#374151",
                                    border: "1px solid #d1d5db",
                                    borderRadius: "6px",
                                    fontSize: "12px",
                                    fontWeight: 500,
                                    cursor: "pointer"
                                        }}
                                    >
                                        상세보기
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

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

                    const newPatient: WaitingPatient = {
                        id: Math.max(...waitingPatients.map(p => p.id), 0) + 1,
                        time: currentTime,
                        name: patientData.name,
                        birthDate: patientData.birthDate,
                        phone: patientData.phone,
                        condition: patientData.symptoms,
                        visitType: "초진",
                        alert: null,
                        alertType: null,
                        buttonText: "진료 시작",
                        visitOrigin: "walkin",
                        nurseInfo: patientData.nurseInfo
                    };

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
