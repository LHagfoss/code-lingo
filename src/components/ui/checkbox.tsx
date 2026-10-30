"use client";

import { FaCheck } from "react-icons/fa";
import { cn } from "@/utils/cn";

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
        <label
            className={cn(
                "flex items-center gap-3 cursor-pointer select-none group",
                className,
            )}
        >
            <input
                type="checkbox"
                checked={checked}
                onChange={(event) =>
                    onCheckedChange(event.currentTarget.checked)
                }
                className="peer sr-only"
            />
            <span
                aria-hidden="true"
                className={cn(
                    "w-6 h-6 rounded-lg border-2 border-b-4 flex items-center justify-center transition-all peer-focus-visible:ring-2 peer-focus-visible:ring-blue-600",
                    checked
                        ? "bg-green-500 border-green-600 text-white"
                        : "bg-white border-slate-200 group-hover:border-slate-300",
                )}
            >
                {checked && <FaCheck size={14} />}
            </span>
            {label && (
                <span className="text-slate-700 font-bold text-sm">
                    {label}
                </span>
            )}
        </label>
    );
}
