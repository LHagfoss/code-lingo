import { cn } from "@/utils/cn";

type PageWrapperProps = {
    children: React.ReactNode;
};

export function PageWrapper({ children }: PageWrapperProps) {
    return (
        <div className={cn("min-h-screen w-full p-4 md:p-8 max-w-7xl mx-auto")}>
            {children}
        </div>
    );
}
