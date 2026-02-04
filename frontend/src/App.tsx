/**
 * EMR 시스템 메인 애플리케이션 컴포넌트
 * 
 * 주요 기능:
 * - 사용자 인증 관리 (로그인/로그아웃)
 * - 페이지 라우팅 (홈, 차트, 검사, 예약, 서식)
 * - 신규 환자 등록 모달 관리
 * - 전체 레이아웃 구성 (헤더, 사이드바, 메인 콘텐츠, 우측 패널)
 */
import React, { useState, useEffect } from 'react';
import { NewPatientModal } from './components/patient-registration';
import { Dashboard } from './components/dashboard';
import { PatientChart } from './pages/PatientChart';
import { ExamManagement } from './pages/ExamManagement';
import { DocumentManagement } from './pages/DocumentManagement';
import { AppointmentManagement } from './pages/AppointmentManagement';
import { Header, Sidebar } from './components/layout';
import { WaitingPatient, waitingPatientsData } from './data/waitingPatientsData';
import { revisitPatientsData } from './data/revisitPatientsData';
import { addBulkPatientHistory, addVisitRecord, updatePatientInfo, getPatientHistory, createDefaultVisitRecord } from './data/patientHistoryData';
import { getPatients, createPatient } from './api/patients';
import { isAuthenticated as checkAuth } from './api/auth';
import './App.css';

