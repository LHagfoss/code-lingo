import { AppButton } from "@/components/ui/app-button";
import AppLogo from "@/components/ui/app-logo";
import { AppText } from "@/components/ui/app-text";

export default async function LandingPage() {
    return (
        <div className="h-screen flex items-center justify-center p-4">
            <div className="max-w-sm flex flex-col justify-center items-center gap-8">
                <div className="flex flex-col items-center">
                    <AppLogo size="lg" />

                    <h1 className="text-4xl font-bold tracking-tight text-slate-800">
                        CodeLingo
                    </h1>

                    <AppText className="text-gray-500">
                        The free, fun, and effective way to learn to code.
                    </AppText>
                </div>

                <div className="flex flex-col gap-2 w-full">
                    <AppButton variant="primary" href="/signin" fullWidth>
                        Get Started
                    </AppButton>
                    <AppButton variant="secondary" href="/signin" fullWidth>
                        I already have an account
                    </AppButton>
                </div>
            </div>

            <AppText className="absolute bottom-8 left-8" size="xs">
                Inspiration taken from Duolingo or sum
            </AppText>
        </div>
    );
}
