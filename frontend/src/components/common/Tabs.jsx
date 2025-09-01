import { tokens } from "@/design/tokens";

export default function Tabs({ value, onChange, options, className = "" }) {
    return (
        <div className={`flex gap-2 mb-2 ${className}`}>
            {options.map(([key, label]) => (
                <button
                    key={key}
                    onClick={() => onChange(key)}
                    className={`rounded-xl px-3 py-2 text-sm font-medium ${
                        value === key 
                            ? 'bg-blue-600 text-white' 
                            : 'border border-slate-300 bg-white hover:bg-slate-50'
                    }`}
                >
                    {label}
                </button>
            ))}
        </div>
    );
}