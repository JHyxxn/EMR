export interface WaitingPatient {
    id: number;
    time: string;
    name: string;
    birthDate: string;
    phone: string;
    condition: string;
    visitType: string;
    alert: string | null;
    alertType: string | null;
    buttonText: string;
    visitOrigin: 'reservation' | 'walkin';
    
    // 간호사 정보 (선택적)
    nurseInfo?: {
        symptoms: string;
        bloodPressure?: {
            systolic: number;
            diastolic: number;
            measuredAt: string;
        };
        notes: string;
        registeredBy: string;
        registeredAt: string;
    };
    
    // 처방 검사 정보 (선택적)
    prescriptionTests?: Array<{
        testName: string;
        urgency: 'routine' | 'urgent';
        result?: string;
    }>;
}

// 금일 대기 환자 20명 데이터 (동명이인, 예약/방문 환자 포함)
export const waitingPatientsData: WaitingPatient[] = [
    // 09:00 - 09:30
    {
        id: 1,
        time: "09:00",
        name: "김지현",
        birthDate: "1998-02-21",
        phone: "010-1234-5678",
        condition: "몸살 기운",
        visitType: "재진",
        alert: null,
        alertType: null,
        buttonText: "진료 시작",
        visitOrigin: "reservation"
    },
    {
        id: 2,
        time: "09:00",
        name: "오수민",
        birthDate: "2002-05-21",
        phone: "010-2345-6789",
        condition: "피부 발진",
        visitType: "재진",
        alert: null,
        alertType: null,
        buttonText: "진료 시작",
        visitOrigin: "walkin"
    },
    {
        id: 3,
        time: "09:30",
        name: "조형석",
        birthDate: "2002-11-08",
        phone: "010-3456-7890",
        condition: "복통",
        visitType: "초진",
        alert: null,
        alertType: null,
        buttonText: "진료 시작",
        visitOrigin: "reservation"
    },
    {
        id: 4,
        time: "09:30",
        name: "조형석",
        birthDate: "2004-05-12",
        phone: "010-4567-8901",
        condition: "두통",
        visitType: "재진",
        alert: null,
        alertType: null,
        buttonText: "진료 시작",
        visitOrigin: "walkin"
    },

    // 10:00 - 10:30
    {
        id: 5,
        time: "10:00",
        name: "홍길동",
        birthDate: "1980-02-29",
        phone: "010-5678-9012",
        condition: "고혈압",
        visitType: "초진",
        alert: null,
        alertType: null,
        buttonText: "진료 시작",
        visitOrigin: "walkin"
    },
    {
        id: 6,
        time: "10:00",
        name: "정민수",
        birthDate: "1987-09-14",
        phone: "010-6789-0123",
        condition: "감기 증상",
        visitType: "재진",
        alert: null,
        alertType: null,
        buttonText: "진료 시작",
        visitOrigin: "reservation"
    },
    {
        id: 7,
        time: "10:30",
        name: "김수진",
        birthDate: "1995-12-03",
        phone: "010-7890-1234",
        condition: "알레르기 비염",
        visitType: "초진",
        alert: null,
        alertType: null,
        buttonText: "진료 시작",
        visitOrigin: "walkin"
    },
    {
        id: 8,
        time: "10:30",
        name: "김지현",
        birthDate: "1995-08-15",
        phone: "010-7890-1235",
        condition: "어지러움",
        visitType: "재진",
        alert: null,
        alertType: null,
        buttonText: "진료 시작",
        visitOrigin: "reservation"
    },
    {
        id: 9,
        time: "10:30",
        name: "이철수",
        birthDate: "1983-06-18",
        phone: "010-8901-2345",
        condition: "위염",
        visitType: "재진",
        alert: "고혈압 경고",
        alertType: "주의",
        buttonText: "진료 시작",
        visitOrigin: "reservation"
    },

    // 11:00 - 11:30
    {
        id: 10,
        time: "11:00",
        name: "김지현",
        birthDate: "2000-03-10",
        phone: "010-8901-2346",
        condition: "복통",
        visitType: "초진",
        alert: null,
        alertType: null,
        buttonText: "진료 시작",
        visitOrigin: "walkin"
    },
    {
        id: 11,
        time: "11:00",
        name: "박영희",
        birthDate: "1989-04-25",
        phone: "010-9012-3456",
        condition: "피로감",
        visitType: "재진",
        alert: null,
        alertType: null,
        buttonText: "진료 시작",
        visitOrigin: "reservation"
    },
    {
        id: 12,
        time: "11:00",
        name: "최동현",
        birthDate: "1991-08-07",
        phone: "010-0123-4567",
        condition: "관절통",
        visitType: "초진",
        alert: null,
        alertType: null,
        buttonText: "진료 시작",
        visitOrigin: "walkin"
    },
    {
        id: 13,
        time: "11:30",
        name: "김민지",
        birthDate: "1993-01-30",
        phone: "010-1234-5679",
        condition: "불면증",
        visitType: "재진",
        alert: null,
        alertType: null,
        buttonText: "진료 시작",
        visitOrigin: "reservation"
    },
    {
        id: 14,
        time: "11:30",
        name: "이준영",
        birthDate: "1986-10-12",
        phone: "010-2345-6780",
        condition: "소화불량",
        visitType: "재진",
        alert: null,
        alertType: null,
        buttonText: "진료 시작",
        visitOrigin: "walkin"
    },

    // 12:00 - 12:30
    {
        id: 15,
        time: "12:00",
        name: "정수영",
        birthDate: "1984-07-05",
        phone: "010-3456-7891",
        condition: "어지럼증",
        visitType: "초진",
        alert: null,
        alertType: null,
        buttonText: "진료 시작",
        visitOrigin: "reservation"
    },
    {
        id: 16,
        time: "12:00",
        name: "박현우",
        birthDate: "1994-03-20",
        phone: "010-4567-8902",
        condition: "코막힘",
        visitType: "재진",
        alert: null,
        alertType: null,
        buttonText: "진료 시작",
        visitOrigin: "walkin"
    },
    {
        id: 17,
        time: "12:30",
        name: "최서연",
        birthDate: "1988-11-28",
        phone: "010-5678-9013",
        condition: "요통",
        visitType: "재진",
        alert: null,
        alertType: null,
        buttonText: "진료 시작",
        visitOrigin: "reservation"
    },
    {
        id: 18,
        time: "12:30",
        name: "김태현",
        birthDate: "1996-05-15",
        phone: "010-6789-0124",
        condition: "발열",
        visitType: "초진",
        alert: null,
        alertType: null,
        buttonText: "진료 시작",
        visitOrigin: "walkin"
    },

    // 13:00 - 13:30
    {
        id: 19,
        time: "13:00",
        name: "이하나",
        birthDate: "1982-09-08",
        phone: "010-7890-1235",
        condition: "가슴 통증",
        visitType: "재진",
        alert: null,
        alertType: null,
        buttonText: "진료 시작",
        visitOrigin: "reservation"
    },
    {
        id: 20,
        time: "13:00",
        name: "정우진",
        birthDate: "1990-12-22",
        phone: "010-8901-2346",
        condition: "기침",
        visitType: "재진",
        alert: null,
        alertType: null,
        buttonText: "진료 시작",
        visitOrigin: "walkin"
    },
    {
        id: 21,
        time: "13:30",
        name: "박소영",
        birthDate: "1987-02-14",
        phone: "010-9012-3457",
        condition: "피부 발진",
        visitType: "초진",
        alert: null,
        alertType: null,
        buttonText: "진료 시작",
        visitOrigin: "reservation"
    },
    {
        id: 22,
        time: "13:30",
        name: "최민호",
        birthDate: "1993-06-30",
        phone: "010-0123-4568",
        condition: "목 아픔",
        visitType: "재진",
        alert: null,
        alertType: null,
        buttonText: "진료 시작",
        visitOrigin: "walkin"
    }
];
