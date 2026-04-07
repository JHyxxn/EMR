/**
 * 소견서 엔티티 타입 (발급·초안·인쇄 상태)
 * - 문서 관리 페이지, 차트 내 소견 모달과 공유
 */
export interface MedicalOpinion {
    id: string;
    patientId: number;
    patientName: string;
    issueDate: string;
    content: string;
    status: 'draft' | 'issued' | 'printed';
    doctorName: string;
    hospitalName: string;
    createdAt: string;
}

export interface MedicalOpinionListProps {
    opinions: MedicalOpinion[];
    onViewOpinion: (opinion: MedicalOpinion) => void;
    onPrintOpinion: (opinion: MedicalOpinion) => void;
    onDeleteOpinion: (opinionId: string) => void;
}
