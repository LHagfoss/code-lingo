import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { SignOut } from "@/components/auth/sign-out";
import { EditProfileForm } from "@/components/profile/edit-profile-form";
import { AppText } from "@/components/ui/app-text";
import { Card } from "@/components/ui/card";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { getUserProgress } from "@/queries/user/progress";
import { getAuthUser } from "@/queries/user/users";

export default async function ProfilePage() {
    const session = await auth();
    if (!session?.user) redirect("/signin");

    const user = await getAuthUser();

    if (!user?.onboarding_completed) redirect("/onboarding");

    const progress = await getUserProgress(user?.id);

    const completedLessons =
        progress?.filter((p: any) => p.completed).length || 0;
    const totalPoints = completedLessons * 10;
    return (
        <PageWrapper>
            <div className="space-y-8">
                {/* Profile Header */}
                <EditProfileForm user={user} />

                <div className="grid grid-cols-2 gap-4">
                    <Card className="text-center py-6">
                        <div className="text-4xl font-extrabold text-blue-500 mb-2">
                            {totalPoints}
                        </div>
                        <AppText
                            size="xs"
                            variant="secondary"
                            className="uppercase tracking-wide"
                        >
                            Total XP
                        </AppText>
                    </Card>
                    <Card className="text-center py-6">
                        <div className="text-4xl font-extrabold text-green-500 mb-2">
                            {completedLessons}
                        </div>
                        <AppText
                            size="xs"
                            variant="secondary"
                            className="uppercase tracking-wide"
                        >
                            Lessons Done
                        </AppText>
                    </Card>
                </div>

                <div className="space-y-4">
                    <AppText as="h2" size="xl" variant="primary">
                        Settings
                    </AppText>
                    <Card className="p-0 overflow-hidden">
                        <Link
                            href="/courses"
                            className="p-4 hover:bg-slate-50 flex justify-between items-center border-b-2 border-slate-100 transition-colors"
                        >
                            <span className="font-bold text-slate-700">
                                Change Language Course
                            </span>
                            <span className="text-slate-400">→</span>
                        </Link>
                        <div className="p-4 flex justify-between items-center bg-rose-50/30">
                            <span className="font-bold text-rose-600">
                                Account Action
                            </span>
                            <SignOut />
                        </div>
                    </Card>
                </div>
            </div>
        </PageWrapper>
    );
}
