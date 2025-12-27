import { AppButton } from "@/components/ui/app-button";
import { PageWrapper } from "@/components/ui/page-wrapper";

export default async function LandingPage() {
    return (
        <PageWrapper>
            <div className="flex flex-col items-center justify-center h-screen text-center space-y-6">
                <div className="space-y-2">
                    <h1 className="text-4xl font-bold tracking-tight text-slate-800">
                        CodeLingo
                    </h1>
                    <p className="text-xl text-gray-500 max-w-md mx-auto">
                        The free, fun, and effective way to learn to code.
                    </p>
                </div>

                <div className="flex flex-col gap-4 w-full max-w-xs">
                    <AppButton variant="primary" href="/signin" fullWidth>
                        Get Started
                    </AppButton>
                    <AppButton variant="secondary" href="/signin" fullWidth>
                        I already have an account
                    </AppButton>
                </div>
            </div>
        </PageWrapper>
    );
}
