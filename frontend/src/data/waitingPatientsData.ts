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

// 금일 대기 환자 100명 데이터 (동명이인, 예약/방문 환자 포함)
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
    },

    // 동명이인 환자들 (51-100번)
    {
        id: 51,
        time: "09:15",
        name: "김영수", // 동명이인
        birthDate: "1975-08-12",
        phone: "010-1111-2222",
        condition: "당뇨 관리",
        visitType: "재진",
        alert: null,
        alertType: null,
        buttonText: "진료 시작",
        visitOrigin: "reservation"
    },
    {
        id: 52,
        time: "09:45",
        name: "김영수", // 동명이인
        birthDate: "1990-03-25",
        phone: "010-3333-4444",
        condition: "고혈압",
        visitType: "재진",
        alert: null,
        alertType: null,
        buttonText: "진료 시작",
        visitOrigin: "walkin"
    },
    {
        id: 53,
        time: "10:15",
        name: "이미영", // 동명이인
        birthDate: "1982-11-03",
        phone: "010-5555-6666",
        condition: "천식",
        visitType: "재진",
        alert: null,
        alertType: null,
        buttonText: "진료 시작",
        visitOrigin: "reservation"
    },
    {
        id: 54,
        time: "10:45",
        name: "박민수", // 동명이인
        birthDate: "1987-06-18",
        phone: "010-7777-8888",
        condition: "관절통",
        visitType: "재진",
        alert: null,
        alertType: null,
        buttonText: "진료 시작",
        visitOrigin: "walkin"
    },
    {
        id: 55,
        time: "11:15",
        name: "박민수", // 동명이인
        birthDate: "1979-12-05",
        phone: "010-9999-0000",
        condition: "위염",
        visitType: "재진",
        alert: null,
        alertType: null,
        buttonText: "진료 시작",
        visitOrigin: "reservation"
    },
    {
        id: 56,
        time: "11:45",
        name: "최지영", // 동명이인
        birthDate: "1985-09-14",
        phone: "010-1212-3434",
        condition: "두통",
        visitType: "재진",
        alert: null,
        alertType: null,
        buttonText: "진료 시작",
        visitOrigin: "walkin"
    },
    {
        id: 57,
        time: "12:15",
        name: "정현우", // 동명이인
        birthDate: "1991-04-22",
        phone: "010-5656-7878",
        condition: "감기",
        visitType: "초진",
        alert: null,
        alertType: null,
        buttonText: "진료 시작",
        visitOrigin: "reservation"
    },
    {
        id: 58,
        time: "12:45",
        name: "정현우", // 동명이인
        birthDate: "1983-01-30",
        phone: "010-9090-1212",
        condition: "복통",
        visitType: "재진",
        alert: null,
        alertType: null,
        buttonText: "진료 시작",
        visitOrigin: "walkin"
    },
    {
        id: 59,
        time: "13:15",
        name: "강서연", // 동명이인
        birthDate: "1988-07-08",
        phone: "010-3434-5656",
        condition: "피부염",
        visitType: "재진",
        alert: null,
        alertType: null,
        buttonText: "진료 시작",
        visitOrigin: "reservation"
    },
    {
        id: 60,
        time: "13:45",
        name: "강서연", // 동명이인
        birthDate: "1995-10-16",
        phone: "010-7878-9090",
        condition: "알레르기",
        visitType: "재진",
        alert: null,
        alertType: null,
        buttonText: "진료 시작",
        visitOrigin: "walkin"
    },
    {
        id: 61,
        time: "14:15",
        name: "윤도현", // 동명이인
        birthDate: "1980-05-27",
        phone: "010-2323-4545",
        condition: "요통",
        visitType: "재진",
        alert: null,
        alertType: null,
        buttonText: "진료 시작",
        visitOrigin: "reservation"
    },
    {
        id: 62,
        time: "14:45",
        name: "윤도현", // 동명이인
        birthDate: "1992-02-11",
        phone: "010-6767-8989",
        condition: "목통",
        visitType: "재진",
        alert: null,
        alertType: null,
        buttonText: "진료 시작",
        visitOrigin: "walkin"
    },
    {
        id: 63,
        time: "15:15",
        name: "임수진", // 동명이인
        birthDate: "1986-08-19",
        phone: "010-4545-6767",
        condition: "불면증",
        visitType: "재진",
        alert: null,
        alertType: null,
        buttonText: "진료 시작",
        visitOrigin: "reservation"
    },
    {
        id: 64,
        time: "15:45",
        name: "임수진", // 동명이인
        birthDate: "1993-11-02",
        phone: "010-8989-0101",
        condition: "우울증",
        visitType: "재진",
        alert: null,
        alertType: null,
        buttonText: "진료 시작",
        visitOrigin: "walkin"
    },
    {
        id: 65,
        time: "16:15",
        name: "한준호", // 동명이인
        birthDate: "1984-03-13",
        phone: "010-5656-7878",
        condition: "고지혈증",
        visitType: "재진",
        alert: null,
        alertType: null,
        buttonText: "진료 시작",
        visitOrigin: "reservation"
    },
    {
        id: 66,
        time: "16:45",
        name: "한준호", // 동명이인
        birthDate: "1989-12-24",
        phone: "010-1212-3434",
        condition: "갑상선 기능 저하증",
        visitType: "재진",
        alert: null,
        alertType: null,
        buttonText: "진료 시작",
        visitOrigin: "walkin"
    },
    {
        id: 67,
        time: "17:15",
        name: "송미영", // 동명이인
        birthDate: "1981-06-07",
        phone: "010-7878-9090",
        condition: "류마티스 관절염",
        visitType: "재진",
        alert: null,
        alertType: null,
        buttonText: "진료 시작",
        visitOrigin: "reservation"
    },
    {
        id: 68,
        time: "17:45",
        name: "송미영", // 동명이인
        birthDate: "1996-09-15",
        phone: "010-3434-5656",
        condition: "천식",
        visitType: "재진",
        alert: null,
        alertType: null,
        buttonText: "진료 시작",
        visitOrigin: "walkin"
    },
    {
        id: 69,
        time: "18:15",
        name: "조현수", // 동명이인
        birthDate: "1987-01-28",
        phone: "010-9090-1212",
        condition: "간염",
        visitType: "재진",
        alert: null,
        alertType: null,
        buttonText: "진료 시작",
        visitOrigin: "reservation"
    },
    {
        id: 70,
        time: "18:45",
        name: "조현수", // 동명이인
        birthDate: "1994-04-06",
        phone: "010-2323-4545",
        condition: "신장염",
        visitType: "재진",
        alert: null,
        alertType: null,
        buttonText: "진료 시작",
        visitOrigin: "walkin"
    },
    {
        id: 71,
        time: "19:00",
        name: "백지원", // 동명이인
        birthDate: "1982-07-21",
        phone: "010-6767-8989",
        condition: "폐렴",
        visitType: "재진",
        alert: null,
        alertType: null,
        buttonText: "진료 시작",
        visitOrigin: "reservation"
    },
    {
        id: 72,
        time: "19:30",
        name: "백지원", // 동명이인
        birthDate: "1991-10-09",
        phone: "010-4545-6767",
        condition: "기관지염",
        visitType: "재진",
        alert: null,
        alertType: null,
        buttonText: "진료 시작",
        visitOrigin: "walkin"
    },
    {
        id: 73,
        time: "20:00",
        name: "남동욱", // 동명이인
        birthDate: "1985-12-17",
        phone: "010-8989-0101",
        condition: "부비동염",
        visitType: "재진",
        alert: null,
        alertType: null,
        buttonText: "진료 시작",
        visitOrigin: "reservation"
    },
    {
        id: 74,
        time: "20:30",
        name: "남동욱", // 동명이인
        birthDate: "1988-05-04",
        phone: "010-1212-3434",
        condition: "중이염",
        visitType: "재진",
        alert: null,
        alertType: null,
        buttonText: "진료 시작",
        visitOrigin: "walkin"
    },
    {
        id: 75,
        time: "21:00",
        name: "오서진", // 동명이인
        birthDate: "1983-08-26",
        phone: "010-5656-7878",
        condition: "독감",
        visitType: "재진",
        alert: null,
        alertType: null,
        buttonText: "진료 시작",
        visitOrigin: "reservation"
    },
    {
        id: 76,
        time: "21:30",
        name: "오서진", // 동명이인
        birthDate: "1990-11-12",
        phone: "010-7878-9090",
        condition: "설사",
        visitType: "재진",
        alert: null,
        alertType: null,
        buttonText: "진료 시작",
        visitOrigin: "walkin"
    },
    {
        id: 77,
        time: "22:00",
        name: "신민지", // 동명이인
        birthDate: "1986-02-18",
        phone: "010-3434-5656",
        condition: "변비",
        visitType: "재진",
        alert: null,
        alertType: null,
        buttonText: "진료 시작",
        visitOrigin: "reservation"
    },
    {
        id: 78,
        time: "22:30",
        name: "신민지", // 동명이인
        birthDate: "1993-06-01",
        phone: "010-9090-1212",
        condition: "어지러움",
        visitType: "재진",
        alert: null,
        alertType: null,
        buttonText: "진료 시작",
        visitOrigin: "walkin"
    },
    {
        id: 79,
        time: "23:00",
        name: "권태영", // 동명이인
        birthDate: "1989-09-23",
        phone: "010-2323-4545",
        condition: "메스꺼움",
        visitType: "재진",
        alert: null,
        alertType: null,
        buttonText: "진료 시작",
        visitOrigin: "reservation"
    },
    {
        id: 80,
        time: "23:30",
        name: "권태영", // 동명이인
        birthDate: "1984-12-14",
        phone: "010-6767-8989",
        condition: "구토",
        visitType: "재진",
        alert: null,
        alertType: null,
        buttonText: "진료 시작",
        visitOrigin: "walkin"
    },
    {
        id: 81,
        time: "09:20",
        name: "황수빈", // 동명이인
        birthDate: "1987-04-05",
        phone: "010-4545-6767",
        condition: "기침",
        visitType: "재진",
        alert: null,
        alertType: null,
        buttonText: "진료 시작",
        visitOrigin: "reservation"
    },
    {
        id: 82,
        time: "09:40",
        name: "황수빈", // 동명이인
        birthDate: "1992-07-19",
        phone: "010-8989-0101",
        condition: "가래",
        visitType: "재진",
        alert: null,
        alertType: null,
        buttonText: "진료 시작",
        visitOrigin: "walkin"
    },
    {
        id: 83,
        time: "10:20",
        name: "안준영", // 동명이인
        birthDate: "1981-11-30",
        phone: "010-1212-3434",
        condition: "콧물",
        visitType: "재진",
        alert: null,
        alertType: null,
        buttonText: "진료 시작",
        visitOrigin: "reservation"
    },
    {
        id: 84,
        time: "10:40",
        name: "안준영", // 동명이인
        birthDate: "1995-02-13",
        phone: "010-5656-7878",
        condition: "재채기",
        visitType: "재진",
        alert: null,
        alertType: null,
        buttonText: "진료 시작",
        visitOrigin: "walkin"
    },
    {
        id: 85,
        time: "11:20",
        name: "유지현", // 동명이인
        birthDate: "1988-08-08",
        phone: "010-7878-9090",
        condition: "인후통",
        visitType: "재진",
        alert: null,
        alertType: null,
        buttonText: "진료 시작",
        visitOrigin: "reservation"
    },
    {
        id: 86,
        time: "11:40",
        name: "유지현", // 동명이인
        birthDate: "1985-01-25",
        phone: "010-3434-5656",
        condition: "목쉼",
        visitType: "재진",
        alert: null,
        alertType: null,
        buttonText: "진료 시작",
        visitOrigin: "walkin"
    },
    {
        id: 87,
        time: "12:20",
        name: "문현우", // 동명이인
        birthDate: "1990-05-16",
        phone: "010-9090-1212",
        condition: "호흡곤란",
        visitType: "재진",
        alert: null,
        alertType: null,
        buttonText: "진료 시작",
        visitOrigin: "reservation"
    },
    {
        id: 88,
        time: "12:40",
        name: "문현우", // 동명이인
        birthDate: "1983-10-03",
        phone: "010-2323-4545",
        condition: "흉통",
        visitType: "재진",
        alert: null,
        alertType: null,
        buttonText: "진료 시작",
        visitOrigin: "walkin"
    },
    {
        id: 89,
        time: "13:20",
        name: "양서영", // 동명이인
        birthDate: "1986-03-27",
        phone: "010-6767-8989",
        condition: "심계항진",
        visitType: "재진",
        alert: null,
        alertType: null,
        buttonText: "진료 시작",
        visitOrigin: "reservation"
    },
    {
        id: 90,
        time: "13:40",
        name: "양서영", // 동명이인
        birthDate: "1994-07-11",
        phone: "010-4545-6767",
        condition: "부정맥",
        visitType: "재진",
        alert: null,
        alertType: null,
        buttonText: "진료 시작",
        visitOrigin: "walkin"
    },
    {
        id: 91,
        time: "14:20",
        name: "구도현", // 동명이인
        birthDate: "1989-12-22",
        phone: "010-8989-0101",
        condition: "협심증",
        visitType: "재진",
        alert: null,
        alertType: null,
        buttonText: "진료 시작",
        visitOrigin: "reservation"
    },
    {
        id: 92,
        time: "14:40",
        name: "구도현", // 동명이인
        birthDate: "1982-06-14",
        phone: "010-1212-3434",
        condition: "심근경색",
        visitType: "재진",
        alert: null,
        alertType: null,
        buttonText: "진료 시작",
        visitOrigin: "walkin"
    },
    {
        id: 93,
        time: "15:20",
        name: "손민수", // 동명이인
        birthDate: "1987-09-06",
        phone: "010-5656-7878",
        condition: "뇌졸중",
        visitType: "재진",
        alert: null,
        alertType: null,
        buttonText: "진료 시작",
        visitOrigin: "reservation"
    },
    {
        id: 94,
        time: "15:40",
        name: "손민수", // 동명이인
        birthDate: "1991-04-18",
        phone: "010-7878-9090",
        condition: "치매",
        visitType: "재진",
        alert: null,
        alertType: null,
        buttonText: "진료 시작",
        visitOrigin: "walkin"
    },
    {
        id: 95,
        time: "16:20",
        name: "배지영", // 동명이인
        birthDate: "1984-11-29",
        phone: "010-3434-5656",
        condition: "파킨슨병",
        visitType: "재진",
        alert: null,
        alertType: null,
        buttonText: "진료 시작",
        visitOrigin: "reservation"
    },
    {
        id: 96,
        time: "16:40",
        name: "배지영", // 동명이인
        birthDate: "1988-02-07",
        phone: "010-9090-1212",
        condition: "간질",
        visitType: "재진",
        alert: null,
        alertType: null,
        buttonText: "진료 시작",
        visitOrigin: "walkin"
    },
    {
        id: 97,
        time: "17:20",
        name: "김철수", // 동명이인
        birthDate: "1985-08-20",
        phone: "010-2323-4545",
        condition: "간경화",
        visitType: "재진",
        alert: null,
        alertType: null,
        buttonText: "진료 시작",
        visitOrigin: "reservation"
    },
    {
        id: 98,
        time: "17:40",
        name: "김철수", // 동명이인
        birthDate: "1993-01-12",
        phone: "010-6767-8989",
        condition: "간암",
        visitType: "재진",
        alert: null,
        alertType: null,
        buttonText: "진료 시작",
        visitOrigin: "walkin"
    },
    {
        id: 99,
        time: "18:20",
        name: "이영희", // 동명이인
        birthDate: "1986-05-25",
        phone: "010-4545-6767",
        condition: "위암",
        visitType: "재진",
        alert: null,
        alertType: null,
        buttonText: "진료 시작",
        visitOrigin: "reservation"
    },
    {
        id: 100,
        time: "18:40",
        name: "이영희", // 동명이인
        birthDate: "1990-10-08",
        phone: "010-8989-0101",
        condition: "대장암",
        visitType: "재진",
        alert: null,
        alertType: null,
        buttonText: "진료 시작",
        visitOrigin: "walkin"
    }
];
