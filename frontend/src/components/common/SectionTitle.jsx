import { tokens } from "@/design/tokens";

export default function SectionTitle({ children, className = "", style = {} }) {
    return (
        <div className={`text-sm font-semibold mb-2 ${className}`} style={style}>
            {children}
        </div>
    );
}