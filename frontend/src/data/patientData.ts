export interface Doctor {
    id: string;
    name: string;
    phone: string;
}

export interface PatientRecord {
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
    doctorId: string; // 담당 의사 ID
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

export const doctors: Doctor[] = [
    {
        id: '1',
        name: '김의사',
        phone: '010-1111-1111'
    },
    {
        id: '2',
        name: '이의사',
        phone: '010-2222-2222'
    },
    {
        id: '3',
        name: '박의사',
        phone: '010-3333-3333'
    }
];

export const patientRecords: PatientRecord[] = [
    {
        id: '1',
        name: '김철수',
        mrn: 'MRN001',
        birthDate: '1985-03-15',
        phone: '010-1234-5678',
        lastVisitDate: '2025-01-15',
        visitDate: '2025-01-20',
        visitType: '재진',
        symptoms: '당뇨 관리, 고혈압',
        diagnosis: '당뇨병, 고혈압',
        medications: 'Metformin 500mg 1T bid, Amlodipine 5mg 1T qd',
        doctorId: '1',
        vitals: {
            bloodPressure: '140/90 mmHg',
            heartRate: '72 bpm',
            temperature: '36.5°C',
            weight: '75kg',
            height: '170cm',
            oxygenSaturation: '98%'
        },
        orders: [
            { id: '1', type: '처방', content: 'Metformin 500mg 1T bid', status: '완료', date: '2025-01-20' },
            { id: '2', type: '검사', content: 'HbA1c, 혈당 검사', status: '대기', date: '2025-01-20' },
            { id: '3', type: '처방', content: 'Amlodipine 5mg 1T qd', status: '완료', date: '2025-01-20' }
        ],
        tests: [
            { id: '1', name: 'HbA1c', result: '7.2%', status: '완료', date: '2025-01-20' },
            { id: '2', name: '공복혈당', result: '135 mg/dL', status: '완료', date: '2025-01-20' },
            { id: '3', name: '혈압 측정', result: '140/90 mmHg', status: '완료', date: '2025-01-20' }
        ],
        notes: [
            { id: '1', type: '진료노트', content: '혈당 조절 양호. 약물 복용 순응도 좋음. 다음 방문 시 HbA1c 재검사 예정.', author: '김의사', date: '2025-01-20' },
            { id: '2', type: '간호노트', content: '혈압 측정 시 안정적. 다이어트 교육 실시.', author: '박간호사', date: '2025-01-20' }
        ]
    },
    {
        id: '2',
        name: '이지현',
        mrn: 'MRN002',
        birthDate: '1990-07-22',
        phone: '010-2345-6789',
        lastVisitDate: '2025-01-10',
        visitDate: '2025-01-18',
        visitType: '초진',
        symptoms: '감기 증상',
        diagnosis: '상기도 감염',
        medications: 'Acetaminophen 500mg 1T tid',
        doctorId: '1',
        vitals: {
            bloodPressure: '120/80 mmHg',
            heartRate: '68 bpm',
            temperature: '37.2°C',
            weight: '55kg',
            height: '160cm',
            oxygenSaturation: '99%'
        },
        orders: [
            { id: '1', type: '처방', content: 'Acetaminophen 500mg 1T tid', status: '완료', date: '2025-01-18' }
        ],
        tests: [
            { id: '1', name: '체온 측정', result: '37.2°C', status: '완료', date: '2025-01-18' }
        ],
        notes: [
            { id: '1', type: '진료노트', content: '상기도 감염 진단. 해열제 처방. 충분한 휴식 권고.', author: '이의사', date: '2025-01-18' }
        ]
    },
    {
        id: '3',
        name: '박민수',
        mrn: 'MRN003',
        birthDate: '1978-11-08',
        phone: '010-3456-7890',
        lastVisitDate: '2025-01-08',
        visitDate: '2025-01-15',
        visitType: '재진',
        symptoms: '복통',
        diagnosis: '위염',
        medications: 'Pantoprazole 40mg 1T qd',
        doctorId: '2',
        vitals: {
            bloodPressure: '130/85 mmHg',
            heartRate: '75 bpm',
            temperature: '36.8°C',
            weight: '70kg',
            height: '175cm',
            oxygenSaturation: '97%'
        },
        orders: [
            { id: '1', type: '처방', content: 'Pantoprazole 40mg 1T qd', status: '완료', date: '2025-01-15' },
            { id: '2', type: '검사', content: '위내시경 검사', status: '예약', date: '2025-01-22' }
        ],
        tests: [
            { id: '1', name: '복부 초음파', result: '정상', status: '완료', date: '2025-01-15' }
        ],
        notes: [
            { id: '1', type: '진료노트', content: '위염 증상 호전. 위내시경 검사 예약.', author: '박의사', date: '2025-01-15' }
        ]
    },
    {
        id: '4',
        name: '최영희',
        mrn: 'MRN004',
        birthDate: '1992-05-12',
        phone: '010-4567-8901',
        lastVisitDate: '2025-01-12',
        visitDate: '2025-01-19',
        visitType: '재진',
        symptoms: '두통, 어지럼증',
        diagnosis: '편두통',
        medications: 'Sumatriptan 50mg 1T prn',
        doctorId: '1',
        vitals: {
            bloodPressure: '110/70 mmHg',
            heartRate: '65 bpm',
            temperature: '36.6°C',
            weight: '52kg',
            height: '165cm',
            oxygenSaturation: '99%'
        },
        orders: [
            { id: '1', type: '처방', content: 'Sumatriptan 50mg 1T prn', status: '완료', date: '2025-01-19' }
        ],
        tests: [
            { id: '1', name: '뇌 CT', result: '정상', status: '완료', date: '2025-01-19' }
        ],
        notes: [
            { id: '1', type: '진료노트', content: '편두통 진단. 트립탄 계열 약물 처방.', author: '최의사', date: '2025-01-19' }
        ]
    },
    {
        id: '5',
        name: '김철수', // 동명이인 예시 (생년월일도 동일)
        mrn: 'MRN005',
        birthDate: '1985-03-15', // 같은 생년월일
        phone: '010-1234-9999', // 다른 전화번호 (뒷자리만 다름)
        lastVisitDate: '2025-01-14',
        visitDate: '2025-01-21',
        visitType: '재진',
        symptoms: '알레르기 비염',
        diagnosis: '알레르기성 비염',
        medications: 'Cetirizine 10mg 1T qd',
        doctorId: '2',
        vitals: {
            bloodPressure: '115/75 mmHg',
            heartRate: '70 bpm',
            temperature: '36.7°C',
            weight: '68kg',
            height: '175cm',
            oxygenSaturation: '98%'
        },
        orders: [
            { id: '1', type: '처방', content: 'Cetirizine 10mg 1T qd', status: '완료', date: '2025-01-21' }
        ],
        tests: [
            { id: '1', name: '알레르기 검사', result: '꽃가루 알레르기 양성', status: '완료', date: '2025-01-21' }
        ],
        notes: [
            { id: '1', type: '진료노트', content: '알레르기성 비염 진단. 항히스타민제 처방. 알레르기 검사 결과 확인.', author: '이의사', date: '2025-01-21' }
        ]
    },
    {
        id: '5',
        name: '정수진',
        mrn: 'MRN005',
        birthDate: '1988-09-30',
        phone: '010-5678-9012',
        lastVisitDate: '2025-01-05',
        visitDate: '2025-01-16',
        visitType: '재진',
        symptoms: '관절통',
        diagnosis: '류마티스 관절염',
        medications: 'Methotrexate 10mg 1T weekly',
        doctorId: '2',
        vitals: {
            bloodPressure: '125/80 mmHg',
            heartRate: '70 bpm',
            temperature: '36.7°C',
            weight: '60kg',
            height: '168cm',
            oxygenSaturation: '98%'
        },
        orders: [
            { id: '1', type: '처방', content: 'Methotrexate 10mg 1T weekly', status: '완료', date: '2025-01-16' },
            { id: '2', type: '검사', content: '류마티스 인자 검사', status: '완료', date: '2025-01-16' }
        ],
        tests: [
            { id: '1', name: '류마티스 인자', result: '양성', status: '완료', date: '2025-01-16' },
            { id: '2', name: 'ESR', result: '45 mm/hr', status: '완료', date: '2025-01-16' }
        ],
        notes: [
            { id: '1', type: '진료노트', content: '류마티스 관절염 진단. 면역억제제 치료 시작.', author: '정의사', date: '2025-01-16' }
        ]
    },
    {
        id: '6',
        name: '김철수',
        mrn: 'MRN006',
        birthDate: '1983-12-03',
        phone: '010-6789-0123',
        lastVisitDate: '2025-01-03',
        visitDate: '2025-01-17',
        visitType: '재진',
        symptoms: '천식 증상',
        diagnosis: '천식',
        medications: 'Salbutamol inhaler 2puffs qid',
        doctorId: '1',
        vitals: {
            bloodPressure: '135/85 mmHg',
            heartRate: '78 bpm',
            temperature: '36.9°C',
            weight: '68kg',
            height: '172cm',
            oxygenSaturation: '95%'
        },
        orders: [
            { id: '1', type: '처방', content: 'Salbutamol inhaler 2puffs qid', status: '완료', date: '2025-01-17' },
            { id: '2', type: '검사', content: '폐기능 검사', status: '완료', date: '2025-01-17' }
        ],
        tests: [
            { id: '1', name: '폐기능 검사', result: 'FEV1 75%', status: '완료', date: '2025-01-17' }
        ],
        notes: [
            { id: '1', type: '진료노트', content: '천식 증상 조절 양호. 흡입기 사용법 재교육.', author: '김의사', date: '2025-01-17' }
        ]
    },
    {
        id: '7',
        name: '김철수',
        mrn: 'MRN007',
        birthDate: '1995-01-25',
        phone: '010-7890-1234',
        lastVisitDate: '2025-01-01',
        visitDate: '2025-01-14',
        visitType: '재진',
        symptoms: '피부 발진',
        diagnosis: '아토피 피부염',
        medications: 'Betamethasone cream 0.1% bid',
        doctorId: '2',
        vitals: {
            bloodPressure: '115/75 mmHg',
            heartRate: '72 bpm',
            temperature: '36.5°C',
            weight: '58kg',
            height: '163cm',
            oxygenSaturation: '99%'
        },
        orders: [
            { id: '1', type: '처방', content: 'Betamethasone cream 0.1% bid', status: '완료', date: '2025-01-14' }
        ],
        tests: [
            { id: '1', name: '알레르기 검사', result: '음성', status: '완료', date: '2025-01-14' }
        ],
        notes: [
            { id: '1', type: '진료노트', content: '아토피 피부염 진단. 스테로이드 연고 처방.', author: '김의사', date: '2025-01-14' }
        ]
    },
    {
        id: '8',
        name: '김철수',
        mrn: 'MRN008',
        birthDate: '1975-06-18',
        phone: '010-8901-2345',
        lastVisitDate: '2024-12-28',
        visitDate: '2025-01-13',
        visitType: '재진',
        symptoms: '불면증',
        diagnosis: '수면장애',
        medications: 'Zolpidem 10mg 1T hs',
        doctorId: '1',
        vitals: {
            bloodPressure: '140/90 mmHg',
            heartRate: '80 bpm',
            temperature: '36.8°C',
            weight: '75kg',
            height: '178cm',
            oxygenSaturation: '97%'
        },
        orders: [
            { id: '1', type: '처방', content: 'Zolpidem 10mg 1T hs', status: '완료', date: '2025-01-13' }
        ],
        tests: [
            { id: '1', name: '수면다원검사', result: '정상', status: '완료', date: '2025-01-13' }
        ],
        notes: [
            { id: '1', type: '진료노트', content: '수면장애 진단. 수면제 처방 및 수면위생 교육.', author: '김의사', date: '2025-01-13' }
        ]
    },
    {
        id: '9',
        name: '이영희',
        mrn: 'MRN009',
        birthDate: '1987-04-07',
        phone: '010-9012-3456',
        lastVisitDate: '2024-12-25',
        visitDate: '2025-01-11',
        visitType: '재진',
        symptoms: '소화불량',
        diagnosis: '기능성 소화불량',
        medications: 'Domperidone 10mg 1T tid',
        doctorId: '2',
        vitals: {
            bloodPressure: '125/80 mmHg',
            heartRate: '70 bpm',
            temperature: '36.6°C',
            weight: '55kg',
            height: '162cm',
            oxygenSaturation: '98%'
        },
        orders: [
            { id: '1', type: '처방', content: 'Domperidone 10mg 1T tid', status: '완료', date: '2025-01-11' }
        ],
        tests: [
            { id: '1', name: '위내시경', result: '정상', status: '완료', date: '2025-01-11' }
        ],
        notes: [
            { id: '1', type: '진료노트', content: '기능성 소화불량 진단. 위장관 운동 촉진제 처방.', author: '이의사', date: '2025-01-11' }
        ]
    },
    {
        id: '10',
        name: '이영희',
        mrn: 'MRN010',
        birthDate: '1993-08-14',
        phone: '010-0123-4567',
        lastVisitDate: '2024-12-20',
        visitDate: '2025-01-09',
        visitType: '재진',
        symptoms: '요통',
        diagnosis: '요추간판탈출증',
        medications: 'Ibuprofen 400mg 1T tid',
        doctorId: '2',
        vitals: {
            bloodPressure: '120/75 mmHg',
            heartRate: '68 bpm',
            temperature: '36.7°C',
            weight: '52kg',
            height: '160cm',
            oxygenSaturation: '99%'
        },
        orders: [
            { id: '1', type: '처방', content: 'Ibuprofen 400mg 1T tid', status: '완료', date: '2025-01-09' },
            { id: '2', type: '검사', content: '요추 MRI', status: '완료', date: '2025-01-09' }
        ],
        tests: [
            { id: '1', name: '요추 MRI', result: 'L4-L5 탈출증', status: '완료', date: '2025-01-09' }
        ],
        notes: [
            { id: '1', type: '진료노트', content: '요추간판탈출증 진단. 소염진통제 처방 및 물리치료 권고.', author: '이의사', date: '2025-01-09' }
        ]
    },
    {
        id: '11',
        name: '박지민',
        mrn: 'MRN011',
        birthDate: '1980-02-29',
        phone: '010-1234-5679',
        lastVisitDate: '2024-12-18',
        visitDate: '2025-01-07',
        visitType: '재진',
        symptoms: '고혈압 관리',
        diagnosis: '본태성 고혈압',
        medications: 'Losartan 50mg 1T qd',
        doctorId: '1',
        vitals: {
            bloodPressure: '150/95 mmHg',
            heartRate: '75 bpm',
            temperature: '36.8°C',
            weight: '80kg',
            height: '175cm',
            oxygenSaturation: '96%'
        },
        orders: [
            { id: '1', type: '처방', content: 'Losartan 50mg 1T qd', status: '완료', date: '2025-01-07' }
        ],
        tests: [
            { id: '1', name: '혈압 측정', result: '150/95 mmHg', status: '완료', date: '2025-01-07' }
        ],
        notes: [
            { id: '1', type: '진료노트', content: '고혈압 조절 필요. 약물 복용 순응도 확인.', author: '박의사', date: '2025-01-07' }
        ]
    },
    {
        id: '12',
        name: '최민수',
        mrn: 'MRN012',
        birthDate: '1986-10-11',
        phone: '010-2345-6780',
        lastVisitDate: '2024-12-15',
        visitDate: '2025-01-06',
        visitType: '재진',
        symptoms: '당뇨 관리',
        diagnosis: '2형 당뇨병',
        medications: 'Glimepiride 2mg 1T qd',
        doctorId: '1',
        vitals: {
            bloodPressure: '140/88 mmHg',
            heartRate: '72 bpm',
            temperature: '36.6°C',
            weight: '78kg',
            height: '173cm',
            oxygenSaturation: '97%'
        },
        orders: [
            { id: '1', type: '처방', content: 'Glimepiride 2mg 1T qd', status: '완료', date: '2025-01-06' },
            { id: '2', type: '검사', content: 'HbA1c, 혈당 검사', status: '완료', date: '2025-01-06' }
        ],
        tests: [
            { id: '1', name: 'HbA1c', result: '6.8%', status: '완료', date: '2025-01-06' },
            { id: '2', name: '공복혈당', result: '120 mg/dL', status: '완료', date: '2025-01-06' }
        ],
        notes: [
            { id: '1', type: '진료노트', content: '당뇨 조절 양호. HbA1c 목표치 달성.', author: '최의사', date: '2025-01-06' }
        ]
    },
    {
        id: '13',
        name: '정수진',
        mrn: 'MRN013',
        birthDate: '1991-12-25',
        phone: '010-3456-7891',
        lastVisitDate: '2024-12-12',
        visitDate: '2025-01-04',
        visitType: '재진',
        symptoms: '갑상선 기능 항진증',
        diagnosis: '그레이브스병',
        medications: 'Methimazole 10mg 1T bid',
        doctorId: '1',
        vitals: {
            bloodPressure: '130/80 mmHg',
            heartRate: '85 bpm',
            temperature: '37.1°C',
            weight: '48kg',
            height: '158cm',
            oxygenSaturation: '98%'
        },
        orders: [
            { id: '1', type: '처방', content: 'Methimazole 10mg 1T bid', status: '완료', date: '2025-01-04' },
            { id: '2', type: '검사', content: '갑상선 기능 검사', status: '완료', date: '2025-01-04' }
        ],
        tests: [
            { id: '1', name: 'TSH', result: '0.1 mIU/L', status: '완료', date: '2025-01-04' },
            { id: '2', name: 'Free T4', result: '2.8 ng/dL', status: '완료', date: '2025-01-04' }
        ],
        notes: [
            { id: '1', type: '진료노트', content: '갑상선 기능 항진증 진단. 항갑상선제 치료 시작.', author: '정의사', date: '2025-01-04' }
        ]
    }
];
