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
import { Header, Sidebar } from './components/layout';
import { WaitingPatient, waitingPatientsData } from './data/waitingPatientsData';
import { addBulkPatientHistory, addVisitRecord, updatePatientInfo } from './data/patientHistoryData';
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
    const [waitingPatients, setWaitingPatients] = useState<WaitingPatient[]>(waitingPatientsData);
    
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
    
    // 컴포넌트 마운트 시 로컬 스토리지에서 토큰 확인하여 인증 상태 설정
    // 컴포넌트 마운트 시 로컬 스토리지에서 토큰 확인하여 인증 상태 설정
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true);
        } else {
            // 테스트용: 토큰이 없어도 자동으로 로그인 상태로 설정
            localStorage.setItem('token', 'temp-token');
            setIsAuthenticated(true);
        }
        setLoading(false);
        
        // 대량 환자 내역 데이터 초기화
        addBulkPatientHistory();
    }, []);
    
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
                                condition: patientData.symptoms,
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
                        <div style={{ textAlign: "center", padding: "40px" }}>
                            <h2>검사 관리</h2>
                            <p>검사 관련 기능이 여기에 표시됩니다.</p>
                        </div>
                    )}
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