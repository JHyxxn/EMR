export interface VisitRecord {
    date: string;
    visitType: '초진' | '재진';
    diagnosis: string;
    medicalRecord: {
        symptoms: string;
        diagnosis: string;
        treatment: string;
    };
    prescription: {
        medications: Array<{
            name: string;
            dosage: string;
            frequency: string;
        }>;
        instructions: string;
    };
    staffMemo: string;
    nurseInfo?: {
        symptoms: string;
        bloodPressure: string | {
            systolic: number;
            diastolic: number;
            measuredAt: string;
        };
        notes: string;
    };
}

export interface PatientHistory {
    patientId: number;
    patientName: string;
    birthDate: string;
    phone: string;
    visits: VisitRecord[];
}

// 환자별 방문 내역 데이터
export const patientHistoryData: PatientHistory[] = [
    {
        patientId: 1,
        patientName: "김영수",
        birthDate: "1985-03-15",
        phone: "010-1234-5678",
        visits: [
            {
                date: "2025-09-09",
                visitType: "재진",
                diagnosis: "감기 증상",
                medicalRecord: {
                    symptoms: "기침, 콧물, 인후통",
                    diagnosis: "상기도 감염 의심",
                    treatment: "대증 치료 및 휴식 권고"
                },
                prescription: {
                    medications: [
                        {
                            name: "Acetaminophen",
                            dosage: "500mg",
                            frequency: "1T tid"
                        }
                    ],
                    instructions: "1일 3회 식후 30분"
                },
                staffMemo: "감기 증상으로 내원. 전반적 상태 양호."
            },
            {
                date: "2025-01-15",
                visitType: "재진",
                diagnosis: "당뇨 관리",
                medicalRecord: {
                    symptoms: "당뇨 관리 상태 확인",
                    diagnosis: "당뇨병",
                    treatment: "약물 처방 및 생활 관리 지침"
                },
                prescription: {
                    medications: [
                        {
                            name: "Metformin",
                            dosage: "500mg",
                            frequency: "1T bid"
                        }
                    ],
                    instructions: "1일 2회 식후 30분"
                },
                staffMemo: "환자 상태 안정적. 약물 복용 순응도 양호."
            },
            {
                date: "2025-01-10",
                visitType: "재진",
                diagnosis: "고혈압 진단",
                medicalRecord: {
                    symptoms: "고혈압 증상",
                    diagnosis: "고혈압",
                    treatment: "약물 처방 및 생활습관 개선 교육"
                },
                prescription: {
                    medications: [
                        {
                            name: "Amlodipine",
                            dosage: "5mg",
                            frequency: "1T qd"
                        }
                    ],
                    instructions: "1일 1회 아침"
                },
                staffMemo: "고혈압 진단. 생활습관 개선 교육 실시."
            },
            {
                date: "2025-01-05",
                visitType: "초진",
                diagnosis: "일반 검진",
                medicalRecord: {
                    symptoms: "일반 검진",
                    diagnosis: "건강",
                    treatment: "특별한 처치 없음"
                },
                prescription: {
                    medications: [],
                    instructions: "해당 없음"
                },
                staffMemo: "일반 검진 결과 양호."
            }
        ]
    },
    {
        patientId: 2,
        patientName: "박준호",
        birthDate: "1975-03-22",
        phone: "010-2345-6789",
        visits: [
            {
                date: "2025-09-09",
                visitType: "재진",
                diagnosis: "복통",
                medicalRecord: {
                    symptoms: "복부 통증, 소화불량",
                    diagnosis: "소화불량 의심",
                    treatment: "소화제 처방 및 식이 조절"
                },
                prescription: {
                    medications: [
                        {
                            name: "Domperidone",
                            dosage: "10mg",
                            frequency: "1T tid"
                        }
                    ],
                    instructions: "1일 3회 식전 30분"
                },
                staffMemo: "복통으로 내원. 소화불량 증상."
            },
            {
                date: "2025-01-05",
                visitType: "초진",
                diagnosis: "고혈압 진단",
                medicalRecord: {
                    symptoms: "두통, 어지러움",
                    diagnosis: "고혈압",
                    treatment: "약물 처방 및 생활습관 개선"
                },
                prescription: {
                    medications: [
                        {
                            name: "Amlodipine",
                            dosage: "5mg",
                            frequency: "1T qd"
                        }
                    ],
                    instructions: "1일 1회 아침"
                },
                staffMemo: "고혈압 진단. 염분 제한 및 운동 권고."
            }
        ]
    },
    {
        patientId: 3,
        patientName: "이지은",
        birthDate: "1990-08-10",
        phone: "010-3456-7890",
        visits: [
            {
                date: "2025-09-09",
                visitType: "재진",
                diagnosis: "두통",
                medicalRecord: {
                    symptoms: "두통, 어지러움",
                    diagnosis: "긴장성 두통 의심",
                    treatment: "진통제 처방 및 휴식 권고"
                },
                prescription: {
                    medications: [
                        {
                            name: "Ibuprofen",
                            dosage: "400mg",
                            frequency: "1T bid"
                        }
                    ],
                    instructions: "1일 2회 식후 30분"
                },
                staffMemo: "두통으로 내원. 전반적 상태 양호."
            },
            {
                date: "2025-01-18",
                visitType: "재진",
                diagnosis: "당뇨 관리",
                medicalRecord: {
                    symptoms: "혈당 조절 상태 확인",
                    diagnosis: "당뇨병",
                    treatment: "약물 조정 및 식이 관리"
                },
                prescription: {
                    medications: [
                        {
                            name: "Metformin",
                            dosage: "1000mg",
                            frequency: "1T bid"
                        },
                        {
                            name: "Glimepiride",
                            dosage: "1mg",
                            frequency: "1T qd"
                        }
                    ],
                    instructions: "Metformin 1일 2회 식후, Glimepiride 1일 1회 아침"
                },
                staffMemo: "혈당 조절 개선됨. 식이 관리 잘 하고 있음."
            },
            {
                date: "2025-01-03",
                visitType: "초진",
                diagnosis: "당뇨병 진단",
                medicalRecord: {
                    symptoms: "다음, 다뇨, 체중 감소",
                    diagnosis: "당뇨병",
                    treatment: "약물 처방 및 식이 관리 교육"
                },
                prescription: {
                    medications: [
                        {
                            name: "Metformin",
                            dosage: "500mg",
                            frequency: "1T bid"
                        }
                    ],
                    instructions: "1일 2회 식후 30분"
                },
                staffMemo: "당뇨병 진단. 식이 관리 및 운동 교육 실시."
            }
        ]
    },
    {
        patientId: 4,
        patientName: "최지영",
        birthDate: "1992-05-12",
        phone: "010-4567-8901",
        visits: [
            {
                date: "2025-01-22",
                visitType: "재진",
                diagnosis: "천식 관리",
                medicalRecord: {
                    symptoms: "천식 증상 점검",
                    diagnosis: "천식",
                    treatment: "흡입제 조정 및 환경 관리"
                },
                prescription: {
                    medications: [
                        {
                            name: "Salbutamol",
                            dosage: "100mcg",
                            frequency: "2회 흡입 prn"
                        },
                        {
                            name: "Budesonide",
                            dosage: "200mcg",
                            frequency: "2회 흡입 bid"
                        }
                    ],
                    instructions: "Salbutamol 증상 시, Budesonide 1일 2회"
                },
                staffMemo: "천식 증상 조절 양호. 흡입기 사용법 재교육."
            },
            {
                date: "2025-01-08",
                visitType: "초진",
                diagnosis: "천식 진단",
                medicalRecord: {
                    symptoms: "기침, 호흡곤란",
                    diagnosis: "천식",
                    treatment: "흡입제 처방 및 교육"
                },
                prescription: {
                    medications: [
                        {
                            name: "Salbutamol",
                            dosage: "100mcg",
                            frequency: "2회 흡입 prn"
                        }
                    ],
                    instructions: "증상 시 사용"
                },
                staffMemo: "천식 진단. 흡입기 사용법 교육 실시."
            }
        ]
    },
    {
        patientId: 5,
        patientName: "홍길동",
        birthDate: "1980-02-29",
        phone: "010-5678-9012",
        visits: [
            {
                date: "2025-01-25",
                visitType: "재진",
                diagnosis: "고지혈증 관리",
                medicalRecord: {
                    symptoms: "혈중 지질 수치 확인",
                    diagnosis: "고지혈증",
                    treatment: "약물 조정 및 식이 관리"
                },
                prescription: {
                    medications: [
                        {
                            name: "Atorvastatin",
                            dosage: "20mg",
                            frequency: "1T qd"
                        }
                    ],
                    instructions: "1일 1회 저녁"
                },
                staffMemo: "지질 수치 개선됨. 식이 관리 잘 하고 있음."
            },
            {
                date: "2025-01-10",
                visitType: "초진",
                diagnosis: "고지혈증 진단",
                medicalRecord: {
                    symptoms: "혈액검사 결과 이상",
                    diagnosis: "고지혈증",
                    treatment: "약물 처방 및 식이 관리"
                },
                prescription: {
                    medications: [
                        {
                            name: "Simvastatin",
                            dosage: "20mg",
                            frequency: "1T qd"
                        }
                    ],
                    instructions: "1일 1회 저녁"
                },
                staffMemo: "고지혈증 진단. 저지방 식이 교육 실시."
            }
        ]
    },
    {
        patientId: 33,
        patientName: "정승우",
        birthDate: "1987-06-12",
        phone: "010-3456-7893",
        visits: [
            {
                date: "2025-01-28",
                visitType: "재진",
                diagnosis: "소화불량 관리",
                medicalRecord: {
                    symptoms: "소화불량 증상 점검",
                    diagnosis: "소화불량",
                    treatment: "약물 조정 및 식이 관리"
                },
                prescription: {
                    medications: [
                        {
                            name: "Omeprazole",
                            dosage: "20mg",
                            frequency: "1T qd"
                        }
                    ],
                    instructions: "1일 1회 아침 식전"
                },
                staffMemo: "소화불량 증상 개선됨. 식이 관리 잘 하고 있음."
            },
            {
                date: "2025-01-15",
                visitType: "초진",
                diagnosis: "소화불량 진단",
                medicalRecord: {
                    symptoms: "복부 팽만감, 소화불량",
                    diagnosis: "소화불량",
                    treatment: "약물 처방 및 식이 관리"
                },
                prescription: {
                    medications: [
                        {
                            name: "Omeprazole",
                            dosage: "20mg",
                            frequency: "1T qd"
                        }
                    ],
                    instructions: "1일 1회 아침 식전"
                },
                staffMemo: "소화불량 진단. 소화에 좋은 식이 교육 실시."
            }
        ]
    }
];

