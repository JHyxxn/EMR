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

export const seedPatients: Patient[] = [
    {
        id: "P0001",
        name: "홍길동",
        sex: "F",
        age: 27,
        dob: "1998-03-15",
        phone: "010-1234-5678",
        address: "서울시 강남구",
        allergies: "NKDA",
        primaryDoctor: "김의사",
        lastVisit: "2025-08-18",
        activeOrders: []
    },
    {
        id: "P0002",
        name: "김철수",
        sex: "M",
        age: 45,
        dob: "1980-06-03",
        phone: "010-2345-6789",
        address: "서울시 서초구",
        allergies: "페니실린",
        primaryDoctor: "김의사",
        lastVisit: "2025-08-18",
        activeOrders: ["Metformin 500mg 1T bid"]
    },
    {
        id: "P0003",
        name: "김알지",
        sex: "M",
        age: 31,
        dob: "1994-12-22",
        phone: "010-3456-7890",
        address: "서울시 마포구",
        allergies: "NKDA",
        primaryDoctor: "이의사",
        lastVisit: "2025-08-17",
        activeOrders: []
    }
];

export const addPatient = (patient: Patient): Patient => {
    const newPatient = {
        ...patient,
        id: `P${String(seedPatients.length + 1).padStart(4, '0')}`,
        lastVisit: new Date().toISOString().split('T')[0],
        activeOrders: []
    };
    seedPatients.push(newPatient);
    return newPatient;
};

export const getPatientById = (id: string): Patient | undefined => {
    return seedPatients.find(p => p.id === id);
};

export const updatePatient = (id: string, updates: Partial<Patient>): Patient | null => {
    const index = seedPatients.findIndex(p => p.id === id);
    if (index === -1) return null;
    
    seedPatients[index] = { ...seedPatients[index], ...updates };
    return seedPatients[index];
};

export const deletePatient = (id: string): boolean => {
    const index = seedPatients.findIndex(p => p.id === id);
    if (index === -1) return false;
    
    seedPatients.splice(index, 1);
    return true;
};

