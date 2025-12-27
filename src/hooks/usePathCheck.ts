"use client";

import { usePathname } from "next/navigation";

/**
 * Custom hook to check if the current pathname matches a specific path.
 * @param {string} targetPath The path to check against (e.g., '/admin').
 * @returns {boolean} True if the paths match exactly, false otherwise.
 */
const usePathCheck = (targetPath: string) => {
    const pathname = usePathname();

    return pathname === targetPath;
};

export default usePathCheck;
