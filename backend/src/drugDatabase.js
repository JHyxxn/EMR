/**
 * 약물 데이터베이스 관리 모듈
 * 
 * 담당자: 조형석 (데이터 생성) / 김지현 (AI Gateway)
 * 
 * 주요 기능:
 * - 약물 데이터 로드 (drug_dataset_500.json)
 * - 약물 검색 (이름, 성분명, 카테고리)
 * - 약물 상호작용 검사
 * - 처방 가이드 생성
 * - 약물 카테고리별 통계
 * 
 * 기술 스택:
 * - Node.js
 * - 파일 시스템 (fs)
 * - JSON 데이터 파싱
 * - 상호작용 매트릭스 구축
 * 
 * 데이터 소스:
 * - Downloads/drug_dataset_500.json (5개 약물 정보)
 * 
 * API 엔드포인트:
 * - /api/drugs/search - 약물 검색
 * - /api/drugs/interactions - 상호작용 검사
 * - /api/drugs/prescription-guide - 처방 가이드
 * - /api/drugs/status - 데이터베이스 상태
 */

import fs from 'fs';
import path from 'path';

class DrugDatabase {
    constructor() {
        this.drugs = [];
        this.interactionMatrix = new Map();
        this.loadDrugData();
    }

    /**
     * 약물 데이터 로드
     */
    loadDrugData() {
        try {
            const drugDataPath = path.join(process.cwd(), '..', 'Downloads', 'drug_dataset_500.json');
            const rawData = fs.readFileSync(drugDataPath, 'utf8');
            const drugDataset = JSON.parse(rawData);
            
            this.drugs = drugDataset.drugs || [];
            this.buildInteractionMatrix();
            
            console.log(`✅ 약물 데이터베이스 로드 완료: ${this.drugs.length}개 약물`);
        } catch (error) {
            console.error('❌ 약물 데이터베이스 로드 실패:', error.message);
            this.drugs = [];
        }
    }

    /**
     * 약물 상호작용 매트릭스 구축
     */
    buildInteractionMatrix() {
        this.drugs.forEach(drug => {
            const interactions = new Set();
            
            // 약물명으로 상호작용 검색
            drug.interactions?.forEach(interaction => {
                interactions.add(interaction);
            });
            
            this.interactionMatrix.set(drug.ingredient, {
                interactions: Array.from(interactions),
                contraindications: drug.contraindications || [],
                sideEffects: drug.side_effects || [],
                precautions: drug.precautions || []
            });
        });
    }

    /**
     * 약물 검색
     * @param {string} query - 검색어 (약물명 또는 성분명)
     * @returns {Array} 검색된 약물 목록
     */
    searchDrugs(query) {
        if (!query || query.trim() === '') {
            return [];
        }

        const searchTerm = query.toLowerCase();
        
        return this.drugs.filter(drug => 
            drug.drug_name?.toLowerCase().includes(searchTerm) ||
            drug.ingredient?.toLowerCase().includes(searchTerm) ||
            drug.category?.toLowerCase().includes(searchTerm)
        );
    }

    /**
     * 약물 상호작용 검사
     * @param {Array} medications - 처방할 약물 목록
     * @returns {Object} 상호작용 검사 결과
     */
    checkDrugInteractions(medications) {
        const results = {
            hasInteractions: false,
            interactions: [],
            warnings: [],
            recommendations: []
        };

        if (!medications || medications.length < 2) {
            return results;
        }

        // 각 약물 쌍에 대해 상호작용 검사
        for (let i = 0; i < medications.length; i++) {
            for (let j = i + 1; j < medications.length; j++) {
                const drug1 = medications[i];
                const drug2 = medications[j];
                
                const interaction = this.findInteraction(drug1, drug2);
                if (interaction) {
                    results.hasInteractions = true;
                    results.interactions.push({
                        drug1: drug1,
                        drug2: drug2,
                        interaction: interaction,
                        severity: this.getInteractionSeverity(interaction)
                    });
                }
            }
        }

        // 개별 약물 주의사항 검사
        medications.forEach(medication => {
            const drugInfo = this.findDrugByName(medication);
            if (drugInfo) {
                if (drugInfo.contraindications?.length > 0) {
                    results.warnings.push({
                        drug: medication,
                        warnings: drugInfo.contraindications
                    });
                }
            }
        });

        return results;
    }

