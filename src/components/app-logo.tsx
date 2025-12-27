import { cn } from "@/utils/cn";

interface Props {
    size?: "default" | "sm" | "md" | "lg";
    className?: string;
}

export default function AppLogo({
    size = "default",
    className,
}: Readonly<Props>) {
    const baseStyles =
        "bg-blue-600 flex justify-center items-center rounded-xl shadow-[0_4px_0_rgb(3,105,161)] border-blue-700 border-2";

    const sizes = {
        default: "h-16 w-16 text-xl",
        sm: "h-8 w-8 text-lg",
        md: "h-12 w-12 text-xl",
        lg: "h-16 w-16 text-2xl",
    } as const;

    const combinedClasses = cn(baseStyles, sizes[size], className);

    return (
        <div className={combinedClasses}>
            <p className="text-blue-50 font-bold">CL</p>
        </div>
    );
}
