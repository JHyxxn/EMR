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
                visitType: "초진",
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
        patientName: "이미영",
        birthDate: "1990-07-22",
        phone: "010-2345-6789",
        visits: [
            {
                date: "2025-01-20",
                visitType: "재진",
                diagnosis: "고혈압 관리",
                medicalRecord: {
                    symptoms: "고혈압 상태 점검",
                    diagnosis: "고혈압",
                    treatment: "약물 조정 및 생활습관 관리"
                },
                prescription: {
                    medications: [
                        {
                            name: "Losartan",
                            dosage: "50mg",
                            frequency: "1T qd"
                        }
                    ],
                    instructions: "1일 1회 아침 식전"
                },
                staffMemo: "혈압 조절 양호. 약물 복용 순응도 좋음."
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
        patientName: "박준호",
        birthDate: "1978-11-08",
        phone: "010-3456-7890",
        visits: [
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
        "김철수", "이영희", "박민수", "최지영", "정현우", "강서연", "윤도현", "임수진",
        "한준호", "송미영", "조현수", "백지원", "남동욱", "오서진", "신민지", "권태영",
        "황수빈", "안준영", "유지현", "문현우", "양서영", "구도현", "손민수", "배지영"
    ];
    
    const conditions = [
        "고혈압", "당뇨병", "고지혈증", "천식", "류마티스 관절염", "갑상선 기능 저하증",
        "위염", "대장염", "간염", "신장염", "폐렴", "기관지염", "부비동염", "중이염"
    ];
    
    const medications = [
        { name: "Amlodipine", dosage: "5mg", frequency: "1T qd" },
        { name: "Metformin", dosage: "500mg", frequency: "1T bid" },
        { name: "Atorvastatin", dosage: "20mg", frequency: "1T qd" },
        { name: "Salbutamol", dosage: "100mcg", frequency: "2회 흡입 prn" },
        { name: "Levothyroxine", dosage: "50mcg", frequency: "1T qd" },
        { name: "Omeprazole", dosage: "20mg", frequency: "1T qd" },
        { name: "Losartan", dosage: "50mg", frequency: "1T qd" },
        { name: "Glimepiride", dosage: "1mg", frequency: "1T qd" }
    ];

    for (let i = 6; i <= 50; i++) {
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