// 대량의 재진환자 방문 내역 생성 함수
export const generateBulkPatientHistory = (): PatientHistory[] => {
    const additionalPatients: PatientHistory[] = [];
    const names = [
        // 동명이인을 위한 인기 이름들
        "김철수", "김영수", "김민수", "김지영", "김현우", "김서연", "김도현", "김수진",
        "이영희", "이민수", "이지영", "이현우", "이서연", "이도현", "이수진", "이준호",
        "박민수", "박지영", "박현우", "박서연", "박도현", "박수진", "박준호", "박미영",
        "최지영", "최현우", "최서연", "최도현", "최수진", "최준호", "최미영", "최현수",
        "정현우", "정서연", "정도현", "정수진", "정준호", "정미영", "정현수", "정민지",
        "강서연", "강도현", "강수진", "강준호", "강미영", "강현수", "강민지", "강태영",
        "윤도현", "윤수진", "윤준호", "윤미영", "윤현수", "윤민지", "윤태영", "윤서진",
        "임수진", "임준호", "임미영", "임현수", "임민지", "임태영", "임서진", "임동욱",
        "한준호", "한미영", "한현수", "한민지", "한태영", "한서진", "한동욱", "한지원",
        "송미영", "송현수", "송민지", "송태영", "송서진", "송동욱", "송지원", "송현우",
        "조현수", "조민지", "조태영", "조서진", "조동욱", "조지원", "조현우", "조서영",
        "백지원", "백현우", "백서영", "백도현", "백수빈", "백준영", "백지현", "백현수",
        "남동욱", "남지원", "남현우", "남서영", "남도현", "남수빈", "남준영", "남지현",
        "오서진", "오동욱", "오지원", "오현우", "오서영", "오도현", "오수빈", "오준영",
        "신민지", "신태영", "신서진", "신동욱", "신지원", "신현우", "신서영", "신도현",
        "권태영", "권서진", "권동욱", "권지원", "권현우", "권서영", "권도현", "권수빈",
        "황수빈", "황준영", "황지현", "황현수", "황서영", "황도현", "황민지", "황태영",
        "안준영", "안지현", "안현수", "안서영", "안도현", "안민지", "안태영", "안서진",
        "유지현", "유현수", "유서영", "유도현", "유민지", "유태영", "유서진", "유동욱",
        "문현우", "문서영", "문도현", "문민지", "문태영", "문서진", "문동욱", "문지원",
        "양서영", "양도현", "양민지", "양태영", "양서진", "양동욱", "양지원", "양현우",
        "구도현", "구민지", "구태영", "구서진", "구동욱", "구지원", "구현우", "구서영",
        "손민수", "손지영", "손현우", "손서연", "손도현", "손수진", "손준호", "손미영",
        "배지영", "배현우", "배서연", "배도현", "배수진", "배준호", "배미영", "배현수"
    ];
    
    const conditions = [
        "고혈압", "당뇨병", "고지혈증", "천식", "류마티스 관절염", "갑상선 기능 저하증",
        "위염", "대장염", "간염", "신장염", "폐렴", "기관지염", "부비동염", "중이염",
        "감기", "독감", "두통", "복통", "설사", "변비", "피부염", "알레르기",
        "관절통", "요통", "목통", "어깨통", "무릎통", "발목통", "손목통", "팔꿈치통",
        "불면증", "우울증", "불안증", "스트레스", "피로", "어지러움", "메스꺼움", "구토",
        "기침", "가래", "콧물", "재채기", "인후통", "목쉼", "호흡곤란", "흉통",
        "심계항진", "부정맥", "협심증", "심근경색", "뇌졸중", "치매", "파킨슨병", "간질",
        "간경화", "간암", "위암", "대장암", "폐암", "유방암", "자궁암", "전립선암",
        "골다공증", "골절", "탈구", "염좌", "근육통", "근육경련", "신경통", "좌골신경통"
    ];
    
    const medications = [
        // 고혈압 약물
        { name: "Amlodipine", dosage: "5mg", frequency: "1T qd" },
        { name: "Losartan", dosage: "50mg", frequency: "1T qd" },
        { name: "Enalapril", dosage: "10mg", frequency: "1T qd" },
        { name: "Valsartan", dosage: "80mg", frequency: "1T qd" },
        { name: "Hydrochlorothiazide", dosage: "25mg", frequency: "1T qd" },
        
        // 당뇨병 약물
        { name: "Metformin", dosage: "500mg", frequency: "1T bid" },
        { name: "Glimepiride", dosage: "1mg", frequency: "1T qd" },
        { name: "Glibenclamide", dosage: "5mg", frequency: "1T qd" },
        { name: "Pioglitazone", dosage: "15mg", frequency: "1T qd" },
        { name: "Sitagliptin", dosage: "100mg", frequency: "1T qd" },
        
        // 고지혈증 약물
        { name: "Atorvastatin", dosage: "20mg", frequency: "1T qd" },
        { name: "Simvastatin", dosage: "20mg", frequency: "1T qd" },
        { name: "Rosuvastatin", dosage: "10mg", frequency: "1T qd" },
        { name: "Fenofibrate", dosage: "200mg", frequency: "1T qd" },
        
        // 호흡기 약물
        { name: "Salbutamol", dosage: "100mcg", frequency: "2회 흡입 prn" },
        { name: "Budesonide", dosage: "200mcg", frequency: "2회 흡입 bid" },
        { name: "Montelukast", dosage: "10mg", frequency: "1T qd" },
        { name: "Theophylline", dosage: "200mg", frequency: "1T bid" },
        
        // 갑상선 약물
        { name: "Levothyroxine", dosage: "50mcg", frequency: "1T qd" },
        { name: "Methimazole", dosage: "5mg", frequency: "1T qd" },
        
        // 소화기 약물
        { name: "Omeprazole", dosage: "20mg", frequency: "1T qd" },
        { name: "Ranitidine", dosage: "150mg", frequency: "1T bid" },
        { name: "Domperidone", dosage: "10mg", frequency: "1T tid" },
        { name: "Lactulose", dosage: "15ml", frequency: "1T qd" },
        
        // 진통제/소염제
        { name: "Ibuprofen", dosage: "400mg", frequency: "1T tid" },
        { name: "Acetaminophen", dosage: "500mg", frequency: "1T qid" },
        { name: "Naproxen", dosage: "250mg", frequency: "1T bid" },
        { name: "Diclofenac", dosage: "50mg", frequency: "1T bid" },
        
        // 항생제
        { name: "Amoxicillin", dosage: "500mg", frequency: "1T tid" },
        { name: "Ciprofloxacin", dosage: "500mg", frequency: "1T bid" },
        { name: "Azithromycin", dosage: "500mg", frequency: "1T qd" },
        { name: "Cefuroxime", dosage: "250mg", frequency: "1T bid" },
        
        // 정신과 약물
        { name: "Fluoxetine", dosage: "20mg", frequency: "1T qd" },
        { name: "Sertraline", dosage: "50mg", frequency: "1T qd" },
        { name: "Lorazepam", dosage: "0.5mg", frequency: "1T prn" },
        { name: "Alprazolam", dosage: "0.25mg", frequency: "1T bid" },
        
        // 기타
        { name: "Warfarin", dosage: "5mg", frequency: "1T qd" },
        { name: "Aspirin", dosage: "100mg", frequency: "1T qd" },
        { name: "Clopidogrel", dosage: "75mg", frequency: "1T qd" },
        { name: "Digoxin", dosage: "0.25mg", frequency: "1T qd" }
    ];

    for (let i = 6; i <= 100; i++) {
        // 정승우(ID 33)는 이미 수동으로 추가했으므로 건너뛰기
        if (i === 33) continue;
        const name = names[Math.floor(Math.random() * names.length)];
        const birthYear = 1950 + Math.floor(Math.random() * 50);
        const birthMonth = 1 + Math.floor(Math.random() * 12);
        const birthDay = 1 + Math.floor(Math.random() * 28);
        const birthDate = `${birthYear}-${birthMonth.toString().padStart(2, '0')}-${birthDay.toString().padStart(2, '0')}`;
        
        const phone = `010-${Math.floor(Math.random() * 9000) + 1000}-${Math.floor(Math.random() * 9000) + 1000}`;
        const condition = conditions[Math.floor(Math.random() * conditions.length)];
        const medication = medications[Math.floor(Math.random() * medications.length)];
        
        // 최근 방문일 (1-30일 전)
        const lastVisitDays = Math.floor(Math.random() * 30) + 1;
        const lastVisitDate = new Date();
        lastVisitDate.setDate(lastVisitDate.getDate() - lastVisitDays);
        const lastVisitDateStr = lastVisitDate.toISOString().split('T')[0];
        
        // 첫 방문일 (1-6개월 전)
        const firstVisitDays = 30 + Math.floor(Math.random() * 150);
        const firstVisitDate = new Date();
        firstVisitDate.setDate(firstVisitDate.getDate() - firstVisitDays);
        const firstVisitDateStr = firstVisitDate.toISOString().split('T')[0];

        const patient: PatientHistory = {
            patientId: i,
            patientName: name,
            birthDate: birthDate,
            phone: phone,
            visits: [
                {
                    date: lastVisitDateStr,
                    visitType: "재진",
                    diagnosis: `${condition} 관리`,
                    medicalRecord: {
                        symptoms: `${condition} 상태 점검`,
                        diagnosis: condition,
                        treatment: "약물 조정 및 생활 관리"
                    },
                    prescription: {
                        medications: [medication],
                        instructions: "1일 1회 복용"
                    },
                    staffMemo: "환자 상태 안정적. 약물 복용 순응도 양호."
                },
                {
                    date: firstVisitDateStr,
                    visitType: "초진",
                    diagnosis: `${condition} 진단`,
                    medicalRecord: {
                        symptoms: `${condition} 관련 증상`,
                        diagnosis: condition,
                        treatment: "약물 처방 및 생활습관 개선"
                    },
                    prescription: {
                        medications: [medication],
                        instructions: "1일 1회 복용"
                    },
                    staffMemo: `${condition} 진단. 생활습관 개선 교육 실시.`
                }
            ]
        };
        
        additionalPatients.push(patient);
    }
    
    return additionalPatients;
};

