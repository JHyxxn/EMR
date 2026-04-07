/**
 * 헤더 검색 등에서 선택된 환자 1명 보관 (`setPatient` / `clear`)
 * - `PatientStoreProvider` + `patientStoreContext`의 `Ctx`에 값 제공
 */
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
