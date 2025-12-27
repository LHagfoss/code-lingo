import { ReactNode } from "react";
import { AppText } from "@/components/ui/app-text";

interface AdminListProps {
    children: ReactNode;
    emptyMessage?: string;
}

export function AdminList({
    children,
    emptyMessage = "No items found.",
}: AdminListProps) {
    // If children is an empty array or null/undefined
    const hasChildren = Array.isArray(children)
        ? children.length > 0
        : !!children;

    if (!hasChildren) {
        return (
            <div className="p-8 text-center bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                <AppText variant="subtle">{emptyMessage}</AppText>
            </div>
        );
    }

    return <div className="grid grid-cols-1 gap-4">{children}</div>;
}
