"use client";

import { cn } from "@/utils/cn";
import { FaCheck } from "react-icons/fa";

type CheckboxProps = {
    label?: string;
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
    className?: string;
};

export function Checkbox({
    label,
    checked,
    onCheckedChange,
    className,
}: CheckboxProps) {
    return (
        <div
            className={cn(
                "flex items-center gap-3 cursor-pointer select-none group",
                className,
            )}
            onClick={() => onCheckedChange(!checked)}
        >
            <div
                className={cn(
                    "w-6 h-6 rounded-lg border-2 border-b-4 flex items-center justify-center transition-all",
                    checked
                        ? "bg-green-500 border-green-600 text-white"
                        : "bg-white border-slate-200 group-hover:border-slate-300",
                )}
            >
                {checked && <FaCheck size={14} />}
            </div>
            {label && (
                <span className="text-slate-700 font-bold text-sm">
                    {label}
                </span>
            )}
        </div>
    );
}