// 대량 환자 내역을 기존 데이터에 추가
export const addBulkPatientHistory = () => {
    const bulkPatients = generateBulkPatientHistory();
    patientHistoryData.push(...bulkPatients);
};

// 환자 내역에 새로운 방문 기록 추가
export const addVisitRecord = (
    patientId: number,
    visitRecord: Omit<VisitRecord, 'date'> & { date?: string }
) => {
    const patient = patientHistoryData.find(p => p.patientId === patientId);
    if (!patient) {
        // 새로운 환자인 경우 새로 생성
        const newPatient: PatientHistory = {
            patientId,
            patientName: "", // 이 정보는 나중에 업데이트
            birthDate: "",
            phone: "",
            visits: [{
                ...visitRecord,
                date: visitRecord.date || new Date().toISOString().split('T')[0]
            }]
        };
        patientHistoryData.push(newPatient);
    } else {
        // 기존 환자에게 방문 기록 추가
        patient.visits.unshift({
            ...visitRecord,
            date: visitRecord.date || new Date().toISOString().split('T')[0]
        });
    }
};

// 환자 내역 조회
export const getPatientHistory = (patientId: number): PatientHistory | undefined => {
    return patientHistoryData.find(p => p.patientId === patientId);
};

// 환자 이름으로 내역 조회
export const getPatientHistoryByName = (patientName: string): PatientHistory | undefined => {
    return patientHistoryData.find(p => p.patientName === patientName);
};

