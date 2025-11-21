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
import { Dashboard, Calendar, QuickActions, AlertsSection } from './components/dashboard';
import { PatientChart } from './pages/PatientChart';
import { ExamManagement } from './pages/ExamManagement';
import { DocumentManagement } from './pages/DocumentManagement';
import { Header, Sidebar } from './components/layout';
import { WaitingPatient, waitingPatientsData } from './data/waitingPatientsData';
import { addBulkPatientHistory, addVisitRecord, updatePatientInfo, getPatientHistory, createDefaultVisitRecord } from './data/patientHistoryData';
import { getPatients, createPatient } from './api/patients';
import { getCurrentUser, isAuthenticated as checkAuth } from './api/auth';
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
        
        // birthDate가 있는 환자만 필터링
        const validPatients = waitingPatientsData
            .filter(patient => patient.birthDate && patient.birthDate !== '');
        
        console.log('유효한 환자 수:', validPatients.length);
        console.log('유효한 환자들:', validPatients);
        
        setWaitingPatients(validPatients);
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
            createdAt: "2024-01-20T14:30:00.000Z"
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
            createdAt: "2024-01-20T15:15:00.000Z"
        },
        // 예시 3: 검사가 있는 환자
        {
            id: "3",
            patientName: "박현준",
            patientId: "P003",
            prescriptions: [
                {
                    medication: "Omeprazole",
                    dosage: "20mg",
                    frequency: "1T qd",
                    duration: "14일"
                }
            ],
            tests: [
                {
                    testName: "혈액검사",
                    urgency: "routine"
                },
                {
                    testName: "위내시경",
                    urgency: "urgent"
                }
            ],
            nextVisit: undefined,
            notes: "위염 의심, 검사 후 재진료 필요",
            revisitRecommendation: "검사 결과 확인 후 치료 방향 결정",
            createdAt: "2024-01-20T16:00:00.000Z"
        },
        // 예시 4: 처방 + 검사 + 재방문 권고가 있는 환자
        {
            id: "4",
            patientName: "최지우",
            patientId: "P004",
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
                    testName: "X-ray 검사",
                    urgency: "routine"
                }
            ],
            nextVisit: undefined,
            notes: "요통 증상 개선 중",
            revisitRecommendation: "검사 결과 확인 후 물리치료 고려",
            createdAt: "2024-01-20T16:30:00.000Z"
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
                        />
                    )}
                    {currentPage === 'document' && <DocumentManagement />}
                    {currentPage === 'appointment' && (
                        <div style={{ textAlign: "center", padding: "40px" }}>
                            <h2>예약 관리</h2>
                            <p>예약 관련 기능이 여기에 표시됩니다.</p>
                        </div>
                    )}
                    {currentPage === 'forms' && (
                        <div style={{ textAlign: "center", padding: "40px" }}>
                            <h2>서식 / 문서</h2>
                            <p>서식 및 문서 관련 기능이 여기에 표시됩니다.</p>
                        </div>
                    )}
                </main>
                
                {/* 우측 패널: 캘린더, 빠른 액션, 알림 섹션 */}
                <aside style={{ 
                    width: "300px", 
                    background: "white", 
                    borderLeft: "1px solid #e5e7eb",
                    padding: "20px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                    overflow: "auto",
                    maxHeight: "100vh"
                }}>
                    <Calendar />
                    <QuickActions onNewPatient={() => setShowNewPatientModal(true)} />
                    <AlertsSection waitingPatients={waitingPatients} setWaitingPatients={setWaitingPatients} />
                </aside>
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