import type { ReactNode } from "react";
import { AppButton } from "@/components/ui/app-button";
import { AppText } from "@/components/ui/app-text";

interface AdminHeaderProps {
    title: string;
    subtitle?: string;
    backHref?: string;
    backLabel?: string;
    children?: ReactNode;
}

export function AdminHeader({
    title,
    subtitle,
    backHref,
    backLabel = "Back",
    children,
}: Readonly<AdminHeaderProps>) {
    return (
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
                <AppText as="h1" size="3xl" variant="primary">{title}</AppText>
                {subtitle && (
                    <AppText variant="secondary" className="mt-1">{subtitle}</AppText>
                )}
            </div>
            <div className="flex items-center gap-3 ml-auto">
                {children}
                {backHref && (
                    <AppButton href={backHref} variant="secondary" size="md">
                        ← {backLabel}
                    </AppButton>
                )}
            </div>
        </div>
    );
}
