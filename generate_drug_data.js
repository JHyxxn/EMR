/**
 * 약물 데이터 생성 스크립트
 * 
 * 5개에서 50개로 확장된 약물 데이터베이스 생성
 * 발표용으로 실제 병원에서 많이 사용하는 약물들 포함
 */

const fs = require('fs');
const path = require('path');

// 약물 데이터 정의 (실제 병원에서 많이 사용하는 약물들)
const drugData = {
  drugs: [
    // 해열진통제 (5개)
    {
      id: 1,
      name: "아스피린",
      category: "해열진통제",
      dosage: "500mg",
      frequency: "1일 3회",
      interactions: ["와파린", "메토트렉세이트", "이부프로펜"],
      contraindications: ["위궤양", "출혈성 질환", "아스피린 알레르기"],
      sideEffects: ["위장장애", "출혈", "알레르기 반응"]
    },
    {
      id: 2,
      name: "아세트아미노펜",
      category: "해열진통제",
      dosage: "500mg",
      frequency: "1일 3-4회",
      interactions: ["와파린", "알코올"],
      contraindications: ["간기능 장애", "알코올 중독"],
      sideEffects: ["간독성", "과량 복용 시 간손상"]
    },
    {
      id: 3,
      name: "이부프로펜",
      category: "해열진통제",
      dosage: "400mg",
      frequency: "1일 3회",
      interactions: ["아스피린", "와파린", "리튬", "메토트렉세이트"],
      contraindications: ["위궤양", "신부전", "임신 3기"],
      sideEffects: ["위장장애", "신장기능 악화", "두통"]
    },
    {
      id: 4,
      name: "나프록센",
      category: "해열진통제",
      dosage: "250mg",
      frequency: "1일 2회",
      interactions: ["와파린", "리튬", "메토트렉세이트"],
      contraindications: ["위궤양", "신부전", "심부전"],
      sideEffects: ["위장장애", "어지러움", "두통"]
    },
    {
      id: 5,
      name: "디클로페낙",
      category: "해열진통제",
      dosage: "50mg",
      frequency: "1일 2-3회",
      interactions: ["와파린", "리튬", "디곡신"],
      contraindications: ["위궤양", "심부전", "간기능 장애"],
      sideEffects: ["위장장애", "간기능 이상", "신장기능 악화"]
    },

    // 항생제 (8개)
    {
      id: 6,
      name: "아목시실린",
      category: "항생제",
      dosage: "500mg",
      frequency: "1일 3회",
      interactions: ["와파린", "메토트렉세이트", "경구피임약"],
      contraindications: ["페니실린 알레르기", "전염성 단핵구증"],
      sideEffects: ["설사", "알레르기 반응", "두드러기"]
    },
    {
      id: 7,
      name: "아목시실린/클라불란산",
      category: "항생제",
      dosage: "500/125mg",
      frequency: "1일 3회",
      interactions: ["와파린", "메토트렉세이트"],
      contraindications: ["페니실린 알레르기", "간기능 장애"],
      sideEffects: ["설사", "간기능 이상", "알레르기 반응"]
    },
    {
      id: 8,
      name: "세파클러",
      category: "항생제",
      dosage: "250mg",
      frequency: "1일 3회",
      interactions: ["와파린", "프로베네시드"],
      contraindications: ["세팔로스포린 알레르기"],
      sideEffects: ["설사", "알레르기 반응", "두드러기"]
    },
    {
      id: 9,
      name: "아지트로마이신",
      category: "항생제",
      dosage: "500mg",
      frequency: "1일 1회",
      interactions: ["와파린", "디곡신", "테오필린"],
      contraindications: ["마크로라이드 알레르기", "간기능 장애"],
      sideEffects: ["위장장애", "간기능 이상", "두통"]
    },
    {
      id: 10,
      name: "레보플록사신",
      category: "항생제",
      dosage: "500mg",
      frequency: "1일 1회",
      interactions: ["와파린", "테오필린", "카페인"],
      contraindications: ["퀴놀론 알레르기", "임신", "18세 미만"],
      sideEffects: ["위장장애", "두통", "어지러움", "건조염"]
    },
    {
      id: 11,
      name: "독시사이클린",
      category: "항생제",
      dosage: "100mg",
      frequency: "1일 2회",
      interactions: ["칼슘", "철분", "마그네슘", "와파린"],
      contraindications: ["테트라사이클린 알레르기", "임신", "8세 미만"],
      sideEffects: ["위장장애", "광과민성", "간기능 이상"]
    },
    {
      id: 12,
      name: "클린다마이신",
      category: "항생제",
      dosage: "300mg",
      frequency: "1일 3회",
      interactions: ["신경근 차단제", "와파린"],
      contraindications: ["린코사마이드 알레르기"],
      sideEffects: ["설사", "위장장애", "가성막성 대장염"]
    },
    {
      id: 13,
      name: "메트로니다졸",
      category: "항생제",
      dosage: "500mg",
      frequency: "1일 3회",
      interactions: ["와파린", "알코올", "리튬"],
      contraindications: ["임신 1기", "알코올 중독"],
      sideEffects: ["메탈릭 테이스트", "위장장애", "어지러움"]
    },

    // 고혈압약 (8개)
    {
      id: 14,
      name: "로사르탄",
      category: "고혈압약",
      dosage: "50mg",
      frequency: "1일 1회",
      interactions: ["칼륨 보충제", "리튬", "NSAIDs"],
      contraindications: ["임신", "양측 신동맥 협착"],
      sideEffects: ["어지러움", "기침", "고칼륨혈증"]
    },
    {
      id: 15,
      name: "아몰로디핀",
      category: "고혈압약",
      dosage: "5mg",
      frequency: "1일 1회",
      interactions: ["그레이프프루트", "디곡신", "시메티딘"],
      contraindications: ["심부전", "간기능 장애"],
      sideEffects: ["말초부종", "어지러움", "두통"]
    },
    {
      id: 16,
      name: "리시노프릴",
      category: "고혈압약",
      dosage: "10mg",
      frequency: "1일 1회",
      interactions: ["칼륨 보충제", "리튬", "디곡신"],
      contraindications: ["임신", "양측 신동맥 협착"],
      sideEffects: ["기침", "어지러움", "고칼륨혈증"]
    },
    {
      id: 17,
      name: "메토프롤롤",
      category: "고혈압약",
      dosage: "50mg",
      frequency: "1일 2회",
      interactions: ["베라파밀", "디곡신", "인슐린"],
      contraindications: ["기관지천식", "심부전", "서맥"],
      sideEffects: ["서맥", "피로", "기관지경련"]
    },
    {
      id: 18,
      name: "아텐올롤",
      category: "고혈압약",
      dosage: "50mg",
      frequency: "1일 1회",
      interactions: ["베라파밀", "디곡신", "인슐린"],
      contraindications: ["기관지천식", "심부전", "서맥"],
      sideEffects: ["서맥", "피로", "기관지경련"]
    },
    {
      id: 19,
      name: "발사르탄",
      category: "고혈압약",
      dosage: "80mg",
      frequency: "1일 1회",
      interactions: ["칼륨 보충제", "리튬", "NSAIDs"],
      contraindications: ["임신", "양측 신동맥 협착"],
      sideEffects: ["어지러움", "기침", "고칼륨혈증"]
    },
    {
      id: 20,
      name: "올메사르탄",
      category: "고혈압약",
      dosage: "20mg",
      frequency: "1일 1회",
      interactions: ["칼륨 보충제", "리튬"],
      contraindications: ["임신", "양측 신동맥 협착"],
      sideEffects: ["어지러움", "기침", "고칼륨혈증"]
    },
    {
      id: 21,
      name: "암로디핀/발사르탄",
      category: "고혈압약",
      dosage: "5/80mg",
      frequency: "1일 1회",
      interactions: ["그레이프프루트", "칼륨 보충제"],
      contraindications: ["임신", "심부전"],
      sideEffects: ["말초부종", "어지러움", "고칼륨혈증"]
    },

    // 당뇨약 (6개)
    {
      id: 22,
      name: "메트포르민",
      category: "당뇨약",
      dosage: "500mg",
      frequency: "1일 2회",
      interactions: ["알코올", "요오드 조영제", "푸로세미드"],
      contraindications: ["신부전", "간부전", "젖산산증"],
      sideEffects: ["설사", "메스꺼움", "젖산산증"]
    },
    {
      id: 23,
      name: "글리메피리드",
      category: "당뇨약",
      dosage: "2mg",
      frequency: "1일 1회",
      interactions: ["와파린", "아스피린", "알코올"],
      contraindications: ["신부전", "간부전", "임신"],
      sideEffects: ["저혈당", "체중증가", "어지러움"]
    },
    {
      id: 24,
      name: "글리피지드",
      category: "당뇨약",
      dosage: "5mg",
      frequency: "1일 2회",
      interactions: ["와파린", "아스피린", "알코올"],
      contraindications: ["신부전", "간부전"],
      sideEffects: ["저혈당", "체중증가", "어지러움"]
    },
    {
      id: 25,
      name: "시타글립틴",
      category: "당뇨약",
      dosage: "100mg",
      frequency: "1일 1회",
      interactions: ["디곡신", "와파린"],
      contraindications: ["신부전", "췌장염 병력"],
      sideEffects: ["위장장애", "두통", "췌장염"]
    },
    {
      id: 26,
      name: "엠파글리플로진",
      category: "당뇨약",
      dosage: "10mg",
      frequency: "1일 1회",
      interactions: ["이뇨제", "인슐린"],
      contraindications: ["신부전", "요로감염"],
      sideEffects: ["요로감염", "질염", "탈수"]
    },
    {
      id: 27,
      name: "피오글리타존",
      category: "당뇨약",
      dosage: "15mg",
      frequency: "1일 1회",
      interactions: ["인슐린", "경구피임약"],
      contraindications: ["심부전", "간기능 장애"],
      sideEffects: ["체중증가", "부종", "간기능 이상"]
    },

    // 고지혈증약 (4개)
    {
      id: 28,
      name: "아토르바스타틴",
      category: "고지혈증약",
      dosage: "20mg",
      frequency: "1일 1회",
      interactions: ["그레이프프루트", "와파린", "시클로스포린"],
      contraindications: ["활성 간질환", "임신", "수유"],
      sideEffects: ["근육통", "간기능 이상", "근육병증"]
    },
    {
      id: 29,
      name: "로수바스타틴",
      category: "고지혈증약",
      dosage: "10mg",
      frequency: "1일 1회",
      interactions: ["그레이프프루트", "와파린"],
      contraindications: ["활성 간질환", "임신"],
      sideEffects: ["근육통", "간기능 이상", "근육병증"]
    },
    {
      id: 30,
      name: "심바스타틴",
      category: "고지혈증약",
      dosage: "20mg",
      frequency: "1일 1회",
      interactions: ["그레이프프루트", "와파린", "시클로스포린"],
      contraindications: ["활성 간질환", "임신"],
      sideEffects: ["근육통", "간기능 이상", "근육병증"]
    },
    {
      id: 31,
      name: "프라바스타틴",
      category: "고지혈증약",
      dosage: "20mg",
      frequency: "1일 1회",
      interactions: ["와파린"],
      contraindications: ["활성 간질환", "임신"],
      sideEffects: ["근육통", "간기능 이상", "근육병증"]
    },

    // 소화제/위장약 (5개)
    {
      id: 32,
      name: "오메프라졸",
      category: "소화제",
      dosage: "20mg",
      frequency: "1일 1-2회",
      interactions: ["와파린", "클로피도그렐", "디곡신"],
      contraindications: ["프로톤펌프 억제제 알레르기"],
      sideEffects: ["두통", "설사", "복통"]
    },
    {
      id: 33,
      name: "란소프라졸",
      category: "소화제",
      dosage: "30mg",
      frequency: "1일 1회",
      interactions: ["와파린", "테오필린"],
      contraindications: ["프로톤펌프 억제제 알레르기"],
      sideEffects: ["두통", "설사", "복통"]
    },
    {
      id: 34,
      name: "판토프라졸",
      category: "소화제",
      dosage: "40mg",
      frequency: "1일 1회",
      interactions: ["와파린", "아탐자나비르"],
      contraindications: ["프로톤펌프 억제제 알레르기"],
      sideEffects: ["두통", "설사", "복통"]
    },
    {
      id: 35,
      name: "수크랄페이트",
      category: "소화제",
      dosage: "1g",
      frequency: "1일 4회",
      interactions: ["와파린", "디곡신", "테트라사이클린"],
      contraindications: ["신부전"],
      sideEffects: ["변비", "구강 건조", "어지러움"]
    },
    {
      id: 36,
      name: "미소프로스톨",
      category: "소화제",
      dosage: "200mcg",
      frequency: "1일 4회",
      interactions: ["마그네슘", "알코올"],
      contraindications: ["임신", "NSAIDs와 병용"],
      sideEffects: ["설사", "복통", "자궁수축"]
    },

    // 항응고제 (3개)
    {
      id: 37,
      name: "와파린",
      category: "항응고제",
      dosage: "5mg",
      frequency: "1일 1회",
      interactions: ["아스피린", "항생제", "항진균제", "비타민K"],
      contraindications: ["출혈성 질환", "임신", "수술 전"],
      sideEffects: ["출혈", "타박상", "코피"]
    },
    {
      id: 38,
      name: "아피사반",
      category: "항응고제",
      dosage: "5mg",
      frequency: "1일 2회",
      interactions: ["케토코나졸", "리토나비르"],
      contraindications: ["출혈성 질환", "신부전"],
      sideEffects: ["출혈", "타박상", "코피"]
    },
    {
      id: 39,
      name: "리바록사반",
      category: "항응고제",
      dosage: "20mg",
      frequency: "1일 1회",
      interactions: ["케토코나졸", "리토나비르"],
      contraindications: ["출혈성 질환", "신부전"],
      sideEffects: ["출혈", "타박상", "코피"]
    },

    // 감기약 (3개)
    {
      id: 40,
      name: "페니라민/아세트아미노펜",
      category: "감기약",
      dosage: "복합제",
      frequency: "1일 3회",
      interactions: ["알코올", "진정제", "MAO 억제제"],
      contraindications: ["MAO 억제제 복용 중", "알코올 중독"],
      sideEffects: ["졸음", "어지러움", "구강 건조"]
    },
    {
      id: 41,
      name: "구아이페네신",
      category: "감기약",
      dosage: "400mg",
      frequency: "1일 3회",
      interactions: ["없음"],
      contraindications: ["없음"],
      sideEffects: ["구역", "구토", "두통"]
    },
    {
      id: 42,
      name: "덱스트로메토르판",
      category: "감기약",
      dosage: "15mg",
      frequency: "1일 3회",
      interactions: ["MAO 억제제", "세로토닌 재흡수 억제제"],
      contraindications: ["MAO 억제제 복용 중"],
      sideEffects: ["졸음", "어지러움", "구역"]
    },

    // 기타 (8개)
    {
      id: 43,
      name: "메토트렉세이트",
      category: "면역억제제",
      dosage: "2.5mg",
      frequency: "주 1회",
      interactions: ["아스피린", "NSAIDs", "프로베네시드"],
      contraindications: ["임신", "수유", "간기능 장애"],
      sideEffects: ["골수억제", "간독성", "폐독성"]
    },
    {
      id: 44,
      name: "프레드니솔론",
      category: "스테로이드",
      dosage: "5mg",
      frequency: "1일 1-3회",
      interactions: ["와파린", "인슐린", "이부프로펜"],
      contraindications: ["전신성 진균감염", "예방접종 후"],
      sideEffects: ["체중증가", "고혈당", "골다공증"]
    },
    {
      id: 45,
      name: "디곡신",
      category: "심장약",
      dosage: "0.25mg",
      frequency: "1일 1회",
      interactions: ["아미오다론", "베라파밀", "퀴니딘"],
      contraindications: ["서맥", "방실차단", "디곡신 중독"],
      sideEffects: ["서맥", "부정맥", "메스꺼움"]
    },
    {
      id: 46,
      name: "푸로세미드",
      category: "이뇨제",
      dosage: "40mg",
      frequency: "1일 1-2회",
      interactions: ["디곡신", "리튬", "아미노글리코사이드"],
      contraindications: ["무뇨", "저나트륨혈증"],
      sideEffects: ["탈수", "저나트륨혈증", "저칼륨혈증"]
    },
    {
      id: 47,
      name: "리튬",
      category: "정신과약",
      dosage: "300mg",
      frequency: "1일 2-3회",
      interactions: ["이뇨제", "NSAIDs", "ACE 억제제"],
      contraindications: ["신부전", "심장질환"],
      sideEffects: ["리튬 중독", "갑상선 기능 저하", "신장 손상"]
    },
    {
      id: 48,
      name: "세르트랄린",
      category: "우울증약",
      dosage: "50mg",
      frequency: "1일 1회",
      interactions: ["MAO 억제제", "와파린", "트립탄"],
      contraindications: ["MAO 억제제 복용 중", "임신"],
      sideEffects: ["불면증", "두통", "성기능 장애"]
    },
    {
      id: 49,
      name: "알부테롤",
      category: "천식약",
      dosage: "100mcg",
      frequency: "필요시",
      interactions: ["베타차단제", "디곡신"],
      contraindications: ["베타차단제 알레르기"],
      sideEffects: ["심박수 증가", "떨림", "두통"]
    },
    {
      id: 50,
      name: "몬테루카스트",
      category: "천식약",
      dosage: "10mg",
      frequency: "1일 1회",
      interactions: ["페니토인", "리팜핀"],
      contraindications: ["몬테루카스트 알레르기"],
      sideEffects: ["두통", "복통", "어지러움"]
    }
  ]
};

// JSON 파일로 저장
const outputPath = path.join(__dirname, 'Downloads', 'drug_dataset_500.json');
const outputDir = path.dirname(outputPath);

// 디렉토리가 없으면 생성
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// JSON 파일 저장
fs.writeFileSync(outputPath, JSON.stringify(drugData, null, 2), 'utf8');

console.log(`✅ 약물 데이터베이스 생성 완료!`);
console.log(`📁 저장 위치: ${outputPath}`);
console.log(`📊 총 약물 수: ${drugData.drugs.length}개`);
console.log(`\n카테고리별 분류:`);

// 카테고리별 통계
const categoryStats = {};
drugData.drugs.forEach(drug => {
  const category = drug.category;
  categoryStats[category] = (categoryStats[category] || 0) + 1;
});

Object.entries(categoryStats).forEach(([category, count]) => {
  console.log(`  - ${category}: ${count}개`);
});

console.log(`\n💡 사용 방법:`);
console.log(`   backend/src/drugDatabase.js에서 이 파일을 읽어옵니다.`);

