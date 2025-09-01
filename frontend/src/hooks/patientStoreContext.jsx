// src/hooks/patientStoreContext.jsx

import { createContext, useContext } from "react";

const Ctx = createContext(null);

export function usePatientStore() {
    const ctx = useContext(Ctx);
    if (!ctx) throw new Error("usePatientStore must be used within <PatientStoreProvider>");
    return ctx;
}

export { Ctx };
