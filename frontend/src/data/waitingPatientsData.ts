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
}

// 금일 대기 환자 50명 데이터
export const waitingPatientsData: WaitingPatient[] = [
    // 09:00 - 09:30
    {
        id: 1,
        time: "09:00",
        name: "김영수",
        birthDate: "1985-03-15",
        phone: "010-1234-5678",
        condition: "고혈압",
        visitType: "재진",
        alert: null,
        alertType: null,
        buttonText: "진료 시작",
        visitOrigin: "reservation"
    },
    {
        id: 2,
        time: "09:00",
        name: "이미영",
        birthDate: "1990-07-22",
        phone: "010-2345-6789",
        condition: "당뇨 관리",
        visitType: "재진",
        alert: null,
        alertType: null,
        buttonText: "진료 시작",
        visitOrigin: "walkin"
    },
    {
        id: 3,
        time: "09:30",
        name: "박준호",
        birthDate: "1978-11-08",
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
        name: "최지영",
        birthDate: "1992-05-12",
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
        id: 9,
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
        id: 10,
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
        id: 11,
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
        id: 12,
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
        id: 13,
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
        id: 14,
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
        id: 15,
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
        id: 16,
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
        id: 17,
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
        id: 18,
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
        id: 19,
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
        id: 20,
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
    },

    // 14:00 - 14:30
    {
        id: 21,
        time: "14:00",
        name: "김지원",
        birthDate: "1985-08-17",
        phone: "010-1234-5670",
        condition: "복부 팽만감",
        visitType: "재진",
        alert: null,
        alertType: null,
        buttonText: "진료 시작",
        visitOrigin: "reservation"
    },
    {
        id: 22,
        time: "14:00",
        name: "이수빈",
        birthDate: "1991-04-03",
        phone: "010-2345-6781",
        condition: "손목 통증",
        visitType: "초진",
        alert: null,
        alertType: null,
        buttonText: "진료 시작",
        visitOrigin: "walkin"
    },
    {
        id: 23,
        time: "14:30",
        name: "정현수",
        birthDate: "1989-10-25",
        phone: "010-3456-7892",
        condition: "눈 피로",
        visitType: "재진",
        alert: null,
        alertType: null,
        buttonText: "진료 시작",
        visitOrigin: "reservation"
    },
    {
        id: 24,
        time: "14:30",
        name: "박지민",
        birthDate: "1995-01-11",
        phone: "010-4567-8903",
        condition: "무릎 통증",
        visitType: "재진",
        alert: null,
        alertType: null,
        buttonText: "진료 시작",
        visitOrigin: "walkin"
    },

    // 15:00 - 15:30
    {
        id: 25,
        time: "15:00",
        name: "최준호",
        birthDate: "1983-12-05",
        phone: "010-5678-9014",
        condition: "소변 빈도 증가",
        visitType: "초진",
        alert: null,
        alertType: null,
        buttonText: "진료 시작",
        visitOrigin: "reservation"
    },
    {
        id: 26,
        time: "15:00",
        name: "김서연",
        birthDate: "1992-07-19",
        phone: "010-6789-0125",
        condition: "어깨 통증",
        visitType: "재진",
        alert: null,
        alertType: null,
        buttonText: "진료 시작",
        visitOrigin: "walkin"
    },
    {
        id: 27,
        time: "15:30",
        name: "이동욱",
        birthDate: "1988-03-27",
        phone: "010-7890-1236",
        condition: "입맛 부족",
        visitType: "재진",
        alert: null,
        alertType: null,
        buttonText: "진료 시작",
        visitOrigin: "reservation"
    },
    {
        id: 28,
        time: "15:30",
        name: "정민지",
        birthDate: "1994-09-14",
        phone: "010-8901-2347",
        condition: "발목 부종",
        visitType: "초진",
        alert: null,
        alertType: null,
        buttonText: "진료 시작",
        visitOrigin: "walkin"
    },

    // 16:00 - 16:30
    {
        id: 29,
        time: "16:00",
        name: "박현준",
        birthDate: "1986-05-08",
        phone: "010-9012-3458",
        condition: "가슴 답답함",
        visitType: "재진",
        alert: null,
        alertType: null,
        buttonText: "진료 시작",
        visitOrigin: "reservation"
    },
    {
        id: 30,
        time: "16:00",
        name: "최지우",
        birthDate: "1990-11-30",
        phone: "010-0123-4569",
        condition: "허리 통증",
        visitType: "재진",
        alert: null,
        alertType: null,
        buttonText: "진료 시작",
        visitOrigin: "walkin"
    },
    {
        id: 31,
        time: "16:30",
        name: "김도현",
        birthDate: "1984-01-23",
        phone: "010-1234-5671",
        condition: "손 떨림",
        visitType: "초진",
        alert: null,
        alertType: null,
        buttonText: "진료 시작",
        visitOrigin: "reservation"
    },
    {
        id: 32,
        time: "16:30",
        name: "이예진",
        birthDate: "1996-08-06",
        phone: "010-2345-6782",
        condition: "다리 저림",
        visitType: "재진",
        alert: null,
        alertType: null,
        buttonText: "진료 시작",
        visitOrigin: "walkin"
    },

    // 17:00 - 17:30
    {
        id: 33,
        time: "17:00",
        name: "정승우",
        birthDate: "1987-06-12",
        phone: "010-3456-7893",
        condition: "소화불량",
        visitType: "재진",
        alert: null,
        alertType: null,
        buttonText: "진료 시작",
        visitOrigin: "reservation"
    },
    {
        id: 34,
        time: "17:00",
        name: "박수진",
        birthDate: "1993-02-28",
        phone: "010-4567-8904",
        condition: "코피",
        visitType: "초진",
        alert: null,
        alertType: null,
        buttonText: "진료 시작",
        visitOrigin: "walkin"
    },
    {
        id: 35,
        time: "17:30",
        name: "최영수",
        birthDate: "1989-12-16",
        phone: "010-5678-9015",
        condition: "관절 강직",
        visitType: "재진",
        alert: null,
        alertType: null,
        buttonText: "진료 시작",
        visitOrigin: "reservation"
    },
    {
        id: 36,
        time: "17:30",
        name: "김민석",
        birthDate: "1991-04-09",
        phone: "010-6789-0126",
        condition: "눈 충혈",
        visitType: "재진",
        alert: null,
        alertType: null,
        buttonText: "진료 시작",
        visitOrigin: "walkin"
    },

    // 18:00 - 18:30
    {
        id: 37,
        time: "18:00",
        name: "이지현",
        birthDate: "1985-10-21",
        phone: "010-7890-1237",
        condition: "복부 통증",
        visitType: "초진",
        alert: null,
        alertType: null,
        buttonText: "진료 시작",
        visitOrigin: "reservation"
    },
    {
        id: 38,
        time: "18:00",
        name: "정태영",
        birthDate: "1994-07-02",
        phone: "010-8901-2348",
        condition: "어깨 결림",
        visitType: "재진",
        alert: null,
        alertType: null,
        buttonText: "진료 시작",
        visitOrigin: "walkin"
    },
    {
        id: 39,
        time: "18:30",
        name: "박서영",
        birthDate: "1988-03-15",
        phone: "010-9012-3459",
        condition: "발열 및 오한",
        visitType: "재진",
        alert: null,
        alertType: null,
        buttonText: "진료 시작",
        visitOrigin: "reservation"
    },
    {
        id: 40,
        time: "18:30",
        name: "최준영",
        birthDate: "1992-09-18",
        phone: "010-0123-4560",
        condition: "손목 부종",
        visitType: "초진",
        alert: null,
        alertType: null,
        buttonText: "진료 시작",
        visitOrigin: "walkin"
    },

    // 동명이인 환자들 (41-45)
    {
        id: 41,
        time: "09:00",
        name: "김철수", // 동명이인 1
        birthDate: "1985-03-15",
        phone: "010-1234-5678",
        condition: "고혈압",
        visitType: "재진",
        alert: null,
        alertType: null,
        buttonText: "진료 시작",
        visitOrigin: "reservation"
    },
    {
        id: 42,
        time: "10:30",
        name: "김철수", // 동명이인 2 (같은 생년월일)
        birthDate: "1985-03-15",
        phone: "010-1234-9999", // 다른 전화번호
        condition: "당뇨",
        visitType: "재진",
        alert: null,
        alertType: null,
        buttonText: "진료 시작",
        visitOrigin: "walkin"
    },
    {
        id: 43,
        time: "11:00",
        name: "김철수", // 동명이인 3 (다른 생년월일)
        birthDate: "1990-08-20",
        phone: "010-5678-1234",
        condition: "감기",
        visitType: "초진",
        alert: null,
        alertType: null,
        buttonText: "진료 시작",
        visitOrigin: "reservation"
    },
    {
        id: 44,
        time: "12:30",
        name: "이영희", // 동명이인 4
        birthDate: "1990-07-22",
        phone: "010-2345-6789",
        condition: "두통",
        visitType: "재진",
        alert: null,
        alertType: null,
        buttonText: "진료 시작",
        visitOrigin: "walkin"
    },
    {
        id: 45,
        time: "13:00",
        name: "이영희", // 동명이인 5 (같은 생년월일)
        birthDate: "1990-07-22",
        phone: "010-2345-8888", // 다른 전화번호
        condition: "복통",
        visitType: "초진",
        alert: null,
        alertType: null,
        buttonText: "진료 시작",
        visitOrigin: "reservation"
    },
    {
        id: 42,
        time: "10:30",
        name: "이수정",
        birthDate: "1990-05-24",
        phone: "010-2345-6783",
        condition: "어지럼증",
        visitType: "재진",
        alert: null,
        alertType: null,
        buttonText: "진료 시작",
        visitOrigin: "reservation"
    },
    {
        id: 43,
        time: "11:00",
        name: "정민호",
        birthDate: "1987-08-31",
        phone: "010-3456-7894",
        condition: "무릎 관절염",
        visitType: "재진",
        alert: null,
        alertType: null,
        buttonText: "진료 시작",
        visitOrigin: "walkin"
    },
    {
        id: 44,
        time: "12:30",
        name: "박지원",
        birthDate: "1993-12-11",
        phone: "010-4567-8905",
        condition: "피부 가려움",
        visitType: "초진",
        alert: null,
        alertType: null,
        buttonText: "진료 시작",
        visitOrigin: "reservation"
    },
    {
        id: 45,
        time: "13:00",
        name: "최서진",
        birthDate: "1989-01-26",
        phone: "010-5678-9016",
        condition: "목소리 쉬움",
        visitType: "재진",
        alert: null,
        alertType: null,
        buttonText: "진료 시작",
        visitOrigin: "walkin"
    },
    {
        id: 46,
        time: "14:30",
        name: "김도영",
        birthDate: "1995-06-13",
        phone: "010-6789-0127",
        condition: "발목 염좌",
        visitType: "초진",
        alert: null,
        alertType: null,
        buttonText: "진료 시작",
        visitOrigin: "reservation"
    },
    {
        id: 47,
        time: "15:00",
        name: "이준호",
        birthDate: "1984-04-29",
        phone: "010-7890-1238",
        condition: "소화불량",
        visitType: "재진",
        alert: null,
        alertType: null,
        buttonText: "진료 시작",
        visitOrigin: "walkin"
    },
    {
        id: 48,
        time: "16:30",
        name: "정수빈",
        birthDate: "1991-10-04",
        phone: "010-8901-2349",
        condition: "어깨 통증",
        visitType: "재진",
        alert: null,
        alertType: null,
        buttonText: "진료 시작",
        visitOrigin: "reservation"
    },
    {
        id: 49,
        time: "17:00",
        name: "박현수",
        birthDate: "1988-07-20",
        phone: "010-9012-3450",
        condition: "눈 건조증",
        visitType: "재진",
        alert: null,
        alertType: null,
        buttonText: "진료 시작",
        visitOrigin: "walkin"
    },
    {
        id: 50,
        time: "18:00",
        name: "최민지",
        birthDate: "1994-02-08",
        phone: "010-0123-4561",
        condition: "허리 통증",
        visitType: "초진",
        alert: null,
        alertType: null,
        buttonText: "진료 시작",
        visitOrigin: "reservation"
    }
];
