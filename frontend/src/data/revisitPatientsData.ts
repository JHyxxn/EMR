export interface RevisitPatient {
    id: string;
    name: string;
    mrn: string;
    birthDate: string;
    phone: string;
    lastVisitDate: string;
    visitDate: string;
    visitType: string;
    symptoms: string;
    diagnosis: string;
    medications: string;
    doctorId: string;
    vitals?: {
        bloodPressure: string;
        heartRate: string;
        temperature: string;
        weight: string;
        height: string;
        oxygenSaturation: string;
    };
    orders?: {
        id: string;
        type: string;
        content: string;
        status: string;
        date: string;
    }[];
    tests?: {
        id: string;
        name: string;
        result: string;
        status: string;
        date: string;
    }[];
    notes?: {
        id: string;
        type: string;
        content: string;
        author: string;
        date: string;
    }[];
}

// 재진 환자 데이터 생성 함수
export const generateRevisitPatients = (count: number = 1000): RevisitPatient[] => {
    const patients: RevisitPatient[] = [];
    const names = [
        "김철수", "이영희", "박민수", "최지영", "정현우", "강서연", "윤도현", "임수진",
        "한준호", "송미영", "조현수", "백지원", "남동욱", "오서진", "신민지", "권태영",
        "황수빈", "안준영", "유지현", "문현우", "양서영", "구도현", "손민수", "배지영",
        "조현우", "홍서연", "김도현", "이수진", "박준호", "최미영", "정현수", "강지원",
        "윤동욱", "임서진", "한민지", "송태영", "조수빈", "백준영", "남지현", "오현우",
        "신서영", "권도현", "황민수", "안지영", "유현우", "문서연", "양도현", "구수진",
        "손준호", "배미영", "조현수", "홍지원", "김동욱", "이서진", "박민지", "최태영",
        "정수빈", "강준영", "윤지현", "임현우", "한서영", "송도현", "조민수", "백지영",
        "남현우", "오서연", "신도현", "권수진", "황준호", "안미영", "유현수", "문지원",
        "양동욱", "구서진", "손민지", "배태영", "조수빈", "홍준영", "김지현", "이현우",
        "박서영", "최도현", "정민수", "강지영", "윤현우", "임서연", "한도현", "송수진",
        "조준호", "백미영", "남현수", "오지원", "신동욱", "권서진", "황민지", "안태영",
        "유수빈", "문준영", "양지현", "구현우", "손서영", "배도현", "조민수", "홍지영"
    ];

    const conditions = [
        "고혈압", "당뇨병", "고지혈증", "천식", "류마티스 관절염", "갑상선 기능 저하증",
        "위염", "대장염", "간염", "신장염", "폐렴", "기관지염", "부비동염", "중이염",
        "결막염", "각막염", "백내장", "녹내장", "망막 박리", "황반 변성", "당뇨 망막증",
        "고혈압 망막증", "신장증", "신경병증", "자율신경병증", "말초신경병증", "뇌졸중",
        "뇌경색", "뇌출혈", "뇌진탕", "뇌종양", "뇌수막염", "뇌염", "뇌농양", "뇌혈관 기형",
        "뇌동맥류", "뇌정맥 혈전증", "뇌하수체 종양", "시상하부 종양", "소뇌 종양", "뇌간 종양",
        "척수 종양", "척수염", "척수 손상", "척수 혈관 기형", "척수 공동증", "척수 공포증",
        "척수 소아마비", "척수성 근위축증", "척수성 근육 위축증", "척수성 근육 이영양증",
        "척수성 근육 경직증", "척수성 근육 무력증", "척수성 근육 마비증", "척수성 근육 경련증"
    ];

    const doctors = [
        { id: '1', name: '김의사' },
        { id: '2', name: '이의사' },
        { id: '3', name: '박의사' },
        { id: '4', name: '최의사' },
        { id: '5', name: '정의사' }
    ];

    for (let i = 1; i <= count; i++) {
        const name = names[Math.floor(Math.random() * names.length)];
        const birthYear = 1950 + Math.floor(Math.random() * 50);
        const birthMonth = 1 + Math.floor(Math.random() * 12);
        const birthDay = 1 + Math.floor(Math.random() * 28);
        const birthDate = `${birthYear}-${birthMonth.toString().padStart(2, '0')}-${birthDay.toString().padStart(2, '0')}`;
        
        const phone = `010-${Math.floor(Math.random() * 9000) + 1000}-${Math.floor(Math.random() * 9000) + 1000}`;
        const condition = conditions[Math.floor(Math.random() * conditions.length)];
        const doctor = doctors[Math.floor(Math.random() * doctors.length)];

        // 최근 방문일 (1-30일 전)
        const lastVisitDays = Math.floor(Math.random() * 30) + 1;
        const lastVisitDate = new Date();
        lastVisitDate.setDate(lastVisitDate.getDate() - lastVisitDays);
        const lastVisitDateStr = lastVisitDate.toISOString().split('T')[0];

        // 방문일 (오늘 또는 내일)
        const visitDays = Math.floor(Math.random() * 2);
        const visitDate = new Date();
        visitDate.setDate(visitDate.getDate() + visitDays);
        const visitDateStr = visitDate.toISOString().split('T')[0];

        const patient: RevisitPatient = {
            id: `R${i.toString().padStart(4, '0')}`,
            name,
            mrn: `MRN${i.toString().padStart(6, '0')}`,
            birthDate,
            phone,
            lastVisitDate: lastVisitDateStr,
            visitDate: visitDateStr,
            visitType: '재진',
            symptoms: `${condition} 관리`,
            diagnosis: condition,
            medications: `${condition} 치료제`,
            doctorId: doctor.id,
            vitals: {
                bloodPressure: `${120 + Math.floor(Math.random() * 40)}/${80 + Math.floor(Math.random() * 20)} mmHg`,
                heartRate: `${60 + Math.floor(Math.random() * 40)} bpm`,
                temperature: `${36.0 + Math.random() * 1.5}°C`,
                weight: `${50 + Math.floor(Math.random() * 50)}kg`,
                height: `${150 + Math.floor(Math.random() * 50)}cm`,
                oxygenSaturation: `${95 + Math.floor(Math.random() * 5)}%`
            },
            orders: [
                {
                    id: `1`,
                    type: '처방',
                    content: `${condition} 치료제`,
                    status: '완료',
                    date: lastVisitDateStr
                }
            ],
            tests: [
                {
                    id: `1`,
                    name: '혈액검사',
                    result: '정상',
                    status: '완료',
                    date: lastVisitDateStr
                }
            ],
            notes: [
                {
                    id: `1`,
                    type: '진료노트',
                    content: `${condition} 상태 안정적. 약물 복용 순응도 양호.`,
                    author: doctor.name,
                    date: lastVisitDateStr
                }
            ]
        };

        patients.push(patient);
    }

    return patients;
};

// 기본 재진 환자 데이터 (1000명)
export const revisitPatientsData = generateRevisitPatients(1000);
