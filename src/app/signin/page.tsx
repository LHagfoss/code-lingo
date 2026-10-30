import { FaGoogle } from "react-icons/fa";
import { signIn } from "@/auth";
import { AppButton } from "@/components/ui/app-button";
import AppLogo from "@/components/ui/app-logo";
import { PageWrapper } from "@/components/ui/page-wrapper";

export default function LoginPage() {
    return (
        <PageWrapper>
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)]">
                <div className="max-w-sm bg-white p-8 rounded-4xl space-y-6 shadow-[0_6px_0_rgb(0,0,0,0.06)] w-full">
                    <div className="flex justify-between items-center">
                        <AppLogo />
                        <AppButton href="/" variant="ghost" size="sm">
                            Go back
                        </AppButton>
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold">
                            Login to CodeLingo
                        </h1>
                        <p className="font-bold text-slate-500">
                            We use Google for authentication
                        </p>
                    </div>

                    <form
                        action={async () => {
                            "use server";
                            await signIn("google", { redirectTo: "/learn" });
                        }}
                    >
                        <AppButton
                            variant="primary"
                            fullWidth
                            className="flex items-center justify-center gap-2"
                        >
                            <FaGoogle /> Sign in with Google
                        </AppButton>
                    </form>

                    <div className="text-center">
                        <a
                            href="/"
                            className="font-bold text-neutral-400 text-sm cursor-pointer hover:underline"
                        >
                            Privacy policy
                        </a>
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
}
