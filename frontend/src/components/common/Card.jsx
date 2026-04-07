/** 공통 카드 컨테이너(라운드·보더·그림자) */
import { tokens } from "@/design/tokens";

export default function Card({ children, className = "" }) {
    return (
        <div className={`rounded-2xl border border-slate-200 bg-white p-3 shadow-sm mb-3 ${className}`}>
            {children}
        </div>
    );
}