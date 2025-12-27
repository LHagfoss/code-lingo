"use client";

import { SignOut } from "@/components/auth/sign-out";
import usePathCheck from "@/hooks/usePathCheck";
import { AppButton } from "@/components/ui/app-button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AppLogo from "./app-logo";

type HeaderProps = {
    role?: "user" | "admin";
};

export default function Header({ role }: Readonly<HeaderProps>) {
    const pathname = usePathname();

    const isSignInPage = usePathCheck("/signin");
    const rootPage = usePathCheck("/");
    const isOnboardingPage = usePathCheck("/onboarding");

    const isActivePath = (path: string) => pathname.startsWith(path);

    if (isSignInPage || rootPage || isOnboardingPage) {
        return null;
    } else {
        return (
            <header className="bg-white flex items-center justify-between p-4 shadow-[0_4px_0_rgb(0,0,0,0.06)]">
                <div className="flex-1 flex items-center">
                    <Link href="/" className="flex items-center gap-2">
                        <AppLogo size="md" />{" "}
                        <p className="text-xl font-bold">CodeLingo</p>
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
                    {role === "admin" && (
                        <AppButton
                            variant={
                                isActivePath("/admin") ? "primary" : "secondary"
                            }
                            size="md"
                            href="/admin"
                        >
                            Admin
                        </AppButton>
                    )}
                </div>

                <div className="flex-1 flex justify-end items-center">
                    <SignOut />
                </div>
            </header>
        );
    }
}
