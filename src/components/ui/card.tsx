import { cn } from "@/utils/cn";

type CardProps = {
    children: React.ReactNode;
    className?: string;
};

export function Card({ children, className }: Readonly<CardProps>) {
    return (
        <div
            className={cn(
                "bg-white border-2 border-b-4 border-slate-200 rounded-2xl p-4",
                className,
            )}
        >
            {children}
        </div>
    );
}
