import Link from "next/link";
import { cn } from "@/utils/cn";

type AppButtonProps = {
    variant?:
        | "primary"
        | "secondary"
        | "success"
        | "super"
        | "danger"
        | "ghost";
    size?: "default" | "sm" | "md" | "lg";
    href?: string;
    className?: string;
    fullWidth?: boolean;
    children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement> &
    Omit<React.ComponentProps<typeof Link>, "href">;

export function AppButton({
    variant = "primary",
    size = "default",
    href,
    className,
    fullWidth,
    children,
    ...props
}: AppButtonProps) {
    const baseStyles =
        "inline-flex items-center justify-center font-extrabold uppercase tracking-wide rounded-2xl border-2 border-b-4 active:border-b-2 active:translate-y-[2px] transition-all disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

    const variants = {
        primary:
            "bg-blue-600 text-white border-blue-700 hover:bg-blue-500 active:border-blue-700",
        secondary:
            "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 active:border-slate-200",
        danger: "bg-rose-500 text-white border-rose-600 hover:bg-rose-400 active:border-rose-600",
        success:
            "bg-green-500 text-white border-green-600 hover:bg-green-400 active:border-green-600",
        super: "bg-yellow-400 text-yellow-900 border-yellow-500 hover:bg-yellow-300 active:border-yellow-500",
        ghost: "bg-transparent text-slate-500 border-transparent border-b-0 hover:bg-slate-100 hover:text-slate-700 active:translate-y-0",
    } as const;

    const sizes = {
        default: "h-12 px-6 py-3 text-base",
        sm: "h-10 px-4 text-sm",
        md: "h-11 px-5 text-base",
        lg: "h-14 px-8 text-lg",
    } as const;

    const combinedClasses = cn(
        baseStyles,
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        className,
    );

    if (href) {
        const { href: _buttonHref, ...linkProps } =
            props as React.ComponentProps<typeof Link>;
        return (
            <Link href={href} className={combinedClasses} {...linkProps}>
                {children}
            </Link>
        );
    }

    return (
        <button
            className={combinedClasses}
            {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
        >
            {children}
        </button>
    );
}