    /**
     * 두 약물 간 상호작용 찾기
     * @param {string} drug1 - 첫 번째 약물
     * @param {string} drug2 - 두 번째 약물
     * @returns {string|null} 상호작용 설명
     */
    findInteraction(drug1, drug2) {
        const drug1Info = this.findDrugByName(drug1);
        const drug2Info = this.findDrugByName(drug2);

        if (!drug1Info || !drug2Info) {
            return null;
        }

        // 약물1의 상호작용 목록에서 약물2 검색
        const interactions1 = drug1Info.interactions || [];
        for (const interaction of interactions1) {
            if (interaction.toLowerCase().includes(drug2.toLowerCase()) ||
                interaction.toLowerCase().includes(drug2Info.ingredient?.toLowerCase())) {
                return interaction;
            }
        }

        // 약물2의 상호작용 목록에서 약물1 검색
        const interactions2 = drug2Info.interactions || [];
        for (const interaction of interactions2) {
            if (interaction.toLowerCase().includes(drug1.toLowerCase()) ||
                interaction.toLowerCase().includes(drug1Info.ingredient?.toLowerCase())) {
                return interaction;
            }
        }

        return null;
    }

    /**
     * 약물명으로 약물 정보 찾기
     * @param {string} drugName - 약물명
     * @returns {Object|null} 약물 정보
     */
    findDrugByName(drugName) {
        return this.drugs.find(drug => 
            drug.drug_name?.toLowerCase().includes(drugName.toLowerCase()) ||
            drug.ingredient?.toLowerCase().includes(drugName.toLowerCase())
        );
    }

    /**
     * 상호작용 심각도 판정
     * @param {string} interaction - 상호작용 설명
     * @returns {string} 심각도 (low, medium, high, critical)
     */
    getInteractionSeverity(interaction) {
        const criticalKeywords = ['금기', '위험', '사망', '치명적'];
        const highKeywords = ['주의', '피해야', '위험도'];
        const mediumKeywords = ['모니터링', '관찰', '주의깊게'];

        const interactionLower = interaction.toLowerCase();

        if (criticalKeywords.some(keyword => interactionLower.includes(keyword))) {
            return 'critical';
        } else if (highKeywords.some(keyword => interactionLower.includes(keyword))) {
            return 'high';
        } else if (mediumKeywords.some(keyword => interactionLower.includes(keyword))) {
            return 'medium';
        } else {
            return 'low';
        }
    }

    /**
     * 처방 가이드 생성
     * @param {Array} medications - 처방할 약물 목록
     * @param {Object} patient - 환자 정보
     * @returns {Object} 처방 가이드
     */
    generatePrescriptionGuide(medications, patient = {}) {
        const interactionCheck = this.checkDrugInteractions(medications);
        
        const guide = {
            medications: medications,
            patient: patient,
            interactionCheck: interactionCheck,
            recommendations: [],
            warnings: [],
            dosageGuidelines: []
        };

        // 각 약물에 대한 용량 가이드 생성
        medications.forEach(medication => {
            const drugInfo = this.findDrugByName(medication);
            if (drugInfo) {
                guide.dosageGuidelines.push({
                    drug: medication,
                    ingredient: drugInfo.ingredient,
                    category: drugInfo.category,
                    dosage: drugInfo.dosage,
                    sideEffects: drugInfo.side_effects || [],
                    precautions: drugInfo.precautions || []
                });
            }
        });

        // 환자 특성에 따른 권고사항
        if (patient.age && patient.age > 65) {
            guide.recommendations.push('고령 환자: 용량 조절 및 부작용 모니터링 필요');
        }
        
        if (patient.conditions?.includes('신장질환')) {
            guide.recommendations.push('신장질환 환자: 신장 배설 약물 용량 조절 필요');
        }

        return guide;
    }

    /**
     * 약물 카테고리별 통계
     * @returns {Object} 카테고리별 약물 수
     */
    getCategoryStats() {
        const stats = {};
        this.drugs.forEach(drug => {
            const category = drug.category || '기타';
            stats[category] = (stats[category] || 0) + 1;
        });
        return stats;
    }

    /**
     * 데이터베이스 상태 확인
     * @returns {Object} 데이터베이스 상태
     */
    getStatus() {
        return {
            totalDrugs: this.drugs.length,
            categories: this.getCategoryStats(),
            lastUpdated: new Date().toISOString(),
            isLoaded: this.drugs.length > 0
        };
    }
}

// 싱글톤 인스턴스 생성
const drugDatabase = new DrugDatabase();

export default drugDatabase;