export default function App() {
    // 인증 상태 관리
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    
    // 신규 환자 등록 모달 상태 관리
    const [showNewPatientModal, setShowNewPatientModal] = useState(false);
    
    // 현재 페이지 상태 관리 (홈, 차트, 검사, 예약, 서식)
    const [currentPage, setCurrentPage] = useState('home');
    
    // 검색 상태 관리
    const [searchQuery, setSearchQuery] = useState('');

    // 대기 환자 목록 상태 관리
    const [waitingPatients, setWaitingPatients] = useState<WaitingPatient[]>([]);
    
    // 환자 데이터 로드
    useEffect(() => {
        console.log('waitingPatientsData 길이:', waitingPatientsData.length);
        console.log('waitingPatientsData 첫 번째 환자:', waitingPatientsData[0]);
        
        // 1. 초진 환자만 필터링 (waitingPatientsData에서)
        const firstVisitPatients = waitingPatientsData
            .filter(patient => patient.visitType === '초진' && patient.birthDate && patient.birthDate !== '');
        
        // 2. 재진 환자는 revisitPatientsData에서 가져오기
        // 시간대별로 배치 (9:00~18:00, 30분 간격)
        const timeSlots = [
            '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
            '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
            '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
        ];
        
        const revisitPatients: WaitingPatient[] = revisitPatientsData
            .filter(patient => patient.visitType === '재진')
            .slice(0, 20) // 최대 20명
            .map((patient, index) => {
                const timeIndex = index % timeSlots.length;
                const visitOrigin: 'reservation' | 'walkin' = index % 2 === 0 ? 'reservation' : 'walkin';
                
                return {
                    id: 1000 + patient.id, // 초진 환자 ID와 겹치지 않도록
                    time: timeSlots[timeIndex],
                    name: patient.name,
                    birthDate: patient.birthDate,
                    phone: patient.phone,
                    condition: patient.diagnosis,
                    visitType: '재진',
                    alert: null,
                    alertType: null,
                    buttonText: '진료 시작',
                    visitOrigin: visitOrigin
                };
            });
        
        // 3. 초진 환자와 재진 환자 합치기
        const allPatients = [...firstVisitPatients, ...revisitPatients];
        
        // 4. 시간순으로 정렬
        allPatients.sort((a, b) => {
            const timeA = a.time.split(':').map(Number);
            const timeB = b.time.split(':').map(Number);
            const minutesA = timeA[0] * 60 + timeA[1];
            const minutesB = timeB[0] * 60 + timeB[1];
            return minutesA - minutesB;
        });
        
        console.log('초진 환자 수:', firstVisitPatients.length);
        console.log('재진 환자 수:', revisitPatients.length);
        console.log('전체 환자 수:', allPatients.length);
        
        setWaitingPatients(allPatients);
    }, []);
    const [isUsingBackendData, setIsUsingBackendData] = useState(false);
    
    // 검사 하기 버튼 연동을 위한 상태 관리
    const [selectedPatientForTest, setSelectedPatientForTest] = useState<WaitingPatient | null>(null);
    
    // 검사 하기 버튼 핸들러 함수
    const handleTestButton = (patient: WaitingPatient) => {
        // 1. 선택된 환자 정보 저장
        setSelectedPatientForTest(patient);
        
        // 2. 검사 대시보드로 페이지 변경
        setCurrentPage('exam');
    };
    
    // 처방/오더 상태 관리
    const [prescriptions, setPrescriptions] = useState<Array<{
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
            result?: string;  // 검사 결과 (완료된 경우)
        }>;
        nextVisit?: string;
        notes: string;
        revisitRecommendation: string;
        createdAt: string;
    }>>([
        // 예시 1: 처방만 있는 환자
        {
            id: "1",
            patientName: "김영수",
            patientId: "P001",
            prescriptions: [
                {
                    medication: "Metformin",
                    dosage: "500mg",
                    frequency: "1T bid",
                    duration: "30일"
                },
                {
                    medication: "Glimepiride",
                    dosage: "1mg",
                    frequency: "1T qd",
                    duration: "30일"
                }
            ],
            tests: [],
            nextVisit: undefined,
            notes: "혈당 관리 상태 양호",
            revisitRecommendation: "",
            createdAt: "2024-01-20T05:30:00.000Z"  // 한국 시간 14:30 (UTC+9)
        },
        // 예시 2: 처방 + 재방문 권고가 있는 환자
        {
            id: "2",
            patientName: "이미영",
            patientId: "P002",
            prescriptions: [
                {
                    medication: "Amlodipine",
                    dosage: "5mg",
                    frequency: "1T qd",
                    duration: "30일"
                }
            ],
            tests: [],
            nextVisit: undefined,
            notes: "혈압 조절 상태 확인 필요",
            revisitRecommendation: "1개월 뒤 재방문 권고",
            createdAt: "2024-01-20T06:15:00.000Z"  // 한국 시간 15:15 (UTC+9)
        },
        // 상단: 검사 완료된 환자들 (resultsReadySection)
        // 일찍 검사 시작한 사람부터 시간순으로 정렬
        // 1. 박현준 - 혈압 조절 상태 확인 필요 (08:30 시작, 가장 일찍)
        {
            id: "3",
            patientName: "박현준",
            patientId: "P003",
            prescriptions: [
                {
                    medication: "Amlodipine",
                    dosage: "5mg",
                    frequency: "1T qd",
                    duration: "30일"
                }
            ],
            tests: [
                {
                    testName: "혈압 측정",
                    urgency: "routine",
                    result: "135/85 mmHg"
                },
                {
                    testName: "혈액검사",
                    urgency: "routine",
                    result: "정상 범위"
                },
                {
                    testName: "심전도",
                    urgency: "routine",
                    result: "정상"
                },
                {
                    testName: "소변검사",
                    urgency: "routine",
                    result: "정상"
                }
            ],
            nextVisit: undefined,
            notes: "혈압 조절 상태 확인 필요",
            revisitRecommendation: "혈압 조절 상태 확인 필요",
            createdAt: "2024-01-19T23:30:00.000Z"  // 한국 시간 08:30 (UTC+9)
        },
        // 2. 최지영 - 검사 완료 (09:00 시작)
        {
            id: "5",
            patientName: "최지영",
            patientId: "P005",
            prescriptions: [
                {
                    medication: "Ibuprofen",
                    dosage: "400mg",
                    frequency: "1T tid",
                    duration: "7일"
                }
            ],
            tests: [
                {
                    testName: "혈액검사",
                    urgency: "routine",
                    result: "정상 범위"
                },
                {
                    testName: "소변검사",
                    urgency: "routine",
                    result: "정상"
                },
                {
                    testName: "초음파",
                    urgency: "routine",
                    result: "정상 소견"
                },
                {
                    testName: "X-ray 검사",
                    urgency: "routine",
                    result: "정상"
                }
            ],
            nextVisit: undefined,
            notes: "두통 재발, 검사 결과 정상",
            revisitRecommendation: "두통 재발 시 재방문 권고",
            createdAt: "2024-01-20T00:00:00.000Z"  // 한국 시간 09:00 (UTC+9)
        },
        // 3. 김지현 - 상급병원 이송 필요 (10:00 시작)
        {
            id: "4",
            patientName: "김지현",
            patientId: "P004",
            prescriptions: [],
            tests: [
                {
                    testName: "CT 검사",
                    urgency: "urgent",
                    result: "뇌출혈 의심 소견"
                },
                {
                    testName: "혈액검사",
                    urgency: "urgent",
                    result: "WBC: 12,500/μL"
                },
                {
                    testName: "X-ray 검사",
                    urgency: "urgent",
                    result: "폐 음영 증가"
                },
                {
                    testName: "심전도",
                    urgency: "urgent",
                    result: "부정맥 소견"
                }
            ],
            nextVisit: undefined,
            notes: "상급병원 이송 필요",
            revisitRecommendation: "상급병원 이송 필요",
            createdAt: "2024-01-20T01:00:00.000Z"  // 한국 시간 10:00 (UTC+9)
        },
        // 하단: 검사 진행 중인 환자들 (inProgressSection)
        // 검사는 8:30~18:00까지만 가능
        // 일찍 검사 시작한 사람부터 시간순으로 정렬, 진행도도 일찍 시작한 사람이 더 높음
        // 1. 이하나 - 심전도 진행 중 (3/4 완료) - 08:30 시작 (가장 일찍)
        {
            id: "6",
            patientName: "이하나",
            patientId: "P006",
            prescriptions: [],
            tests: [
                {
                    testName: "심전도",
                    urgency: "urgent"
                },
                {
                    testName: "혈액검사",
                    urgency: "routine",
                    result: "정상 범위"
                },
                {
                    testName: "소변검사",
                    urgency: "routine",
                    result: "정상"
                },
                {
                    testName: "X-ray 검사",
                    urgency: "routine",
                    result: "정상"
                }
            ],
            nextVisit: undefined,
            notes: "가슴 통증, 심전도 검사 필요",
            revisitRecommendation: "",
            createdAt: "2024-01-19T23:30:00.000Z"  // 한국 시간 08:30 (UTC+9)
        },
        // 2. 오수민 - X-ray 진행 중 (3/4 완료) - 09:00 시작
        {
            id: "7",
            patientName: "오수민",
            patientId: "P007",
            prescriptions: [],
            tests: [
                {
                    testName: "X-ray 검사",
                    urgency: "routine"
                },
                {
                    testName: "혈액검사",
                    urgency: "routine",
                    result: "정상 범위"
                },
                {
                    testName: "소변검사",
                    urgency: "routine",
                    result: "정상"
                },
                {
                    testName: "초음파",
                    urgency: "routine",
                    result: "정상"
                }
            ],
            nextVisit: undefined,
            notes: "요통 증상 개선 중",
            revisitRecommendation: "",
            createdAt: "2024-01-20T00:00:00.000Z"  // 한국 시간 09:00 (UTC+9)
        },
        // 3. 조형석 - 혈액검사 진행 중 (2/4 완료) - 09:30 시작
        {
            id: "8",
            patientName: "조형석",
            patientId: "P008",
            prescriptions: [],
            tests: [
                {
                    testName: "혈액검사",
                    urgency: "routine"
                },
                {
                    testName: "소변검사",
                    urgency: "routine",
                    result: "정상"
                },
                {
                    testName: "초음파",
                    urgency: "routine",
                    result: "정상"
                },
                {
                    testName: "X-ray 검사",
                    urgency: "routine"
                }
            ],
            nextVisit: undefined,
            notes: "복통 증상 지속",
            revisitRecommendation: "",
            createdAt: "2024-01-20T00:30:00.000Z"  // 한국 시간 09:30 (UTC+9)
        },
        // 4. 홍길동 - 위내시경 진행 중 (2/4 완료) - 10:00 시작
        {
            id: "9",
            patientName: "홍길동",
            patientId: "P009",
            prescriptions: [],
            tests: [
                {
                    testName: "위내시경",
                    urgency: "urgent"
                },
                {
                    testName: "혈액검사",
                    urgency: "routine",
                    result: "정상 범위"
                },
                {
                    testName: "소변검사",
                    urgency: "routine",
                    result: "정상"
                },
                {
                    testName: "초음파",
                    urgency: "routine"
                }
            ],
            nextVisit: undefined,
            notes: "위염 의심, 검사 후 재진료 필요",
            revisitRecommendation: "",
            createdAt: "2024-01-20T01:00:00.000Z"  // 한국 시간 10:00 (UTC+9)
        },
        // 5. 정민수 - CT 검사 진행 중 (2/4 완료) - 10:30 시작
        {
            id: "10",
            patientName: "정민수",
            patientId: "P010",
            prescriptions: [],
            tests: [
                {
                    testName: "CT 검사",
                    urgency: "urgent"
                },
                {
                    testName: "혈액검사",
                    urgency: "routine",
                    result: "정상 범위"
                },
                {
                    testName: "소변검사",
                    urgency: "routine"
                },
                {
                    testName: "X-ray 검사",
                    urgency: "routine"
                }
            ],
            nextVisit: undefined,
            notes: "두통 지속, 영상 검사 필요",
            revisitRecommendation: "",
            createdAt: "2024-01-20T01:30:00.000Z"  // 한국 시간 10:30 (UTC+9)
        },
        // 6. 김수진 - 초음파 진행 중 (2/4 완료) - 11:00 시작
        {
            id: "11",
            patientName: "김수진",
            patientId: "P011",
            prescriptions: [],
            tests: [
                {
                    testName: "초음파",
                    urgency: "routine"
                },
                {
                    testName: "혈액검사",
                    urgency: "routine",
                    result: "정상 범위"
                },
                {
                    testName: "소변검사",
                    urgency: "routine",
                    result: "정상"
                },
                {
                    testName: "X-ray 검사",
                    urgency: "routine"
                }
            ],
            nextVisit: undefined,
            notes: "복부 통증, 초음파 검사 진행 중",
            revisitRecommendation: "",
            createdAt: "2024-01-20T02:00:00.000Z"  // 한국 시간 11:00 (UTC+9)
        },
        // 7. 정우진 - 혈액검사 진행 중 (1/4 완료) - 11:30 시작 (가장 늦게)
        {
            id: "12",
            patientName: "정우진",
            patientId: "P012",
            prescriptions: [],
            tests: [
                {
                    testName: "혈액검사",
                    urgency: "routine"
                },
                {
                    testName: "소변검사",
                    urgency: "routine"
                },
                {
                    testName: "초음파",
                    urgency: "routine"
                },
                {
                    testName: "X-ray 검사",
                    urgency: "routine"
                }
            ],
            nextVisit: undefined,
            notes: "지속적 기침, 혈액검사 진행 중",
            revisitRecommendation: "",
            createdAt: "2024-01-20T02:30:00.000Z"  // 한국 시간 11:30 (UTC+9)
        }
    ]);
    
    // 컴포넌트 마운트 시 인증 상태 확인 및 환자 데이터 로드
    useEffect(() => {
        const initializeApp = async () => {
            try {
                // 인증 상태 확인
                if (checkAuth()) {
                    setIsAuthenticated(true);
                } else {
                    // 테스트용: 토큰이 없어도 자동으로 로그인 상태로 설정
                    localStorage.setItem('token', 'temp-token');
                    setIsAuthenticated(true);
                }
                
                // 로컬 데이터 사용 (백엔드 연결 비활성화)
                console.log('로컬 데이터 사용 중');
                
            } catch (error) {
                console.error('앱 초기화 실패:', error);
            } finally {
                setLoading(false);
                // 대량 환자 내역 데이터 초기화
                addBulkPatientHistory();
            }
        };

        initializeApp();
    }, []);

    // 백엔드에서 환자 데이터 로드
    const loadPatientsFromBackend = async () => {
        try {
            console.log('백엔드에서 환자 데이터 로드 시작...');
            const patients = await getPatients();
            console.log('백엔드에서 받은 환자 데이터:', patients);
            // 백엔드 데이터를 WaitingPatient 형식으로 변환
            const waitingPatientsData = patients.map(patient => {
                // 환자의 이전 방문 내역 확인
                const patientHistory = getPatientHistory(patient.id);
                const hasPreviousVisits = patientHistory && patientHistory.visits && patientHistory.visits.length > 0;
                
                // 오늘 방문 이유 가져오기 (가장 최근 방문 기록 사용)
                const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD 형식
                const todayVisit = patientHistory?.visits?.find(visit => visit.date === today);
                const latestVisit = patientHistory?.visits?.[0]; // 가장 최근 방문 기록
                const todaySymptoms = todayVisit?.medicalRecord?.symptoms || latestVisit?.medicalRecord?.symptoms || '대기 중';
                
                // 나이 계산
                const calculatedAge = patient.birthDate ? 
                    new Date().getFullYear() - new Date(patient.birthDate).getFullYear() : 
                    null;
                
                return {
                    id: patient.id,
                    name: patient.name,
                    mrn: patient.mrn,
                    age: calculatedAge,
                    sex: patient.sex === 'M' ? '남성' : patient.sex === 'F' ? '여성' : '기타',
                    phone: patient.phone || '',
                    visitType: hasPreviousVisits ? '재진' : '초진', // 실제 내역 기반으로 결정
                    symptoms: todaySymptoms, // 오늘 방문 이유
                    condition: todaySymptoms, // 대시보드에 표시될 병명
                    time: new Date().toTimeString().slice(0, 5), // 현재 시간 설정
                    estimatedTime: '10분',
                    priority: 'normal',
                nurseInfo: {
                    symptoms: '',
                    bloodPressure: '',
                    notes: '',
                    registeredBy: '간호사',
                    registeredAt: new Date().toISOString()
                }
                };
            });
            setWaitingPatients(waitingPatientsData);
            setIsUsingBackendData(true);
        } catch (error) {
            console.error('❌ 환자 데이터 로드 실패:', error);
            // 백엔드 연결 실패 시 로컬 데이터 사용
            setWaitingPatients(waitingPatientsData);
            setIsUsingBackendData(false);
            console.log('⚠️ 로컬 데이터 사용 중');
        }
    };
    
    // 로딩 중인 경우 로딩 화면 표시
    if (loading) {
        return (
            <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
                background: "#f8fafc",
                fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto"
            }}>
                <div style={{ textAlign: "center", padding: "40px" }}>
                    <h1 style={{ fontSize: "32px", fontWeight: 700, color: "#374151", marginBottom: "16px" }}>
                        Dr.App • EMR
                    </h1>
                    <p style={{ fontSize: "16px", color: "#6b7280" }}>로딩 중...</p>
                </div>
            </div>
        );
    }
    
    // 로그인하지 않은 경우 로그인 화면 표시
    if (!isAuthenticated) {
        return (
            <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
                background: "#f8fafc",
                fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto"
            }}>
                <div style={{ textAlign: "center", padding: "40px" }}>
                    <h1 style={{ fontSize: "32px", fontWeight: 700, color: "#374151", marginBottom: "16px" }}>
                        Dr.App • EMR
                    </h1>
                    <p style={{ fontSize: "16px", color: "#6b7280", marginBottom: "32px" }}>
                        의료진을 위한 전자 의무기록 시스템
                    </p>
                    <button
                        onClick={() => {
                            localStorage.setItem('token', 'temp-token');
                            setIsAuthenticated(true);
                        }}
                        style={{
                            padding: "12px 24px",
                            background: "#3b82f6",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            fontSize: "16px",
                            fontWeight: 600,
                            cursor: "pointer",
                            transition: "background-color 0.2s"
                        }}
                        onMouseEnter={(e) => (e.target as HTMLElement).style.background = "#2563eb"}
                        onMouseLeave={(e) => (e.target as HTMLElement).style.background = "#3b82f6"}
                    >
                        로그인 (테스트)
                    </button>
                </div>
            </div>
        );
    }

    
    // 로그인된 경우 메인 EMR 시스템 화면 표시
    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            height: "100vh",
            background: "#f8fafc",
            fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto"
        }}>
            {/* 상단 헤더: 로고, 검색바, 신규 환자 등록 버튼, 사용자 정보 */}
            <Header 
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onNewPatient={() => setShowNewPatientModal(true)}
                onLogout={() => {
                    localStorage.removeItem('token');
                    setIsAuthenticated(false);
                }}
                dataSource={isUsingBackendData ? 'backend' : 'local'}
            />
            
            {/* 메인 콘텐츠 영역: 좌측 사이드바 + 중앙 콘텐츠 + 우측 패널 */}
            <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
                {/* 좌측 사이드바: 메뉴 네비게이션 */}
                <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
                
                {/* 중앙 메인 콘텐츠: 현재 페이지에 따른 내용 표시 */}
                <main style={{ flex: 1, padding: "20px", overflow: "auto", minWidth: 0 }}>
                    {currentPage === 'home' && <Dashboard 
                        searchQuery={searchQuery} 
                        onNewPatient={() => setShowNewPatientModal(true)} 
                        onAddToWaitingList={(patientData) => {
                            console.log('대기 목록에 추가:', patientData);
                        }}
                        waitingPatients={waitingPatients}
                        setWaitingPatients={setWaitingPatients}
                        prescriptions={prescriptions}
                        setPrescriptions={setPrescriptions}
                        onTestButton={handleTestButton}
                    />}
                    {currentPage === 'chart' && <PatientChart 
                        searchQuery={searchQuery} 
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
                                condition: patientData.condition || patientData.symptoms || '',
                                visitType: "재진",
                                alert: null,
                                alertType: null,
                                buttonText: "진료 시작",
                                visitOrigin: "walkin" as const,
                                nurseInfo: patientData.nurseInfo
                            };

                            setWaitingPatients(prev => [...prev, newPatient]);
                            
                            // 재진환자 등록 시 즉시 방문 내역 생성
                            updatePatientInfo(newPatient.id, newPatient.name, newPatient.birthDate, newPatient.phone);
                            
                            // 간호사 정보만 포함된 오늘 방문 내역 생성
                            const todayVisitRecord = {
                                visitType: "재진" as const,
                                diagnosis: newPatient.condition,
                                medicalRecord: {
                                    symptoms: "",
                                    diagnosis: "",
                                    treatment: ""
                                },
                                prescription: {
                                    medications: [],
                                    instructions: ""
                                },
                                staffMemo: "간호사 등록 완료",
                                nurseInfo: newPatient.nurseInfo ? {
                                    symptoms: newPatient.nurseInfo.symptoms,
                                    bloodPressure: newPatient.nurseInfo.bloodPressure || "",
                                    notes: newPatient.nurseInfo.notes
                                } : undefined
                            };
                            
                            addVisitRecord(newPatient.id, todayVisitRecord);
                            
                            alert('재진환자가 대기 목록에 추가되었습니다.');
                        }}
                    />}
                    {currentPage === 'exam' && (
                        <ExamManagement 
                            selectedPatient={selectedPatientForTest}
                            onPatientClear={() => setSelectedPatientForTest(null)}
                            prescriptions={prescriptions}
                        />
                    )}
                    {currentPage === 'document' && <DocumentManagement />}
                    {currentPage === 'appointment' && <AppointmentManagement />}
                    {currentPage === 'forms' && (
                        <div style={{ textAlign: "center", padding: "40px" }}>
                            <h2>서식 / 문서</h2>
                            <p>서식 및 문서 관련 기능이 여기에 표시됩니다.</p>
                        </div>
                    )}
                </main>
            </div>
            
            {/* 신규 환자 등록 모달 */}
            <NewPatientModal
                isOpen={showNewPatientModal}
                onClose={() => setShowNewPatientModal(false)}
                onSubmit={(patientData) => {
                    console.log('환자 데이터:', patientData);
                    alert('환자가 등록되었습니다!');
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
                        visitOrigin: "walkin" as const,
                        nurseInfo: patientData.nurseInfo
                    };

                    setWaitingPatients(prev => [...prev, newPatient]);
                    alert('신규환자가 대기 목록에 추가되었습니다.');
                    setShowNewPatientModal(false);
                }}
            />
        </div>
    );
}