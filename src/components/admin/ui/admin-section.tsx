import { ReactNode } from "react";
import { AppText } from "@/components/ui/app-text";

interface AdminSectionProps {
    title: string;
    children: ReactNode;
}

export function AdminSection({ title, children }: AdminSectionProps) {
    return (
        <div className="space-y-6">
            <AppText as="h2" size="2xl" variant="primary">{title}</AppText>
            {children}
        </div>
    );
}
