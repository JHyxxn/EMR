
// src/components/Button.jsx

export default function Button({ children, className = "", ...props }) {
    return (
        <button
            className={`rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm hover:bg-slate-50 ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
