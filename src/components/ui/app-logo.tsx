import Image from "next/image";
import { cn } from "@/utils/cn";
import logo from "../../../public/logo.png";
import whiteLogo from "../../../public/white-logo.png";

interface Props {
    size?: "default" | "sm" | "md" | "lg";
    width?: number;
    height?: number;
    className?: string;
    variant?: "default" | "white";
}

export default function AppLogo({
    size = "default",
    width,
    height,
    className,
    variant = "default",
}: Readonly<Props>) {
    const sizes = {
        default: { width: 48, height: 48 },
        sm: { width: 32, height: 32 },
        md: { width: 64, height: 64 },
        lg: { width: 128, height: 128 },
    } as const;

    const finalWidth = width ?? sizes[size].width;
    const finalHeight = height ?? sizes[size].height;

    if (variant === "white") {
        return (
            <Image
                src={whiteLogo}
                width={finalWidth}
                height={finalHeight}
                priority
                alt="CodeLingo logo"
                className={cn(className)}
            />
        );
    } else {
        return (
            <Image
                src={logo}
                width={finalWidth}
                height={finalHeight}
                priority
                alt="CodeLingo logo"
                className={cn(className)}
            />
        );
    }
}