// 환자 정보 업데이트
export const updatePatientInfo = (
    patientId: number,
    patientName: string,
    birthDate: string,
    phone: string
) => {
    const patient = patientHistoryData.find(p => p.patientId === patientId);
    if (patient) {
        patient.patientName = patientName;
        patient.birthDate = birthDate;
        patient.phone = phone;
    }
};

// 백엔드 환자 데이터에 대한 기본 방문 기록 생성
export const createDefaultVisitRecord = (patientId: number, patientName: string, symptoms: string) => {
    const existingPatient = patientHistoryData.find(p => p.patientId === patientId);
    if (!existingPatient) {
        const today = new Date().toISOString().split('T')[0];
        patientHistoryData.push({
            patientId,
            patientName,
            birthDate: "1990-01-01", // 기본값
            phone: "",
            visits: [
                {
                    date: today,
                    visitType: "초진",
                    diagnosis: symptoms,
                    medicalRecord: {
                        symptoms: symptoms,
                        diagnosis: "진단 대기",
                        treatment: "진료 예정"
                    },
                    prescription: {
                        medications: [],
                        instructions: "진료 후 처방 예정"
                    },
                    staffMemo: `${symptoms}으로 내원.`
                }
            ]
        });
    }
};

// 대량 환자 내역 자동 생성 (100명)
const bulkPatients = generateBulkPatientHistory();
patientHistoryData.push(...bulkPatients);
