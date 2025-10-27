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
