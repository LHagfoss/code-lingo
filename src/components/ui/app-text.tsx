import type { ElementType, ReactNode } from "react";
import { cn } from "@/utils/cn";

type Variant =
    | "primary"
    | "secondary"
    | "danger"
    | "success"
    | "inverted"
    | "subtle"
    | "brand";
type Size = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
type Weight = "normal" | "medium" | "bold" | "extrabold";
type Align = "left" | "center" | "right" | "justify";

interface AppTextProps {
    children: ReactNode;
    variant?: Variant;
    size?: Size;
    weight?: Weight;
    lines?: number;
    align?: Align;
    as?: ElementType;
    className?: string;
    bold?: boolean;
}

export function AppText({
    children,
    variant = "primary",
    size = "md",
    weight = "bold",
    lines,
    align,
    as: Component = "p",
    className,
    bold,
}: Readonly<AppTextProps>) {
    const finalWeight = bold ? "bold" : weight;

    const variants: Record<Variant, string> = {
        primary: "text-slate-700",
        secondary: "text-slate-500",
        danger: "text-red-500",
        success: "text-green-500",
        inverted: "text-white",
        subtle: "text-slate-400",
        brand: "text-blue-500",
    };

    const sizes: Record<Size, string> = {
        xs: "text-xs",
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg",
        xl: "text-xl",
        "2xl": "text-2xl",
        "3xl": "text-3xl",
        "4xl": "text-4xl",
    };

    const weights: Record<Weight, string> = {
        normal: "font-normal",
        medium: "font-medium",
        bold: "font-bold",
        extrabold: "font-extrabold",
    };

    const aligns: Record<Align, string> = {
        left: "text-left",
        center: "text-center",
        right: "text-right",
        justify: "text-justify",
    };

    return (
        <Component
            className={cn(
                variants[variant],
                sizes[size],
                weights[finalWeight],
                align && aligns[align],
                lines && `line-clamp-${lines}`,
                className,
            )}
        >
            {children}
        </Component>
    );
}
