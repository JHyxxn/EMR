import React from 'react';

export default function TextArea({ className = "", error, ...props }) {
    return (
        <div style={{ width: "100%" }}>
            <textarea
                className={`w-full min-h-[120px] p-6 text-sm outline-none focus:ring-2 focus:ring-sky-100 resize-none ${className}`}
                style={{
                    borderColor: error ? "#dc2626" : "#d1d5db",
                    borderWidth: "1px",
                    borderRadius: "8px",
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
