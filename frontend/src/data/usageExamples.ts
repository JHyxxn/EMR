// 동적 데이터 관리 사용 예시

// 1. 실제 진료 시나리오 - 재진 환자가 도착
export const realClinicScenario = () => {
    // 09:00 - 첫 번째 재진 환자 도착
    addPatientFromRevisit(
        {
            name: "김철수",
            birthDate: "1985-03-15",
            phone: "010-1234-5678",
            symptoms: "고혈압 관리"
        },
        "09:00",
        "reservation"
    );

    // 09:30 - 방문 환자 도착
    addPatientFromRevisit(
        {
            name: "이영희",
            birthDate: "1990-07-22",
            phone: "010-2345-6789",
            symptoms: "두통"
        },
        "09:30",
        "walkin"
    );

    // 10:00 - AI 위험도 감지 환자 추가
    addAIRiskPatient({
        time: "10:00",
        name: "홍길동",
        birthDate: "1980-02-29",
        phone: "010-5678-9012",
        condition: "가슴 통증",
        visitOrigin: "walkin"
    });
};

// 2. 새로운 병원 일정 추가 예시
export const addNewScheduleExample = () => {
    // 회의 일정 추가
    addHospitalSchedule("14:00-15:00", "의료진 회의", "진행 중");
    
    // 수술 일정 추가
    addHospitalSchedule("16:00-18:00", "응급 수술", "예정");
};

// 3. 새로운 처방/오더 추가 예시
export const addNewPrescriptionExample = () => {
    // 처방 추가
    addPrescription("홍길동", "Aspirin 100mg 1T qd", "14:30", "처방");
    
    // 검사 오더 추가
    addPrescription("김철수", "Blood Test, ECG", "15:00", "오더");
};

// 4. 동명이인 검색 테스트 예시
export const searchExamples = [
    "김철수", // 동명이인 3명 검색
    "김철수, 850315", // 같은 생년월일인 김철수 2명 검색
    "김철수, 850315, 5678", // 특정 전화번호 김철수 1명 검색
    "이영희, 900722", // 같은 생년월일인 이영희 2명 검색
    "이영희, 900722, 6789" // 특정 전화번호 이영희 1명 검색
];

// 5. 대기 환자 제거 예시
export const removePatientExample = () => {
    // ID가 1인 환자 제거
    removeWaitingPatient(1);
};

// 6. 실시간 업데이트 시나리오
export const realTimeUpdateScenario = () => {
    // 09:00 - 첫 번째 환자 도착
    addWaitingPatient({
        time: "09:00",
        name: "이첫환자",
        birthDate: "1990-01-01",
        phone: "010-1111-1111",
        condition: "감기",
        visitType: "초진",
        visitOrigin: "walkin"
    });

    // 10:30 - 처방 완료
    addPrescription("이첫환자", "Tylenol 500mg 1T tid", "10:30", "처방");

    // 11:00 - AI 위험도 감지 환자 추가
    addWaitingPatient({
        time: "11:00",
        name: "김위험환자",
        birthDate: "1985-06-15",
        phone: "010-2222-2222",
        condition: "가슴 통증",
        visitType: "재진",
        visitOrigin: "walkin",
        alert: "AI 위험도 감지 - 재진료 필요",
        alertType: "AI 위험"
    });

    // 12:00 - 점심 시간 일정 업데이트
    addHospitalSchedule("12:00-13:00", "점심 시간", "진행 중");

    // 14:00 - 오후 진료 시작
    addHospitalSchedule("14:00-18:00", "오후 외래 진료", "진행 중");
};
