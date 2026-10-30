import type { ReactNode } from "react";
import { AppText } from "@/components/ui/app-text";
import { Card } from "@/components/ui/card";

interface AdminItemCardProps {
    title: string;
    subtitle?: string; // e.g. description
    order?: number;
    actions: ReactNode;
    children?: ReactNode; // Extra content
}

export function AdminItemCard({
    title,
    subtitle,
    order,
    actions,
    children,
}: AdminItemCardProps) {
    return (
        <Card className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4">
            <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                    {order !== undefined && (
                        <AppText
                            size="xs"
                            variant="secondary"
                            className="bg-slate-100 px-2 py-1 rounded uppercase shrink-0"
                        >
                            Order {order}
                        </AppText>
                    )}
                    <AppText size="lg" className="text-slate-800">
                        {title}
                    </AppText>
                </div>
                {subtitle && (
                    <AppText size="sm" variant="secondary">
                        {subtitle}
                    </AppText>
                )}
                {children}
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 mt-2 md:mt-0">
                {actions}
            </div>
        </Card>
    );
}
