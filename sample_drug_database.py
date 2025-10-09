#!/usr/bin/env python3
"""
샘플 약물 데이터베이스 생성기
API 없이 테스트용 약물 상호작용 데이터를 생성합니다.
"""

import pandas as pd
import json
from typing import List, Dict

class SampleDrugDatabase:
    def __init__(self):
        # 고혈압/당뇨 관련 약물 샘플 데이터
        self.sample_drugs = [
            # 고혈압 약물
            {
                'drug_name': '아몰디핀정 5mg',
                'ingredient': 'Amlodipine',
                'interaction_type': '병용금기',
                'caution_text': '베타차단제와 병용 시 저혈압 유발 가능'
            },
            {
                'drug_name': '로사르탄정 50mg',
                'ingredient': 'Losartan',
                'interaction_type': '주의',
                'caution_text': '칼륨 보유 이뇨제와 병용 시 고칼륨혈증 주의'
            },
            {
                'drug_name': '메토프롤롤정 50mg',
                'ingredient': 'Metoprolol',
                'interaction_type': '병용금기',
                'caution_text': '기관지천식 환자에게 금기'
            },
            {
                'drug_name': '캅토프릴정 25mg',
                'ingredient': 'Captopril',
                'interaction_type': '주의',
                'caution_text': '신장기능 저하 환자에서 용량 조절 필요'
            },
            {
                'drug_name': '발사르탄정 80mg',
                'ingredient': 'Valsartan',
                'interaction_type': '주의',
                'caution_text': '임신 중 사용 금지'
            },
            
            # 당뇨 약물
            {
                'drug_name': '다이아벡스정 500mg',
                'ingredient': 'Metformin',
                'interaction_type': '주의',
                'caution_text': '신장기능 저하 환자에서 용량 조절 필요'
            },
            {
                'drug_name': '글리메피리드정 2mg',
                'ingredient': 'Glimepiride',
                'interaction_type': '주의',
                'caution_text': '간기능 저하 환자에서 저혈당 위험 증가'
            },
            {
                'drug_name': '글리피지드정 5mg',
                'ingredient': 'Glipizide',
                'interaction_type': '주의',
                'caution_text': '신장기능 저하 시 용량 감소 필요'
            },
            {
                'drug_name': '시타글립틴정 100mg',
                'ingredient': 'Sitagliptin',
                'interaction_type': '주의',
                'caution_text': '췌장염 병력 환자에서 주의'
            },
            {
                'drug_name': '인슐린 글라르진',
                'ingredient': 'Insulin Glargine',
                'interaction_type': '주의',
                'caution_text': '저혈당 위험으로 인한 주의 깊은 모니터링 필요'
            },
            
            # 복합 약물
            {
                'drug_name': '아몰디핀/발사르탄정',
                'ingredient': 'Amlodipine/Valsartan',
                'interaction_type': '주의',
                'caution_text': '두 성분의 상호작용으로 인한 부작용 모니터링 필요'
            },
            {
                'drug_name': '메트포르민/시타글립틴정',
                'ingredient': 'Metformin/Sitagliptin',
                'interaction_type': '주의',
                'caution_text': '신장기능 저하 시 용량 조절 필요'
            }
        ]
        
        # 약물 상호작용 매트릭스
        self.interaction_matrix = {
            'Amlodipine': {
                'Metoprolol': '저혈압 위험 증가',
                'Digoxin': '디곡신 혈중농도 증가',
                'Grapefruit': '아몰디핀 효과 증가'
            },
            'Metformin': {
                'Contrast_media': '신장독성 위험',
                'Alcohol': '젖산산증 위험',
                'Furosemide': '신장기능 악화'
            },
            'Losartan': {
                'Potassium_sparing_diuretics': '고칼륨혈증',
                'NSAIDs': '신장기능 악화',
                'Lithium': '리튬 독성'
            },
            'Glimepiride': {
                'Warfarin': '항응고제 효과 증가',
                'Aspirin': '저혈당 위험',
                'Alcohol': '저혈당 위험'
            }
        }
    
    def generate_interaction_data(self) -> List[Dict]:
        """약물 상호작용 데이터 생성"""
        interaction_data = []
        
        for drug in self.sample_drugs:
            base_data = {
                'drug_name': drug['drug_name'],
                'ingredient': drug['ingredient'],
                'interaction_type': drug['interaction_type'],
                'caution_text': drug['caution_text']
            }
            interaction_data.append(base_data)
            
            # 추가 상호작용 정보 생성
            ingredient = drug['ingredient']
            if ingredient in self.interaction_matrix:
                for interacting_drug, interaction_desc in self.interaction_matrix[ingredient].items():
                    interaction_data.append({
                        'drug_name': f"{drug['drug_name']} + {interacting_drug}",
                        'ingredient': f"{ingredient} + {interacting_drug}",
                        'interaction_type': '상호작용',
                        'caution_text': interaction_desc
                    })
        
        return interaction_data
    
    def generate_drug_categories(self) -> List[Dict]:
        """약물 분류 데이터 생성"""
        categories = [
            {
                'drug_name': 'ACE 억제제',
                'ingredient': 'ACE Inhibitors',
                'interaction_type': '약물군',
                'caution_text': '고칼륨혈증, 신장기능 악화 주의'
            },
            {
                'drug_name': 'ARB',
                'ingredient': 'Angiotensin Receptor Blockers',
                'interaction_type': '약물군',
                'caution_text': '임신 중 사용 금지, 고칼륨혈증 주의'
            },
            {
                'drug_name': '베타차단제',
                'ingredient': 'Beta Blockers',
                'interaction_type': '약물군',
                'caution_text': '기관지천식, 심부전 악화 주의'
            },
            {
                'drug_name': '설포닐우레아',
                'ingredient': 'Sulfonylureas',
                'interaction_type': '약물군',
                'caution_text': '저혈당 위험, 신장기능 저하 시 주의'
            },
            {
                'drug_name': '빅아나이드',
                'ingredient': 'Biguanides',
                'interaction_type': '약물군',
                'caution_text': '신장기능 저하 시 젖산산증 위험'
            }
        ]
        return categories
    
    def save_to_csv(self, filename: str = 'sample_drug_database.csv'):
        """샘플 데이터를 CSV로 저장"""
        # 기본 약물 데이터
        drug_data = self.generate_interaction_data()
        
        # 약물 분류 데이터 추가
        category_data = self.generate_drug_categories()
        
        # 전체 데이터 합치기
        all_data = drug_data + category_data
        
        # DataFrame 생성
        df = pd.DataFrame(all_data)
        
        # 중복 제거
        df = df.drop_duplicates()
        
        # CSV 저장
        df.to_csv(filename, index=False, encoding='utf-8-sig')
        
        print(f"샘플 약물 데이터베이스가 {filename}에 저장되었습니다.")
        print(f"총 {len(df)}개의 약물 정보가 포함되었습니다.")
        
        # 샘플 데이터 출력
        print("\n=== 저장된 데이터 샘플 ===")
        print(df.head(15).to_string(index=False))
        
        return df
    
    def generate_json_for_emr(self, filename: str = 'drug_interactions.json'):
        """EMR 시스템용 JSON 데이터 생성"""
        drug_data = self.generate_interaction_data()
        
        # JSON 구조로 변환
        json_data = {
            'metadata': {
                'generated_at': pd.Timestamp.now().isoformat(),
                'total_drugs': len(drug_data),
                'description': '고혈압/당뇨 관련 약물 상호작용 데이터'
            },
            'drugs': drug_data,
            'interaction_matrix': self.interaction_matrix
        }
        
        # JSON 파일 저장
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(json_data, f, ensure_ascii=False, indent=2)
        
        print(f"EMR 시스템용 JSON 데이터가 {filename}에 저장되었습니다.")
        return json_data

def main():
    """메인 실행 함수"""
    print("=== 샘플 약물 데이터베이스 생성기 ===")
    
    # 샘플 데이터 생성기 초기화
    generator = SampleDrugDatabase()
    
    # CSV 파일 생성
    print("\n1. CSV 파일 생성 중...")
    df = generator.save_to_csv('hypertension_diabetes_drugs.csv')
    
    # JSON 파일 생성 (EMR 시스템용)
    print("\n2. EMR 시스템용 JSON 파일 생성 중...")
    json_data = generator.generate_json_for_emr('drug_interactions.json')
    
    print("\n=== 생성 완료 ===")
    print("생성된 파일:")
    print("- hypertension_diabetes_drugs.csv: 약물 상호작용 데이터")
    print("- drug_interactions.json: EMR 시스템용 JSON 데이터")
    
    print("\n=== 사용 방법 ===")
    print("1. CSV 파일을 EMR 시스템의 데이터베이스에 임포트")
    print("2. JSON 파일을 AI 처방 가이드에서 활용")
    print("3. 약물 상호작용 검사 기능에 통합")

if __name__ == "__main__":
    main()
