
// src/hooks/patientStore.jsx

import { useMemo, useState } from "react";
import { Ctx } from "./patientStoreContext.jsx";

export default function PatientStoreProvider({ children }) {
    const [patient, setPatient] = useState(null); // { id, mrn, name, ... }

    const api = useMemo(() => ({
        patient,
        setPatient,
        clear: () => setPatient(null),
    }), [patient]);

    return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}
