export interface RevisitPatient {
    id: number;
    name: string;
    birthDate: string;
    phone: string;
    lastVisit: string;
    diagnosis: string;
    visitType: string;
    notes: Array<{
        id: string;
        type: string;
        content: string;
        author: string;
        date: string;
        details?: string;
    }>;
}

// 재진 환자 50명 데이터 (대시보드 20명 포함)
export const revisitPatientsData: RevisitPatient[] = [
    // 대시보드 환자들 (1-20번)
    {
        id: 1,
        name: "김지현",
        birthDate: "1998-02-21",
        phone: "010-1234-5678",
        lastVisit: "2024-10-27",
        diagnosis: "몸살 기운",
        visitType: "재진",
        notes: [
            {
                id: "note-1",
                type: "재진",
                content: "몸살 기운으로 내원",
                author: "김의사",
                date: "2024-10-27",
                details: "발열, 근육통, 두통 증상. 감기 의심. 충분한 휴식과 수분 섭취 권고."
            },
            {
                id: "note-2",
                type: "재진",
                content: "감기 증상",
                author: "김의사",
                date: "2024-09-15",
                details: "콧물, 인후통, 기침. 해열제 처방 후 회복됨."
            },
            {
                id: "note-3",
                type: "재진",
                content: "피로감 및 수면 부족",
                author: "김의사",
                date: "2024-08-20",
                details: "과로로 인한 피로감. 충분한 수면과 규칙적인 생활 패턴 권고."
            }
        ]
    },
    {
        id: 2,
        name: "이희창",
        birthDate: "2002-05-21",
        phone: "010-2345-6789",
        lastVisit: "2024-10-27",
        diagnosis: "피부 발진",
        visitType: "재진",
        notes: [
            {
                id: "note-1",
                type: "재진",
                content: "피부 발진으로 내원",
                author: "김의사",
                date: "2024-10-27",
                details: "얼굴과 목 부위에 붉은 발진. 알레르기성 피부염 의심. 항히스타민제 처방."
            },
            {
                id: "note-2",
                type: "재진",
                content: "여드름 치료",
                author: "김의사",
                date: "2024-09-10",
                details: "턱 부위 여드름 악화. 항생제 연고 처방 후 개선됨."
            },
            {
                id: "note-3",
                type: "재진",
                content: "스트레스성 두드러기",
                author: "김의사",
                date: "2024-07-15",
                details: "시험 기간 중 스트레스로 인한 두드러기 발생. 스트레스 관리 권고."
            }
        ]
    },
    {
        id: 3,
        name: "김지현",
        birthDate: "1995-08-15",
        phone: "010-3456-7890",
        lastVisit: "2024-10-27",
        diagnosis: "고혈압 관리",
        visitType: "재진",
        notes: [
            {
                id: "note-1",
                type: "재진",
                content: "고혈압 관리",
                author: "김의사",
                date: "2024-10-27",
                details: "혈압 135/85, 약물 효과 양호."
            }
        ]
    },
    {
        id: 4,
        name: "김지현",
        birthDate: "1992-05-12",
        phone: "010-4567-8901",
        lastVisit: "2024-10-27",
        diagnosis: "복통",
        visitType: "초진",
        notes: []
    },
    {
        id: 5,
        name: "최지영",
        birthDate: "1983-06-18",
        phone: "010-5678-9012",
        lastVisit: "2024-10-27",
        diagnosis: "두통",
        visitType: "재진",
        notes: [
            {
                id: "note-1",
                type: "재진",
                content: "두통 재발",
                author: "김의사",
                date: "2024-10-27",
                details: "스트레스성 두통으로 진단. 휴식 권고."
            }
        ]
    },
    {
        id: 6,
        name: "이윤효",
        birthDate: "2002-03-21",
        phone: "010-6789-0123",
        lastVisit: "2024-10-27",
        diagnosis: "복통",
        visitType: "재진",
        notes: [
            {
                id: "note-1",
                type: "재진",
                content: "복통으로 내원",
                author: "김의사",
                date: "2024-10-27",
                details: "배꼽 주변 통증, 구토 증상. 위염 의심. 위장약 처방."
            },
            {
                id: "note-2",
                type: "재진",
                content: "스트레스성 위통",
                author: "김의사",
                date: "2024-09-05",
                details: "시험 스트레스로 인한 위통. 스트레스 관리와 규칙적인 식사 권고."
            },
            {
                id: "note-3",
                type: "재진",
                content: "소화불량",
                author: "김의사",
                date: "2024-07-20",
                details: "과식 후 소화불량. 소화제 처방 후 개선됨."
            }
        ]
    },
    {
        id: 7,
        name: "이윤효",
        birthDate: "1999-12-08",
        phone: "010-7890-1234",
        lastVisit: "2024-10-27",
        diagnosis: "두통",
        visitType: "재진",
        notes: [
            {
                id: "note-1",
                type: "재진",
                content: "복통으로 내원",
                author: "김의사",
                date: "2024-10-27",
                details: "배꼽 주변 통증, 구토 증상. 위염 의심. 위장약 처방."
            },
            {
                id: "note-2",
                type: "재진",
                content: "스트레스성 위통",
                author: "김의사",
                date: "2024-09-05",
                details: "시험 스트레스로 인한 위통. 스트레스 관리와 규칙적인 식사 권고."
            }
        ]
    },
    {
        id: 8,
        name: "김종원",
        birthDate: "2004-04-21",
        phone: "010-8901-2345",
        lastVisit: "2024-10-27",
        diagnosis: "두통",
        visitType: "재진",
        notes: [
            {
                id: "note-1",
                type: "재진",
                content: "두통으로 내원",
                author: "김의사",
                date: "2024-10-27",
                details: "편두통 증상. 진통제 처방 후 개선됨."
            },
            {
                id: "note-2",
                type: "재진",
                content: "스트레스성 두통",
                author: "김의사",
                date: "2024-09-15",
                details: "시험 스트레스로 인한 두통. 충분한 휴식 권고."
            },
            {
                id: "note-3",
                type: "재진",
                content: "수면 부족으로 인한 두통",
                author: "김의사",
                date: "2024-08-10",
                details: "야간 학습으로 인한 수면 부족. 규칙적인 수면 패턴 권고."
            }
        ]
    },
    {
        id: 9,
        name: "이철수",
        birthDate: "1983-06-18",
        phone: "010-9012-3456",
        lastVisit: "2024-10-27",
        diagnosis: "위염",
        visitType: "재진",
        notes: [
            {
                id: "note-1",
                type: "재진",
                content: "위염 재발",
                author: "김의사",
                date: "2024-10-27",
                details: "상복부 불편감. 위산억제제 처방."
            }
        ]
    },
    {
        id: 10,
        name: "박영희",
        birthDate: "1989-04-25",
        phone: "010-0123-4567",
        lastVisit: "2024-10-27",
        diagnosis: "피로감",
        visitType: "재진",
        notes: [
            {
                id: "note-1",
                type: "재진",
                content: "만성 피로",
                author: "김의사",
                date: "2024-10-27",
                details: "지속적인 피로감. 철분 보충제 처방."
            }
        ]
    },
    {
        id: 11,
        name: "최동현",
        birthDate: "1991-08-07",
        phone: "010-1234-5678",
        lastVisit: "2024-10-27",
        diagnosis: "관절통",
        visitType: "초진",
        notes: []
    },
    {
        id: 12,
        name: "김민지",
        birthDate: "1993-01-30",
        phone: "010-2345-6789",
        lastVisit: "2024-10-27",
        diagnosis: "불면증",
        visitType: "재진",
        notes: [
            {
                id: "note-1",
                type: "재진",
                content: "불면증 관리",
                author: "김의사",
                date: "2024-10-27",
                details: "수면 패턴 개선 필요. 수면제 처방."
            }
        ]
    },
    {
        id: 13,
        name: "이준영",
        birthDate: "1986-10-12",
        phone: "010-3456-7890",
        lastVisit: "2024-10-27",
        diagnosis: "소화불량",
        visitType: "재진",
        notes: [
            {
                id: "note-1",
                type: "재진",
                content: "소화불량",
                author: "김의사",
                date: "2024-10-27",
                details: "복부 팽만감. 소화제 처방."
            }
        ]
    },
    {
        id: 14,
        name: "정수영",
        birthDate: "1984-07-05",
        phone: "010-4567-8901",
        lastVisit: "2024-10-27",
        diagnosis: "어지럼증",
        visitType: "초진",
        notes: []
    },
    {
        id: 15,
        name: "박현우",
        birthDate: "1994-03-20",
        phone: "010-5678-9012",
        lastVisit: "2024-10-27",
        diagnosis: "코막힘",
        visitType: "재진",
        notes: [
            {
                id: "note-1",
                type: "재진",
                content: "코막힘",
                author: "김의사",
                date: "2024-10-27",
                details: "알레르기성 비염 의심. 항히스타민제 처방."
            }
        ]
    },
    {
        id: 16,
        name: "최서연",
        birthDate: "1988-11-28",
        phone: "010-6789-0123",
        lastVisit: "2024-10-27",
        diagnosis: "요통",
        visitType: "재진",
        notes: [
            {
                id: "note-1",
                type: "재진",
                content: "요통 재발",
                author: "김의사",
                date: "2024-10-27",
                details: "허리 통증. 물리치료 권고."
            }
        ]
    },
    {
        id: 17,
        name: "김태현",
        birthDate: "1996-05-15",
        phone: "010-7890-1234",
        lastVisit: "2024-10-27",
        diagnosis: "발열",
        visitType: "초진",
        notes: []
    },
    {
        id: 18,
        name: "이하나",
        birthDate: "1982-09-08",
        phone: "010-8901-2345",
        lastVisit: "2024-10-27",
        diagnosis: "가슴 통증",
        visitType: "재진",
        notes: [
            {
                id: "note-1",
                type: "재진",
                content: "가슴 통증",
                author: "김의사",
                date: "2024-10-27",
                details: "심장 질환 의심. 심전도 검사 권고."
            }
        ]
    },
    {
        id: 19,
        name: "정우진",
        birthDate: "1990-12-22",
        phone: "010-9012-3456",
        lastVisit: "2024-10-27",
        diagnosis: "기침",
        visitType: "재진",
        notes: [
            {
                id: "note-1",
                type: "재진",
                content: "지속적 기침",
                author: "김의사",
                date: "2024-10-27",
                details: "3주간 지속되는 기침. 흉부 X-ray 검사 권고."
            }
        ]
    },
    {
        id: 20,
        name: "박소영",
        birthDate: "1987-02-14",
        phone: "010-0123-4567",
        lastVisit: "2024-10-27",
        diagnosis: "피부 발진",
        visitType: "초진",
        notes: []
    },
    // 추가 재진 환자들 (21-50번)
    {
        id: 21,
        name: "최민호",
        birthDate: "1993-06-30",
        phone: "010-1111-2222",
        lastVisit: "2024-10-26",
        diagnosis: "목 아픔",
        visitType: "재진",
        notes: [
            {
                id: "note-1",
                type: "재진",
                content: "목 통증",
                author: "김의사",
                date: "2024-10-26",
                details: "목 근육 긴장. 마사지 치료 권고."
            }
        ]
    },
    {
        id: 22,
        name: "김지원",
        birthDate: "1985-08-17",
        phone: "010-3333-4444",
        lastVisit: "2024-10-26",
        diagnosis: "복부 팽만감",
        visitType: "재진",
        notes: [
            {
                id: "note-1",
                type: "재진",
                content: "복부 팽만감",
                author: "김의사",
                date: "2024-10-26",
                details: "소화불량 증상. 소화제 처방."
            }
        ]
    },
    {
        id: 23,
        name: "이수빈",
        birthDate: "1991-04-03",
        phone: "010-5555-6666",
        lastVisit: "2024-10-26",
        diagnosis: "손목 통증",
        visitType: "초진",
        notes: []
    },
    {
        id: 24,
        name: "정현수",
        birthDate: "1989-10-25",
        phone: "010-7777-8888",
        lastVisit: "2024-10-26",
        diagnosis: "눈 피로",
        visitType: "재진",
        notes: [
            {
                id: "note-1",
                type: "재진",
                content: "눈 피로",
                author: "김의사",
                date: "2024-10-26",
                details: "컴퓨터 사용으로 인한 눈 피로. 안과 진료 권고."
            }
        ]
    },
    {
        id: 25,
        name: "박지민",
        birthDate: "1995-01-11",
        phone: "010-9999-0000",
        lastVisit: "2024-10-26",
        diagnosis: "무릎 통증",
        visitType: "재진",
        notes: [
            {
                id: "note-1",
                type: "재진",
                content: "무릎 통증",
                author: "김의사",
                date: "2024-10-26",
                details: "관절염 의심. 정형외과 진료 권고."
            }
        ]
    },
    {
        id: 26,
        name: "최준호",
        birthDate: "1983-12-05",
        phone: "010-1212-3434",
        lastVisit: "2024-10-25",
        diagnosis: "소변 빈도 증가",
        visitType: "초진",
        notes: []
    },
    {
        id: 27,
        name: "김서연",
        birthDate: "1992-07-19",
        phone: "010-5656-7878",
        lastVisit: "2024-10-25",
        diagnosis: "어깨 통증",
        visitType: "재진",
        notes: [
            {
                id: "note-1",
                type: "재진",
                content: "어깨 통증",
                author: "김의사",
                date: "2024-10-25",
                details: "오십견 의심. 물리치료 권고."
            }
        ]
    },
    {
        id: 28,
        name: "이동욱",
        birthDate: "1988-03-27",
        phone: "010-9090-1212",
        lastVisit: "2024-10-25",
        diagnosis: "입맛 부족",
        visitType: "재진",
        notes: [
            {
                id: "note-1",
                type: "재진",
                content: "입맛 부족",
                author: "김의사",
                date: "2024-10-25",
                details: "스트레스성 식욕부진. 상담 권고."
            }
        ]
    },
    {
        id: 29,
        name: "정민지",
        birthDate: "1994-09-14",
        phone: "010-3434-5656",
        lastVisit: "2024-10-25",
        diagnosis: "발목 부종",
        visitType: "초진",
        notes: []
    },
    {
        id: 30,
        name: "박현준",
        birthDate: "1986-05-08",
        phone: "010-7878-9090",
        lastVisit: "2024-10-24",
        diagnosis: "가슴 답답함",
        visitType: "재진",
        notes: [
            {
                id: "note-1",
                type: "재진",
                content: "가슴 답답함",
                author: "김의사",
                date: "2024-10-24",
                details: "심장 질환 의심. 심전도 검사 권고."
            }
        ]
    },
    {
        id: 31,
        name: "최지우",
        birthDate: "1990-11-30",
        phone: "010-2323-4545",
        lastVisit: "2024-10-24",
        diagnosis: "허리 통증",
        visitType: "재진",
        notes: [
            {
                id: "note-1",
                type: "재진",
                content: "허리 통증",
                author: "김의사",
                date: "2024-10-24",
                details: "디스크 의심. MRI 검사 권고."
            }
        ]
    },
    {
        id: 32,
        name: "김도현",
        birthDate: "1984-01-23",
        phone: "010-6767-8989",
        lastVisit: "2024-10-24",
        diagnosis: "손 떨림",
        visitType: "초진",
        notes: []
    },
    {
        id: 33,
        name: "이예진",
        birthDate: "1996-08-06",
        phone: "010-4545-6767",
        lastVisit: "2024-10-24",
        diagnosis: "다리 저림",
        visitType: "재진",
        notes: [
            {
                id: "note-1",
                type: "재진",
                content: "다리 저림",
                author: "김의사",
                date: "2024-10-24",
                details: "당뇨 합병증 의심. 혈당 검사 권고."
            }
        ]
    },
    {
        id: 34,
        name: "정승우",
        birthDate: "1987-06-12",
        phone: "010-8989-0101",
        lastVisit: "2024-10-23",
        diagnosis: "소화불량",
        visitType: "재진",
        notes: [
            {
                id: "note-1",
                type: "재진",
                content: "소화불량",
                author: "김의사",
                date: "2024-10-23",
                details: "위염 재발. 위산억제제 처방."
            }
        ]
    },
    {
        id: 35,
        name: "박수진",
        birthDate: "1993-02-28",
        phone: "010-1212-3434",
        lastVisit: "2024-10-23",
        diagnosis: "코피",
        visitType: "초진",
        notes: []
    },
    {
        id: 36,
        name: "최영수",
        birthDate: "1989-12-16",
        phone: "010-5656-7878",
        lastVisit: "2024-10-23",
        diagnosis: "관절 강직",
        visitType: "재진",
        notes: [
            {
                id: "note-1",
                type: "재진",
                content: "관절 강직",
                author: "김의사",
                date: "2024-10-23",
                details: "류마티스 관절염 의심. 혈액 검사 권고."
            }
        ]
    },
    {
        id: 37,
        name: "김민석",
        birthDate: "1991-04-09",
        phone: "010-9090-1212",
        lastVisit: "2024-10-23",
        diagnosis: "눈 충혈",
        visitType: "재진",
        notes: [
            {
                id: "note-1",
                type: "재진",
                content: "눈 충혈",
                author: "김의사",
                date: "2024-10-23",
                details: "결막염 의심. 안과 진료 권고."
            }
        ]
    },
    {
        id: 38,
        name: "이지현",
        birthDate: "1985-10-21",
        phone: "010-3434-5656",
        lastVisit: "2024-10-22",
        diagnosis: "복부 통증",
        visitType: "초진",
        notes: []
    },
    {
        id: 39,
        name: "정태영",
        birthDate: "1994-07-02",
        phone: "010-7878-9090",
        lastVisit: "2024-10-22",
        diagnosis: "어깨 결림",
        visitType: "재진",
        notes: [
            {
                id: "note-1",
                type: "재진",
                content: "어깨 결림",
                author: "김의사",
                date: "2024-10-22",
                details: "근육 긴장. 마사지 치료 권고."
            }
        ]
    },
    {
        id: 40,
        name: "박서영",
        birthDate: "1988-03-15",
        phone: "010-2323-4545",
        lastVisit: "2024-10-22",
        diagnosis: "발열 및 오한",
        visitType: "재진",
        notes: [
            {
                id: "note-1",
                type: "재진",
                content: "발열 및 오한",
                author: "김의사",
                date: "2024-10-22",
                details: "독감 의심. 항바이러스제 처방."
            }
        ]
    },
    {
        id: 41,
        name: "최준영",
        birthDate: "1992-09-18",
        phone: "010-6767-8989",
        lastVisit: "2024-10-21",
        diagnosis: "손목 부종",
        visitType: "초진",
        notes: []
    },
    {
        id: 42,
        name: "이윤효",
        birthDate: "2002-11-08",
        phone: "010-3456-7890",
        lastVisit: "2024-10-21",
        diagnosis: "복통",
        visitType: "초진",
        notes: []
    },
    {
        id: 43,
        name: "이희창",
        birthDate: "1996-07-14",
        phone: "010-8989-0101",
        lastVisit: "2024-10-21",
        diagnosis: "알레르기성 피부염",
        visitType: "재진",
        notes: [
            {
                id: "note-1",
                type: "재진",
                content: "알레르기성 피부염",
                author: "김의사",
                date: "2024-10-21",
                details: "손목과 팔꿈치 부위 가려움증과 발진. 알레르기 검사 권고."
            },
            {
                id: "note-2",
                type: "재진",
                content: "아토피 피부염",
                author: "김의사",
                date: "2024-08-30",
                details: "겨드랑이와 무릎 뒤쪽 습진. 보습제와 스테로이드 연고 처방."
            }
        ]
    },
    {
        id: 44,
        name: "김지현",
        birthDate: "1987-11-03",
        phone: "010-1212-3434",
        lastVisit: "2024-10-21",
        diagnosis: "당뇨 관리",
        visitType: "재진",
        notes: [
            {
                id: "note-1",
                type: "재진",
                content: "당뇨 관리",
                author: "김의사",
                date: "2024-10-21",
                details: "혈당 140mg/dL, 인슐린 조절 필요."
            }
        ]
    },
    {
        id: 45,
        name: "김종원",
        birthDate: "1989-06-14",
        phone: "010-5656-7878",
        lastVisit: "2024-10-20",
        diagnosis: "감기",
        visitType: "재진",
        notes: [
            {
                id: "note-1",
                type: "재진",
                content: "감기 증상",
                author: "김의사",
                date: "2024-10-20",
                details: "기침, 콧물. 감기약 처방."
            }
        ]
    },
    {
        id: 46,
        name: "김종원",
        birthDate: "2004-05-12",
        phone: "010-9090-1212",
        lastVisit: "2024-10-20",
        diagnosis: "두통",
        visitType: "재진",
        notes: [
            {
                id: "note-1",
                type: "재진",
                content: "무릎 관절통",
                author: "김의사",
                date: "2024-10-20",
                details: "퇴행성 관절염. 소염진통제 처방."
            }
        ]
    },
    {
        id: 47,
        name: "최현우",
        birthDate: "1992-03-18",
        phone: "010-3434-5656",
        lastVisit: "2024-10-20",
        diagnosis: "복통",
        visitType: "재진",
        notes: [
            {
                id: "note-1",
                type: "재진",
                content: "복통",
                author: "김의사",
                date: "2024-10-20",
                details: "위염 재발. 위산억제제 처방."
            }
        ]
    },
    {
        id: 48,
        name: "정서연",
        birthDate: "1986-09-11",
        phone: "010-7878-9090",
        lastVisit: "2024-10-19",
        diagnosis: "피부염",
        visitType: "재진",
        notes: [
            {
                id: "note-1",
                type: "재진",
                content: "아토피 피부염",
                author: "김의사",
                date: "2024-10-19",
                details: "피부 가려움. 스테로이드 연고 처방."
            }
        ]
    },
    {
        id: 49,
        name: "강도현",
        birthDate: "1993-05-22",
        phone: "010-2323-4545",
        lastVisit: "2024-10-19",
        diagnosis: "요통",
        visitType: "재진",
        notes: [
            {
                id: "note-1",
                type: "재진",
                content: "요통",
                author: "김의사",
                date: "2024-10-19",
                details: "허리 디스크 의심. MRI 검사 권고."
            }
        ]
    },
    {
        id: 50,
        name: "윤수진",
        birthDate: "1988-01-29",
        phone: "010-6767-8989",
        lastVisit: "2024-10-19",
        diagnosis: "불면증",
        visitType: "재진",
            notes: [
                {
                id: "note-1",
                type: "재진",
                content: "불면증",
                author: "김의사",
                date: "2024-10-19",
                details: "수면 패턴 개선 필요. 수면제 처방."
            }
        ]
    }
];