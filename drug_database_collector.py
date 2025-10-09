#!/usr/bin/env python3
"""
한국 식품의약품안전처 DUR API를 활용한 약물 데이터베이스 수집 스크립트
- DUR(OpenAPI, data.go.kr 데이터 ID 15056780)
- 의약품개요정보(OpenAPI, 데이터 ID 15075057)
"""

import requests
import pandas as pd
import time
import os
from dotenv import load_dotenv
import logging
from typing import List, Dict, Optional
import json

# 환경 변수 로드
load_dotenv()

# 로깅 설정
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class DrugDatabaseCollector:
    def __init__(self):
        self.api_key = os.getenv('DATA_GO_KR_API_KEY')
        if not self.api_key:
            raise ValueError("DATA_GO_KR_API_KEY가 .env 파일에 설정되지 않았습니다.")
        
        self.base_url = "http://apis.data.go.kr/1471000/DURPrdlstInfoService"
        self.drug_info_url = "http://apis.data.go.kr/1471000/DrugPrdtPrmsnInfoService"
        
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
    
    def get_dur_data(self, page: int = 1, num_of_rows: int = 100) -> List[Dict]:
        """DUR 데이터 조회"""
        url = f"{self.base_url}/getDurPrdlstInfoList"
        params = {
            'serviceKey': self.api_key,
            'pageNo': page,
            'numOfRows': num_of_rows,
            'type': 'json'
        }
        
        try:
            response = self.session.get(url, params=params, timeout=30)
            response.raise_for_status()
            data = response.json()
            
            if 'body' in data and 'items' in data['body']:
                return data['body']['items']
            else:
                logger.warning(f"DUR 데이터 조회 실패 (페이지 {page}): {data}")
                return []
                
        except requests.exceptions.RequestException as e:
            logger.error(f"DUR API 호출 오류 (페이지 {page}): {e}")
            return []
        except Exception as e:
            logger.error(f"DUR 데이터 처리 오류 (페이지 {page}): {e}")
            return []
    
    def get_drug_info(self, item_name: str) -> Optional[Dict]:
        """의약품 개요정보 조회"""
        url = f"{self.drug_info_url}/getDrugPrdtPrmsnInfoList"
        params = {
            'serviceKey': self.api_key,
            'itemName': item_name,
            'type': 'json'
        }
        
        try:
            response = self.session.get(url, params=params, timeout=30)
            response.raise_for_status()
            data = response.json()
            
            if 'body' in data and 'items' in data['body'] and data['body']['items']:
                return data['body']['items'][0]  # 첫 번째 결과 반환
            else:
                return None
                
        except requests.exceptions.RequestException as e:
            logger.error(f"의약품 정보 API 호출 오류 ({item_name}): {e}")
            return None
        except Exception as e:
            logger.error(f"의약품 정보 처리 오류 ({item_name}): {e}")
            return None
    
    def collect_all_dur_data(self, max_pages: int = 50) -> List[Dict]:
        """모든 DUR 데이터 수집"""
        all_data = []
        
        for page in range(1, max_pages + 1):
            logger.info(f"DUR 데이터 수집 중... 페이지 {page}/{max_pages}")
            data = self.get_dur_data(page=page)
            
            if not data:
                logger.info(f"페이지 {page}에서 데이터가 없습니다. 수집 완료.")
                break
                
            all_data.extend(data)
            time.sleep(0.5)  # API 호출 간격 조절
        
        logger.info(f"총 {len(all_data)}개의 DUR 데이터를 수집했습니다.")
        return all_data
    
    def filter_hypertension_diabetes_drugs(self, data: List[Dict]) -> List[Dict]:
        """고혈압, 당뇨 관련 약물 필터링"""
        # 고혈압 관련 키워드
        hypertension_keywords = [
            'amlodipine', 'amlodipin', '아몰디핀', 'amlodipine',
            'losartan', '로사르탄', 'losartan',
            'metoprolol', '메토프롤롤', 'metoprolol',
            'hydrochlorothiazide', '하이드로클로로티아지드', 'hctz',
            'captopril', '캅토프릴', 'captopril',
            'valsartan', '발사르탄', 'valsartan',
            'ace', 'arb', '베타차단제', '이뇨제'
        ]
        
        # 당뇨 관련 키워드
        diabetes_keywords = [
            'metformin', '메트포르민', 'metformin',
            'glimepiride', '글리메피리드', 'glimepiride',
            'insulin', '인슐린', 'insulin',
            'glipizide', '글리피지드', 'glipizide',
            'sitagliptin', '시타글립틴', 'sitagliptin',
            'sulfonylurea', '설포닐우레아'
        ]
        
        filtered_data = []
        
        for item in data:
            item_name = item.get('ITEM_NAME', '').lower()
            ingredient = item.get('INGR_NAME', '').lower()
            
            # 고혈압 또는 당뇨 관련 약물인지 확인
            is_hypertension = any(keyword in item_name or keyword in ingredient 
                                for keyword in hypertension_keywords)
            is_diabetes = any(keyword in item_name or keyword in ingredient 
                            for keyword in diabetes_keywords)
            
            if is_hypertension or is_diabetes:
                filtered_data.append(item)
        
        logger.info(f"고혈압/당뇨 관련 약물 {len(filtered_data)}개를 필터링했습니다.")
        return filtered_data
    
    def process_dur_data(self, dur_data: List[Dict]) -> List[Dict]:
        """DUR 데이터 처리 및 의약품 정보 통합"""
        processed_data = []
        
        for i, item in enumerate(dur_data):
            logger.info(f"데이터 처리 중... {i+1}/{len(dur_data)}")
            
            # 기본 정보 추출
            drug_name = item.get('ITEM_NAME', '')
            ingredient = item.get('INGR_NAME', '')
            interaction_type = item.get('MIXTURE_ITEM_NAME', '')
            caution_text = item.get('PROHBT_CONTENT', '')
            
            # 의약품 개요정보 조회
            drug_info = self.get_drug_info(drug_name)
            
            # 추가 정보가 있으면 통합
            if drug_info:
                # 성분명이 비어있으면 개요정보에서 가져오기
                if not ingredient and drug_info.get('INGR_NAME'):
                    ingredient = drug_info.get('INGR_NAME', '')
                
                # 주의사항이 비어있으면 개요정보에서 가져오기
                if not caution_text and drug_info.get('CAUTION'):
                    caution_text = drug_info.get('CAUTION', '')
            
            processed_item = {
                'drug_name': drug_name,
                'ingredient': ingredient,
                'interaction_type': interaction_type,
                'caution_text': caution_text
            }
            
            processed_data.append(processed_item)
            time.sleep(0.3)  # API 호출 간격 조절
        
        return processed_data
    
    def save_to_csv(self, data: List[Dict], filename: str = 'drug_database.csv'):
        """데이터를 CSV로 저장"""
        if not data:
            logger.warning("저장할 데이터가 없습니다.")
            return
        
        df = pd.DataFrame(data)
        
        # 중복 제거
        df = df.drop_duplicates(subset=['drug_name', 'ingredient'])
        
        # 빈 값 정리
        df = df.fillna('')
        
        # CSV 저장 (UTF-8 인코딩)
        df.to_csv(filename, index=False, encoding='utf-8-sig')
        logger.info(f"데이터가 {filename}에 저장되었습니다. (총 {len(df)}개 항목)")
        
        # 샘플 데이터 출력
        print("\n=== 저장된 데이터 샘플 ===")
        print(df.head(10).to_string(index=False))
    
    def run(self):
        """메인 실행 함수"""
        try:
            logger.info("약물 데이터베이스 수집을 시작합니다...")
            
            # 1. DUR 데이터 수집
            logger.info("1단계: DUR 데이터 수집")
            dur_data = self.collect_all_dur_data(max_pages=20)  # 테스트용으로 20페이지로 제한
            
            if not dur_data:
                logger.error("DUR 데이터를 수집할 수 없습니다.")
                return
            
            # 2. 고혈압/당뇨 관련 약물 필터링
            logger.info("2단계: 고혈압/당뇨 관련 약물 필터링")
            filtered_data = self.filter_hypertension_diabetes_drugs(dur_data)
            
            if not filtered_data:
                logger.warning("필터링된 데이터가 없습니다. 전체 데이터를 사용합니다.")
                filtered_data = dur_data[:50]  # 테스트용으로 50개만 사용
            
            # 3. 데이터 처리 및 통합
            logger.info("3단계: 데이터 처리 및 의약품 정보 통합")
            processed_data = self.process_dur_data(filtered_data)
            
            # 4. CSV 저장
            logger.info("4단계: CSV 파일 저장")
            self.save_to_csv(processed_data, 'hypertension_diabetes_drugs.csv')
            
            logger.info("약물 데이터베이스 수집이 완료되었습니다!")
            
        except Exception as e:
            logger.error(f"데이터 수집 중 오류 발생: {e}")
            raise

def main():
    """메인 함수"""
    try:
        collector = DrugDatabaseCollector()
        collector.run()
    except Exception as e:
        logger.error(f"프로그램 실행 중 오류: {e}")

if __name__ == "__main__":
    main()
