/**
 * 앱 내 페이지 전환 상태 (`home` | `chart` | `exam` | …)
 * - 사이드바·라우팅 대체용 `currentPage` / `navigate`
 */
import { useMemo, useState } from "react";
import { createContext, useContext } from "react";

const NavigationContext = createContext(null);

export function useNavigationStore() {
    const ctx = useContext(NavigationContext);
    if (!ctx) throw new Error("useNavigationStore must be used within <NavigationStoreProvider>");
    return ctx;
}

export function NavigationStoreProvider({ children }) {
    const [currentPage, setCurrentPage] = useState('home'); // home, chart, exam, appointment, forms

    const api = useMemo(() => ({
        currentPage,
        setCurrentPage,
        navigate: (page) => setCurrentPage(page)
    }), [currentPage]);

    return <NavigationContext.Provider value={api}>{children}</NavigationContext.Provider>;
}
