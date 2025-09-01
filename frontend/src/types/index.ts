export interface Patient {
    id: string;
    name: string;
    sex: string;
    age: number;
    dob: string;
    phone?: string;
    address?: string;
    guardian?: string;
    guardianPhone?: string;
    insurance?: string;
    allergies?: string;
    primaryDoctor?: string;
    lastVisit?: string;
    activeOrders?: string[];
}

export interface VitalSigns {
    temperature?: number;
    bloodPressure?: string;
    pulse?: number;
    height?: number;
    weight?: number;
    respiratoryRate?: number;
    oxygenSaturation?: number;
}

export interface VisitInfo {
    visitType: 'first' | 'revisit' | 'emergency';
    symptoms: string;
    symptomDuration: string;
    medicalHistory: string;
    medications: string;
    allergies: string;
}

export interface NurseNote {
    symptoms: string;
    observations: string;
    timestamp: string;
}

export interface NewPatientData {
    mrn: string;
    name: string;
    gender: string;
    dob: string;
    phone: string;
    address: string;
    guardian: string;
    guardianPhone: string;
    insurance: string;
    visitType: string;
    symptoms: string;
    symptomDuration: string;
    medicalHistory: string;
    medications: string;
    allergies: string;
    temperature: string;
    bloodPressure: string;
    pulse: string;
    height: string;
    weight: string;
    nurseNotes: string;
    observations: string;
}

export interface Appointment {
    id: string;
    patientId: string;
    patientName: string;
    time: string;
    type: 'appointment' | 'walkin';
    reason: string;
    estimatedDuration: number;
    warnings?: string[];
    status: 'waiting' | 'in-progress' | 'completed';
}

export interface HospitalSchedule {
    time: string;
    activity: string;
    status: 'in-progress' | 'scheduled' | 'completed';
}

export interface Prescription {
    id: string;
    patientId: string;
    patientName: string;
    medication: string;
    time: string;
    type: 'prescription' | 'order';
}

