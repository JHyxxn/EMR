import { tokens } from "@/design/tokens";

export default function ListRow({ left, right, className = "" }) {
    return (
        <div className={`flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2 mb-2 bg-white hover:bg-slate-50 ${className}`}>
            <div>{left}</div>
            <div>{right}</div>
        </div>
    );
}