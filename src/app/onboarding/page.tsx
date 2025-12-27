import { getCourses } from "@/queries/user/courses";
import { getAuthUser } from "@/queries/user/users";
import { OnboardingForm } from "@/components/onboarding/onboarding-form";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { PageWrapper } from "@/components/ui/page-wrapper";

export default async function OnboardingPage() {
    const session = await auth();
    if (!session?.user) {
        redirect("/signin");
    }

    const courses = await getCourses();
    const user = await getAuthUser();

    if (user?.onboarding_completed) {
        redirect("/learn");
    }

    return (
        <PageWrapper>
            <div className="min-h-[80vh] flex flex-col items-center justify-center">
                <div className="max-w-md w-full text-center space-y-6 mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-800">
                        Welcome to CodeLingo!
                    </h1>
                    <p className="text-gray-500 text-lg">
                        Let's get your profile set up so you can start learning.
                    </p>
                </div>

                <OnboardingForm
                    courses={courses}
                    defaultUsername={user?.name || ""}
                />
            </div>
        </PageWrapper>
    );
}
