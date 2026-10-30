"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity } from "react";
import { SignOut } from "@/components/auth/sign-out";
import { AppButton } from "@/components/ui/app-button";
import AppLogo from "@/components/ui/app-logo";
import { AppText } from "@/components/ui/app-text";
import usePathCheck from "@/hooks/usePathCheck";

type HeaderProps = {
    role?: "user" | "admin";
};

export default function Header({ role }: Readonly<HeaderProps>) {
    const pathname = usePathname();

    const isSignInPage = usePathCheck("/signin");
    const rootPage = usePathCheck("/");
    const isOnboardingPage = usePathCheck("/onboarding");

    const isActivePath = (path: string) => pathname.startsWith(path);

    const isAdmin = role === "admin";

    if (isSignInPage || rootPage || isOnboardingPage) {
        return null;
    } else {
        return (
            <header className="bg-white flex items-center justify-between p-4 border-b-4 border-slate-200">
                <div className="flex-1 flex items-center">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="bg-blue-600 border-2 border-blue-700 border-b-4 rounded-xl p-1">
                            <AppLogo size="sm" variant="white" />
                        </div>

                        <AppText size="lg">CodeLingo</AppText>
                    </Link>
                </div>

                <div className="flex-2 flex justify-center items-center gap-4">
                    <AppButton
                        variant={
                            isActivePath("/learn") ? "primary" : "secondary"
                        }
                        size="md"
                        href="/learn"
                    >
                        Learn
                    </AppButton>
                    <AppButton
                        variant={
                            isActivePath("/profile") ? "primary" : "secondary"
                        }
                        size="md"
                        href="/profile"
                    >
                        Profile
                    </AppButton>
                    <AppButton
                        variant={
                            isActivePath("/courses") ? "primary" : "secondary"
                        }
                        size="md"
                        href="/courses"
                    >
                        Courses
                    </AppButton>
                    <Activity mode={isAdmin ? "visible" : "hidden"}>
                        <AppButton
                            variant={
                                isActivePath("/admin") ? "primary" : "secondary"
                            }
                            size="md"
                            href="/admin"
                        >
                            Admin
                        </AppButton>
                    </Activity>
                </div>

                <div className="flex-1 flex justify-end items-center">
                    <SignOut />
                </div>
            </header>
        );
    }
}
