import { cn } from "@/utils/cn";

interface SeparatorProps {
    className?: string;
    variant?: "horizontal" | "vertical";
}

export default function Separator({
    className,
    variant = "horizontal",
}: Readonly<SeparatorProps>) {
    const variants = {
        horizontal: "w-full h-px bg-slate-200",
        vertical: "h-full w-px bg-slate-200",
    } as const;

    const combinedClasses = cn(variants[variant], className);

    return <div className={combinedClasses}></div>;
}
