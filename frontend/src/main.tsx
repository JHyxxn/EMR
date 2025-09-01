
// src/main.tsx

import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import PatientStoreProvider from "./hooks/patientStore.jsx";
import { NavigationStoreProvider } from "./hooks/navigationStore.jsx";
import { AuthStoreProvider } from "./hooks/authStore.jsx";

interface ErrorBoundaryProps {
    children: React.ReactNode;
}

function ErrorBoundary({ children }: ErrorBoundaryProps) {
    const [err, setErr] = useState<Error | null>(null);
    if (err) {
        return (
            <div style={{ padding: 24, color: "crimson", whiteSpace: "pre-wrap" }}>
                <h2>🚨 Runtime Error</h2>
                {String(err && err.stack ? err.stack : err)}
            </div>
        );
    }
    // 자식에서 throw 나면 여기로 올라오도록 try/catch 한 번 감싸기
    try {
        return children;
    } catch (e) {
        setErr(e as Error);
        return null;
    }
}

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

createRoot(rootElement).render(
    <StrictMode>
        <ErrorBoundary>
                            <AuthStoreProvider>
                    <NavigationStoreProvider>
                        <PatientStoreProvider>
                            <App />
                        </PatientStoreProvider>
                    </NavigationStoreProvider>
                </AuthStoreProvider>
        </ErrorBoundary>
    </StrictMode>
);