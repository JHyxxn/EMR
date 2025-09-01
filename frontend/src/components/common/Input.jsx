import { tokens } from "@/design/tokens";

export default function Input({ className = "", error, ...props }) {
    return (
        <div style={{ width: "100%" }}>
            <input
                className={`w-full px-6 py-12 text-sm outline-none focus:ring-2 focus:ring-sky-100 ${className}`}
                style={{
                    borderColor: error ? "#dc2626" : "#d1d5db",
                    borderWidth: "1px",
                    borderRadius: "5px",
                    borderStyle: "solid"
                }}
                {...props}
            />
            {error && (
                <div style={{
                    color: "#dc2626",
                    fontSize: "12px",
                    marginTop: "4px",
                    marginLeft: "4px"
                }}>
                    {error}
                </div>
            )}
        </div>
    );
}